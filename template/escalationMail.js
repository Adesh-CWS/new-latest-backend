const nodemailer = require("nodemailer");
const logoURL =
"https://res.cloudinary.com/dfvumzr0q/image/upload/v1764346150/email-assets/hzcl6heksswnumx0dpvj.jpg";
const mailIcon = "https://res.cloudinary.com/dtxmxdwuf/image/upload/v1784273971/email_sp6ikn.png";
const categoryIcon ="https://res.cloudinary.com/dtxmxdwuf/image/upload/v1784274039/open-folder_jib9xp.png";
const raisedon ="https://res.cloudinary.com/dtxmxdwuf/image/upload/v1784274186/calendar_1_f4wfmd.png";
const priorityIcon ="https://res.cloudinary.com/dtxmxdwuf/image/upload/v1784274079/lightning_yr2pcb.png";
const statusIcon ="https://res.cloudinary.com/dtxmxdwuf/image/upload/v1784274123/push-pin_k25khd.png";
const ticketIcon ="https://res.cloudinary.com/dtxmxdwuf/image/upload/v1784274448/tickets_m1pap6.png";
const documentIcon ="https://res.cloudinary.com/dtxmxdwuf/image/upload/v1784274667/pencil_epuhxg.png";
const escalationIcon ="https://res.cloudinary.com/dtxmxdwuf/image/upload/v1784274803/esclation_sljjc5.png";
const candidateIcon="https://res.cloudinary.com/dtxmxdwuf/image/upload/v1781844267/Rectangle_158022_g9yixm.png"
const actionrequiredIcon = "https://res.cloudinary.com/dtxmxdwuf/image/upload/v1784274321/warning_1_tbo7pk.png";
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEscalationMail = async (
  ticket,
  employee,
  toEmails,
  ccEmails
) => {
  await transporter.sendMail({
    // Company Email
    from: `"Creative Web Solution" <${process.env.EMAIL_USER}>`,

    // Reply will go to Employee
    replyTo: employee.email,

    // IT Support
    to: toEmails.join(","),

    // Admin + Manager + MD
    // cc: ccEmails.join(","),

    subject: `🚨 Ticket Escalation - ${ticket.ticketId}`,

    html: `

<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>🚨 IT Support Ticket Escalation</title>
</head>

<body style="margin:0;padding:0;background:#f4f6f9;font-family:Arial,sans-serif;">

<div style="padding:30px 15px;">
  <table align="center" cellpadding="0" cellspacing="0"
    style="max-width:700px;width:100%;background:#ffffff;border:1px solid #e5e5e5;">

    <!-- Header -->
   <tr>
<td style="
background:#3A5FBE;
padding:12px 20px 20px 20px;
">

<table width="100%" cellpadding="0" cellspacing="0">
<tr>

<!-- LOGO LEFT -->
<td width="25%" valign="top" align="left">

<img
src="${logoURL}"
alt="Creative Web Solution"
style="
height:36px;
display:block;
"
/>

</td>


<!-- TITLE CENTER -->
<td width="50%" align="center" valign="top">

<div style="
color:#fff;
font-size:18px;
font-weight:700;
margin-top:28px;
margin-bottom:4px;
">
 IT Support Ticket Escalation
</div>



</td>


<!-- ICON RIGHT -->
<td width="25%" align="right" valign="middle">

<img
src="${escalationIcon}"
alt="Interview"
style="
width:65px;
height:65px;
display:block;
margin-right:20px;
margin-top:10px;
"
/>

</td>

</tr>
</table>

</td>
</tr>


<!-- Body -->
    <tr>
      <td style="padding:35px 40px;">

        <p style="font-size:16px;color:#333;margin-top:0;">
          Hello Team, 
        </p>

        <p style="font-size:15px;line-height:24px;color:#555;">
         The following ticket has been escalated by the employee because it has
            not been resolved within the expected SLA.
        </p>

        <!-- Interview Details -->
        <table width="100%" cellpadding="12" cellspacing="0"
          style="margin-top:25px;">

       <tr>
  <td width="35%"
      style="
      font-weight:500;
      color:#555;
     
      padding:14px 0;
      ">

    <img
      src="${ticketIcon}"
      alt="Date"
      style="
      width:20px;
      height:20px;
      vertical-align:middle;
      margin-right:12px;
      "
    />

    <span style="
      vertical-align:middle;
      font-size:14px;
      ">
      Ticket ID
    </span>

  </td>

  <td width="3%"
      style="
      color:#d1d5db;
      text-align:center;
      
      ">
      |
  </td>

  <td
      style="
      font-weight:700;
      color:#1f3556;
    
      font-size:14px;
      ">
       ${ticket.ticketId}
  </td>
</tr>

          <tr>
            <td width="35%"
      style="
      font-weight:500;
      color:#555;
     
      padding:14px 0;
      ">
             <img
                src="${candidateIcon }"
                alt ="Time"
                   style="
                    width:20px;
                    height:20px;
                    vertical-align:middle;
                    margin-right:12px;
                    "
              />
                 <span style="
      vertical-align:middle;
      font-size:14px;
      ">
      Employee Name
    </span>
            </td>
  <td width="3%"
      style="
      color:#d1d5db;
      text-align:center;
      
      ">
      |
  </td>
            <td   style="
      font-weight:700;
      color:#1f3556;
     
      font-size:14px;
      ">
            ${employee.name}
             
            </td>
          </tr>

   <tr>
            <td width="35%"
      style="
      font-weight:500;
      color:#555;
     
      padding:14px 0;
      ">
             <img
                src="${mailIcon}"
                alt ="Time"
                   style="
                    width:20px;
                    height:20px;
                    vertical-align:middle;
                    margin-right:12px;
                    "
              />
                 <span style="
      vertical-align:middle;
      font-size:14px;
      ">
      Employee Email
    </span>
            </td>
  <td width="3%"
      style="
      color:#d1d5db;
      text-align:center;
      
      ">
      |
  </td>
            <td   style="
      font-weight:700;
      color:#1f3556;
     
      font-size:14px;
      ">
           ${employee.email}
             
            </td>
          </tr>

           <tr>
            <td width="35%"
      style="
      font-weight:500;
      color:#555;
     
      padding:14px 0;
      ">
             <img
                src="${categoryIcon}"
                alt ="Time"
                   style="
                    width:20px;
                    height:20px;
                    vertical-align:middle;
                    margin-right:12px;
                    "
              />
                 <span style="
      vertical-align:middle;
      font-size:14px;
      ">
      Category
    </span>
            </td>
  <td width="3%"
      style="
      color:#d1d5db;
      text-align:center;
      
      ">
      |
  </td>
            <td   style="
      font-weight:700;
      color:#1f3556;
     
      font-size:14px;
      ">
          ${ticket.category}
             
            </td>
          </tr>


           <tr>
            <td width="35%"
      style="
      font-weight:500;
      color:#555;
     
      padding:14px 0;
      ">
             <img
                src="${priorityIcon}"
                alt ="Time"
                   style="
                    width:20px;
                    height:20px;
                    vertical-align:middle;
                    margin-right:12px;
                    "
              />
                 <span style="
      vertical-align:middle;
      font-size:14px;
      ">
      Priority
    </span>
            </td>
  <td width="3%"
      style="
      color:#d1d5db;
      text-align:center;
      
      ">
      |
  </td>
            <td   style="
      font-weight:700;
      color:#1f3556;
     
      font-size:14px;
      ">
          ${ticket.priority}
             
            </td>
          </tr>


           <tr>
            <td width="35%"
      style="
      font-weight:500;
      color:#555;
     
      padding:14px 0;
      ">
             <img
                src="${statusIcon}"
                alt ="Time"
                   style="
                    width:20px;
                    height:20px;
                    vertical-align:middle;
                    margin-right:12px;
                    "
              />
                 <span style="
      vertical-align:middle;
      font-size:14px;
      ">
      Status
    </span>
            </td>
  <td width="3%"
      style="
      color:#d1d5db;
      text-align:center;
      
      ">
      |
  </td>
            <td   style="
      font-weight:700;
      color:#1f3556;
     
      font-size:14px;
      ">
           ${ticket.status}
             
            </td>
          </tr>
      
          <tr>
            <td width="35%"
      style="
      font-weight:500;
      color:#555;
     
      padding:14px 0;
      ">
             <img
                src="${documentIcon}"
                alt ="Time"
                   style="
                    width:20px;
                    height:20px;
                    vertical-align:middle;
                    margin-right:12px;
                    "
              />
                 <span style="
      vertical-align:middle;
      font-size:14px;
      ">
    Description
    </span>
            </td>
  <td width="3%"
      style="
      color:#d1d5db;
      text-align:center;
      
      ">
      |
  </td>
            <td   style="
      font-weight:700;
      color:#1f3556;
     
      font-size:14px;
      ">
         ${ticket.description}
             
            </td>
          </tr>

          
           <tr>
            <td width="35%"
      style="
      font-weight:500;
      color:#555;
     
      padding:14px 0;
      ">
             <img
                src="${raisedon}"
                alt ="Time"
                   style="
                    width:20px;
                    height:20px;
                    vertical-align:middle;
                    margin-right:12px;
                    "
              />
                 <span style="
      vertical-align:middle;
      font-size:14px;
      ">
    Raised On
    </span>
            </td>
  <td width="3%"
      style="
      color:#d1d5db;
      text-align:center;
      
      ">
      |
  </td>
            <td   style="
      font-weight:700;
      color:#1f3556;
     
      font-size:14px;
      ">
         ${new Date(ticket.raisedDate).toLocaleString()}
             
            </td>
          </tr>
<hr></hr>
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:25px;">
  <tr>
    <td
      style="
      background:#FFF9E8;
      border-left:4px solid #F59E0B;
      padding:16px 18px;
      width:100%;
      "
    >

      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>

          <td width="28" valign="top">
            <img
              src="${actionrequiredIcon}"
              width="20"
              style="display:block;"
            />
          </td>

          <td
            style="
            font-size:14px;
            line-height:24px;
            color:#555;
            "
          >
            <span
              style="
              color:#F59E0B;
              font-weight:bold;
              font-size:15px;
              "
            >
              Action Required:
            </span>

            This ticket has crossed the expected SLA. Kindly review the issue and take the necessary action at the earliest.
          </td>

        </tr>
      </table>

    </td>
  </tr>
</table>



<!-- Signature -->
        <div style="margin-top:25px;">
          <div style="font-size:15px;color:#555;">
            Best Regards,
          </div>

          <div style="
            color:#3A5FBE;
            font-size:14px;
            font-weight:700;
            margin-top:8px;
          ">
            CWS EMS Team
          </div>
        </div>

        <div style="margin-top:20px;">
          <img
            src="${logoURL}"
            alt="Creative Web Solution"
            style="height:40px;"
          />
        </div>

      </td>
    </tr>

    <!-- Footer -->
    <tr>
      <td>

        <div style="height:5px;background:#3A5FBE;"></div>

        <div style="
          padding:20px;
          text-align:center;
          color:#777;
          font-size:10px;
          line-height:20px;
        ">
          Creative Web Solution • LWT, 203, C/O ITI Rd,
          Above PNG, Near Parihar Chowk,
          Aundh, Maharashtra 411007.
        </div>

      </td>
    </tr>

  </table>
</div>

</body>
</html>

    `,
  });
};

module.exports = sendEscalationMail;








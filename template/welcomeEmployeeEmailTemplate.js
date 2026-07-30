const logoURL =
  "https://res.cloudinary.com/dfvumzr0q/image/upload/v1764346150/email-assets/hzcl6heksswnumx0dpvj.jpg";
const candidateIcon = "https://res.cloudinary.com/dtxmxdwuf/image/upload/v1781844267/Rectangle_158022_g9yixm.png"
const employeeIdIcon = "https://res.cloudinary.com/dtxmxdwuf/image/upload/v1782205984/employeeID_ykmjhd.jpg";
const designationIcon = "https://res.cloudinary.com/dtxmxdwuf/image/upload/v1782205871/designation_by77lo.jpg";
const departmentIcon = "https://res.cloudinary.com/dtxmxdwuf/image/upload/v1782205822/department_cyqiw3.jpg";
const dojIcon = "https://res.cloudinary.com/dtxmxdwuf/image/upload/v1782205912/doj_rra9rf.jpg";
const welcomeIcon = "https://res.cloudinary.com/dtxmxdwuf/image/upload/v1782206046/welcomeIcon_y5zk97.jpg";

function welcomeEmployeeEmailTemplate(employee) {

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date)
      .toLocaleDateString("en-GB")
      .replace(/\//g, "-");
  };


  return `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Welcome Employee</title>
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
Welcome to Creative Web Solution 🎉
</div>



</td>


<!-- ICON RIGHT -->
<td width="25%" align="right" valign="middle">

<img
src="${welcomeIcon}"
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
          Dear <strong>${employee.name}</strong>,
        </p>
        <p>
          We are delighted to welcome you to the CWS Family!
        </p>
         <p>
   We are excited to have you join our team and look forward to your contributions and growth with us.
  We hope your journey with Creative Web Solution will be rewarding, successful and filled with learning opportunities.

  </p>
  <p>
   Wishing you all the best as you begin this new chapter with us.
  </p>
  <p>
  Welcome aboard!
  </p>

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
  
`;
}

module.exports = welcomeEmployeeEmailTemplate;



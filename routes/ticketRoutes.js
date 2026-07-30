


const express = require("express");
const multer = require("multer");
const mongoose = require("mongoose");
const Ticket = require("../models/Ticket");
const User = require("../models/User");
const Notification = require("../models/notificationSchema");
const nodemailer = require("nodemailer");
const router = express.Router();
const sendEscalationMail = require("../template/escalationMail");
const authenticate = require("../authMiddleware/authenticate");

/* ========= FILE UPLOAD ========= */
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => cb(null, Date.now() + "_" + file.originalname),
});

const upload = multer({ storage });
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/* ================= CREATE TICKET ================= */

router.post(
  "/",
  authenticate,
  upload.array("attachment", 5),
  async (req, res) => {

    try {

        const { category, priority, description } = req.body;

        // const employeeUser = await User.findById(req.user._id);

        // if (!employeeUser) {
        //     return res.status(404).json({
        //         message: "Employee not found"
        //     });
        // }
        const employeeUser = await User.findById(req.body.employee);

if (!employeeUser) {
   return res.status(404).json({
      message: "Employee not found",
   });
}

        const lastTicket = await Ticket.findOne().sort({ createdAt: -1 });

        const nextNumber = lastTicket
            ? Number(lastTicket.ticketId.split("-")[1]) + 1
            : 1;

        const attachments =
            req.files?.map(file => file.filename) || [];

        const ticket = await Ticket.create({

            ticketId: `TKT-${nextNumber}`,

            employee: employeeUser._id,

            employeeName: employeeUser.name,

            category,

            priority,

            description,

            attachment: attachments,

            status: "Open",

            assignedTo: "IT_Support",

        });

        const itUsers = await User.find({
            role: "IT_Support"
        });

        await Notification.insertMany(
            itUsers.map(it => ({
                user: it._id,
                ticketRef: ticket._id,
                type: "Ticket",
                triggeredByRole: "EMPLOYEE",
                message: `New ticket raised by ${employeeUser.name}`
            }))
        );

        res.status(201).json(ticket);

    } catch (err) {

        console.log(err);

        res.status(500).json({
            message: err.message
        });

    }

});

/* ================= GET ALL ================= */
router.get("/", async (req, res) => {
  try {
    const tickets = await Ticket.find().sort({ raisedDate: -1 });
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch tickets" });
  }
});

router.get("/employee/:employeeId", async (req, res) => {
  const tickets = await Ticket.find({
    employee: req.params.employeeId,
  });

  res.json(tickets);
});


/* ================= FILTER ================= */
router.get("/filter", async (req, res) => {
  try {
    const { status, from, to } = req.query;
    const query = {};

    if (status && status !== "All") query.status = status;
    if (from || to) {
      query.raisedDate = {};
      if (from) query.raisedDate.$gte = new Date(from);
      if (to) query.raisedDate.$lte = new Date(to);
    }

    const tickets = await Ticket.find(query).sort({ raisedDate: -1 });
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ message: "Failed to filter tickets" });
  }
});

/* ================= GET ONE ================= */
router.get("/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
      return res.status(400).json({ message: "Invalid Ticket ID" });

    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });

    ticket.attachment = Array.isArray(ticket.attachment)
      ? ticket.attachment
      : [];

    res.json(ticket);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch ticket" });
  }
});

/* ================= UPDATE ================= */
router.put("/:id", upload.array("attachment", 5), async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });

    //added snehal 16-01-2026
    let notifyEmployee = false;
    let messages = [];
    //snehal added 16-01-2026
    // Status change notification
    if (req.body.status && req.body.status !== ticket.status) {
      //snehal added 16-01-2026
      ticket.status = req.body.status;
      notifyEmployee = true;
      messages.push(`status changed to ${req.body.status}`);
      //snehal added 16-01-2026

      if (req.body.status === "Closed") {
        ticket.closedDate = new Date();
      }
    }
    // 🔄 Assigned change
    //snehal added 16-01-2026
    if (req.body.assignedTo && req.body.assignedTo !== ticket.assignedTo) {
      ticket.assignedTo = req.body.assignedTo;
      notifyEmployee = true;
      messages.push(`assigned to ${req.body.assignedTo}`);
    }
    //snehal added 16-01-2026
    // ✅ ONLY ALLOWED FIELDS
    ticket.category = req.body.category ?? ticket.category;
    ticket.priority = req.body.priority ?? ticket.priority;
    ticket.description = req.body.description ?? ticket.description;
    ticket.status = req.body.status ?? ticket.status;

    // Attachments (only once)
    if (req.files?.length) {
      ticket.attachment.push(...req.files.map((f) => f.filename));
    }

    await ticket.save();
    //snehal added 16-01-2026
    //🔔 🔥 CREATE EMPLOYEE NOTIFICATION
    if (notifyEmployee && ticket.employee) {
      await Notification.create({
        user: ticket.employee,
        type: "Ticket",
        ticketRef: ticket._id,
        triggeredByRole: "IT_Support",
        message: `IT Support updated your ticket (${ticket.ticketId}): ${messages.join(", ")}`,
      });
    }


console.log("Notification Created:", Notification);

    //snehal added 16-01-2026

    res.json(ticket);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update ticket" });
  }
});

/* ================= DELETE ================= */
router.delete("/:id", async (req, res) => {
  try {
    const ticketId = req.params.id;

    const ticket = await Ticket.findById(ticketId);
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });

    // 1️⃣ Delete Ticket
    await Ticket.findByIdAndDelete(ticketId);

    // 2️⃣ Delete ALL notifications related to this ticket
    await Notification.deleteMany({ ticketRef: ticketId });

    res.json({ message: "Ticket and notifications deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Delete failed" });
  }
});

router.post("/:id/comment", async (req, res) => {
  try {
    const { message, role } = req.body;

    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });

    ticket.comments.push({ message, role });

    // IT commented → notify employee
    if (role === "IT_Support" && ticket.employee) {
      await Notification.create({
        user: ticket.employee,
        type: "Ticket",
        ticketRef: ticket._id,
        //snehal added 16-01-2026
        triggeredByRole: "IT_Support",
        //snehal added 16-01-2026
        message: `IT Support commented on your ticket (${ticket.ticketId})`,
      });
    }

    //added 16-01-2026
    // 🔔 Employee → IT
    if (role === "EMPLOYEE") {
      const itUsers = await User.find({ role: "IT_Support" });

      await Notification.insertMany(
        itUsers.map((it) => ({
          user: it._id,
          type: "Ticket",
          ticketRef: ticket._id,
          triggeredByRole: "EMPLOYEE",
          message: `${ticket.employeeName} commented on ticket (${ticket.ticketId})`,
        })),
      );
    }

    await ticket.save();
    res.json(ticket);
  } catch (err) {
    res.status(500).json({ message: "Failed to add comment" });
  }
});

/* ================= COMMENT READ ================= */
router.put("/:ticketId/comment/:commentId/read", async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.ticketId);
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });

    const comment = ticket.comments.id(req.params.commentId);
    if (comment) comment.isRead = true;

    await ticket.save();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: "Failed to mark comment read" });
  }
});


router.get("/notifications/:userId", async (req, res) => {
  const notifications = await Notification.find({
    user: req.params.userId,
  })
    .populate("ticketRef", "ticketId")
    .sort({ createdAt: -1 });

  res.json(notifications);
});


/* ================= ESCALATE TICKET ================= */



// router.post("/:id/escalate", authenticate, async (req, res) => {
//   try {
//     const ticket = await Ticket.findById(req.params.id);

//     if (!ticket) {
//       return res.status(404).json({
//         message: "Ticket not found",
//       });
//     }

//     // Only ticket owner can escalate
//     if (String(ticket.employee) !== String(req.user.id)) {
//       return res.status(403).json({
//         message: "You cannot escalate another employee's ticket",
//       });
//     }

//     if (ticket.isEscalated) {
//       return res.status(400).json({
//         message: "Ticket already escalated",
//       });
//     }

//     const employee = await User.findById(req.user.id);

//     if (!employee) {
//       return res.status(404).json({
//         message: "Employee not found",
//       });
//     }

//     // TO -> IT Support
//     const itUsers = await User.find({
//       role: "IT_Support",
//     });

//     const toEmails = itUsers
//       .map((u) => u.email)
//       .filter(Boolean);

//     // CC -> Admin, Manager, MD
//     const ccUsers = await User.find({
//       role: {
//         $in: ["Admin", "Manager", "MD"],
//       },
//     });

//     const ccEmails = ccUsers
//       .map((u) => u.email)
//       .filter(Boolean);

//     if (!toEmails.length) {
//       return res.status(404).json({
//         message: "IT Support email not found",
//       });
//     }

//     await sendEscalationMail(
//       ticket,
//       employee,
//       toEmails,
//       ccEmails
//     );

//     ticket.isEscalated = true;
//     ticket.escalatedAt = new Date();
//     ticket.escalationMailSent = true;

//     await ticket.save();

//     res.json({
//       success: true,
//       message: "Escalation Mail Sent Successfully",
//     });

//   } 
//   // catch (err) {
//   //   console.error(err);
//   //   res.status(500).json({
//   //     message: "Mail sending failed",
//   //   });
//   // }
//    catch (err) {
//   console.error("ESCALATION ERROR:", err);
//   console.error(err.stack);

//   res.status(500).json({
//     message: err.message,
//   });
// }
// });



module.exports = router;
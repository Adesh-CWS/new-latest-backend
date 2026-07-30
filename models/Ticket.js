// const mongoose = require("mongoose");

// const ticketSchema = new mongoose.Schema(
//   {
//     ticketId: { type: String, unique: true },

//     // ✅ ADD THIS
//     employee: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//     },
//     employeeName: String,
//     category: String,
//     priority: String,
//     description: String,
//     // attachment: String,
//     attachment: {
//       type: [String], // ✅ ARRAY
//       default: [],
//     },

//     status: { type: String, default: "Open" },
//     assignedTo: { type: String, default: "IT Support" },
//     raisedDate: { type: Date, default: Date.now },
//     closedDate: Date,
//     comments: [{ message: String, role: String }],


//     notifications: [
//       {
//         receiverRole: String,
//         message: String,
//         isRead: { type: Boolean, default: false },
//       },
//     ],
   
//   },
//   { timestamps: true },
// );

// module.exports = mongoose.model("Ticket", ticketSchema);




const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema(
  {
    ticketId: {
      type: String,
      unique: true,
    },

    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    employeeName: {
      type: String,
      required: true,
    },

    employeeEmail: {
      type: String,
    },

    category: String,

    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
    },

    description: String,

    attachment: {
      type: [String],
      default: [],
    },

    status: {
      type: String,
      enum: ["Open", "In Progress", "Resolved", "Closed"],
      default: "Open",
    },

    assignedTo: {
      type: String,
      default: "IT Support",
    },

    // ========================
    // Escalation Fields
    // ========================

    isEscalated: {
      type: Boolean,
      default: false,
    },

    escalatedAt: {
      type: Date,
      default: null,
    },

    escalationReason: {
      type: String,
      default: "",
    },

    escalationMailSent: {
      type: Boolean,
      default: false,
    },

    // SLA Due Date (Optional)
    dueDate: {
      type: Date,
    },

    // Ticket Delay
    isDelayed: {
      type: Boolean,
      default: false,
    },

    raisedDate: {
      type: Date,
      default: Date.now,
    },

    closedDate: Date,

    comments: [
      {
        message: String,
        role: String,
        timestamp: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    notifications: [
      {
        receiverRole: String,
        message: String,
        isRead: {
          type: Boolean,
          default: false,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Ticket", ticketSchema);
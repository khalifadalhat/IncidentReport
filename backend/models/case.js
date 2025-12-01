const mongoose = require("mongoose");

const CaseSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    customerName: {
      type: String,
      required: true,
      trim: true,
    },
    issue: {
      type: String,
      required: true,
      trim: true,
    },
    department: {
      type: String,
      required: true,
      enum: [
        "sexual_assault",
        "physical_assault",
        "robbery",
        "burglary",
        "theft",
        "domestic_violence",
        "hate_crime",
        "kidnapping_abduction",
        "harassment_stalking",
        "cyber_crime",
        "public_disturbance",
        "missing_person",
        "homicide",
        "child_abuse",
        "elder_abuse",
        "hate_speech",
        "vandalism",
        "arson",
        "drug_offense",
        "traffic_incident",
        "other",
      ],
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["pending", "in-progress", "active", "resolved", "rejected"],
      default: "pending",
      index: true,
    },
    assignedAgent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },
    imageUrl: {
      type: String,
      trim: true,
      default: null,
      index: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    resolvedAt: {
      type: Date,
    },
    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
  },
  {
    timestamps: true,
  }
);

CaseSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

CaseSchema.pre("findOneAndUpdate", function (next) {
  this.set({ updatedAt: Date.now() });
  next();
});

CaseSchema.index({ customer: 1, status: 1 });
CaseSchema.index({ assignedAgent: 1, status: 1 });
CaseSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model("Case", CaseSchema);

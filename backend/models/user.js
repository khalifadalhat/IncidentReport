const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String,
      enum: ["customer", "agent", "supervisor", "admin"],
      required: true,
      default: "customer",
    },
    phone: String,
    location: String, 
    gender: String,
    department: {
      type: String,
      enum: [
        "sexual_assault_unit",
        "physical_assault_unit",
        "domestic_violence_unit",
        "homicide_unit",
        "robbery_unit",
        "burglary_unit",
        "theft_unit",
        "vandalism_arson_unit",
        "child_abuse_unit",
        "elder_abuse_unit",
        "missing_persons_unit",
        "cyber_crime_unit",
        "drug_enforcement_unit",
        "public_disturbance_unit",
        "traffic_incident_unit",
        "hate_crimes_unit",
        "emergency_response",
        "investigations_support",
        "general_support",
      ],
      default: "general_support",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isFirstLogin: {
      type: Boolean,
      default: true,
    },
    profileImage: String,

    liveLocation: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], 
        default: [0, 0],
      },
      lastUpdated: {
        type: Date,
        default: Date.now,
      },
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.index({ email: 1 });
UserSchema.index({ role: 1 });
UserSchema.index({ department: 1 });

UserSchema.index({ liveLocation: "2dsphere" });

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

UserSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

UserSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  delete user.__v;
  return user;
};

module.exports = mongoose.model("User", UserSchema);
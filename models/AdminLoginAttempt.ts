import mongoose from "mongoose";

const AdminLoginAttemptSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    attempts: { type: Number, required: true, default: 0 },
    windowStartedAt: { type: Date, required: true },
    expiresAt: { type: Date, required: true, index: { expires: 0 } },
  },
  { timestamps: true },
);

export default mongoose.models.AdminLoginAttempt
  || mongoose.model("AdminLoginAttempt", AdminLoginAttemptSchema);

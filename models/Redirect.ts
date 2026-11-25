import mongoose from "mongoose";

const RedirectSchema = new mongoose.Schema(
  {
    source: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    destination: {
      type: String,
      required: true,
      trim: true,
    },
    permanent: {
      type: Boolean,
      default: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    hits: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Redirect || mongoose.model("Redirect", RedirectSchema);
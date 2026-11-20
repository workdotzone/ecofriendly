import mongoose from "mongoose";

const ClientSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // e.g., "Birla Hospital" (SEO Alt text ke liye)
    image: { type: String, required: true }, // Logo ka URL
  },
  { timestamps: true }
);

export default mongoose.models.Client || mongoose.model("Client", ClientSchema);
import mongoose from "mongoose";

const LeadSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    service: { type: String, required: true },
    address: { type: String, default: "" },
    propertyType: { type: String, default: "Not Specified" },
    preferredDate: { type: String, default: "" },
    source: { type: String, default: "Website" }, // Hero Form ya Book Now Page
    status: { type: String, enum: ["New", "Contacted"], default: "New" }, // Admin ke liye
  },
  { timestamps: true } // Ye automatically createdAt aur updatedAt date add kar dega
);

export default mongoose.models.Lead || mongoose.model("Lead", LeadSchema);
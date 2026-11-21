import mongoose from "mongoose";

const LocationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // e.g., "Andheri East"
    slug: { type: String, required: true, unique: true }, // e.g., "andheri-east" (URL ke liye)
    
    // SEO & Content Fields (Admin se manage karne ke liye)
    heading: { type: String, default: "Best Pest Control Services" }, // e.g., "Best Pest Control in Andheri East"
    shortDescription: { type: String, default: "Professional and safe pest control services in your area." },
    detailedContent: { type: String, default: "We provide 100% herbal treatments..." }, // Lamba content
    
    // Meta Tags for Google Ranking
    metaTitle: { type: String }, // e.g., "Pest Control in Andheri East | Eco-Friendly Pests"
    metaDescription: { type: String }, 
    
    isActive: { type: Boolean, default: true }, 
  },
  { timestamps: true }
);

export default mongoose.models.Location || mongoose.model("Location", LocationSchema);
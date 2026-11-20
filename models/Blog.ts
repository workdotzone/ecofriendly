import mongoose from "mongoose";

const BlogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true }, // e.g. "top-10-pest-control-tips"
    metaDescription: { type: String, required: true }, // 🚀 SEO ke liye short summary
    image: { type: String, default: "/banner.png" }, // Thumbnail Image URL
    content: { type: String, required: true }, // Main lamba text
    author: { type: String, default: "EcoFriendlyPests Expert" }
  },
  { timestamps: true }
);

export default mongoose.models.Blog || mongoose.model("Blog", BlogSchema);
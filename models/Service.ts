import mongoose from "mongoose";

/**
 * Service model.
 * Original fields (title, slug, shortDescription, fullContent, image) are unchanged,
 * so existing documents keep working. Every new SEO field is optional — when it is empty
 * the site falls back to the curated content in lib/content/services.ts (matched by slug),
 * and then to generated defaults.
 */
const FaqItemSchema = new mongoose.Schema(
  {
    question: { type: String, required: true, trim: true },
    answer: { type: String, required: true, trim: true },
  },
  { _id: false },
);

const ServiceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true }, // e.g. "cockroach-control"
    shortDescription: { type: String, required: true, trim: true }, // card text + meta description fallback
    // Long content. Supports simple markdown: "## Heading", "### Sub", "- bullet", "1. step", **bold**.
    fullContent: { type: String, required: true },
    image: { type: String, required: true }, // ImageKit URL or /public path

    // --- SEO / GEO / AEO fields (all optional) ---
    imageAlt: { type: String, trim: true },
    metaTitle: { type: String, trim: true },
    metaDescription: { type: String, trim: true },
    h1: { type: String, trim: true },
    // 40–60 word direct answer shown at the top of the page (featured snippet / AI overview / voice answer)
    quickAnswer: { type: String, trim: true },
    keywords: { type: [String], default: undefined },
    faqs: { type: [FaqItemSchema], default: undefined },
    order: { type: Number, default: 100, index: true },
    isActive: { type: Boolean, default: true, index: true },
  },
  { timestamps: true },
);

// Hot-reload safety: drop a cached model compiled from the old, smaller schema.
if (mongoose.models.Service && !mongoose.models.Service.schema.path("quickAnswer")) {
  delete mongoose.models.Service;
}

export default mongoose.models.Service || mongoose.model("Service", ServiceSchema);

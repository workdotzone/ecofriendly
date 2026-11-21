import mongoose from "mongoose";

const FaqSchema = new mongoose.Schema(
  {
    question: { type: String, required: true },
    answer: { type: String, required: true },
    locationSlug: { type: String, default: null, index: true },
    serviceSlug: { type: String, default: null, index: true },
    serviceOverview: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);

if (mongoose.models.Faq && (
  !mongoose.models.Faq.schema.path("serviceSlug")
  || !mongoose.models.Faq.schema.path("serviceOverview")
)) {
  delete mongoose.models.Faq;
}

export default mongoose.models.Faq || mongoose.model("Faq", FaqSchema);
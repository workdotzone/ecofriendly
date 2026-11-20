import mongoose from "mongoose";

const TestimonialSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    designation: { type: String, required: true, trim: true }, // e.g. "Resident, Thane" or "Manager, L&T"
    service: { type: String, required: true, trim: true },
    // Optional link to a Service document's slug so reviews can be shown on the matching service page.
    serviceSlug: { type: String, trim: true, lowercase: true, index: true },
    rating: { type: Number, default: 5, min: 1, max: 5 },
    text: { type: String, required: true, trim: true },
  },
  { timestamps: true },
);

if (mongoose.models.Testimonial && !mongoose.models.Testimonial.schema.path("serviceSlug")) {
  delete mongoose.models.Testimonial;
}

export default mongoose.models.Testimonial || mongoose.model("Testimonial", TestimonialSchema);

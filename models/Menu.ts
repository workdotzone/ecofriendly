import mongoose from "mongoose";

const MenuSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // Jaise: "Cockroach Control" ya "Pricing"
    slug: { type: String, required: true }, // Jaise: "/services/cockroach" ya "/pricing"
    category: { type: String, enum: ["Page", "Service"], required: true }, // Pata chalega ki dropdown me dalna hai ya main nav me
  },
  { timestamps: true }
);

export default mongoose.models.Menu || mongoose.model("Menu", MenuSchema);
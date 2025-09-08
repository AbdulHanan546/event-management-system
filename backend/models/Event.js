import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  category: { 
    type: String, 
    enum: ["conference", "wedding", "party", "workshop"], 
    required: true 
  },
  location: { type: String, required: true },
  date: { type: Date, required: true },
  price: { type: Number, default: 0 },
  imageUrl: { type: String },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
}, { timestamps: true });

export default mongoose.model("Event", eventSchema);

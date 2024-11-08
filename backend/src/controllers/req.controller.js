import mongoose from "mongoose";

const requestSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Reference to User model (one-to-one relationship)
  title: { type: String, required: true, trim: true }, // Title of the requested publication
  description: { type: String, required: true, trim: true }, // Description of the requested publication
  url_imagen: { type: String, required: true }, // URL of the uploaded image from Cloudinary
  status: {
    type: String,
    required: true,
    default: "pending",
    enum: ["pending", "accepted", "rejected"],
  },
  createdAt: { type: Date, default: Date.now }, // Timestamp of request creation
});

export const Request = mongoose.model("Request", requestSchema);

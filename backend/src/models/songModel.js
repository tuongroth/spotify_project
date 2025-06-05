// models/songModel.js
import mongoose from "mongoose";

const songSchema = new mongoose.Schema({
  name: { type: String, required: true },
  desc: { type: String, required: true },
  album: { type: String, required: true },
  image: { type: String, required: true }, // Cloudinary image URL
  file: { type: String, required: true },  // Cloudinary audio URL
  duration: { type: String, required: true }
}, { timestamps: true });  // <-- Đây là nơi đúng

const songModel = mongoose.models.song || mongoose.model("song", songSchema);
export default songModel;

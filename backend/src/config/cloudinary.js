// config/cloudinary.js
import { v2 as cloudinary } from 'cloudinary';

const connectCloudinary = async () => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET_KEY
  });

  console.log("✅ Cloudinary config loaded.");

  try {
    // Thử gọi API đơn giản để test kết nối
    const result = await cloudinary.api.ping();
    console.log("✅ Cloudinary connected successfully:", result);
  } catch (error) {
    console.error("❌ Cloudinary connection failed:", error.message);
  }
};

export default connectCloudinary;

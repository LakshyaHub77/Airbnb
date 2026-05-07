import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
console.log('Cloud name:', process.env.CLOUDINARY_CLOUD_NAME);

// ✅ Configure ONCE outside the function
cloudinary.config({ 
  cloud_name: "dbhzoxfgm",
  api_key: "949271851462151", 
  api_secret: "9_mvD3Q5HnPU-eZiM3HzYUrhVig"
});


const uploadOnCloudinary = async (filepath) => {  // ✅ Takes filepath parameter
  try {
    // ✅ Check if filepath exists
    if (!filepath) {
      throw new Error("Filepath not defined");
    }

    // ✅ Upload to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(filepath, {
      resource_type: "auto"
    });
    
    // ✅ Delete local temp file after successful upload
    fs.unlinkSync(filepath);
    
    // ✅ Return secure URL for controller to save in DB
    return uploadResult.secure_url;
    
  } catch (error) {
    // ✅ Clean up temp file even on error
    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath);
    }
    
    console.error("Cloudinary upload error:", error);
    throw error;  // ✅ Re-throw so controller can handle
  }
};

export default uploadOnCloudinary;

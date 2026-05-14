import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export const uploadToCloudinary = async (file, folder = 'servai') => {
  if (!file) return null;

  try {
    const options = {
      folder,
      resource_type: 'auto',
      overwrite: true,
      use_filename: true,
      unique_filename: true
    };

    const uploadResult = await cloudinary.uploader.upload(file.path, options);
    return uploadResult.secure_url;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    return null;
  } finally {
    try {
      fs.unlinkSync(path.resolve(file.path));
    } catch (e) {
      // ignore cleanup error
    }
  }
};

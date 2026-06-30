import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import '../config/cloudinary.js';

/**
 * Multer instance using in-memory storage.
 * Files are buffered in memory and then streamed to Cloudinary —
 * no temporary files are written to disk.
 *
 * Limits:
 *  - Max file size: 5 MB
 *  - Allowed types: images only
 */
const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  },
});

/**
 * Uploads an image buffer directly to Cloudinary.
 *
 * @param {Buffer} buffer    - File buffer from multer (req.file.buffer)
 * @param {string} folder    - Cloudinary folder name (default: 'svem-products')
 * @returns {Promise<string>} - Resolves with the secure_url of the uploaded image
 */
export function uploadToCloudinary(buffer, folder = 'svem-products') {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: 'image' },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    );
    stream.end(buffer);
  });
}

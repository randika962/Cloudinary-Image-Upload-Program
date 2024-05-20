import type { NextApiRequest, NextApiResponse } from 'next';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET,
});

const storage = multer.memoryStorage();
const upload = multer({ storage });

const uploadMiddleware = upload.single('file');

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  uploadMiddleware(req as any, res as any, async (err: any) => {
    if (err) {
      return res.status(500).json({ error: (err as Error).message });
    }

    const file = (req as any).file;
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded.' });
    }

    try {
      const result = await new Promise<any>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: 'uploads' },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          }
        );
        file.stream.pipe(uploadStream);
      });

      const imageUrl = result.secure_url;

      res.status(200).json({ url: imageUrl });
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'An unknown error occurred' });
      }
    }
  });
}
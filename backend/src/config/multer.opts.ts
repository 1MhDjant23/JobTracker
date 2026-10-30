import { memoryStorage } from 'multer';

const multerOptions = {
  storage: memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5mb
    files: 3,
  },
  fileFilter: (
    req: Express.Request,
    file: Express.Multer.File,
    cb: (error: Error | null, acceptFile: boolean) => void,
  ) => {
    const allowedMimeTypes = new Set([
      'image/jpeg',
      'image/webp',
      'image/jpg',
      'image/png',
    ]);
    console.log('mimetype: ', file.mimetype);
    if (!allowedMimeTypes.has(file.mimetype)) {
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  },
};
export default multerOptions;

import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Ensure directory exists (use project root, not __dirname)
const uploadDir = path.join(process.cwd(), 'uploads/case-files');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname);
        cb(null, `${uniqueSuffix}${ext}`);
    },
});

export const upload = multer({ storage });

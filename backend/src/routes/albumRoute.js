import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { addAlbum } from '../controller/albumController.js';
import { listAlbums } from '../controller/albumController.js';
import { deleteAlbum } from '../controller/albumController.js';

const router = express.Router();

// ======= Multer Config =======
const uploadFolder = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadFolder)) {
  fs.mkdirSync(uploadFolder);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadFolder),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// ======= Routes =======
router.post('/add', upload.single('image'), addAlbum);
router.get('/list', listAlbums);
router.delete('/:id', deleteAlbum);

export default router;


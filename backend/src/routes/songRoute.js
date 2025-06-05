import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { v2 as cloudinary } from 'cloudinary';
import songModel from '../models/songModel.js';

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

// ======= Controller Functions =======
const addSong = async (req, res) => {
  try {
    const { name, desc, album } = req.body;
    const audioFile = req.files?.audio?.[0];
    const imageFile = req.files?.image?.[0];

    if (!audioFile || !imageFile) {
      return res.status(400).json({ error: 'Audio and image files are required' });
    }

    const [audioUpload, imageUpload] = await Promise.all([
      cloudinary.uploader.upload(audioFile.path, { resource_type: 'video' }),
      cloudinary.uploader.upload(imageFile.path, { resource_type: 'image' })
    ]);

    fs.unlinkSync(audioFile.path);
    fs.unlinkSync(imageFile.path);

    const newSong = await songModel.create({
      name,
      desc,
      album,
      image: imageUpload.secure_url,
      file: audioUpload.secure_url,
      duration: audioUpload.duration?.toString() || "0"
    });

    res.status(201).json({ message: '🎶 Song added successfully', song: newSong });
  } catch (err) {
    console.error('❌ Error adding song:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const listSongs = async (req, res) => {
  try {
    const songs = await songModel.find({});
    res.json(songs);
  } catch (err) {
    console.error('❌ Error listing songs:', err.message);
    res.status(500).json({ error: 'Failed to fetch songs' });
  }
};

const deleteSong = async (req, res) => {
  try {
    const deleted = await songModel.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Song not found' });
    }
    res.json({ message: 'Song deleted successfully' });
  } catch (err) {
    console.error('❌ Error deleting song:', err.message);
    res.status(500).json({ error: 'Failed to delete song' });
  }
};

// ======= Routes =======
router.post('/add', upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'audio', maxCount: 1 }
]), addSong);

router.get('/list', listSongs);
router.delete('/:id', deleteSong);

export default router;

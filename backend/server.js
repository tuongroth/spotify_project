import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import connectCloudinary from './src/config/cloudinary.js';
import connectDB from './src/config/mongodb.js';
import songModel from './src/models/songModel.js';
import albumModel from './src/models/albumModel.js';
import { addAlbum } from './src/controller/albumController.js';
import { listAlbums } from './src/controller/albumController.js';
import { deleteAlbum } from './src/controller/albumController.js';
import { addSong } from './src/controller/songController.js';
import { listSongs } from './src/controller/songController.js';
import { deleteSong } from './src/controller/songController.js';

const app = express();
const port = process.env.PORT || 4000;

// ======= Cloudinary Config =======
connectCloudinary();

// ======= MongoDB Connect =======
connectDB();

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

// ======= Mongoose Schemas =======



// ======= Middleware =======
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ======= Base Route =======
app.get('/', (req, res) => res.send("🎵 Spotify-like API is running"));

// ======= SONG Routes =======
app.post('/api/song/add', upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'audio', maxCount: 1 }
]), addSong);

app.get('/api/song/list', listSongs);

app.delete('/api/song/:id', deleteSong);

// ======= ALBUM Routes =======
app.post('/api/album/add', upload.single('image'), addAlbum);

app.get('/api/album/list', listAlbums);

app.delete('/api/album/:id', deleteAlbum);

// ======= ALBUM Routes =======

// ======= Start Server =======
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});

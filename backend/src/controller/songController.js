import fs from 'fs';
import { v2 as cloudinary } from 'cloudinary';
import songModel from '../models/songModel.js';

export const addSong = async (req, res) => {
  console.log("➡️ req.body:", req.body);
  console.log("➡️ req.files:", req.files);

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
 console.log("📦 Cloudinary Audio Upload Response:", audioUpload); 
    const minutes = Math.floor(audioUpload.duration / 60);
    const seconds = Math.floor(audioUpload.duration % 60);
    const formattedDuration = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

    console.log("⏱️ Duration:", formattedDuration); // ✅ log ở đúng chỗ

    const newSong = await songModel.create({
      name,
      desc,
      album,
      image: imageUpload.secure_url,
      file: audioUpload.secure_url,
      duration: formattedDuration
    });

    res.status(201).json({ message: '🎶 Song added successfully', song: newSong });
  } catch (err) {
    console.error('❌ Error adding song:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};


export const listSongs = async (req, res) => {
  try {
    const songs = await songModel.find({});
    res.json(songs);
  } catch (err) {
    console.error('❌ Error listing songs:', err.message);
    res.status(500).json({ error: 'Failed to fetch songs' });
  }
};

export const deleteSong = async (req, res) => {
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

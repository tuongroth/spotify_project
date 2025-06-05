import fs from 'fs';
import { v2 as cloudinary } from 'cloudinary';
import albumModel from '../models/albumModel.js';
// trong albumController.js


// controller
export const getAlbumById = async (req, res) => {
  try {
    console.log('📥 Received Mongo _id:', req.params.id); // In ra ID nhận được

    const album = await albumModel.findById(req.params.id); // Mongo _id
    if (!album) {
      console.log('⚠️ Album not found');
      return res.status(404).json({ message: "Album not found" });
    }

    console.log('✅ Found album:', album); // In chi tiết album tìm được
    res.json(album);
  } catch (error) {
    console.error('❌ Error fetching album by _id:', error.message);
    res.status(500).json({ message: "Server error" });
  }
};


export const addAlbum = async (req, res) => {
  try {
    const { name, desc, bgColour } = req.body;
    const imageFile = req.file;

    if (!imageFile) {
      return res.status(400).json({ error: 'Image file is required' });
    }

    const imageUpload = await cloudinary.uploader.upload(imageFile.path);
    fs.unlinkSync(imageFile.path);

    const newId = await getNextId();

    const newAlbum = await albumModel.create({
      id: newId,
      name,
      desc,
      bgColour,
      image: imageUpload.secure_url
    });

    console.log('🔥 newAlbum._id:', newAlbum._id);
    console.log('🔥 newAlbum.id:', newAlbum.id);

    res.status(201).json({ message: '📀 Album created successfully', album: newAlbum });
  } catch (err) {
    console.error('❌ Error adding album:', err.message);
    res.status(500).json({ error: 'Failed to add album' });
  }
};

export const listAlbums = async (req, res) => {
  try {
    const albums = await albumModel.find({});
    
    // Log toàn bộ id của albums trả về
    console.log('🔥 Fetched albums ids:', albums.map(album => ({ _id: album._id, id: album.id })));
    
    res.json(albums);
  } catch (err) {
    console.error('❌ Error listing albums:', err.message);
    res.status(500).json({ error: 'Failed to fetch albums' });
  }
};


export const deleteAlbum = async (req, res) => {
  try {
    const deleted = await albumModel.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Album not found' });
    }
    res.json({ message: 'Album deleted successfully' });
  } catch (err) {
    console.error('❌ Error deleting album:', err.message);
    res.status(500).json({ error: 'Failed to delete album' });
  }
};

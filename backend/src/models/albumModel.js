import mongoose from 'mongoose';

const albumSchema = new mongoose.Schema({
  id: { type: Number, unique: true }, // thêm trường id kiểu Number
  name: String,
  desc: String,
  bgColour: String,
  image: String
});

const albumModel = mongoose.model('Album', albumSchema);

export default albumModel;

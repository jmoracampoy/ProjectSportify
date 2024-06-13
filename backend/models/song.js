const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  text: { type: String, maxlength: 1000 },
  stars: { type: Number, min: 0, max: 5 },
  createdAt: { type: Date, default: Date.now },
  geolocation: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number] }
  }
});

const songSchema = new mongoose.Schema({
  name: { type: String, required: true },
  artist: { type: String, required: true },
  releaseDate: { type: Date },
  imageUrl: { type: String },
  comments: [commentSchema],
  geolocation: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number] }
  }
});

const Song = mongoose.model('Song', songSchema);
module.exports = Song;

const Song = require('../models/song');
const axios = require('axios');

// Precargar canciones desde Spotify
exports.loadSongs = async (req, res) => {
  try {
    const tokenResponse = await axios.post('https://accounts.spotify.com/api/token', 
      'grant_type=client_credentials', 
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString('base64')}`
        }
      });
    const accessToken = tokenResponse.data.access_token;

    const songResponse = await axios.get('https://api.spotify.com/v1/tracks/{track_id}', {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    const songData = songResponse.data;
    const song = new Song({
      name: songData.name,
      artist: songData.artists[0].name,
      releaseDate: songData.album.release_date,
      imageUrl: songData.album.images[0].url
    });
    await song.save();
    res.status(201).send(song);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Buscar canciones
exports.searchSongs = async (req, res) => {
  try {
    const { name, artist, date } = req.query;
    const query = {};
    if (name) query.name = new RegExp(name, 'i');
    if (artist) query.artist = new RegExp(artist, 'i');
    if (date) query.releaseDate = new Date(date);
    const songs = await Song.find(query);
    res.send(songs);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Obtener datos de una canción
exports.getSong = async (req, res) => {
  try {
    const song = await Song.findById(req.params.id).populate('comments.author');
    if (!song) {
      return res.status(404).send({ message: 'Song not found' });
    }
    res.send(song);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Añadir comentario a una canción
exports.addComment = async (req, res) => {
  try {
    const { text, stars, userId, lat, lng } = req.body;
    const song = await Song.findById(req.params.id);
    if (!song) {
      return res.status(404).send({ message: 'Song not found' });
    }
    const comment = { author: userId, text, stars, createdAt: new Date(), geolocation: { type: 'Point', coordinates: [lng, lat] } };
    song.comments.push(comment);
    await song.save();
    res.send(song);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Insertar canciones seleccionando como favoritos
exports.addFavorite = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }
    user.favorites.push(req.params.id);
    await user.save();
    res.send(user);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Insertar canciones mediante formulario
exports.addSong = async (req, res) => {
  try {
    const { name, artist, releaseDate, imageUrl, lat, lng } = req.body;
    const song = new Song({ name, artist, releaseDate, imageUrl, geolocation: { type: 'Point', coordinates: [lng, lat] } });
    await song.save();
    res.status(201).send(song);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Editar canción
exports.updateSong = async (req, res) => {
  try {
    const song = await Song.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!song) {
      return res.status(404).send({ message: 'Song not found' });
    }
    res.send(song);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Eliminar canción
exports.deleteSong = async (req, res) => {
  try {
    const song = await Song.findByIdAndDelete(req.params.id);
    if (!song) {
      return res.status(404).send({ message: 'Song not found' });
    }
    res.send({ message: 'Song deleted successfully' });
  } catch (error) {
    res.status(500).send(error);
  }
};

// Eliminar comentario
exports.deleteComment = async (req, res) => {
  try {
    const song = await Song.findById(req.params.songId);
    if (!song) {
      return res.status(404).send({ message: 'Song not found' });
    }
    song.comments.id(req.params.commentId).remove();
    await song.save();
    res.send(song);
  } catch (error) {
    res.status(500).send(error);
  }
};

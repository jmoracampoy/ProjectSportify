const User = require('../models/user');
const Song = require('../models/song');

exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('favorites');
    if (!user) {
      return res.status(404).send({ message: 'Usuario no encontrado' });
    }
    res.status(200).send(user);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.addFavorite = async (req, res) => {
  try {
    const userId = req.params.id;
    const songId = req.params.songId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send({ message: 'Usuario no encontrado' });
    }

    const song = await Song.findById(songId);
    if (!song) {
      return res.status(404).send({ message: 'Canción no encontrada' });
    }

    const isFavorite = user.favorites.includes(songId);
    if (isFavorite) {
      return res.status(400).send({ message: 'La canción ya está en favoritos' });
    }

    user.favorites.push(songId);
    await user.save();
    
    res.status(200).send(user);
  } catch (error) {
    res.status(500).send(error);
  }
};


// Método para eliminar una canción de los favoritos
exports.removeFavorite = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).send({ message: 'Usuario no encontrado' });
    }
    user.favorites.pull(req.params.songId);
    await user.save();
    res.status(200).send(user);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Método para obtener las canciones favoritas de un usuario
exports.getFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('favorites');
    if (!user) {
      return res.status(404).send({ message: 'Usuario no encontrado' });
    }
    res.status(200).send(user.favorites);
  } catch (error) {
    res.status(500).send(error);
  }
};

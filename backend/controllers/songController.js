const Song = require("../models/song");
const axios = require("axios");
const getSpotifyAccessToken = require("../middlewares/configSpotify");

//Cargar de canciones Spotify
exports.getTracks = async (req, res) => {
  try {
    const accessToken = await getSpotifyAccessToken();
    let tracks = [];
    let nextUrl = `https://api.spotify.com/v1/search?q=track&type=track&limit=50`;

    while (tracks.length < 500 && nextUrl) {
      const response = await axios.get(nextUrl, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      const newTracks = response.data.tracks.items.map(track => ({
        name: track.name,
        artist: track.artists.map(artist => artist.name).join(', '),
        releaseDate: track.album.release_date,
        imageUrl: track.album.images[0]?.url,
        comments: [],
        geolocation: {
          type: 'Point',
          coordinates: [0, 0]
        }
      }));

      tracks = tracks.concat(newTracks);

      // Get the next URL to fetch more tracks
      nextUrl = response.data.tracks.next;
    }

    tracks = tracks.slice(0, 500);

    // Guarda las canciones en la base de datos
    await Song.insertMany(tracks);

    res.json(tracks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener las pistas' });
  }
};

// Buscar canciones
exports.searchSongs = async (req, res) => {
  try {
    const { name, artist, date } = req.query;
    const query = {};
    if (name) query.name = new RegExp(name, "i");
    if (artist) query.artist = new RegExp(artist, "i");
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
    const song = await Song.findById(req.params.id).populate("comments.author");
    if (!song) {
      return res.status(404).send({ message: "Song not found" });
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
      return res.status(404).send({ message: "Song not found" });
    }
    const comment = {
      author: userId,
      text,
      stars,
      createdAt: new Date(),
      geolocation: { type: "Point", coordinates: [lng, lat] },
    };
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
      return res.status(404).send({ message: "User not found" });
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
    const song = new Song({
      name,
      artist,
      releaseDate,
      imageUrl,
      geolocation: { type: "Point", coordinates: [lng, lat] },
    });
    await song.save();
    res.status(201).send(song);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Editar canción
exports.updateSong = async (req, res) => {
  try {
    const song = await Song.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!song) {
      return res.status(404).send({ message: "Song not found" });
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
      return res.status(404).send({ message: "Song not found" });
    }
    res.send({ message: "Song deleted successfully" });
  } catch (error) {
    res.status(500).send(error);
  }
};

// Eliminar comentario
exports.deleteComment = async (req, res) => {
  try {
    const song = await Song.findById(req.params.songId);
    if (!song) {
      return res.status(404).send({ message: "Song not found" });
    }
    song.comments.id(req.params.commentId).remove();
    await song.save();
    res.send(song);
  } catch (error) {
    res.status(500).send(error);
  }
};

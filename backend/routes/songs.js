/**
 * @swagger
 * tags:
 *   name: Canciones
 *   description: API para la gestión de canciones y comentarios
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Cancion:
 *       type: object
 *       required:
 *         - name
 *         - artist
 *       properties:
 *         _id:
 *           type: string
 *           description: ID único de la canción
 *         name:
 *           type: string
 *           description: Nombre de la canción
 *         artist:
 *           type: string
 *           description: Artista de la canción
 *         releaseDate:
 *           type: string
 *           format: date
 *           description: Fecha de lanzamiento de la canción (YYYY-MM-DD)
 *         imageUrl:
 *           type: string
 *           description: URL de la imagen de la canción
 *         comments:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               _id:
 *                 type: string
 *                 description: ID único del comentario
 *               author:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: ID único del autor del comentario
 *                   username:
 *                     type: string
 *                     description: Nombre de usuario del autor del comentario
 *               text:
 *                 type: string
 *                 description: Texto del comentario
 *               stars:
 *                 type: number
 *                 description: Calificación del comentario (1-5)
 *               createdAt:
 *                 type: string
 *                 format: date-time
 *                 description: Fecha y hora de creación del comentario
 *               geolocation:
 *                 type: object
 *                 properties:
 *                   type:
 *                     type: string
 *                     description: Tipo de coordenadas (Point)
 *                   coordinates:
 *                     type: array
 *                     items:
 *                       type: number
 *                     description: Coordenadas geográficas [longitud, latitud]
 *       example:
 *         name: "Nombre de la Canción"
 *         artist: "Nombre del Artista"
 *         releaseDate: "2023-01-01"
 *         imageUrl: "https://ejemplo.com/imagen.jpg"
 *         comments: []
 * 
 *     Comentario:
 *       type: object
 *       required:
 *         - text
 *         - stars
 *         - userId
 *       properties:
 *         text:
 *           type: string
 *           description: Texto del comentario
 *         stars:
 *           type: number
 *           description: Calificación del comentario (1-5)
 *         userId:
 *           type: string
 *           description: ID del autor del comentario
 *         lat:
 *           type: number
 *           description: Latitud para geolocalización del comentario
 *         lng:
 *           type: number
 *           description: Longitud para geolocalización del comentario
 *       example:
 *         text: "Excelente canción!"
 *         stars: 5
 *         userId: "usuario123"
 *         lat: 40.7128
 *         lng: -74.006
 */

/**
 * @swagger
 * /songs/get-tracks:
 *   get:
 *     summary: Busca pistas de canciones en Spotify
 *     tags: [Canciones]
 *     parameters:
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *         required: true
 *         description: Consulta de búsqueda para encontrar pistas en Spotify
 *     responses:
 *       200:
 *         description: Lista de pistas obtenidas de Spotify
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                     description: Nombre de la pista
 *                   artist:
 *                     type: string
 *                     description: Artista de la pista
 *                   releaseDate:
 *                     type: string
 *                     format: date
 *                     description: Fecha de lanzamiento de la pista
 *                   imageUrl:
 *                     type: string
 *                     description: URL de la imagen del álbum
 *       400:
 *         description: Parámetro de consulta requerido
 *       500:
 *         description: Error al obtener pistas de Spotify
 */

/**
 * @swagger
 * /api/tracks:
 *   get:
 *     summary: Obtiene y guarda pistas de canciones desde Spotify
 *     tags: [Canciones]
 *     responses:
 *       200:
 *         description: Lista de canciones obtenidas y guardadas exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Cancion'
 */

/**
 * @swagger
 * /api/:
 *   get:
 *     summary: Busca canciones por nombre, artista y/o fecha de lanzamiento
 *     tags: [Canciones]
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Nombre de la canción (búsqueda parcial)
 *       - in: query
 *         name: artist
 *         schema:
 *           type: string
 *         description: Nombre del artista (búsqueda parcial)
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha de lanzamiento de la canción (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Lista de canciones que coinciden con los criterios de búsqueda
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Cancion'
 */

/**
 * @swagger
 * /api/{id}:
 *   get:
 *     summary: Obtiene detalles de una canción por su ID
 *     tags: [Canciones]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la canción a obtener
 *     responses:
 *       200:
 *         description: Información detallada de la canción solicitada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cancion'
 *       404:
 *         description: La canción no fue encontrada
 */

/**
 * @swagger
 * /api/:
 *   post:
 *     summary: Añade una nueva canción
 *     tags: [Canciones]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Cancion'
 *     responses:
 *       201:
 *         description: Canción añadida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cancion'
 *       400:
 *         description: Error en la solicitud
 */

/**
 * @swagger
 * /api/{id}:
 *   put:
 *     summary: Actualiza una canción existente por su ID
 *     tags: [Canciones]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la canción a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Cancion'
 *     responses:
 *       200:
 *         description: Canción actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cancion'
 *       404:
 *         description: La canción no fue encontrada
 *       400:
 *         description: Error en la solicitud
 */

/**
 * @swagger
 * /api/{id}:
 *   delete:
 *     summary: Elimina una canción por su ID
 *     tags: [Canciones]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la canción a eliminar
 *     responses:
 *       204:
 *         description: Canción eliminada exitosamente
 *       404:
 *         description: La canción no fue encontrada
 */

/**
 * @swagger
 * /api/{id}/comments:
 *   post:
 *     summary: Añade un comentario a una canción por su ID
 *     tags: [Canciones]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la canción a la que se agregará el comentario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Comentario'
 *     responses:
 *       200:
 *         description: Comentario agregado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cancion'
 *       400:
 *         description: Error en la solicitud
 *       404:
 *         description: La canción no fue encontrada
 */

/**
 * @swagger
 * /api/{songId}/comments/{commentId}:
 *   delete:
 *     summary: Elimina un comentario de una canción por su ID y el ID del comentario
 *     tags: [Canciones]
 *     parameters:
 *       - in: path
 *         name: songId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la canción
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del comentario a eliminar
 *     responses:
 *       204:
 *         description: Comentario eliminado exitosamente
 *       404:
 *         description: Comentario o canción no encontrados
 */

const express = require('express');
const router = express.Router();
const songController = require('../controllers/songController');
const auth = require('../middlewares/auth');

router.get('/get-tracks', songController.getTracksSpotify);
router.get('/tracks', songController.getTracks);
router.get('/', songController.searchSongs);
router.get('/:id', songController.getSong);
router.post('/', auth, songController.addSong);
router.put('/:id', auth, songController.updateSong);
router.delete('/:id', auth, songController.deleteSong);

router.post('/:id/comments', songController.addComment);
router.delete('/:songId/comments/:commentId', auth, songController.deleteComment);

module.exports = router;

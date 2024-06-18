/**
 * @swagger
 * tags:
 *   name: Usuarios
 *   description: API para la gestión de usuarios y sus canciones favoritas
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Usuario:
 *       type: object
 *       required:
 *         - username
 *         - email
 *       properties:
 *         _id:
 *           type: string
 *           description: ID único del usuario
 *         username:
 *           type: string
 *           description: Nombre de usuario
 *         email:
 *           type: string
 *           description: Correo electrónico del usuario
 *         favorites:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Cancion'
 *       example:
 *         username: "usuario123"
 *         email: "usuario@example.com"
 *         favorites: []
 * 
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
 */

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Obtiene información de un usuario por su ID
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario a obtener
 *     responses:
 *       '200':
 *         description: Información detallada del usuario solicitado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Usuario'
 *       '404':
 *         description: El usuario no fue encontrado
 */

/**
 * @swagger
 * /api/users/{id}/favorites:
 *   get:
 *     summary: Obtiene la lista de canciones favoritas de un usuario
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario
 *     responses:
 *       '200':
 *         description: Lista de canciones favoritas del usuario
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Cancion'
 *       '404':
 *         description: El usuario no fue encontrado
 */

/**
 * @swagger
 * /api/users/{id}/favorites/{songId}:
 *   post:
 *     summary: Agrega una canción a los favoritos de un usuario
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario
 *       - in: path
 *         name: songId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la canción a agregar a favoritos
 *     responses:
 *       '200':
 *         description: Canción agregada a favoritos exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Usuario'
 *       '404':
 *         description: El usuario o la canción no fueron encontrados
 */

/**
 * @swagger
 * /api/users/{id}/favorites/{songId}:
 *   delete:
 *     summary: Elimina una canción de los favoritos de un usuario
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario
 *       - in: path
 *         name: songId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la canción a eliminar de favoritos
 *     responses:
 *       '204':
 *         description: Canción eliminada de favoritos exitosamente
 *       '404':
 *         description: El usuario o la canción no fueron encontrados
 */

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middlewares/auth');

router.get('/:id', auth, userController.getUser);
router.post('/:id/favorites/:songId', auth, userController.addFavorite);
router.delete('/:id/favorites/:songId', userController.removeFavorite);
router.get('/:id/favorites', userController.getFavorites);

module.exports = router;

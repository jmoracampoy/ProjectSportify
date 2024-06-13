const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middlewares/auth');

/**
 * @swagger
 * tags:
 *   name: Usuarios
 *   description: Endpoints para la gestión de usuarios
 */

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Obtiene los detalles de un usuario por su ID
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
 *         description: Información del usuario obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: ID único del usuario
 *                 username:
 *                   type: string
 *                   description: Nombre de usuario
 *                 email:
 *                   type: string
 *                   description: Correo electrónico del usuario
 *       '401':
 *         description: No autorizado, token inválido o caducado
 *       '404':
 *         description: Usuario no encontrado
 *       '500':
 *         description: Error interno del servidor
 */

/**
 * @swagger
 * /api/users/{id}/favorites/{songId}:
 *   post:
 *     summary: Agrega una canción a favoritos para el usuario autenticado
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
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: ID único del usuario
 *                 favorites:
 *                   type: array
 *                   description: Lista de IDs de canciones favoritas del usuario
 *                   items:
 *                     type: string
 *       '401':
 *         description: No autorizado, token inválido o caducado
 *       '404':
 *         description: Usuario o canción no encontrados
 *       '500':
 *         description: Error interno del servidor
 */

// Rutas de usuario
router.get('/:id', auth, userController.getUser);
router.post('/:id/favorites/:songId', auth, userController.addFavorite);

module.exports = router;

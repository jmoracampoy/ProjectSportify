const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middlewares/auth');

router.get('/:id', auth, userController.getUser);
router.post('/:id/favorites/:songId', auth, userController.addFavorite);

module.exports = router;

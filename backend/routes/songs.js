const express = require('express');
const router = express.Router();
const songController = require('../controllers/songController');
const auth = require('../middlewares/auth');

router.get('/', songController.searchSongs);
router.get('/:id', songController.getSong);
router.post('/', auth, songController.addSong);
router.put('/:id', auth, songController.updateSong);
router.delete('/:id', auth, songController.deleteSong);

router.post('/:id/comments', auth, songController.addComment);
router.delete('/:songId/comments/:commentId', auth, songController.deleteComment);

module.exports = router;

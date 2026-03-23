const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const { 
  getPosts, getPost, createPost, deletePost,
  likePost, unlikePost,
  commentPost, getComments,
  favoritePost, unfavoritePost,
  getUserPosts, getUserLikes, getUserFavorites
} = require('../controllers/post');

router.get('/', getPosts);
router.get('/user/posts', authMiddleware, getUserPosts);
router.get('/user/likes', authMiddleware, getUserLikes);
router.get('/user/favorites', authMiddleware, getUserFavorites);
router.get('/:id', getPost);
router.post('/', authMiddleware, createPost);
router.delete('/:id', authMiddleware, deletePost);
router.post('/:id/like', authMiddleware, likePost);
router.delete('/:id/like', authMiddleware, unlikePost);
router.post('/:id/comments', authMiddleware, commentPost);
router.get('/:id/comments', getComments);
router.post('/:id/favorite', authMiddleware, favoritePost);
router.delete('/:id/favorite', authMiddleware, unfavoritePost);

module.exports = router;
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const { getQuestions, getQuestion, createQuestion, deleteQuestion, createAnswer, getAnswers, acceptAnswer, likeAnswer } = require('../controllers/question');

router.get('/', getQuestions);
router.get('/:id', getQuestion);
router.post('/', authMiddleware, createQuestion);
router.delete('/:id', authMiddleware, deleteQuestion);
router.post('/:id/answers', authMiddleware, createAnswer);
router.get('/:id/answers', getAnswers);
router.post('/answers/:id/accept', authMiddleware, acceptAnswer);
router.post('/answers/:id/like', authMiddleware, likeAnswer);

module.exports = router;
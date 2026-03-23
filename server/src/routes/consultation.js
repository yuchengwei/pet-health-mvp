const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const { startConsultation, replyConsultation, getConsultationHistory, getConsultationDetail } = require('../controllers/consultation');

router.post('/start', authMiddleware, startConsultation);
router.post('/:id/reply', authMiddleware, replyConsultation);
router.get('/history', authMiddleware, getConsultationHistory);
router.get('/:id', authMiddleware, getConsultationDetail);

module.exports = router;
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const { getNotifications, markRead, markAllRead, deleteNotification, getUnreadCount } = require('../controllers/notification');

router.get('/', authMiddleware, getNotifications);
router.get('/unread', authMiddleware, getUnreadCount);
router.put('/:id/read', authMiddleware, markRead);
router.put('/read-all', authMiddleware, markAllRead);
router.delete('/:id', authMiddleware, deleteNotification);

module.exports = router;
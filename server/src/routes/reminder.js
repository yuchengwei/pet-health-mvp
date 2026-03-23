const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const { getReminders, updateReminder, updateSettings, createReminder, deleteReminder, checkReminders } = require('../controllers/reminder');

router.get('/', authMiddleware, getReminders);
router.put('/:id', authMiddleware, updateReminder);
router.put('/settings', authMiddleware, updateSettings);
router.post('/', authMiddleware, createReminder);
router.delete('/:id', authMiddleware, deleteReminder);
router.post('/check', checkReminders);

module.exports = router;
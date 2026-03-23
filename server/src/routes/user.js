const express = require('express');
const router = express.Router();
const { getProfile, updateProfile } = require('../controllers/user');
const authMiddleware = require('../middleware/auth');

// 获取用户信息
router.get('/profile', authMiddleware, getProfile);

// 更新用户信息
router.put('/profile', authMiddleware, updateProfile);

module.exports = router;
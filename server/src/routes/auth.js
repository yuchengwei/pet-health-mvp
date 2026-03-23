const express = require('express');
const router = express.Router();
const { sendVerificationCode, loginWithCode, wxLogin } = require('../controllers/auth');

// 发送验证码
router.post('/send-code', sendVerificationCode);

// 验证码登录
router.post('/login', loginWithCode);

// 微信登录
router.post('/wx-login', wxLogin);

module.exports = router;
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { createClient } = require('redis');

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'pet_health',
  password: process.env.DB_PASSWORD || 'password',
  port: process.env.DB_PORT || 5432,
});

const redis = createClient({ url: process.env.REDIS_URL || 'redis://localhost:6379' });
redis.connect().catch(console.error);

// 发送验证码
const sendVerificationCode = async (req, res) => {
  const { phone } = req.body;
  
  if (!phone || !/^1[3-9]\d{9}$/.test(phone)) {
    return res.status(400).json({ error: '无效的手机号' });
  }

  // 生成6位验证码
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  
  // 存入Redis，5分钟有效
  await redis.setEx(`verify:${phone}`, 300, code);
  
  // TODO: 调用短信API发送验证码
  console.log(`验证码: ${code}`);
  
  res.json({ success: true, message: '验证码已发送' });
};

// 验证码登录
const loginWithCode = async (req, res) => {
  const { phone, code } = req.body;
  
  if (!phone || !code) {
    return res.status(400).json({ error: '参数不完整' });
  }

  // 验证验证码
  const savedCode = await redis.get(`verify:${phone}`);
  if (savedCode !== code) {
    return res.status(401).json({ error: '验证码错误或已过期' });
  }

  // 查找或创建用户
  let user = await pool.query('SELECT * FROM users WHERE phone = $1', [phone]);
  
  if (user.rows.length === 0) {
    // 新用户注册
    const newUser = await pool.query(
      'INSERT INTO users (phone, created_at) VALUES ($1, NOW()) RETURNING *',
      [phone]
    );
    user = newUser;
  }

  // 生成Token
  const token = jwt.sign(
    { userId: user.rows[0].id, phone: user.rows[0].phone },
    process.env.JWT_SECRET || 'pet-health-secret',
    { expiresIn: '7d' }
  );

  // 删除验证码
  await redis.del(`verify:${phone}`);

  res.json({
    success: true,
    token,
    user: {
      id: user.rows[0].id,
      phone: user.rows[0].phone,
      nickname: user.rows[0].nickname,
      avatar: user.rows[0].avatar
    }
  });
};

// 微信登录
const wxLogin = async (req, res) => {
  const { code, userInfo } = req.body;
  
  // TODO: 通过code换取openid
  // const wxResult = await axios.get(`https://api.weixin.qq.com/sns/jscode2session?appid=${APPID}&secret=${SECRET}&js_code=${code}&grant_type=authorization_code`);
  // const openid = wxResult.data.openid;
  
  const openid = `wx_${code}`; // 模拟
  
  // 查找或创建用户
  let user = await pool.query('SELECT * FROM users WHERE wx_openid = $1', [openid]);
  
  if (user.rows.length === 0) {
    const newUser = await pool.query(
      'INSERT INTO users (wx_openid, nickname, avatar, created_at) VALUES ($1, $2, $3, NOW()) RETURNING *',
      [openid, userInfo?.nickName || '微信用户', userInfo?.avatarUrl || '']
    );
    user = newUser;
  }

  const token = jwt.sign(
    { userId: user.rows[0].id },
    process.env.JWT_SECRET || 'pet-health-secret',
    { expiresIn: '7d' }
  );

  res.json({
    success: true,
    token,
    user: {
      id: user.rows[0].id,
      phone: user.rows[0].phone,
      nickname: user.rows[0].nickname,
      avatar: user.rows[0].avatar
    }
  });
};

module.exports = { sendVerificationCode, loginWithCode, wxLogin };
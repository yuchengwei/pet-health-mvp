const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'pet_health',
  password: process.env.DB_PASSWORD || 'password',
  port: process.env.DB_PORT || 5432,
});

// 获取用户信息
const getProfile = async (req, res) => {
  try {
    const user = await pool.query(
      'SELECT id, phone, nickname, avatar, region, pet_experience, created_at FROM users WHERE id = $1',
      [req.userId]
    );
    
    if (user.rows.length === 0) {
      return res.status(404).json({ error: '用户不存在' });
    }
    
    res.json({ success: true, user: user.rows[0] });
  } catch (error) {
    res.status(500).json({ error: '服务器错误' });
  }
};

// 更新用户信息
const updateProfile = async (req, res) => {
  const { nickname, avatar, region, pet_experience } = req.body;
  
  try {
    const user = await pool.query(
      `UPDATE users 
       SET nickname = COALESCE($1, nickname),
           avatar = COALESCE($2, avatar),
           region = COALESCE($3, region),
           pet_experience = COALESCE($4, pet_experience),
           updated_at = NOW()
       WHERE id = $5
       RETURNING id, phone, nickname, avatar, region, pet_experience`,
      [nickname, avatar, region, pet_experience, req.userId]
    );
    
    res.json({ success: true, user: user.rows[0] });
  } catch (error) {
    res.status(500).json({ error: '服务器错误' });
  }
};

module.exports = { getProfile, updateProfile };
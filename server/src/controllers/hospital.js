const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'pet_health',
  password: process.env.DB_PASSWORD || 'password',
  port: process.env.DB_PORT || 5432,
});

// 获取医院列表
const getHospitals = async (req, res) => {
  const { region, rating, sort, page = 1, limit = 20 } = req.query;
  const offset = (page - 1) * limit;
  
  let query = 'SELECT * FROM hospitals WHERE 1=1';
  const params = [];
  let paramIndex = 1;
  
  if (region) {
    query += ` AND region = $${paramIndex}`;
    params.push(region);
    paramIndex++;
  }
  
  if (rating) {
    query += ` AND rating >= $${paramIndex}`;
    params.push(rating);
    paramIndex++;
  }
  
  // 排序
  switch (sort) {
    case 'rating':
      query += ' ORDER BY rating DESC';
      break;
    case 'reviews':
      query += ' ORDER BY reviews_count DESC';
      break;
    default:
      query += ' ORDER BY created_at DESC';
  }
  
  query += ` LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
  params.push(limit, offset);
  
  try {
    const hospitals = await pool.query(query, params);
    res.json({ success: true, hospitals: hospitals.rows });
  } catch (error) {
    res.status(500).json({ error: '服务器错误' });
  }
};

// 获取医院详情
const getHospital = async (req, res) => {
  try {
    const hospital = await pool.query(
      'SELECT * FROM hospitals WHERE id = $1',
      [req.params.id]
    );
    
    if (hospital.rows.length === 0) {
      return res.status(404).json({ error: '医院不存在' });
    }
    
    res.json({ success: true, hospital: hospital.rows[0] });
  } catch (error) {
    res.status(500).json({ error: '服务器错误' });
  }
};

// 搜索医院
const searchHospitals = async (req, res) => {
  const { keyword, page = 1, limit = 20 } = req.query;
  const offset = (page - 1) * limit;
  
  try {
    const hospitals = await pool.query(
      `SELECT * FROM hospitals 
       WHERE name ILIKE $1 OR address ILIKE $1
       ORDER BY rating DESC
       LIMIT $2 OFFSET $3`,
      [`%${keyword}%`, limit, offset]
    );
    res.json({ success: true, hospitals: hospitals.rows });
  } catch (error) {
    res.status(500).json({ error: '服务器错误' });
  }
};

// 获取附近医院
const getNearbyHospitals = async (req, res) => {
  const { lat, lng, radius = 5000 } = req.query;
  
  // 简单距离计算（实际应使用PostGIS）
  try {
    const hospitals = await pool.query(
      `SELECT *, 
       (6371 * acos(cos(radians($1)) * cos(radians(latitude)) * 
       cos(radians(longitude) - radians($2)) + sin(radians($1)) * 
       sin(radians(latitude)))) AS distance
       FROM hospitals
       HAVING distance < $3
       ORDER BY distance
       LIMIT 20`,
      [lat, lng, radius / 1000]
    );
    res.json({ success: true, hospitals: hospitals.rows });
  } catch (error) {
    res.status(500).json({ error: '服务器错误' });
  }
};

// 添加评价
const addReview = async (req, res) => {
  const { overall_rating, service_rating, env_rating, professional_rating, content, images } = req.body;
  const authMiddleware = require('../middleware/auth');
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ error: '请先登录' });
  }
  
  try {
    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'pet-health-secret');
    
    const review = await pool.query(
      `INSERT INTO reviews (hospital_id, user_id, overall_rating, service_rating, env_rating, professional_rating, content, images, status, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'pending', NOW())
       RETURNING *`,
      [req.params.id, decoded.userId, overall_rating, service_rating, env_rating, professional_rating, content, JSON.stringify(images)]
    );
    
    res.json({ success: true, review: review.rows[0], message: '评价提交成功，待审核' });
  } catch (error) {
    res.status(500).json({ error: '服务器错误' });
  }
};

// 获取评价列表
const getReviews = async (req, res) => {
  try {
    const reviews = await pool.query(
      `SELECT r.*, u.nickname, u.avatar 
       FROM reviews r
       JOIN users u ON r.user_id = u.id
       WHERE r.hospital_id = $1 AND r.status = 'approved'
       ORDER BY r.created_at DESC`,
      [req.params.id]
    );
    res.json({ success: true, reviews: reviews.rows });
  } catch (error) {
    res.status(500).json({ error: '服务器错误' });
  }
};

// 收藏/取消收藏
const toggleFavorite = async (req, res) => {
  const authMiddleware = require('../middleware/auth');
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ error: '请先登录' });
  }
  
  try {
    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'pet-health-secret');
    
    // 检查是否已收藏
    const existing = await pool.query(
      'SELECT * FROM favorites WHERE user_id = $1 AND hospital_id = $2',
      [decoded.userId, req.params.id]
    );
    
    if (existing.rows.length > 0) {
      // 取消收藏
      await pool.query(
        'DELETE FROM favorites WHERE user_id = $1 AND hospital_id = $2',
        [decoded.userId, req.params.id]
      );
      res.json({ success: true, favorited: false });
    } else {
      // 添加收藏
      await pool.query(
        'INSERT INTO favorites (user_id, hospital_id, created_at) VALUES ($1, $2, NOW())',
        [decoded.userId, req.params.id]
      );
      res.json({ success: true, favorited: true });
    }
  } catch (error) {
    res.status(500).json({ error: '服务器错误' });
  }
};

module.exports = { getHospitals, getHospital, searchHospitals, getNearbyHospitals, addReview, getReviews, toggleFavorite };
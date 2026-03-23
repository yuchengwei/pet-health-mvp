const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'pet_health',
  password: process.env.DB_PASSWORD || 'password',
  port: process.env.DB_PORT || 5432,
});

// 获取故事列表
const getPosts = async (req, res) => {
  const { category, page = 1, limit = 20 } = req.query;
  const offset = (page - 1) * limit;
  
  try {
    let query = `SELECT p.*, u.nickname, u.avatar FROM posts p JOIN users u ON p.user_id = u.id WHERE p.status = 'approved'`;
    const params = [];
    
    if (category) {
      query += ' AND p.category = $1';
      params.push(category);
    }
    
    query += ' ORDER BY p.created_at DESC LIMIT $' + (params.length + 1) + ' OFFSET $' + (params.length + 2);
    params.push(limit, offset);
    
    const posts = await pool.query(query, params);
    res.json({ success: true, posts: posts.rows });
  } catch (error) {
    res.status(500).json({ error: '服务器错误' });
  }
};

// 获取故事详情
const getPost = async (req, res) => {
  try {
    const post = await pool.query(
      `SELECT p.*, u.nickname, u.avatar FROM posts p JOIN users u ON p.user_id = u.id WHERE p.id = $1`,
      [req.params.id]
    );
    
    if (post.rows.length === 0) {
      return res.status(404).json({ error: '故事不存在' });
    }
    
    res.json({ success: true, post: post.rows[0] });
  } catch (error) {
    res.status(500).json({ error: '服务器错误' });
  }
};

// 发布故事
const createPost = async (req, res) => {
  const { category, title, content, images } = req.body;
  
  try {
    const post = await pool.query(
      `INSERT INTO posts (user_id, category, title, content, images, status, created_at)
       VALUES ($1, $2, $3, $4, $5, 'pending', NOW())
       RETURNING *`,
      [req.userId, category, title, content, JSON.stringify(images)]
    );
    
    res.json({ success: true, post: post.rows[0], message: '发布成功，待审核' });
  } catch (error) {
    res.status(500).json({ error: '服务器错误' });
  }
};

// 删除故事
const deletePost = async (req, res) => {
  try {
    await pool.query('DELETE FROM posts WHERE id = $1 AND user_id = $2', [req.params.id, req.userId]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: '服务器错误' });
  }
};

// 点赞
const likePost = async (req, res) => {
  try {
    await pool.query('INSERT INTO likes (user_id, post_id, created_at) VALUES ($1, $2, NOW())', [req.userId, req.params.id]);
    await pool.query('UPDATE posts SET likes_count = likes_count + 1 WHERE id = $1', [req.params.id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: '服务器错误' });
  }
};

const unlikePost = async (req, res) => {
  try {
    await pool.query('DELETE FROM likes WHERE user_id = $1 AND post_id = $2', [req.userId, req.params.id]);
    await pool.query('UPDATE posts SET likes_count = likes_count - 1 WHERE id = $1', [req.params.id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: '服务器错误' });
  }
};

// 评论
const commentPost = async (req, res) => {
  const { content, parent_id } = req.body;
  
  try {
    const comment = await pool.query(
      'INSERT INTO comments (post_id, user_id, content, parent_id, created_at) VALUES ($1, $2, $3, $4, NOW()) RETURNING *',
      [req.params.id, req.userId, content, parent_id]
    );
    await pool.query('UPDATE posts SET comments_count = comments_count + 1 WHERE id = $1', [req.params.id]);
    res.json({ success: true, comment: comment.rows[0] });
  } catch (error) {
    res.status(500).json({ error: '服务器错误' });
  }
};

const getComments = async (req, res) => {
  try {
    const comments = await pool.query(
      `SELECT c.*, u.nickname, u.avatar FROM comments c JOIN users u ON c.user_id = u.id WHERE c.post_id = $1 ORDER BY c.created_at`,
      [req.params.id]
    );
    res.json({ success: true, comments: comments.rows });
  } catch (error) {
    res.status(500).json({ error: '服务器错误' });
  }
};

// 收藏
const favoritePost = async (req, res) => {
  try {
    await pool.query('INSERT INTO favorites (user_id, post_id, created_at) VALUES ($1, $2, NOW())', [req.userId, req.params.id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: '服务器错误' });
  }
};

const unfavoritePost = async (req, res) => {
  try {
    await pool.query('DELETE FROM favorites WHERE user_id = $1 AND post_id = $2', [req.userId, req.params.id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: '服务器错误' });
  }
};

// 用户相关
const getUserPosts = async (req, res) => {
  try {
    const posts = await pool.query('SELECT * FROM posts WHERE user_id = $1 ORDER BY created_at DESC', [req.userId]);
    res.json({ success: true, posts: posts.rows });
  } catch (error) {
    res.status(500).json({ error: '服务器错误' });
  }
};

const getUserLikes = async (req, res) => {
  try {
    const posts = await pool.query(
      `SELECT p.* FROM posts p JOIN likes l ON p.id = l.post_id WHERE l.user_id = $1 ORDER BY l.created_at DESC`,
      [req.userId]
    );
    res.json({ success: true, posts: posts.rows });
  } catch (error) {
    res.status(500).json({ error: '服务器错误' });
  }
};

const getUserFavorites = async (req, res) => {
  try {
    const posts = await pool.query(
      `SELECT p.* FROM posts p JOIN favorites f ON p.id = f.post_id WHERE f.user_id = $1 ORDER BY f.created_at DESC`,
      [req.userId]
    );
    res.json({ success: true, posts: posts.rows });
  } catch (error) {
    res.status(500).json({ error: '服务器错误' });
  }
};

module.exports = {
  getPosts, getPost, createPost, deletePost,
  likePost, unlikePost, commentPost, getComments,
  favoritePost, unfavoritePost,
  getUserPosts, getUserLikes, getUserFavorites
};
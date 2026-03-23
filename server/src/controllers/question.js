const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'pet_health',
  password: process.env.DB_PASSWORD || 'password',
  port: process.env.DB_PORT || 5432,
});

const getQuestions = async (req, res) => {
  const { category, page = 1, limit = 20 } = req.query;
  const offset = (page - 1) * limit;
  try {
    let query = `SELECT q.*, u.nickname, u.avatar FROM questions q JOIN users u ON q.user_id = u.id WHERE 1=1`;
    const params = [];
    if (category) { query += ' AND q.category = $1'; params.push(category); }
    query += ` ORDER BY q.created_at DESC LIMIT $${params.length+1} OFFSET $${params.length+2}`;
    params.push(limit, offset);
    const questions = await pool.query(query, params);
    res.json({ success: true, questions: questions.rows });
  } catch (error) { res.status(500).json({ error: '服务器错误' }); }
};

const getQuestion = async (req, res) => {
  try {
    const question = await pool.query(`SELECT q.*, u.nickname, u.avatar FROM questions q JOIN users u ON q.user_id = u.id WHERE q.id = $1`, [req.params.id]);
    if (question.rows.length === 0) return res.status(404).json({ error: '问题不存在' });
    await pool.query('UPDATE questions SET views_count = views_count + 1 WHERE id = $1', [req.params.id]);
    res.json({ success: true, question: question.rows[0] });
  } catch (error) { res.status(500).json({ error: '服务器错误' }); }
};

const createQuestion = async (req, res) => {
  const { category, title, content, images } = req.body;
  try {
    const question = await pool.query(`INSERT INTO questions (user_id, category, title, content, images, created_at) VALUES ($1, $2, $3, $4, $5, NOW()) RETURNING *`, [req.userId, category, title, content, JSON.stringify(images)]);
    res.json({ success: true, question: question.rows[0] });
  } catch (error) { res.status(500).json({ error: '服务器错误' }); }
};

const deleteQuestion = async (req, res) => {
  try {
    await pool.query('DELETE FROM questions WHERE id = $1 AND user_id = $2', [req.params.id, req.userId]);
    res.json({ success: true });
  } catch (error) { res.status(500).json({ error: '服务器错误' }); }
};

const createAnswer = async (req, res) => {
  const { content } = req.body;
  try {
    const answer = await pool.query(`INSERT INTO answers (question_id, user_id, content, created_at) VALUES ($1, $2, $3, NOW()) RETURNING *`, [req.params.id, req.userId, content]);
    await pool.query('UPDATE questions SET answers_count = answers_count + 1 WHERE id = $1', [req.params.id]);
    res.json({ success: true, answer: answer.rows[0] });
  } catch (error) { res.status(500).json({ error: '服务器错误' }); }
};

const getAnswers = async (req, res) => {
  try {
    const answers = await pool.query(`SELECT a.*, u.nickname, u.avatar FROM answers a JOIN users u ON a.user_id = u.id WHERE a.question_id = $1 ORDER BY a.is_accepted DESC, a.likes_count DESC, a.created_at`, [req.params.id]);
    res.json({ success: true, answers: answers.rows });
  } catch (error) { res.status(500).json({ error: '服务器错误' }); }
};

const acceptAnswer = async (req, res) => {
  try {
    const question = await pool.query('SELECT user_id FROM questions WHERE id = (SELECT question_id FROM answers WHERE id = $1)', [req.params.id]);
    if (question.rows[0].user_id !== req.userId) return res.status(403).json({ error: '无权限' });
    await pool.query('UPDATE answers SET is_accepted = true WHERE id = $1', [req.params.id]);
    res.json({ success: true });
  } catch (error) { res.status(500).json({ error: '服务器错误' }); }
};

const likeAnswer = async (req, res) => {
  try {
    await pool.query('UPDATE answers SET likes_count = likes_count + 1 WHERE id = $1', [req.params.id]);
    res.json({ success: true });
  } catch (error) { res.status(500).json({ error: '服务器错误' }); }
};

module.exports = { getQuestions, getQuestion, createQuestion, deleteQuestion, createAnswer, getAnswers, acceptAnswer, likeAnswer };
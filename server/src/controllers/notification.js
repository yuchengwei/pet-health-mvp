const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'pet_health',
  password: process.env.DB_PASSWORD || 'password',
  port: process.env.DB_PORT || 5432,
});

const getNotifications = async (req, res) => {
  try {
    const notifications = await pool.query('SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC LIMIT 50', [req.userId]);
    res.json({ success: true, notifications: notifications.rows });
  } catch (error) { res.status(500).json({ error: '服务器错误' }); }
};

const getUnreadCount = async (req, res) => {
  try {
    const result = await pool.query('SELECT COUNT(*) FROM notifications WHERE user_id = $1 AND is_read = false', [req.userId]);
    res.json({ success: true, count: parseInt(result.rows[0].count) });
  } catch (error) { res.status(500).json({ error: '服务器错误' }); }
};

const markRead = async (req, res) => {
  try {
    await pool.query('UPDATE notifications SET is_read = true WHERE id = $1 AND user_id = $2', [req.params.id, req.userId]);
    res.json({ success: true });
  } catch (error) { res.status(500).json({ error: '服务器错误' }); }
};

const markAllRead = async (req, res) => {
  try {
    await pool.query('UPDATE notifications SET is_read = true WHERE user_id = $1', [req.userId]);
    res.json({ success: true });
  } catch (error) { { res.status(500).json({ error: '服务器错误' }); }
};

const deleteNotification = async (req, res) => {
  try {
    await pool.query('DELETE FROM notifications WHERE id = $1 AND user_id = $2', [req.params.id, req.userId]);
    res.json({ success: true });
  } catch (error) { res.status(500).json({ error: '服务器错误' }); }
};

module.exports = { getNotifications, markRead, markAllRead, deleteNotification, getUnreadCount };
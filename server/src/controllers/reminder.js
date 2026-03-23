const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'pet_health',
  password: process.env.DB_PASSWORD || 'password',
  port: process.env.DB_PORT || 5432,
});

const getReminders = async (req, res) => {
  try {
    const reminders = await pool.query('SELECT * FROM reminders WHERE user_id = $1 ORDER BY remind_date', [req.userId]);
    res.json({ success: true, reminders: reminders.rows });
  } catch (error) { res.status(500).json({ error: '服务器错误' }); }
};

const updateReminder = async (req, res) => {
  try {
    await pool.query('UPDATE reminders SET is_handled = true WHERE id = $1 AND user_id = $2', [req.params.id, req.userId]);
    res.json({ success: true });
  } catch (error) { res.status(500).json({ error: '服务器错误' }); }
};

const updateSettings = async (req, res) => {
  const { vaccine_enabled, deworm_enabled, exam_enabled, advance_days } = req.body;
  try {
    const settings = await pool.query(`INSERT INTO reminder_settings (user_id, vaccine_enabled, deworm_enabled, exam_enabled, advance_days) VALUES ($1, $2, $3, $4, $5) ON CONFLICT (user_id) DO UPDATE SET vaccine_enabled = $2, deworm_enabled = $3, exam_enabled = $4, advance_days = $5 RETURNING *`, [req.userId, vaccine_enabled, deworm_enabled, exam_enabled, advance_days || 3]);
    res.json({ success: true, settings: settings.rows[0] });
  } catch (error) { res.status(500).json({ error: '服务器错误' }); }
};

const createReminder = async (req, res) => {
  const { pet_id, type, title, content, remind_date } = req.body;
  try {
    const reminder = await pool.query('INSERT INTO reminders (pet_id, user_id, type, title, content, remind_date, created_at) VALUES ($1, $2, $3, $4, $5, $6, NOW()) RETURNING *', [pet_id, req.userId, type, title, content, remind_date]);
    res.json({ success: true, reminder: reminder.rows[0] });
  } catch (error) { res.status(500).json({ error: '服务器错误' }); }
};

const deleteReminder = async (req, res) => {
  try {
    await pool.query('DELETE FROM reminders WHERE id = $1 AND user_id = $2', [req.params.id, req.userId]);
    res.json({ success: true });
  } catch (error) { res.status(500).json({ error: '服务器错误' }); }
};

// 定时检查提醒
const checkReminders = async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const reminders = await pool.query(`SELECT r.*, u.wx_openid FROM reminders r JOIN users u ON r.user_id = u.id WHERE r.remind_date <= $1 AND r.is_handled = false`, [today]);
    
    for (const reminder of reminders.rows) {
      // TODO: 发送微信通知
      console.log(`发送提醒: ${reminder.title} - ${reminder.content}`);
    }
    
    res.json({ success: true, count: reminders.rows.length });
  } catch (error) { res.status(500).json({ error: '服务器错误' }); }
};

module.exports = { getReminders, updateReminder, updateSettings, createReminder, deleteReminder, checkReminders };
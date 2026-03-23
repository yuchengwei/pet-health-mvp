const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'pet_health',
  password: process.env.DB_PASSWORD || 'password',
  port: process.env.DB_PORT || 5432,
});

// AI问诊响应（简化版）
const generateAIResponse = (userMessage, petType) => {
  const responses = {
    '日常护理': '感谢您的咨询。根据您描述的情况，建议：1）保持宠物生活环境清洁；2）注意饮食均衡；3）定期运动。如症状持续，建议就医。',
    '疾病咨询': '根据您描述的症状，可能是以下原因导致。建议尽快带宠物就医，进行详细检查。不要自行给宠物用药。',
    '用药咨询': '关于用药问题，请务必咨询专业兽医。不要随意给宠物使用人类药物，某些药物对宠物可能有毒。'
  };
  return responses[petType] || '感谢您的咨询。建议咨询专业兽医获取准确建议。';
};

const startConsultation = async (req, res) => {
  const { pet_id, type, content, images } = req.body;
  try {
    const consultation = await pool.query(
      'INSERT INTO consultations (user_id, pet_id, type, status, created_at) VALUES ($1, $2, $3, $4, NOW()) RETURNING *',
      [req.userId, pet_id, type, 'active']
    );
    const aiResponse = generateAIResponse(content, type);
    const message = await pool.query(
      'INSERT INTO consultation_messages (consultation_id, role, content, images, created_at) VALUES ($1, $2, $3, $4, NOW()) RETURNING *',
      [consultation.rows[0].id, 'user', content, JSON.stringify(images)]
    );
    const aiMsg = await pool.query(
      'INSERT INTO consultation_messages (consultation_id, role, content, created_at) VALUES ($1, $2, $3, NOW()) RETURNING *',
      [consultation.rows[0].id, 'assistant', aiResponse]
    );
    res.json({ success: true, consultation: consultation.rows[0], messages: [message.rows[0], aiMsg.rows[0]] });
  } catch (error) { res.status(500).json({ error: '服务器错误' }); }
};

const replyConsultation = async (req, res) => {
  const { content } = req.body;
  try {
    const message = await pool.query(
      'INSERT INTO consultation_messages (consultation_id, role, content, created_at) VALUES ($1, $2, $3, NOW()) RETURNING *',
      [req.params.id, 'user', content]
    );
    const aiResponse = generateAIResponse(content, '日常护理');
    const aiMsg = await pool.query(
      'INSERT INTO consultation_messages (consultation_id, role, content, created_at) VALUES ($1, $2, $3, NOW()) RETURNING *',
      [req.params.id, 'assistant', aiResponse]
    );
    res.json({ success: true, messages: [message.rows[0], aiMsg.rows[0]] });
  } catch (error) { res.status(500).json({ error: '服务器错误' }); }
};

const getConsultationHistory = async (req, res) => {
  try {
    const consultations = await pool.query('SELECT * FROM consultations WHERE user_id = $1 ORDER BY created_at DESC', [req.userId]);
    res.json({ success: true, consultations: consultations.rows });
  } catch (error) { res.status(500).json({ error: '服务器错误' }); }
};

const getConsultationDetail = async (req, res) => {
  try {
    const consultation = await pool.query('SELECT * FROM consultations WHERE id = $1 AND user_id = $2', [req.params.id, req.userId]);
    if (consultation.rows.length === 0) return res.status(404).json({ error: '问诊不存在' });
    const messages = await pool.query('SELECT * FROM consultation_messages WHERE consultation_id = $1 ORDER BY created_at', [req.params.id]);
    res.json({ success: true, consultation: consultation.rows[0], messages: messages.rows });
  } catch (error) { res.status(500).json({ error: '服务器错误' }); }
};

module.exports = { startConsultation, replyConsultation, getConsultationHistory, getConsultationDetail };
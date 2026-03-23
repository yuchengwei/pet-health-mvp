const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'pet_health',
  password: process.env.DB_PASSWORD || 'password',
  port: process.env.DB_PORT || 5432,
});

// 获取宠物列表
const getPets = async (req, res) => {
  try {
    const pets = await pool.query(
      'SELECT * FROM pets WHERE user_id = $1 ORDER BY created_at DESC',
      [req.userId]
    );
    res.json({ success: true, pets: pets.rows });
  } catch (error) {
    res.status(500).json({ error: '服务器错误' });
  }
};

// 获取宠物详情
const getPet = async (req, res) => {
  try {
    const pet = await pool.query(
      'SELECT * FROM pets WHERE id = $1 AND user_id = $2',
      [req.params.id, req.userId]
    );
    
    if (pet.rows.length === 0) {
      return res.status(404).json({ error: '宠物不存在' });
    }
    
    res.json({ success: true, pet: pet.rows[0] });
  } catch (error) {
    res.status(500).json({ error: '服务器错误' });
  }
};

// 添加宠物
const createPet = async (req, res) => {
  const { name, breed, gender, birth_date, weight, chip_no } = req.body;
  
  try {
    // 检查宠物数量上限
    const count = await pool.query(
      'SELECT COUNT(*) FROM pets WHERE user_id = $1',
      [req.userId]
    );
    
    if (parseInt(count.rows[0].count) >= 5) {
      return res.status(400).json({ error: '最多添加5只宠物' });
    }
    
    const pet = await pool.query(
      `INSERT INTO pets (user_id, name, breed, gender, birth_date, weight, chip_no, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
       RETURNING *`,
      [req.userId, name, breed, gender, birth_date, weight, chip_no]
    );
    
    res.json({ success: true, pet: pet.rows[0] });
  } catch (error) {
    res.status(500).json({ error: '服务器错误' });
  }
};

// 编辑宠物
const updatePet = async (req, res) => {
  const { name, breed, gender, birth_date, weight, chip_no } = req.body;
  
  try {
    const pet = await pool.query(
      `UPDATE pets 
       SET name = COALESCE($1, name),
           breed = COALESCE($2, breed),
           gender = COALESCE($3, gender),
           birth_date = COALESCE($4, birth_date),
           weight = COALESCE($5, weight),
           chip_no = COALESCE($6, chip_no),
           updated_at = NOW()
       WHERE id = $7 AND user_id = $8
       RETURNING *`,
      [name, breed, gender, birth_date, weight, chip_no, req.params.id, req.userId]
    );
    
    if (pet.rows.length === 0) {
      return res.status(404).json({ error: '宠物不存在' });
    }
    
    res.json({ success: true, pet: pet.rows[0] });
  } catch (error) {
    res.status(500).json({ error: '服务器错误' });
  }
};

// 删除宠物
const deletePet = async (req, res) => {
  try {
    const result = await pool.query(
      'DELETE FROM pets WHERE id = $1 AND user_id = $2 RETURNING id',
      [req.params.id, req.userId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: '宠物不存在' });
    }
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: '服务器错误' });
  }
};

// 疫苗记录
const addVaccineRecord = async (req, res) => {
  const { vaccine_name, date, next_date, hospital } = req.body;
  
  try {
    const record = await pool.query(
      `INSERT INTO vaccine_records (pet_id, vaccine_name, date, next_date, hospital, created_at)
       VALUES ($1, $2, $3, $4, $5, NOW())
       RETURNING *`,
      [req.params.id, vaccine_name, date, next_date, hospital]
    );
    
    res.json({ success: true, record: record.rows[0] });
  } catch (error) {
    res.status(500).json({ error: '服务器错误' });
  }
};

const getVaccineRecords = async (req, res) => {
  try {
    const records = await pool.query(
      'SELECT * FROM vaccine_records WHERE pet_id = $1 ORDER BY date DESC',
      [req.params.id]
    );
    res.json({ success: true, records: records.rows });
  } catch (error) {
    res.status(500).json({ error: '服务器错误' });
  }
};

// 驱虫记录
const addDewormRecord = async (req, res) => {
  const { medicine_name, date, next_date } = req.body;
  
  try {
    const record = await pool.query(
      `INSERT INTO deworm_records (pet_id, medicine_name, date, next_date, created_at)
       VALUES ($1, $2, $3, $4, NOW())
       RETURNING *`,
      [req.params.id, medicine_name, date, next_date]
    );
    
    res.json({ success: true, record: record.rows[0] });
  } catch (error) {
    res.status(500).json({ error: '服务器错误' });
  }
};

const getDewormRecords = async (req, res) => {
  try {
    const records = await pool.query(
      'SELECT * FROM deworm_records WHERE pet_id = $1 ORDER BY date DESC',
      [req.params.id]
    );
    res.json({ success: true, records: records.rows });
  } catch (error) {
    res.status(500).json({ error: '服务器错误' });
  }
};

// 体检记录
const addExamRecord = async (req, res) => {
  const { exam_date, items, result, hospital } = req.body;
  
  try {
    const record = await pool.query(
      `INSERT INTO exam_records (pet_id, exam_date, items, result, hospital, created_at)
       VALUES ($1, $2, $3, $4, $5, NOW())
       RETURNING *`,
      [req.params.id, exam_date, items, result, hospital]
    );
    
    res.json({ success: true, record: record.rows[0] });
  } catch (error) {
    res.status(500).json({ error: '服务器错误' });
  }
};

const getExamRecords = async (req, res) => {
  try {
    const records = await pool.query(
      'SELECT * FROM exam_records WHERE pet_id = $1 ORDER BY exam_date DESC',
      [req.params.id]
    );
    res.json({ success: true, records: records.rows });
  } catch (error) {
    res.status(500).json({ error: '服务器错误' });
  }
};

// 就医记录
const addMedicalRecord = async (req, res) => {
  const { visit_date, diagnosis, prescription, hospital } = req.body;
  
  try {
    const record = await pool.query(
      `INSERT INTO medical_records (pet_id, visit_date, diagnosis, prescription, hospital, created_at)
       VALUES ($1, $2, $3, $4, $5, NOW())
       RETURNING *`,
      [req.params.id, visit_date, diagnosis, prescription, hospital]
    );
    
    res.json({ success: true, record: record.rows[0] });
  } catch (error) {
    res.status(500).json({ error: '服务器错误' });
  }
};

const getMedicalRecords = async (req, res) => {
  try {
    const records = await pool.query(
      'SELECT * FROM medical_records WHERE pet_id = $1 ORDER BY visit_date DESC',
      [req.params.id]
    );
    res.json({ success: true, records: records.rows });
  } catch (error) {
    res.status(500).json({ error: '服务器错误' });
  }
};

module.exports = {
  getPets, getPet, createPet, updatePet, deletePet,
  addVaccineRecord, getVaccineRecords,
  addDewormRecord, getDewormRecords,
  addExamRecord, getExamRecords,
  addMedicalRecord, getMedicalRecords
};
-- 宠物健康管理+社区 数据库Schema

-- 用户表
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    phone VARCHAR(20),
    wx_openid VARCHAR(100),
    nickname VARCHAR(100),
    avatar VARCHAR(500),
    region VARCHAR(100),
    pet_experience INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 宠物表
CREATE TABLE IF NOT EXISTS pets (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    name VARCHAR(100) NOT NULL,
    breed VARCHAR(100),
    gender VARCHAR(10),
    birth_date DATE,
    weight DECIMAL(5,2),
    chip_no VARCHAR(100),
    avatar VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 宠物照片
CREATE TABLE IF NOT EXISTS pet_photos (
    id SERIAL PRIMARY KEY,
    pet_id INT REFERENCES pets(id),
    url VARCHAR(500),
    is_avatar BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 疫苗记录
CREATE TABLE IF NOT EXISTS vaccine_records (
    id SERIAL PRIMARY KEY,
    pet_id INT REFERENCES pets(id),
    vaccine_name VARCHAR(200),
    date DATE,
    next_date DATE,
    hospital VARCHAR(200),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 驱虫记录
CREATE TABLE IF NOT EXISTS deworm_records (
    id SERIAL PRIMARY KEY,
    pet_id INT REFERENCES pets(id),
    medicine_name VARCHAR(200),
    date DATE,
    next_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 体检记录
CREATE TABLE IF NOT EXISTS exam_records (
    id SERIAL PRIMARY KEY,
    pet_id INT REFERENCES pets(id),
    exam_date DATE,
    items TEXT,
    result TEXT,
    hospital VARCHAR(200),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 就医记录
CREATE TABLE IF NOT EXISTS medical_records (
    id SERIAL PRIMARY KEY,
    pet_id INT REFERENCES pets(id),
    visit_date DATE,
    diagnosis TEXT,
    prescription TEXT,
    hospital VARCHAR(200),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 医院表
CREATE TABLE IF NOT EXISTS hospitals (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    address VARCHAR(500),
    phone VARCHAR(20),
    latitude DECIMAL(10,7),
    longitude DECIMAL(10,7),
    business_hours VARCHAR(200),
    images JSONB,
    rating DECIMAL(2,1) DEFAULT 0,
    reviews_count INT DEFAULT 0,
    region VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 医院评价
CREATE TABLE IF NOT EXISTS reviews (
    id SERIAL PRIMARY KEY,
    hospital_id INT REFERENCES hospitals(id),
    user_id INT REFERENCES users(id),
    overall_rating DECIMAL(2,1),
    service_rating DECIMAL(2,1),
    env_rating DECIMAL(2,1),
    professional_rating DECIMAL(2,1),
    content TEXT,
    images JSONB,
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 收藏表
CREATE TABLE IF NOT EXISTS favorites (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    hospital_id INT REFERENCES hospitals(id),
    post_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, hospital_id)
);

-- 故事/帖子
CREATE TABLE IF NOT EXISTS posts (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    category VARCHAR(50),
    title VARCHAR(200),
    content TEXT,
    images JSONB,
    likes_count INT DEFAULT 0,
    comments_count INT DEFAULT 0,
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 点赞
CREATE TABLE IF NOT EXISTS likes (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    post_id INT REFERENCES posts(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, post_id)
);

-- 评论
CREATE TABLE IF NOT EXISTS comments (
    id SERIAL PRIMARY KEY,
    post_id INT REFERENCES posts(id),
    user_id INT REFERENCES users(id),
    content TEXT,
    parent_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 问答-问题
CREATE TABLE IF NOT EXISTS questions (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    category VARCHAR(50),
    title VARCHAR(200),
    content TEXT,
    images JSONB,
    answers_count INT DEFAULT 0,
    views_count INT DEFAULT 0,
    best_answer_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 问答-回答
CREATE TABLE IF NOT EXISTS answers (
    id SERIAL PRIMARY KEY,
    question_id INT REFERENCES questions(id),
    user_id INT REFERENCES users(id),
    content TEXT,
    likes_count INT DEFAULT 0,
    is_accepted BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 健康提醒
CREATE TABLE IF NOT EXISTS reminders (
    id SERIAL PRIMARY KEY,
    pet_id INT REFERENCES pets(id),
    user_id INT REFERENCES users(id),
    type VARCHAR(50),
    title VARCHAR(200),
    content TEXT,
    remind_date DATE,
    is_handled BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 提醒设置
CREATE TABLE IF NOT EXISTS reminder_settings (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    vaccine_enabled BOOLEAN DEFAULT true,
    deworm_enabled BOOLEAN DEFAULT true,
    exam_enabled BOOLEAN DEFAULT true,
    advance_days INT DEFAULT 3,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id)
);

-- 消息通知
CREATE TABLE IF NOT EXISTS notifications (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    type VARCHAR(50),
    title VARCHAR(200),
    content TEXT,
    related_id INT,
    related_type VARCHAR(50),
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 问诊
CREATE TABLE IF NOT EXISTS consultations (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    pet_id INT REFERENCES pets(id),
    type VARCHAR(50),
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 问诊消息
CREATE TABLE IF NOT EXISTS consultation_messages (
    id SERIAL PRIMARY KEY,
    consultation_id INT REFERENCES consultations(id),
    role VARCHAR(20),
    content TEXT,
    images JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 内容审核
CREATE TABLE IF NOT EXISTS content_audit (
    id SERIAL PRIMARY KEY,
    content_type VARCHAR(50),
    content_id INT,
    status VARCHAR(20),
    reject_reason TEXT,
    auditor_id INT,
    audited_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 索引
CREATE INDEX idx_pets_user_id ON pets(user_id);
CREATE INDEX idx_hospitals_region ON hospitals(region);
CREATE INDEX idx_hospitals_rating ON hospitals(rating DESC);
CREATE INDEX idx_posts_user_id ON posts(user_id);
CREATE INDEX idx_posts_category ON posts(category);
CREATE INDEX idx_posts_status ON posts(status);
CREATE INDEX idx_questions_category ON questions(category);
CREATE INDEX idx_reminders_user_id ON reminders(user_id);
CREATE INDEX idx_reminders_date ON reminders(remind_date);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
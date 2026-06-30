-- ============================================================
-- 流浪猫数据导入脚本
-- 使用方法：将导出的 data.json 数据替换下方的 JSON 数组
-- ============================================================

-- 1. 创建表结构
CREATE TABLE IF NOT EXISTS cat_info (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    breed VARCHAR(50) DEFAULT '其他',
    age VARCHAR(50) DEFAULT '未知',
    gender VARCHAR(10) DEFAULT '未知',
    neutered TINYINT(1) DEFAULT 0,
    vaccinated TINYINT(1) DEFAULT 0,
    health VARCHAR(200) DEFAULT '良好',
    location VARCHAR(200) NOT NULL,
    contact VARCHAR(100) DEFAULT '',
    personality VARCHAR(200) DEFAULT '待补充',
    adopt_info TEXT,
    images TEXT,
    review_status VARCHAR(20) DEFAULT 'pending',
    publish_time VARCHAR(50) DEFAULT '',
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. 清空旧数据（谨慎使用，仅首次导入时执行）
-- TRUNCATE TABLE cat_info;

-- 3. 批量导入数据（使用 Node.js 或 PHP 执行更方便）
-- 以下为示例数据，请用 export_cats.js 脚本自动生成

/*
-- 示例：单个插入
INSERT INTO cat_info (id, name, breed, age, gender, neutered, vaccinated, health, location, contact, personality, adopt_info, images, review_status, publish_time)
VALUES ('p1234567890', '橘猫小胖', '橘猫', '1岁', '公', 1, 1, '非常健康', '东区花园', '138****1234', '粘人活泼', '["需提供稳定住所证明"]', '["data:image/svg+xml;base64,..."]', 'approved', '2026-06-01 10:00')
ON DUPLICATE KEY UPDATE name=VALUES(name), breed=VALUES(breed), age=VALUES(age), gender=VALUES(gender), neutered=VALUES(neutered), vaccinated=VALUES(vaccinated), health=VALUES(health), location=VALUES(location), contact=VALUES(contact), personality=VALUES(personality), adopt_info=VALUES(adopt_info), images=VALUES(images), review_status=VALUES(review_status), publish_time=VALUES(publish_time);
*/

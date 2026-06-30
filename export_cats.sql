-- ============================================================
-- 流浪猫数据导出脚本
-- 使用方法：在浏览器控制台执行以下代码导出本地数据
-- ============================================================

/*
【步骤1】在浏览器 pets.html 页面打开后，按 F12 打开控制台，执行以下代码导出数据：

var pets = JSON.parse(localStorage.getItem('campus_pets') || '[]');
var exportData = JSON.stringify(pets, null, 2);
console.log(exportData);
copy(exportData); // 复制到剪贴板

【步骤2】把复制的 JSON 数据保存为 data.json，然后执行下方 SQL 导入云端数据库

【步骤3】在云端数据库执行 init_cats_table.sql 创建表结构
【步骤4】执行 import_cats.sql 导入数据
*/

-- 1. 创建表结构（如果不存在）
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

-- 2. 导入数据（请先替换下方 VALUES 中的数据）
-- 使用步骤1导出的JSON数据，替换每行数据
INSERT INTO cat_info (id, name, breed, age, gender, neutered, vaccinated, health, location, contact, personality, adopt_info, images, review_status, publish_time) VALUES
('p1234567890', '橘猫小胖', '橘猫', '1岁', '公', 1, 1, '非常健康', '东区花园', '138****1234', '粘人活泼', '["需提供稳定住所证明","承诺科学喂养"]', '["data:image/svg+xml;base64,..."]', 'approved', '2026-06-01 10:00');

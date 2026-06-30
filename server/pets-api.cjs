/* ============================================================
 * 流浪猫模块 - 云端MySQL后端服务
 * 使用方法：
 *   1. npm install mysql2 express cors
 *   2. 修改 mysql-config.json 中的云数据库连接信息
 *   3. node server/pets-api.cjs
 * ============================================================ */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

// 尝试加载 MySQL 配置（如果已安装 mysql2 模块）
let mysql = null;
let pool = null;
let dbConnected = false;

try {
    mysql = require('mysql2/promise');
    const config = JSON.parse(fs.readFileSync(path.join(__dirname, 'mysql-config.json'), 'utf8'));
    pool = mysql.createPool({
        host: config.host,
        port: config.port || 3306,
        user: config.user,
        password: config.password,
        database: config.database,
        charset: config.charset || 'utf8mb4',
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    });
    dbConnected = true;
    console.log('[MySQL] 数据库连接池创建成功');
} catch (e) {
    console.log('[MySQL] 未安装 mysql2 或配置文件不存在，降级为内存模式');
    console.log('[MySQL] 请执行: npm install mysql2');
}

// 内存数据存储（降级模式）
let memoryPets = [];

/* ---------- 初始化表结构 ---------- */
async function initTable() {
    if (!dbConnected) return;
    try {
        const createTableSQL = `
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
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
        `;
        await pool.execute(createTableSQL);
        console.log('[MySQL] 表 cat_info 就绪');
    } catch (e) {
        console.error('[MySQL] 创建表失败:', e.message);
    }
}

/* ---------- CORS 头 ---------- */
function setCORS(res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With, Cache-Control');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
}

/* ---------- JSON 响应 ---------- */
function json(res, status, data) {
    setCORS(res);
    res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify(data));
}

/* ---------- GET /api/pets 获取全部猫咪（公开数据，不筛选用户） ---------- */
async function getPets(req, res) {
    if (dbConnected) {
        try {
            const [rows] = await pool.execute('SELECT * FROM cat_info ORDER BY create_time DESC');
            // 处理 images 字段（JSON字符串转数组）
            const result = rows.map(row => {
                if (typeof row.images === 'string') {
                    try { row.images = JSON.parse(row.images); } catch(e) { row.images = []; }
                }
                if (typeof row.adopt_info === 'string') {
                    try { row.adopt_info = JSON.parse(row.adopt_info); } catch(e) { row.adopt_info = []; }
                }
                return row;
            });
            json(res, 200, { success: true, data: result });
        } catch (e) {
            console.error('[MySQL] 查询失败:', e.message);
            json(res, 500, { success: false, message: '数据库查询失败' });
        }
    } else {
        // 降级模式：返回内存数据
        json(res, 200, { success: true, data: memoryPets });
    }
}

/* ---------- GET /api/pets/:id 获取单只猫咪 ---------- */
async function getPetById(req, res, id) {
    if (dbConnected) {
        try {
            const [rows] = await pool.execute('SELECT * FROM cat_info WHERE id = ?', [id]);
            if (rows.length === 0) {
                json(res, 404, { success: false, message: '猫咪不存在' });
                return;
            }
            const row = rows[0];
            if (typeof row.images === 'string') {
                try { row.images = JSON.parse(row.images); } catch(e) { row.images = []; }
            }
            if (typeof row.adopt_info === 'string') {
                try { row.adopt_info = JSON.parse(row.adopt_info); } catch(e) { row.adopt_info = []; }
            }
            json(res, 200, { success: true, data: row });
        } catch (e) {
            json(res, 500, { success: false, message: '数据库查询失败' });
        }
    } else {
        const pet = memoryPets.find(p => p.id === id);
        if (pet) {
            json(res, 200, { success: true, data: pet });
        } else {
            json(res, 404, { success: false, message: '猫咪不存在' });
        }
    }
}

/* ---------- POST /api/pets 新增猫咪（不绑定用户） ---------- */
async function createPet(req, res) {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', async () => {
        try {
            const data = JSON.parse(body);
            const pet = {
                id: data.id || 'p' + Date.now(),
                name: data.name,
                breed: data.breed || '其他',
                age: data.age || '未知',
                gender: data.gender || '未知',
                neutered: data.neutered ? 1 : 0,
                vaccinated: data.vaccinated ? 1 : 0,
                health: data.health || '良好',
                location: data.location,
                contact: data.contact || '',
                personality: data.personality || '待补充',
                adopt_info: JSON.stringify(data.adopt_info || []),
                images: JSON.stringify(data.images || []),
                review_status: data.review_status || 'pending',
                publish_time: data.publish_time || new Date().toISOString().replace('T', ' ').substring(0, 16)
            };

            if (dbConnected) {
                const sql = `INSERT INTO cat_info (id, name, breed, age, gender, neutered, vaccinated, health, location, contact, personality, adopt_info, images, review_status, publish_time)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
                await pool.execute(sql, [pet.id, pet.name, pet.breed, pet.age, pet.gender, pet.neutered, pet.vaccinated, pet.health, pet.location, pet.contact, pet.personality, pet.adopt_info, pet.images, pet.review_status, pet.publish_time]);
                pet.images = data.images || [];
                pet.adopt_info = data.adopt_info || [];
                json(res, 201, { success: true, data: pet });
            } else {
                pet.images = data.images || [];
                pet.adopt_info = data.adopt_info || [];
                memoryPets.unshift(pet);
                json(res, 201, { success: true, data: pet });
            }
        } catch (e) {
            console.error('[API] 创建失败:', e.message);
            json(res, 400, { success: false, message: '数据格式错误' });
        }
    });
}

/* ---------- PUT /api/pets/:id 更新猫咪 ---------- */
async function updatePet(req, res, id) {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', async () => {
        try {
            const data = JSON.parse(body);
            const updates = [];
            const values = [];

            if (data.name) { updates.push('name = ?'); values.push(data.name); }
            if (data.breed) { updates.push('breed = ?'); values.push(data.breed); }
            if (data.age) { updates.push('age = ?'); values.push(data.age); }
            if (data.gender) { updates.push('gender = ?'); values.push(data.gender); }
            if (data.neutered !== undefined) { updates.push('neutered = ?'); values.push(data.neutered ? 1 : 0); }
            if (data.vaccinated !== undefined) { updates.push('vaccinated = ?'); values.push(data.vaccinated ? 1 : 0); }
            if (data.health) { updates.push('health = ?'); values.push(data.health); }
            if (data.location) { updates.push('location = ?'); values.push(data.location); }
            if (data.contact) { updates.push('contact = ?'); values.push(data.contact); }
            if (data.personality) { updates.push('personality = ?'); values.push(data.personality); }
            if (data.adopt_info) { updates.push('adopt_info = ?'); values.push(JSON.stringify(data.adopt_info)); }
            if (data.images) { updates.push('images = ?'); values.push(JSON.stringify(data.images)); }
            if (data.review_status) { updates.push('review_status = ?'); values.push(data.review_status); }

            values.push(id);

            if (dbConnected) {
                const sql = `UPDATE cat_info SET ${updates.join(', ')} WHERE id = ?`;
                await pool.execute(sql, values);
            } else {
                const idx = memoryPets.findIndex(p => p.id === id);
                if (idx !== -1) {
                    Object.assign(memoryPets[idx], data);
                }
            }
            json(res, 200, { success: true, message: '更新成功' });
        } catch (e) {
            json(res, 400, { success: false, message: '更新失败' });
        }
    });
}

/* ---------- DELETE /api/pets/:id 删除猫咪 ---------- */
async function deletePet(req, res, id) {
    if (dbConnected) {
        try {
            await pool.execute('DELETE FROM cat_info WHERE id = ?', [id]);
        } catch (e) {
            console.error('[MySQL] 删除失败:', e.message);
        }
    } else {
        memoryPets = memoryPets.filter(p => p.id !== id);
    }
    json(res, 200, { success: true, message: '删除成功' });
}

/* ---------- 路由处理 ---------- */
async function handleAPI(req, res) {
    const parsed = url.parse(req.url, true);
    const pathname = parsed.pathname;
    const method = req.method;

    // GET /api/pets - 获取全部
    if (method === 'GET' && pathname === '/api/pets') {
        await getPets(req, res);
        return;
    }

    // GET /api/pets/:id
    const singleMatch = pathname.match(/^\/api\/pets\/([^\/]+)$/);
    if (method === 'GET' && singleMatch) {
        await getPetById(req, res, singleMatch[1]);
        return;
    }

    // POST /api/pets - 新增
    if (method === 'POST' && pathname === '/api/pets') {
        await createPet(req, res);
        return;
    }

    // PUT /api/pets/:id
    if (method === 'PUT' && singleMatch) {
        await updatePet(req, res, singleMatch[1]);
        return;
    }

    // DELETE /api/pets/:id
    const deleteMatch = pathname.match(/^\/api\/pets\/([^\/]+)$/);
    if (method === 'DELETE' && deleteMatch) {
        await deletePet(req, res, deleteMatch[1]);
        return;
    }

    // 404
    json(res, 404, { success: false, message: '接口不存在' });
}

/* ---------- 静态文件服务器 ---------- */
function serveStatic(req, res) {
    setCORS(res);
    const parsed = url.parse(decodeURIComponent(req.url));
    let pathname = parsed.pathname;
    if (pathname === '/') pathname = '/pets.html';

    const filePath = path.join(__dirname, '..', pathname);

    if (filePath.indexOf(path.join(__dirname, '..')) !== 0) {
        res.writeHead(403);
        res.end('403 Forbidden');
        return;
    }

    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end('<h1>404 Not Found</h1>');
            return;
        }
        const ext = path.extname(filePath).toLowerCase();
        const mimeTypes = {
            '.html': 'text/html; charset=utf-8',
            '.js': 'application/javascript; charset=utf-8',
            '.css': 'text/css; charset=utf-8',
            '.json': 'application/json; charset=utf-8',
            '.png': 'image/png',
            '.jpg': 'image/jpeg',
            '.svg': 'image/svg+xml'
        };
        res.writeHead(200, {
            'Content-Type': mimeTypes[ext] || 'text/plain',
            'Cache-Control': 'no-cache, no-store, must-revalidate'
        });
        res.end(data);
    });
}

/* ---------- 主服务器 ---------- */
const PORT = 3000;

async function start() {
    if (dbConnected) {
        await initTable();
    }

    const server = http.createServer((req, res) => {
        const parsed = url.parse(req.url);
        if (parsed.pathname.startsWith('/api/')) {
            handleAPI(req, res);
        } else {
            serveStatic(req, res);
        }
    });

    server.listen(PORT, '0.0.0.0', () => {
        console.log('');
        console.log('========================================');
        console.log('  流浪猫模块 - 云端API服务');
        console.log('========================================');
        console.log('  端口: ' + PORT);
        console.log('  MySQL: ' + (dbConnected ? '已连接' : '未连接（内存模式）'));
        console.log('  API地址: http://localhost:' + PORT + '/api/pets');
        console.log('========================================');
    });
}

start();

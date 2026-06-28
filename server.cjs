/* ============================================================
 * 青园在线综合服务平台 - 静态资源服务器
 * 零依赖（仅使用 Node.js 内置模块），开箱即用
 *
 * 功能：
 *   1. 监听 0.0.0.0:8080，允许局域网/本机任意网卡访问
 *   2. 启动前自动检测端口占用，避免冲突
 *   3. 内置 CORS 头，关闭跨域拦截
 *   4. 详细启动日志，明确显示监听状态
 *   5. 支持常见 MIME 类型（html/css/js/png/jpg/svg/ico/json 等）
 *   6. 默认入口 index.html，目录未找到时返回友好提示
 *
 * 启动命令：
 *   node server.cjs
 * ============================================================ */

const http = require('http');
const fs = require('fs');
const path = require('path');
const net = require('net');
const os = require('os');
const url = require('url');

/* ---------- 配置 ---------- */
const PORT = 8080;
const HOST = '0.0.0.0';        // 关键：监听全部网卡，而非仅 127.0.0.1
const ROOT_DIR = __dirname;    // 项目根目录（server.cjs 所在目录）

/* ---------- MIME 类型表 ---------- */
const MIME = {
    '.html': 'text/html; charset=utf-8',
    '.htm':  'text/html; charset=utf-8',
    '.css':  'text/css; charset=utf-8',
    '.js':   'application/javascript; charset=utf-8',
    '.mjs':  'application/javascript; charset=utf-8',
    '.cjs':  'application/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png':  'image/png',
    '.jpg':  'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif':  'image/gif',
    '.svg':  'image/svg+xml',
    '.ico':  'image/x-icon',
    '.webp': 'image/webp',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf':  'font/ttf',
    '.eot':  'application/vnd.ms-fontobject',
    '.map':  'application/json; charset=utf-8',
    '.txt':  'text/plain; charset=utf-8',
    '.xml':  'application/xml; charset=utf-8',
    '.pdf':  'application/pdf',
    '.mp4':  'video/mp4',
    '.mp3':  'audio/mpeg',
    '.wasm': 'application/wasm'
};

/* ---------- 端口占用检测 ---------- */
function checkPortInUse(port, host) {
    return new Promise(function(resolve) {
        const tester = net.createServer();
        tester.once('error', function(err) {
            if (err.code === 'EADDRINUSE') {
                resolve(true);   // 端口已被占用
            } else {
                resolve(false);
            }
        });
        tester.once('listening', function() {
            tester.close(function() { resolve(false); }); // 端口可用
        });
        tester.listen(port, host);
    });
}

/* ---------- 获取本机局域网 IP（用于日志展示） ---------- */
function getLocalIPs() {
    const ifaces = os.networkInterfaces();
    const result = [];
    Object.keys(ifaces).forEach(function(name) {
        ifaces[name].forEach(function(iface) {
            if (iface.family === 'IPv4' && !iface.internal) {
                result.push(iface.address);
            }
        });
    });
    return result;
}

/* ---------- 统一 CORS 头（关闭跨域拦截） ---------- */
function applyCORS(res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, HEAD');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    res.setHeader('Access-Control-Max-Age', '86400');
}

/* ---------- 请求处理 ---------- */
function handleRequest(req, res) {
    applyCORS(res);

    /* OPTIONS 预检直接放行 */
    if (req.method === 'OPTIONS' || req.method === 'HEAD') {
        res.writeHead(204);
        res.end();
        return;
    }

    /* 仅允许 GET，避免静态服务器被滥用 */
    if (req.method !== 'GET') {
        res.writeHead(405, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('405 Method Not Allowed');
        return;
    }

    /* 解析 URL，去掉 query 和 hash，禁止路径穿越 */
    const parsed = url.parse(decodeURIComponent(req.url));
    let pathname = parsed.pathname || '/';

    /* 安全校验：禁止 .. 路径穿越 */
    if (pathname.indexOf('..') !== -1) {
        res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('403 Forbidden');
        return;
    }

    /* 默认入口 */
    if (pathname === '/') pathname = '/index.html';

    /* 解析文件路径 */
    const filePath = path.join(ROOT_DIR, pathname);

    /* 必须在项目根目录内 */
    if (filePath.indexOf(ROOT_DIR) !== 0) {
        res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('403 Forbidden');
        return;
    }

    fs.stat(filePath, function(err, stats) {
        if (err || !stats.isFile()) {
            /* 404 友好提示 */
            res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end(
                '<!DOCTYPE html><html><head><meta charset="utf-8">' +
                '<title>404</title></head><body style="font-family:sans-serif;text-align:center;padding:60px;">' +
                '<h1 style="color:#ea580c;">404 - 文件未找到</h1>' +
                '<p>请求路径：<code>' + pathname + '</code></p>' +
                '<p>请确认文件位于项目根目录：<code>' + ROOT_DIR + '</code></p>' +
                '<p><a href="/">返回首页</a></p>' +
                '</body></html>'
            );
            return;
        }

        /* 根据扩展名确定 MIME */
        const ext = path.extname(filePath).toLowerCase();
        const contentType = MIME[ext] || 'application/octet-stream';

        /* 读取并返回 */
        fs.readFile(filePath, function(err, data) {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
                res.end('500 Internal Server Error: ' + err.message);
                return;
            }
            res.writeHead(200, {
                'Content-Type': contentType,
                'Cache-Control': 'no-cache',
                'X-Content-Type-Options': 'nosniff'
            });
            res.end(data);
        });
    });
}

/* ---------- 启动流程 ---------- */
async function start() {
    console.log('');
    console.log('============================================================');
    console.log('  青园在线综合服务平台 - 静态服务器');
    console.log('============================================================');
    console.log('  [配置] 监听地址   : ' + HOST + ':' + PORT);
    console.log('  [配置] 项目根目录 : ' + ROOT_DIR);
    console.log('  [配置] 默认入口   : /index.html');
    console.log('  [配置] CORS       : 已开启（允许跨域）');
    console.log('------------------------------------------------------------');

    /* 步骤1：端口占用检测 */
    console.log('  [检测] 正在检测端口 ' + PORT + ' 占用情况...');
    const inUse = await checkPortInUse(PORT, HOST);
    if (inUse) {
        console.error('');
        console.error('  [错误] 端口 ' + PORT + ' 已被占用，服务启动失败！');
        console.error('  [建议] 请先释放该端口，或修改 server.cjs 顶部的 PORT 常量。');
        console.error('');
        console.error('  Windows 排查命令：');
        console.error('    netstat -ano | findstr :' + PORT);
        console.error('    taskkill /PID <占用进程ID> /F');
        console.error('');
        process.exit(1);
        return;
    }
    console.log('  [检测] 端口 ' + PORT + ' 可用，开始启动服务...');

    /* 步骤2：创建并启动 HTTP 服务器 */
    const server = http.createServer(handleRequest);

    server.on('error', function(err) {
        console.error('');
        console.error('  [错误] 服务启动失败：' + err.message);
        if (err.code === 'EACCES') {
            console.error('  [建议] 端口号 < 1024 需要管理员权限，请改用 8080 或其他高位端口。');
        } else if (err.code === 'EADDRINUSE') {
            console.error('  [建议] 端口被占用，请稍后重试或更换端口。');
        }
        process.exit(1);
    });

    server.listen(PORT, HOST, function() {
        const localIPs = getLocalIPs();
        console.log('');
        console.log('  ============================================================');
        console.log('  [成功] 服务已启动，正在监听 0.0.0.0:' + PORT);
        console.log('  ============================================================');
        console.log('');
        console.log('  [访问地址] 本机浏览器：');
        console.log('     ->  http://localhost:' + PORT + '/');
        console.log('     ->  http://127.0.0.1:' + PORT + '/');
        if (localIPs.length > 0) {
            console.log('');
            console.log('  [访问地址] 局域网其他设备（同 WiFi 下）：');
            localIPs.forEach(function(ip) {
                console.log('     ->  http://' + ip + ':' + PORT + '/');
            });
        }
        console.log('');
        console.log('  [常用页面直达]');
        console.log('     ->  餐饮服务（学生端）： http://localhost:' + PORT + '/dining.html');
        console.log('     ->  食堂管理员登录：    http://localhost:' + PORT + '/dining-admin-login.html');
        console.log('     ->  食堂管理员工作台：  http://localhost:' + PORT + '/dining-admin.html');
        console.log('     ->  营业厅：            http://localhost:' + PORT + '/telecom.html');
        console.log('     ->  医务室：            http://localhost:' + PORT + '/clinic.html');
        console.log('     ->  生活服务：          http://localhost:' + PORT + '/life.html');
        console.log('');
        console.log('  [提示] 按 Ctrl + C 可停止服务');
        console.log('  ============================================================');
        console.log('');
    });
}

/* ---------- 启动 ---------- */
start();

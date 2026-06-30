/* ============================================================
 * 数据导出脚本 - 将本地 localStorage 猫咪数据导出为 SQL
 * 使用方法：node export_local_cats.cjs
 * ============================================================ */

const https = require('https');
const http = require('http');

// 读取 localStorage 数据（通过浏览器自动化）
// 由于 Node.js 无法直接访问浏览器 localStorage，请按以下步骤操作：

console.log('========================================');
console.log('  流浪猫数据导出脚本');
console.log('========================================');
console.log('');
console.log('【步骤1】在浏览器中打开 pets.html 页面');
console.log('【步骤2】按 F12 打开控制台（Console）');
console.log('【步骤3】执行以下代码复制数据：');
console.log('');
console.log('--- 复制以下代码到控制台执行 ---');
console.log(`
var pets = JSON.parse(localStorage.getItem('campus_pets') || '[]');
var sql = 'INSERT INTO cat_info (id, name, breed, age, gender, neutered, vaccinated, health, location, contact, personality, adopt_info, images, review_status, publish_time) VALUES\\n';
pets.forEach(function(p) {
    var adoptInfo = JSON.stringify(p.adoptInfo || p.adopt_info || []).replace(/'/g, "''");
    var images = JSON.stringify(p.images || []).replace(/'/g, "''");
    sql += "('" + p.id + "', '" + (p.name||'').replace(/'/g, "''") + "', '" + (p.breed||'其他').replace(/'/g, "''") + "', '" + (p.age||'未知').replace(/'/g, "''") + "', '" + (p.gender||'未知').replace(/'/g, "''") + "', " + (p.neutered?1:0) + ", " + (p.vaccinated?1:0) + ", '" + (p.health||'良好').replace(/'/g, "''") + "', '" + (p.location||'').replace(/'/g, "''") + "', '" + (p.contact||'').replace(/'/g, "''") + "', '" + (p.personality||'待补充').replace(/'/g, "''") + "', '" + adoptInfo + "', '" + images + "', '" + (p.reviewStatus||p.review_status||'pending') + "', '" + (p.publishTime||p.publish_time||'') + "'),\\n";
});
sql = sql.replace(/,\\n$/, ';');
console.log(sql);
copy(sql);
console.log('SQL已复制到剪贴板！');
`);
console.log('');
console.log('【步骤4】将复制的 SQL 粘贴到云端数据库执行');
console.log('========================================');

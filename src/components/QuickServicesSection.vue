<template>
  <section class="quick-services-section">
    <div class="section-header">
      <h2><i class="fas fa-th-large"></i> 高频快捷服务</h2>
      <p>一键直达，高效便捷</p>
    </div>
    <div class="quick-services-grid">
      <a v-for="item in services" :key="item.name" :href="item.link" class="quick-card">
        <div class="quick-icon" :style="{ background: item.bg }">
          <i :class="item.icon"></i>
        </div>
        <h3>{{ item.name }}</h3>
        <p>{{ item.desc }}</p>
      </a>
    </div>
  </section>
</template>

<script setup>
const services = [
  { name: '教务查询', desc: '课程·成绩·选课', link: 'education.html', icon: 'fas fa-search', bg: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' },
  { name: '二手交易', desc: '闲置·求购·租用', link: 'secondhand.html', icon: 'fas fa-shopping-bag', bg: 'linear-gradient(135deg, #10b981, #059669)' },
  { name: '场馆预约', desc: '图书馆·活动室', link: 'booking.html', icon: 'fas fa-calendar-check', bg: 'linear-gradient(135deg, #8b5cf6, #7c3aed)' },
  { name: '后勤报修', desc: '宿舍·教室·设施', link: 'repair.html', icon: 'fas fa-wrench', bg: 'linear-gradient(135deg, #f59e0b, #d97706)' },
  { name: '兼职拼车', desc: '兼职·互助·出行', link: 'parttime.html', icon: 'fas fa-hands-helping', bg: 'linear-gradient(135deg, #ef4444, #dc2626)' },
  { name: '生活服务', desc: '食堂·快递·出行', link: 'life.html', icon: 'fas fa-concierge-bell', bg: 'linear-gradient(135deg, #06b6d4, #0891b2)' },
]
</script>

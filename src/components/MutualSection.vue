<template>
  <section class="mutual-section">
    <div class="section-header">
      <h2><i class="fas fa-handshake"></i> 校园互助板块</h2>
      <a href="parttime.html" class="view-more">查看更多 <i class="fas fa-arrow-right"></i></a>
    </div>
    <div class="mutual-grid">
      <div v-for="item in mutualItems" :key="item.title" class="mutual-card" @click="location.href=item.link">
        <div class="mutual-header">
          <div class="mutual-icon" :style="{ background: item.bg }">
            <i :class="item.icon"></i>
          </div>
          <h3>{{ item.title }}</h3>
        </div>
        <ul class="mutual-list">
          <li v-for="(entry, i) in item.entries" :key="i">
            <span v-if="entry.badge" class="mutual-badge" :class="entry.badgeClass">{{ entry.badge }}</span>
            <i v-if="entry.icon" :class="entry.icon" style="margin-right:4px"></i>
            {{ entry.text }}
            <span v-if="entry.pay" class="mutual-pay">{{ entry.pay }}</span>
          </li>
        </ul>
        <a :href="item.link" class="mutual-link">{{ item.linkText }} <i class="fas fa-chevron-right"></i></a>
      </div>
    </div>
  </section>
</template>

<script setup>
const mutualItems = [
  {
    title: '兼职信息', icon: 'fas fa-briefcase', bg: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
    link: 'parttime.html', linkText: '查看全部兼职',
    entries: [
      { badge: '热', badgeClass: 'badge-hot', text: '图书馆助理招募', pay: '¥80/天' },
      { badge: '新', badgeClass: 'badge-new', text: '食堂兼职服务员', pay: '¥100/天' },
      { text: '勤工助学岗位', pay: '¥60/天' },
      { text: '校园导游志愿者', pay: '志愿时长' },
    ]
  },
  {
    title: '失物招领', icon: 'fas fa-search', bg: 'linear-gradient(135deg, #f59e0b, #d97706)',
    link: 'parttime.html#lost', linkText: '发布寻物/招领',
    entries: [
      { badge: '寻', badgeClass: 'badge-lost', text: '丢失蓝色水杯 教学楼A区' },
      { badge: '领', badgeClass: 'badge-found', text: '拾到校园卡一张 学号2021...' },
      { badge: '寻', badgeClass: 'badge-lost', text: '遗失黑色双肩包 图书馆' },
      { badge: '领', badgeClass: 'badge-found', text: '拾到钥匙串 南门快递站' },
    ]
  },
  {
    title: '校内拼车', icon: 'fas fa-car', bg: 'linear-gradient(135deg, #10b981, #059669)',
    link: 'parttime.html#carpool', linkText: '发布拼车信息',
    entries: [
      { badge: '新', badgeClass: 'badge-new', text: '周五下午回家 火车站拼车' },
      { text: '周日返校 机场拼车 3人' },
      { text: '周末市区出行 费用AA' },
      { text: '每日上下学结伴 南门→教学楼' },
    ]
  },
  {
    title: '更多互助', icon: 'fas fa-paw', bg: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
    link: 'parttime.html#other', linkText: '查看更多互助',
    entries: [
      { icon: 'fas fa-paw', text: '流浪猫寄养登记' },
      { icon: 'fas fa-book', text: '教材租用信息' },
      { icon: 'fas fa-laptop-code', text: '技能接单服务' },
      { icon: 'fas fa-chalkboard-teacher', text: '学长学姐辅导' },
    ]
  },
]
</script>

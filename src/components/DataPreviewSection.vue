<template>
  <section class="data-preview-section">
    <div class="section-header">
      <h2><i class="fas fa-chart-line"></i> 校园数据概览</h2>
      <a href="bigdata.html" class="view-more">进入数据大屏 <i class="fas fa-arrow-right"></i></a>
    </div>
    <div class="data-preview-grid">
      <div v-for="item in dataCards" :key="item.label" class="data-card">
        <div class="data-card-icon"><i :class="item.icon"></i></div>
        <div class="data-card-info">
          <div class="data-card-value">{{ item.displayValue }}</div>
          <div class="data-card-label">{{ item.label }}</div>
        </div>
        <div class="data-card-trend up"><i class="fas fa-arrow-up"></i> {{ item.trend }}</div>
      </div>
    </div>
    <div class="data-chart-preview">
      <div v-for="chart in charts" :key="chart.title" class="mini-chart">
        <h4>{{ chart.title }}</h4>
        <div class="chart-bars">
          <div v-for="bar in chart.bars" :key="bar.name" class="chart-bar-item">
            <span>{{ bar.name }}</span>
            <div class="chart-bar"><div class="chart-bar-fill" :style="{ width: bar.width, background: bar.color }"></div></div>
            <span>{{ bar.value }}</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const dataCards = ref([
  { icon: 'fas fa-eye', target: 128560, displayValue: '0', label: '本月服务访问量', trend: '12.5%' },
  { icon: 'fas fa-check-circle', target: 96, displayValue: '0', label: '报修完成率(%)', trend: '3.2%' },
  { icon: 'fas fa-exchange-alt', target: 3456, displayValue: '0', label: '二手交易量', trend: '8.7%' },
  { icon: 'fas fa-users', target: 8920, displayValue: '0', label: '活动参与人数', trend: '15.3%' },
])

const charts = [
  {
    title: '二手商品分类占比',
    bars: [
      { name: '数码', width: '85%', color: '#3b82f6', value: '34%' },
      { name: '书籍', width: '70%', color: '#10b981', value: '28%' },
      { name: '生活', width: '50%', color: '#f59e0b', value: '20%' },
      { name: '运动', width: '30%', color: '#8b5cf6', value: '12%' },
      { name: '其他', width: '15%', color: '#ef4444', value: '6%' },
    ]
  },
  {
    title: '本周服务热度',
    bars: [
      { name: '教务', width: '90%', color: '#3b82f6', value: '2.1万' },
      { name: '二手', width: '75%', color: '#10b981', value: '1.8万' },
      { name: '报修', width: '55%', color: '#f59e0b', value: '1.2万' },
      { name: '预约', width: '45%', color: '#8b5cf6', value: '0.9万' },
      { name: '兼职', width: '35%', color: '#06b6d4', value: '0.7万' },
    ]
  }
]

function animateNumbers() {
  dataCards.value.forEach(card => {
    const duration = 2000
    const increment = card.target / (duration / 16)
    let current = 0
    function update() {
      current += increment
      if (current < card.target) {
        card.displayValue = Math.floor(current).toLocaleString()
        requestAnimationFrame(update)
      } else {
        card.displayValue = card.target.toLocaleString()
      }
    }
    update()
  })
}

onMounted(() => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateNumbers()
        observer.disconnect()
      }
    })
  }, { threshold: 0.3 })
  const section = document.querySelector('.data-preview-section')
  if (section) observer.observe(section)
})
</script>

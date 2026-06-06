<template>
  <section class="secondhand-section">
    <div class="section-header">
      <h2><i class="fas fa-store"></i> 校园二手市场精选</h2>
      <a href="secondhand.html" class="view-more">进入二手市场 <i class="fas fa-arrow-right"></i></a>
    </div>
    <div class="secondhand-categories">
      <button
        v-for="cat in categories"
        :key="cat.key"
        class="sh-cat-btn"
        :class="{ active: activeCat === cat.key }"
        @click="activeCat = cat.key"
      >{{ cat.label }}</button>
    </div>
    <div class="secondhand-grid">
      <div
        v-for="p in filteredProducts"
        :key="p.id"
        class="secondhand-card"
        @click="location.href='secondhand.html'"
      >
        <img :src="p.image" :alt="p.name" />
        <div class="secondhand-info">
          <span class="secondhand-category">{{ p.catLabel }}</span>
          <h3 class="secondhand-title">{{ p.name }}</h3>
          <div class="secondhand-price">¥{{ p.price }}</div>
          <div class="secondhand-meta">
            <span>{{ p.seller }}</span>
            <span><i class="fas fa-eye"></i> {{ p.views }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="section-cta">
      <a href="secondhand.html" class="btn primary-btn"><i class="fas fa-plus-circle"></i> 发布闲置</a>
      <a href="secondhand.html#rent" class="btn secondary-btn"><i class="fas fa-book"></i> 教材租用专区</a>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue'

const activeCat = ref('all')

const categories = [
  { key: 'all', label: '全部' },
  { key: 'books', label: '教材课本' },
  { key: 'digital', label: '数码电子' },
  { key: 'daily', label: '生活用品' },
  { key: 'sports', label: '运动器材' },
  { key: 'tools', label: '实训工具' },
]

const products = [
  { id: 1, name: 'MacBook Pro 14寸', category: 'digital', catLabel: '数码电子', price: 8999, image: 'https://picsum.photos/seed/mbp/400/300', seller: '小明', views: 123 },
  { id: 2, name: '考研英语真题全套', category: 'books', catLabel: '教材课本', price: 50, image: 'https://picsum.photos/seed/books1/400/300', seller: '学姐', views: 89 },
  { id: 3, name: 'AirPods Pro 2', category: 'digital', catLabel: '数码电子', price: 1299, image: 'https://picsum.photos/seed/airpods/400/300', seller: '小李', views: 234 },
  { id: 4, name: '羽毛球拍套装', category: 'sports', catLabel: '运动器材', price: 180, image: 'https://picsum.photos/seed/badminton/400/300', seller: '运动达人', views: 67 },
  { id: 5, name: '小米台灯', category: 'daily', catLabel: '生活用品', price: 60, image: 'https://picsum.photos/seed/lamp/400/300', seller: '毕业生', views: 156 },
  { id: 6, name: '高等数学教材', category: 'books', catLabel: '教材课本', price: 30, image: 'https://picsum.photos/seed/mathbook/400/300', seller: '学长', views: 45 },
  { id: 7, name: '电工实训工具箱', category: 'tools', catLabel: '实训工具', price: 120, image: 'https://picsum.photos/seed/toolbox/400/300', seller: '工科生', views: 78 },
  { id: 8, name: '瑜伽垫加厚款', category: 'sports', catLabel: '运动器材', price: 45, image: 'https://picsum.photos/seed/yogamat/400/300', seller: '瑜伽社', views: 92 },
]

const filteredProducts = computed(() => {
  return activeCat.value === 'all' ? products : products.filter(p => p.category === activeCat.value)
})
</script>

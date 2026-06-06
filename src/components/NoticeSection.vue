<template>
  <section class="notice-section">
    <div class="notice-container">
      <div class="notice-header">
        <i class="fas fa-bell"></i>
        <span>校园公告</span>
      </div>
      <div class="notice-scroll">
        <ul>
          <li v-for="(item, i) in notices" :key="i">{{ item }}</li>
        </ul>
      </div>
    </div>
  </section>
</template>

<script setup>
const notices = [
  '关于开展2024年秋季学期心理健康教育活动的通知',
  '图书馆新增电子资源数据库开通试用',
  '学生宿舍安全检查通知',
  '校园招聘会时间安排',
  '食堂菜单更新通知',
]
</script>

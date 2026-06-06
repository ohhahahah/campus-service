<template>
  <nav class="navbar" :class="{ scrolled: isScrolled }">
    <div class="nav-container">
      <div class="nav-logo">
        <i class="fas fa-university"></i>
        <span>智慧校园</span>
      </div>
      <div class="nav-menu" :class="{ active: menuOpen }">
        <a href="index.html" class="nav-link" :class="{ active: currentPage === 'index' }">首页</a>
        <a href="secondhand.html" class="nav-link" :class="{ active: currentPage === 'secondhand' }">二手市场</a>
        <a href="life.html" class="nav-link" :class="{ active: currentPage === 'life' }">生活服务</a>
        <a href="booking.html" class="nav-link" :class="{ active: currentPage === 'booking' }">场馆预约</a>
        <a href="parttime.html" class="nav-link" :class="{ active: currentPage === 'parttime' }">兼职互助</a>
        <a href="news.html" class="nav-link" :class="{ active: currentPage === 'news' }">新闻公告</a>
      </div>
      <div class="nav-right">
        <button class="theme-toggle" @click="toggleTheme">
          <i :class="isDark ? 'fas fa-sun' : 'fas fa-moon'"></i>
        </button>
        <!-- 已登录用户 -->
        <div v-if="user" class="nav-user" @click="dropdownOpen = !dropdownOpen">
          <div class="nav-user-avatar" :style="{ background: user.role === 'admin' ? '#8b5cf6' : '#3b82f6' }">
            <i :class="user.role === 'admin' ? 'fas fa-user-shield' : 'fas fa-user-graduate'"></i>
          </div>
          <span class="nav-user-name">{{ user.role === 'admin' ? '管理员' : user.name }}</span>
          <div class="nav-user-dropdown" :class="{ active: dropdownOpen }">
            <div class="nav-user-info">
              <i :class="user.role === 'admin' ? 'fas fa-user-shield' : 'fas fa-user-graduate'"></i>
              <div>
                <strong>{{ user.name }}</strong>
                <span>{{ user.role === 'admin' ? '系统管理员' : user.stuId + ' · ' + (user.dept || '') }}</span>
              </div>
            </div>
            <a v-if="user.role === 'admin'" href="admin.html" class="nav-dropdown-item">
              <i class="fas fa-cog"></i> 后台管理
            </a>
            <template v-else>
              <a href="profile.html" class="nav-dropdown-item">
                <i class="fas fa-user"></i> 个人中心
              </a>
              <a href="messages.html" class="nav-dropdown-item">
                <i class="fas fa-comment-dots"></i> 我的私信
              </a>
            </template>
            <a href="javascript:void(0)" class="nav-dropdown-item logout" @click.stop="logout">
              <i class="fas fa-sign-out-alt"></i> 退出登录
            </a>
          </div>
        </div>
        <!-- 未登录 -->
        <a v-else href="login.html" class="login-btn">登录</a>
      </div>
      <div class="menu-toggle" @click="menuOpen = !menuOpen">
        <i class="fas fa-bars"></i>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const isScrolled = ref(false)
const isDark = ref(false)
const menuOpen = ref(false)
const dropdownOpen = ref(false)
const user = ref(null)
const currentPage = ref('index')

function handleScroll() {
  isScrolled.value = window.scrollY > 50
}

function toggleTheme() {
  isDark.value = !isDark.value
  document.documentElement.setAttribute('data-theme', isDark.value ? 'dark' : 'light')
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
}

function logout() {
  localStorage.removeItem('campus_current_user')
  window.location.href = 'index.html'
}

function handleClickOutside(e) {
  if (!e.target.closest('.nav-user')) {
    dropdownOpen.value = false
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  document.addEventListener('click', handleClickOutside)

  // 主题
  const savedTheme = localStorage.getItem('theme') || 'light'
  isDark.value = savedTheme === 'dark'
  document.documentElement.setAttribute('data-theme', savedTheme)

  // 用户
  try {
    user.value = JSON.parse(localStorage.getItem('campus_current_user') || 'null')
  } catch (e) {
    user.value = null
  }

  // 当前页面
  const path = window.location.pathname
  if (path.includes('secondhand')) currentPage.value = 'secondhand'
  else if (path.includes('life')) currentPage.value = 'life'
  else if (path.includes('booking')) currentPage.value = 'booking'
  else if (path.includes('parttime')) currentPage.value = 'parttime'
  else if (path.includes('news')) currentPage.value = 'news'
  else currentPage.value = 'index'
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
/* 导航组件样式继承全局，此处仅补充 */
</style>

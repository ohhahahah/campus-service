<template>
  <section class="hero">
    <div class="hero-content">
      <div class="hero-text">
        <h1 class="hero-title">
          <span class="typewriter">{{ displayText }}</span>
          <span class="cursor">|</span>
        </h1>
        <p class="hero-subtitle">一站式校园服务平台，让校园生活更智慧</p>
        <div class="hero-buttons">
          <a href="secondhand.html" class="btn primary-btn">
            <i class="fas fa-shopping-bag"></i> 进入二手市场
          </a>
          <a href="booking.html" class="btn secondary-btn">
            <i class="fas fa-calendar-check"></i> 场馆预约
          </a>
        </div>
      </div>
      <div class="hero-visual">
        <div class="floating-card card-1" @click="$router?.push?.('/education') || (location.href='education.html')">
          <i class="fas fa-book-open"></i><span>课程查询</span>
        </div>
        <div class="floating-card card-2" @click="location.href='secondhand.html'">
          <i class="fas fa-shopping-cart"></i><span>二手交易</span>
        </div>
        <div class="floating-card card-3" @click="location.href='booking.html'">
          <i class="fas fa-calendar-check"></i><span>场馆预约</span>
        </div>
        <div class="floating-card card-4" @click="location.href='life.html'">
          <i class="fas fa-utensils"></i><span>生活服务</span>
        </div>
      </div>
    </div>
    <div class="hero-particles"></div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const texts = ['智慧校园', '便捷生活', '智能服务', '共创未来']
const displayText = ref('')
let textIndex = 0
let charIndex = 0
let timer = null

function type() {
  if (charIndex < texts[textIndex].length) {
    displayText.value += texts[textIndex].charAt(charIndex)
    charIndex++
    timer = setTimeout(type, 150)
  } else {
    timer = setTimeout(erase, 2000)
  }
}

function erase() {
  if (charIndex > 0) {
    displayText.value = texts[textIndex].substring(0, charIndex - 1)
    charIndex--
    timer = setTimeout(erase, 100)
  } else {
    textIndex = (textIndex + 1) % texts.length
    timer = setTimeout(type, 500)
  }
}

onMounted(() => { type() })
onUnmounted(() => { if (timer) clearTimeout(timer) })
</script>

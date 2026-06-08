<template>
  <div class="home-page">
    <NavBar />
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
          <div class="floating-card card-1" @click="location.href='life.html'">
            <i class="fas fa-utensils"></i><span>生活服务</span>
          </div>
          <div class="floating-card card-2" @click="location.href='secondhand.html'">
            <i class="fas fa-shopping-cart"></i><span>二手交易</span>
          </div>
          <div class="floating-card card-3" @click="location.href='booking.html'">
            <i class="fas fa-calendar-check"></i><span>场馆预约</span>
          </div>
          <div class="floating-card card-4" @click="location.href='parttime.html'">
            <i class="fas fa-hands-helping"></i><span>兼职互助</span>
          </div>
        </div>
      </div>
      <div class="hero-particles"></div>
    </section>
    <RobotAssistant />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import NavBar from '../components/NavBar.vue'
import RobotAssistant from '../components/RobotAssistant.vue'

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

<style scoped>
.home-page {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.hero {
  flex: 1;
  background: linear-gradient(135deg, #0f172a 0%, #1e3a5f 40%, #1e40af 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  min-height: 0;
}

.hero-content {
  max-width: 1200px;
  width: 100%;
  padding: 0 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 60px;
  z-index: 2;
}

.hero-text {
  flex: 1;
  color: #fff;
}

.hero-title {
  font-size: 52px;
  font-weight: 800;
  margin-bottom: 16px;
  line-height: 1.2;
}

.typewriter {
  background: linear-gradient(135deg, #60a5fa, #a78bfa);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.cursor {
  color: #60a5fa;
  font-weight: 300;
  animation: blink 1s infinite;
}

@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}

.hero-subtitle {
  font-size: 20px;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 36px;
  font-weight: 300;
}

.hero-buttons {
  display: flex;
  gap: 16px;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 14px 32px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
  cursor: pointer;
}

.primary-btn {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  color: #fff;
  box-shadow: 0 4px 20px rgba(59, 130, 246, 0.4);
}
.primary-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(59, 130, 246, 0.5);
}

.secondary-btn {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
}
.secondary-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

.hero-visual {
  flex: 1;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  max-width: 400px;
}

.floating-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 16px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #fff;
}
.floating-card:hover {
  transform: translateY(-4px);
  background: rgba(255, 255, 255, 0.18);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
}
.floating-card i {
  font-size: 28px;
  color: #60a5fa;
}
.floating-card span {
  font-size: 14px;
  font-weight: 500;
}

.card-1 { animation: float1 6s ease-in-out infinite; }
.card-2 { animation: float2 5s ease-in-out infinite 0.5s; }
.card-3 { animation: float1 7s ease-in-out infinite 1s; }
.card-4 { animation: float2 5.5s ease-in-out infinite 1.5s; }

@keyframes float1 {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
@keyframes float2 {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}

.hero-particles {
  position: absolute;
  inset: 0;
  z-index: 1;
  overflow: hidden;
}
.hero-particles::before,
.hero-particles::after {
  content: '';
  position: absolute;
  border-radius: 50%;
  opacity: 0.1;
}
.hero-particles::before {
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, #3b82f6, transparent);
  top: -200px;
  right: -100px;
  animation: particleFloat 15s ease-in-out infinite;
}
.hero-particles::after {
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, #8b5cf6, transparent);
  bottom: -150px;
  left: -50px;
  animation: particleFloat 12s ease-in-out infinite reverse;
}

@keyframes particleFloat {
  0%, 100% { transform: translate(0, 0); }
  33% { transform: translate(30px, -20px); }
  66% { transform: translate(-20px, 30px); }
}

@media (max-width: 768px) {
  .hero-content {
    flex-direction: column;
    text-align: center;
    padding: 0 20px;
    gap: 30px;
  }
  .hero-title {
    font-size: 36px;
  }
  .hero-subtitle {
    font-size: 16px;
  }
  .hero-buttons {
    justify-content: center;
  }
  .hero-visual {
    max-width: 280px;
  }
  .floating-card {
    padding: 16px;
  }
  .floating-card i {
    font-size: 22px;
  }
}
</style>

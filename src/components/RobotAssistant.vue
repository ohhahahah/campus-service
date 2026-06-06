<template>
  <div class="robot-wrapper">
    <!-- 可拖拽悬浮图标 -->
    <div
      class="robot-float"
      :style="{ left: pos.x + 'px', top: pos.y + 'px' }"
      @mousedown="onDragStart"
      @touchstart="onTouchStart"
      @click="onRobotClick"
    >
      <div class="robot-icon" :class="{ breathing: !chatOpen }">
        <i class="fas fa-robot"></i>
      </div>
      <span class="robot-label">AI助手</span>
    </div>

    <!-- AI聊天弹窗 -->
    <transition name="chat-fade">
      <div v-if="chatOpen" class="robot-chat-overlay" @click.self="chatOpen = false">
        <div class="robot-chat-window">
          <!-- 头部 -->
          <div class="robot-chat-header">
            <div class="robot-chat-header-info">
              <div class="robot-chat-avatar">
                <i class="fas fa-robot"></i>
              </div>
              <div>
                <h3>智慧校园AI助手</h3>
                <span class="robot-online">在线</span>
              </div>
            </div>
            <button class="robot-chat-close" @click="chatOpen = false">
              <i class="fas fa-times"></i>
            </button>
          </div>

          <!-- 消息区 -->
          <div class="robot-chat-messages" ref="messagesRef">
            <div
              v-for="(msg, idx) in messages"
              :key="idx"
              class="robot-msg"
              :class="msg.role"
            >
              <div class="robot-msg-avatar" v-if="msg.role === 'bot'">
                <i class="fas fa-robot"></i>
              </div>
              <div class="robot-msg-bubble">{{ msg.text }}</div>
            </div>
            <div v-if="typing" class="robot-msg bot">
              <div class="robot-msg-avatar"><i class="fas fa-robot"></i></div>
              <div class="robot-msg-bubble typing-dots">
                <span></span><span></span><span></span>
              </div>
            </div>
          </div>

          <!-- 快捷问题 -->
          <div class="robot-quick-questions" v-if="messages.length <= 1">
            <button
              v-for="(q, i) in quickQuestions"
              :key="i"
              class="robot-quick-btn"
              @click="sendQuickQuestion(q)"
            >{{ q }}</button>
          </div>

          <!-- 输入区 -->
          <div class="robot-chat-input">
            <input
              v-model="inputText"
              type="text"
              placeholder="输入您的问题..."
              @keyup.enter="sendMessage"
            />
            <button class="robot-send-btn" @click="sendMessage" :disabled="!inputText.trim()">
              <i class="fas fa-paper-plane"></i>
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, nextTick, onMounted, onUnmounted } from 'vue'

const chatOpen = ref(false)
const inputText = ref('')
const typing = ref(false)
const messagesRef = ref(null)

const pos = ref({ x: 0, y: 0 })
const dragState = ref({ dragging: false, moved: false, startX: 0, startY: 0, offsetX: 0, offsetY: 0 })

const messages = ref([
  { role: 'bot', text: '你好！我是智慧校园AI助手，有什么可以帮你的吗？' }
])

const quickQuestions = [
  '如何选课？',
  '二手市场怎么用？',
  '如何报修宿舍设施？',
  '场馆预约流程',
  '校园兼职信息'
]

// AI 自动回复映射
const replyMap = [
  { keywords: ['选课', '课程', '课表'], reply: '选课请登录教务系统，第一轮选课在学期初进行。如遇选课冲突，可联系教务处协调处理。' },
  { keywords: ['二手', '交易', '闲置'], reply: '校园二手市场支持商品发布、搜索、私信咨询和租用。点击导航栏"二手市场"即可进入，发布闲置商品需先登录。' },
  { keywords: ['报修', '维修', '宿舍', '设施'], reply: '后勤报修可通过"生活服务"模块提交，选择报修类型和位置，提交后可在个人中心查看进度。' },
  { keywords: ['预约', '场馆', '图书馆'], reply: '场馆预约支持图书馆自习室、体育馆、活动室等。进入"场馆预约"选择日期和时段即可预约。' },
  { keywords: ['兼职', '工作', '勤工'], reply: '兼职互助板块提供校内勤工助学、校外兼职信息。进入"兼职互助"查看最新岗位，需登录后报名。' },
  { keywords: ['你好', '嗨', '在吗', 'hello', 'hi'], reply: '你好！很高兴为你服务，请问有什么需要帮助的？' },
  { keywords: ['考试', '成绩', '期末'], reply: '考试安排和成绩查询请登录教务系统。期末考试时间通常在学期最后两周，具体安排以教务处通知为准。' },
  { keywords: ['食堂', '菜单', '吃饭'], reply: '食堂菜单可在"生活服务"中查看，支持一/二/三食堂切换和早中晚餐筛选。' },
]

function getAIReply(text) {
  const lower = text.toLowerCase()
  for (const item of replyMap) {
    if (item.keywords.some(k => lower.includes(k))) {
      return item.reply
    }
  }
  return '感谢您的提问！我已记录您的问题，如需进一步帮助，请联系校园服务中心（电话：010-12345678）或前往信息中心咨询。'
}

function sendMessage() {
  const text = inputText.value.trim()
  if (!text) return
  messages.value.push({ role: 'user', text })
  inputText.value = ''
  scrollToBottom()

  typing.value = true
  setTimeout(() => {
    typing.value = false
    messages.value.push({ role: 'bot', text: getAIReply(text) })
    scrollToBottom()
  }, 800 + Math.random() * 800)
}

function sendQuickQuestion(q) {
  inputText.value = q
  sendMessage()
}

function scrollToBottom() {
  nextTick(() => {
    if (messagesRef.value) {
      messagesRef.value.scrollTop = messagesRef.value.scrollHeight
    }
  })
}

function onRobotClick() {
  if (!dragState.value.moved) {
    chatOpen.value = !chatOpen.value
    if (chatOpen.value) {
      nextTick(scrollToBottom)
    }
  }
}

// 拖拽逻辑
function onDragStart(e) {
  e.preventDefault()
  dragState.value = {
    dragging: true,
    moved: false,
    startX: e.clientX,
    startY: e.clientY,
    offsetX: e.clientX - pos.value.x,
    offsetY: e.clientY - pos.value.y
  }
  document.addEventListener('mousemove', onDragMove)
  document.addEventListener('mouseup', onDragEnd)
}

function onDragMove(e) {
  if (!dragState.value.dragging) return
  const dx = Math.abs(e.clientX - dragState.value.startX)
  const dy = Math.abs(e.clientY - dragState.value.startY)
  if (dx > 3 || dy > 3) dragState.value.moved = true

  let newX = e.clientX - dragState.value.offsetX
  let newY = e.clientY - dragState.value.offsetY
  // 边界防溢出
  const w = window.innerWidth - 70
  const h = window.innerHeight - 70
  newX = Math.max(0, Math.min(newX, w))
  newY = Math.max(0, Math.min(newY, h))
  pos.value = { x: newX, y: newY }
}

function onDragEnd() {
  dragState.value.dragging = false
  document.removeEventListener('mousemove', onDragMove)
  document.removeEventListener('mouseup', onDragEnd)
}

// 触摸拖拽
function onTouchStart(e) {
  const touch = e.touches[0]
  dragState.value = {
    dragging: true,
    moved: false,
    startX: touch.clientX,
    startY: touch.clientY,
    offsetX: touch.clientX - pos.value.x,
    offsetY: touch.clientY - pos.value.y
  }
  document.addEventListener('touchmove', onTouchMove, { passive: false })
  document.addEventListener('touchend', onTouchEnd)
}

function onTouchMove(e) {
  if (!dragState.value.dragging) return
  e.preventDefault()
  const touch = e.touches[0]
  const dx = Math.abs(touch.clientX - dragState.value.startX)
  const dy = Math.abs(touch.clientY - dragState.value.startY)
  if (dx > 3 || dy > 3) dragState.value.moved = true

  let newX = touch.clientX - dragState.value.offsetX
  let newY = touch.clientY - dragState.value.offsetY
  const w = window.innerWidth - 70
  const h = window.innerHeight - 70
  newX = Math.max(0, Math.min(newX, w))
  newY = Math.max(0, Math.min(newY, h))
  pos.value = { x: newX, y: newY }
}

function onTouchEnd() {
  if (!dragState.value.moved) {
    chatOpen.value = !chatOpen.value
    if (chatOpen.value) nextTick(scrollToBottom)
  }
  dragState.value.dragging = false
  document.removeEventListener('touchmove', onTouchMove)
  document.removeEventListener('touchend', onTouchEnd)
}

onMounted(() => {
  // 默认位置：右下角
  pos.value = {
    x: window.innerWidth - 90,
    y: window.innerHeight - 120
  }
})

onUnmounted(() => {
  document.removeEventListener('mousemove', onDragMove)
  document.removeEventListener('mouseup', onDragEnd)
})
</script>

<style scoped>
.robot-float {
  position: fixed;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: grab;
  user-select: none;
  transition: none;
}
.robot-float:active {
  cursor: grabbing;
}

.robot-icon {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, #1e40af, #3b82f6);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 20px rgba(30, 64, 175, 0.4);
  transition: transform 0.3s, box-shadow 0.3s;
}
.robot-icon:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 28px rgba(30, 64, 175, 0.5);
}
.robot-icon i {
  font-size: 26px;
  color: #fff;
}

.robot-icon.breathing {
  animation: breathe 3s ease-in-out infinite;
}
@keyframes breathe {
  0%, 100% { box-shadow: 0 4px 20px rgba(30, 64, 175, 0.4); }
  50% { box-shadow: 0 4px 30px rgba(59, 130, 246, 0.7); }
}

.robot-label {
  font-size: 11px;
  color: #1e40af;
  font-weight: 600;
  margin-top: 4px;
  white-space: nowrap;
  background: #fff;
  padding: 1px 8px;
  border-radius: 10px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.1);
}

/* 聊天弹窗 */
.robot-chat-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.robot-chat-window {
  width: 100%;
  max-width: 420px;
  height: 560px;
  background: #fff;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.25);
}

.robot-chat-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background: linear-gradient(135deg, #1e40af, #3b82f6);
  color: #fff;
}
.robot-chat-header-info {
  display: flex;
  align-items: center;
  gap: 12px;
}
.robot-chat-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
}
.robot-chat-avatar i {
  font-size: 20px;
}
.robot-chat-header h3 {
  font-size: 16px;
  font-weight: 700;
}
.robot-online {
  font-size: 12px;
  color: #86efac;
}
.robot-chat-close {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: #fff;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}
.robot-chat-close:hover {
  background: rgba(255, 255, 255, 0.3);
}

/* 消息区 */
.robot-chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.robot-msg {
  display: flex;
  align-items: flex-start;
  gap: 8px;
}
.robot-msg.user {
  flex-direction: row-reverse;
}
.robot-msg-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, #1e40af, #3b82f6);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.robot-msg-avatar i {
  font-size: 14px;
  color: #fff;
}
.robot-msg-bubble {
  max-width: 75%;
  padding: 10px 14px;
  border-radius: 16px;
  font-size: 14px;
  line-height: 1.6;
  word-break: break-word;
}
.robot-msg.bot .robot-msg-bubble {
  background: #f1f5f9;
  color: #1e293b;
  border-bottom-left-radius: 4px;
}
.robot-msg.user .robot-msg-bubble {
  background: linear-gradient(135deg, #1e40af, #3b82f6);
  color: #fff;
  border-bottom-right-radius: 4px;
}

/* 打字动画 */
.typing-dots {
  display: flex;
  gap: 4px;
  padding: 12px 16px;
}
.typing-dots span {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #94a3b8;
  animation: dotBounce 1.4s ease-in-out infinite;
}
.typing-dots span:nth-child(2) { animation-delay: 0.2s; }
.typing-dots span:nth-child(3) { animation-delay: 0.4s; }
@keyframes dotBounce {
  0%, 60%, 100% { transform: translateY(0); }
  30% { transform: translateY(-6px); }
}

/* 快捷问题 */
.robot-quick-questions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 0 16px 12px;
}
.robot-quick-btn {
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  color: #1e40af;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
}
.robot-quick-btn:hover {
  background: #dbeafe;
  border-color: #3b82f6;
}

/* 输入区 */
.robot-chat-input {
  display: flex;
  gap: 8px;
  padding: 12px 16px;
  border-top: 1px solid #e2e8f0;
}
.robot-chat-input input {
  flex: 1;
  padding: 10px 16px;
  border: 1px solid #e2e8f0;
  border-radius: 25px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s;
}
.robot-chat-input input:focus {
  border-color: #3b82f6;
}
.robot-send-btn {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: linear-gradient(135deg, #1e40af, #3b82f6);
  border: none;
  color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}
.robot-send-btn:hover:not(:disabled) {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(30, 64, 175, 0.3);
}
.robot-send-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 过渡动画 */
.chat-fade-enter-active,
.chat-fade-leave-active {
  transition: opacity 0.3s ease;
}
.chat-fade-enter-from,
.chat-fade-leave-to {
  opacity: 0;
}

/* 响应式 */
@media (max-width: 480px) {
  .robot-chat-window {
    max-width: 100%;
    height: 100%;
    border-radius: 0;
  }
  .robot-chat-overlay {
    padding: 0;
  }
}
</style>

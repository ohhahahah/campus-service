<template>
  <section class="announcements-section">
    <div class="section-header">
      <h2><i class="fas fa-bell"></i> 校园最新公告</h2>
      <a href="news.html" class="view-more">查看全部 <i class="fas fa-arrow-right"></i></a>
    </div>
    <div class="announcements-wrapper">
      <div class="announcement-carousel">
        <div
          v-for="(item, idx) in announcements"
          :key="idx"
          class="announcement-slide"
          :class="{ active: isActive(idx) }"
          @click="openModal(item)"
        >
          <div class="announcement-icon"><i :class="item.icon"></i></div>
          <div class="announcement-body">
            <span class="announcement-tag" :class="item.tagClass">{{ item.tag }}</span>
            <h3>{{ item.title }}</h3>
            <p>{{ item.preview }}</p>
            <span class="announcement-time">{{ item.time }}</span>
          </div>
        </div>
      </div>
      <div class="announcement-controls">
        <button class="announcement-prev" @click="prevGroup"><i class="fas fa-chevron-left"></i></button>
        <div class="announcement-dots">
          <span
            v-for="i in totalGroups"
            :key="i"
            class="dot"
            :class="{ active: currentGroup === i - 1 }"
            @click="currentGroup = i - 1"
          ></span>
        </div>
        <button class="announcement-next" @click="nextGroup"><i class="fas fa-chevron-right"></i></button>
      </div>
    </div>

    <!-- 公告详情弹窗 -->
    <div class="modal" :class="{ active: modalOpen }" @click.self="modalOpen = false">
      <div class="modal-content">
        <div class="modal-header">
          <h3>{{ modalItem?.title }}</h3>
          <button class="close-btn" @click="modalOpen = false"><i class="fas fa-times"></i></button>
        </div>
        <div class="modal-body">{{ modalItem?.content }}</div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const currentGroup = ref(0)
const perGroup = 3
const modalOpen = ref(false)
const modalItem = ref(null)
let autoTimer = null

const announcements = [
  { icon: 'fas fa-graduation-cap', tag: '教务通知', tagClass: 'tag-edu', title: '关于2024年秋季学期选课的通知', preview: '各位同学：秋季学期选课工作即将开始，请登录教务系统进行选课...', content: '各位同学：2024年秋季学期选课工作即将开始，请登录教务系统进行选课。第一轮选课时间：9月1日-9月5日，第二轮选课时间：9月8日-9月12日。请合理安排选课计划，避免时间冲突。如有疑问请联系教务处。', time: '2024-09-01' },
  { icon: 'fas fa-file-alt', tag: '考试安排', tagClass: 'tag-exam', title: '期末考试安排通知', preview: '2024年秋季学期期末考试将于12月20日-1月10日进行...', content: '2024年秋季学期期末考试将于12月20日-1月10日进行，请同学们提前做好复习准备。考试座位安排已发布至教务系统，请及时查看。考试期间请携带学生证和身份证。', time: '2024-12-01' },
  { icon: 'fas fa-language', tag: '证书报考', tagClass: 'tag-cert', title: '英语四六级报名通知', preview: '2024年下半年全国大学英语四、六级考试报名工作即将开始...', content: '2024年下半年全国大学英语四、六级考试报名工作即将开始。报名时间：9月15日-9月25日，考试时间：12月14日。请同学们在规定时间内完成报名缴费。', time: '2024-09-10' },
  { icon: 'fas fa-music', tag: '校园活动', tagClass: 'tag-activity', title: '校园文化艺术节活动通知', preview: '第十八届校园文化艺术节将于10月15日-10月30日举办...', content: '第十八届校园文化艺术节将于10月15日-10月30日举办，包含歌唱比赛、舞蹈大赛、书法展览、话剧表演等多项活动。欢迎同学们踊跃报名参加！', time: '2024-10-01' },
  { icon: 'fas fa-utensils', tag: '生活通知', tagClass: 'tag-life', title: '食堂菜单更新通知', preview: '为丰富师生饮食选择，学校食堂本周起推出新菜品系列...', content: '为丰富师生饮食选择，学校食堂本周起推出新菜品系列：一食堂新增川菜窗口，二食堂新增轻食窗口，三食堂新增夜宵服务。欢迎品尝！', time: '2024-09-05' },
  { icon: 'fas fa-shield-alt', tag: '安全提示', tagClass: 'tag-safety', title: '校园安全温馨提示', preview: '近期电信诈骗案件频发，请同学们提高警惕...', content: '近期电信诈骗案件频发，请同学们提高警惕，不要轻信陌生来电和短信，不要随意点击不明链接，不要向陌生人转账汇款。如遇可疑情况请及时联系保卫处。', time: '2024-09-08' },
]

const totalGroups = computed(() => Math.ceil(announcements.length / perGroup))

function isActive(idx) {
  const start = currentGroup.value * perGroup
  return idx >= start && idx < start + perGroup
}

function prevGroup() {
  currentGroup.value = currentGroup.value === 0 ? totalGroups.value - 1 : currentGroup.value - 1
}

function nextGroup() {
  currentGroup.value = currentGroup.value === totalGroups.value - 1 ? 0 : currentGroup.value + 1
}

function openModal(item) {
  modalItem.value = item
  modalOpen.value = true
}

onMounted(() => {
  autoTimer = setInterval(nextGroup, 6000)
})
onUnmounted(() => {
  if (autoTimer) clearInterval(autoTimer)
})
</script>

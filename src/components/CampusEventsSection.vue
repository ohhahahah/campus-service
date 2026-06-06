<template>
  <section class="campus-events-section">
    <div class="section-header">
      <h2><i class="fas fa-calendar-alt"></i> 校园资讯 & 活动预告</h2>
      <a href="news.html" class="view-more">查看全部 <i class="fas fa-arrow-right"></i></a>
    </div>
    <div class="events-tabs">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        class="event-tab"
        :class="{ active: activeTab === tab.key }"
        @click="activeTab = tab.key"
      >{{ tab.label }}</button>
    </div>
    <div class="events-grid">
      <div
        v-for="event in filteredEvents"
        :key="event.title"
        class="event-card"
      >
        <div class="event-date">
          <span class="event-day">{{ event.day }}</span>
          <span class="event-month">{{ event.month }}</span>
        </div>
        <div class="event-content">
          <span class="event-tag" :class="event.tagClass">{{ event.tag }}</span>
          <h3>{{ event.title }}</h3>
          <p>{{ event.desc }}</p>
          <div class="event-meta">
            <span><i class="fas fa-map-marker-alt"></i> {{ event.location }}</span>
            <span><i class="fas fa-clock"></i> {{ event.time }}</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue'

const activeTab = ref('all')

const tabs = [
  { key: 'all', label: '全部' },
  { key: 'club', label: '社团活动' },
  { key: 'contest', label: '技能竞赛' },
  { key: 'lecture', label: '讲座通知' },
  { key: 'volunteer', label: '志愿服务' },
  { key: 'psychology', label: '心理科普' },
]

const events = [
  { tab: 'club', day: '15', month: '10月', tag: '社团活动', tagClass: 'tag-club', title: '吉他社秋季音乐会', desc: '吉他社年度演出，多支乐队倾情献唱，感受音乐的魅力', location: '大学生活动中心', time: '19:00-21:00' },
  { tab: 'contest', day: '20', month: '10月', tag: '技能竞赛', tagClass: 'tag-contest', title: 'ACM程序设计大赛校内选拔', desc: '选拔优秀选手参加省赛，展现编程实力', location: '计算机学院机房', time: '09:00-14:00' },
  { tab: 'lecture', day: '22', month: '10月', tag: '讲座通知', tagClass: 'tag-lecture', title: '人工智能前沿技术讲座', desc: '邀请业界专家分享AI最新发展趋势与应用', location: '学术报告厅', time: '14:00-16:00' },
  { tab: 'volunteer', day: '25', month: '10月', tag: '志愿服务', tagClass: 'tag-volunteer', title: '社区义教志愿活动', desc: '走进社区，为留守儿童提供课业辅导', location: '阳光社区', time: '09:00-11:30' },
  { tab: 'psychology', day: '28', month: '10月', tag: '心理科普', tagClass: 'tag-psychology', title: '压力管理与情绪调节工作坊', desc: '学习科学减压方法，提升心理健康水平', location: '心理咨询中心', time: '15:00-17:00' },
  { tab: 'club', day: '30', month: '10月', tag: '社团活动', tagClass: 'tag-club', title: '摄影社校园风光展', desc: '展示社员镜头下的校园四季美景', location: '艺术楼展厅', time: '全天' },
]

const filteredEvents = computed(() => {
  return activeTab.value === 'all' ? events : events.filter(e => e.tab === activeTab.value)
})
</script>

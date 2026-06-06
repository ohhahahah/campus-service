<template>
  <div class="smart-campus">
    <NavBar />
    <div class="page-content">
      <HeroSection />
      <AnnouncementSection />
      <QuickServicesSection />
      <SecondhandSection />
      <MutualSection />
      <DataPreviewSection />
      <CampusEventsSection />
      <NoticeSection />
      <FooterSection />
    </div>
    <RobotAssistant />
  </div>
</template>

<script setup>
import NavBar from './components/NavBar.vue'
import HeroSection from './components/HeroSection.vue'
import AnnouncementSection from './components/AnnouncementSection.vue'
import QuickServicesSection from './components/QuickServicesSection.vue'
import SecondhandSection from './components/SecondhandSection.vue'
import MutualSection from './components/MutualSection.vue'
import DataPreviewSection from './components/DataPreviewSection.vue'
import CampusEventsSection from './components/CampusEventsSection.vue'
import NoticeSection from './components/NoticeSection.vue'
import FooterSection from './components/FooterSection.vue'
import RobotAssistant from './components/RobotAssistant.vue'
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
  background: #f0f2f5;
  color: #333;
}
</style>

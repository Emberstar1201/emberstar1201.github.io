<script setup>

import SystemHeader from "@/components/SystemHeader.vue";
import SearchInput from "@/components/SearchInput.vue";
import SideBar from "@/components/SideBar.vue";
import {onMounted} from "vue";
import router from "@/router/index.js";

const switchSubsystem = (subsystem) => {
  router.push(`/system/${subsystem}`);
}

onMounted(() => {
  router.push("/system/monitor");
})
</script>

<template>
  <SystemHeader />
  <SearchInput />
  <div class="main-content">
    <SideBar :switchSubsystem="switchSubsystem" />
    <router-view class="content-area"/>
  </div>
</template>

<style scoped>
.main-content {
  display: flex;
  gap: 15px;
  width: auto;
  height: calc(100vh - 140px);
}

.content-area {
  flex: 1;
  background-color: rgba(10, 10, 24, 0.5);
  border: 1px solid rgba(0, 255, 255, 0.3);
  border-radius: 5px;
  padding: 12px; /* 减少内边距以适应小屏幕 */
  order: 2;
  position: relative;
  max-height: 80vh; /* 设置最大高度以防止过高 */
  overflow-y: auto; /* 允许内容滚动 */
}

@media (max-width: 767px) {
  .main-content {
    flex-direction: column;
    height: auto;
    gap: 10px; /* 减小间距 */
  }
  
  .content-area {
    order: 1; /* 在小屏幕上内容区域先显示 */
    max-height: 40vh; /* 在小屏幕上进一步调整最大高度 */
  }
}
</style>
<script setup>
import { ref } from 'vue';

// 响应式变量跟踪当前激活的导航项
const activeItem = ref('');

defineProps({
  switchSubsystem: {
    type: Function,
    required: true
  }
});
</script>

<template>
  <div class="sidebar">
    <div class="sidebar-title">系统导航</div>
    <!-- <div class="start-button" id="startButton">开始</div> -->
    <!-- <div class="effects-toggle" id="effectsToggle">星尘特效: 光轨版</div> -->
    &nbsp;
    <div class="nav-item" :class="{ active: activeItem === 'monitor' }" @click="activeItem = 'monitor'; switchSubsystem('monitor')">日常检测报告</div>
    <div class="nav-item" :class="{ active: activeItem === 'defender' }" @click="activeItem = 'defender'; switchSubsystem('defender')">防御系统</div>
    <div class="nav-item" :class="{ active: activeItem === 'soul-frequency' }" @click="activeItem = 'soul-frequency'; switchSubsystem('soul-frequency')">灵魂频率监测</div>
    <div class="nav-item" :class="{ active: activeItem === 'character' }" @click="activeItem = 'character'; switchSubsystem('character')">角色档案资料</div>
    <div class="nav-item" :class="{ active: activeItem === 'dimension' }" @click="activeItem = 'dimension'; switchSubsystem('dimension')">维度档案资料</div>
  </div>
</template>

<style scoped>
/* 修复开始按钮样式 - 居中显示 */
.start-button {
  padding: 8px 15px;
  background-color: transparent;
  border: 1px solid #00ffff;
  border-radius: 3px;
  color: #00ffff;
  font-family: 'Monospace', monospace;
  transition: all 0.3s ease;
  touch-action: manipulation;
  font-size: 0.9rem;
  display: block;
  margin: 0 auto;
  text-align: center;
}

.start-button:hover, .start-button:active {
  background-color: rgba(0, 255, 255, 0.1);
}

/* 特效切换按钮 */
.effects-toggle {
  padding: 8px 15px;
  background-color: transparent;
  border: 1px solid #00ffff;
  border-radius: 3px;
  color: #00ffff;
  font-family: 'Monospace', monospace;
  transition: all 0.3s ease;
  touch-action: manipulation;
  font-size: 0.9rem;
  margin-top: 10px;
  text-align: center;
  display: block;
}

.effects-toggle:hover, .effects-toggle:active {
  background-color: rgba(0, 255, 255, 0.1);
}

.sidebar {
  width: 15%;
  background-color: rgba(10, 10, 24, 0.5);
  border: 1px solid rgba(0, 255, 255, 0.3);
  border-radius: 5px;
  padding: 12px; /* 减少内边距以适应小屏幕 */
  order: 2;
  height: 80vh;
  overflow-y: auto;
}

@media (max-width: 768px) {
  .sidebar {
    width: 100%;
    order: 1;
    height: 30vh;
    overflow-y: auto;
  }
}

.sidebar-title {
  font-size: 1.1rem;
  margin-bottom: 15px;
  color: #00aaff;
  text-align: center;
  border-bottom: 1px solid rgba(0, 255, 255, 0.3);
  padding-bottom: 5px;
  position: sticky;
  top: 0;
  background-color: rgba(10, 10, 24, 0.8);
  z-index: 1;
}

.nav-item {
  padding: 12px;
  margin-bottom: 8px;
  border: 1px solid transparent;
  border-radius: 3px;
  transition: all 0.3s ease;
  touch-action: manipulation;
  font-size: 0.9rem;
}

.nav-item:hover, .nav-item.active {
  background-color: rgba(0, 255, 255, 0.1);
  border-color: rgba(0, 255, 255, 0.5);
}

</style>
<script setup>
import { ref } from 'vue';

// 响应式变量跟踪当前激活的导航项
const activeItem = ref('');

const props = defineProps({
  switchSubsystem: {
    type: Function,
    required: true
  }
});

const emit = defineEmits(['start-ai-chat']);

const openAIChat = () => {
  emit('start-ai-chat');
};

// ===================== 世界线观测 相关 =====================

// 母按钮展开/折叠状态
const worldlineExpanded = ref(false);

// 02世界线子按钮展开/折叠状态
const worldline02Expanded = ref(false);

// 进度条相关状态
const isLoadingWorldline02 = ref(false);  // 是否正在加载
const worldline02Progress = ref(0);        // 进度百分比
const worldline02Loaded = ref(false);      // 是否已加载完成（用于记忆状态）

// 点击母按钮：世界线观测
const toggleWorldline = () => {
  worldlineExpanded.value = !worldlineExpanded.value;
};

// 点击 02世界线 子按钮
const toggleWorldline02 = () => {
  worldline02Expanded.value = !worldline02Expanded.value;

  // 如果还没加载过，则先进行进度条模拟
  if (!worldline02Loaded.value && !isLoadingWorldline02.value) {
    startWorldline02Loading();
  }
};

// 进度条模拟逻辑
const startWorldline02Loading = () => {
  isLoadingWorldline02.value = true;
  worldline02Progress.value = 0;

  // 模拟进度条增长，总耗时约 2.5 秒
  const totalDuration = 2500;
  const intervalTime = 50; // 每 50ms 更新一次
  const increment = 100 / (totalDuration / intervalTime);

  const timer = setInterval(() => {
    worldline02Progress.value += increment;
    if (worldline02Progress.value >= 100) {
      worldline02Progress.value = 100;
      clearInterval(timer);
      // 稍作延迟后标记加载完成
      setTimeout(() => {
        isLoadingWorldline02.value = false;
        worldline02Loaded.value = true;
      }, 300);
    }
  }, intervalTime);
};

// 点击 02世界线 下的 角色档案资料
const goToWorldline02Character = () => {
  activeItem.value = 'worldline-02-character';
  props.switchSubsystem('worldline-02-character');
};
</script>

<template>
  <div class="sidebar">
    <div class="sidebar-title">系统导航</div>
    <div class="start-button" @click="openAIChat">✦ 开始</div>
    &nbsp;
    <div class="nav-item" :class="{ active: activeItem === 'monitor' }" @click="activeItem = 'monitor'; switchSubsystem('monitor')">日常检测报告</div>
    <div class="nav-item" :class="{ active: activeItem === 'defender' }" @click="activeItem = 'defender'; switchSubsystem('defender')">防御系统</div>
    <div class="nav-item" :class="{ active: activeItem === 'soul-frequency' }" @click="activeItem = 'soul-frequency'; switchSubsystem('soul-frequency')">灵魂频率监测</div>
    <div class="nav-item" :class="{ active: activeItem === 'character' }" @click="activeItem = 'character'; switchSubsystem('character')">角色档案资料</div>
    <div class="nav-item" :class="{ active: activeItem === 'dimension' }" @click="activeItem = 'dimension'; switchSubsystem('dimension')">维度档案资料</div>

    <!-- ========== 世界线观测 母按钮 ========== -->
    <div class="nav-item worldline-parent" @click="toggleWorldline">
      <span class="expand-icon">{{ worldlineExpanded ? '▼' : '▶' }}</span>
      世界线观测
    </div>

    <!-- 世界线观测 子菜单 -->
    <div v-if="worldlineExpanded" class="submenu">

      <!-- 02世界线 子按钮 -->
      <div class="nav-item sub-item worldline-02-parent" @click="toggleWorldline02">
        <span class="expand-icon">{{ worldline02Expanded ? '▼' : '▶' }}</span>
        ∧-02世界线
      </div>

      <!-- 02世界线 展开后的内容区域 -->
      <div v-if="worldline02Expanded" class="submenu sub-submenu">

        <!-- 进度条模拟 -->
        <div v-if="isLoadingWorldline02" class="progress-container">
          <div class="progress-label">正在解析世界线数据...</div>
          <div class="progress-bar-wrapper">
            <div class="progress-bar" :style="{ width: worldline02Progress + '%' }"></div>
          </div>
          <div class="progress-percent">{{ Math.floor(worldline02Progress) }}%</div>
        </div>

        <!-- 加载完成后显示的子按钮 -->
        <template v-if="worldline02Loaded && !isLoadingWorldline02">
          <div
            class="nav-item sub-item sub-sub-item"
            :class="{ active: activeItem === 'worldline-02-character' }"
            @click="goToWorldline02Character"
          >
            角色档案资料
          </div>
        </template>
      </div>
    </div>
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

/* ========== 嵌套导航 样式 ========== */

/* 展开箭头图标 */
.expand-icon {
  display: inline-block;
  width: 14px;
  font-size: 0.75rem;
  margin-right: 4px;
  color: #00aaff;
  transition: transform 0.3s ease;
}

/* 子菜单容器 */
.submenu {
  margin-left: 12px;
  padding-left: 10px;
  border-left: 1px dashed rgba(0, 255, 255, 0.25);
  animation: slideDown 0.25s ease-out;
}

/* 二级子菜单（缩进更深） */
.sub-submenu {
  margin-left: 10px;
  padding-left: 10px;
  border-left: 1px dashed rgba(0, 170, 255, 0.2);
}

/* 子项样式 */
.sub-item {
  font-size: 0.85rem;
  padding: 8px 10px;
  margin-bottom: 6px;
}

/* 三级子项（角色档案资料） */
.sub-sub-item {
  font-size: 0.82rem;
  padding: 8px 10px;
  margin-bottom: 6px;
  color: #66ddff;
}

.sub-sub-item:hover, .sub-sub-item.active {
  color: #00ffff;
}

/* 展开动画 */
@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ========== 进度条 样式 ========== */

.progress-container {
  margin: 8px 0 10px 0;
  padding: 10px;
  background-color: rgba(0, 255, 255, 0.05);
  border: 1px solid rgba(0, 255, 255, 0.2);
  border-radius: 4px;
}

.progress-label {
  font-size: 0.75rem;
  color: #00aaff;
  margin-bottom: 6px;
  letter-spacing: 0.5px;
}

.progress-bar-wrapper {
  width: 100%;
  height: 8px;
  background-color: rgba(0, 255, 255, 0.1);
  border-radius: 4px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #00aaff, #00ffff, #66ffff);
  border-radius: 4px;
  transition: width 0.05s linear;
  box-shadow: 0 0 8px rgba(0, 255, 255, 0.6);
}

.progress-percent {
  font-size: 0.7rem;
  color: #00ffff;
  margin-top: 4px;
  text-align: right;
  font-family: 'Monospace', monospace;
}
</style>

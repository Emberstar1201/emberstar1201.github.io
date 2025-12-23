<script setup>
// 接收父组件传递的stage更新方法
import router from "@/router/index.js";

const props = defineProps({
  updateStage: {
    type: Function,
    required: true
  }
});

// 模拟加载进度
import { ref, onMounted } from 'vue';
const progressPercentage = ref(0);
const loadingStatus = ref('初始化核心组件...');

// 模拟加载过程
onMounted(() => {
  const statusMessages = [
    '初始化核心组件...',
    '加载系统模块...',
    '配置用户环境...',
    '连接服务中心...',
    '系统启动完成!'
  ];

  const interval = setInterval(() => {
    // 增加进度
    progressPercentage.value += 1;

    // 更新状态消息
    if (progressPercentage.value <= 20) {
      loadingStatus.value = statusMessages[0];
    } else if (progressPercentage.value <= 40) {
      loadingStatus.value = statusMessages[1];
    } else if (progressPercentage.value <= 60) {
      loadingStatus.value = statusMessages[2];
    } else if (progressPercentage.value <= 80) {
      loadingStatus.value = statusMessages[3];
    } else if (progressPercentage.value === 100) {
      loadingStatus.value = statusMessages[4];
    }

    // 加载完成
    if (progressPercentage.value >= 100) {
      clearInterval(interval);
      // 可以选择在加载完成后执行某些操作
      // 例如：返回欢迎页面或跳转到主应用
      setTimeout(() => {
        router.push("/system");
      }, 2000);
    }
  }, 50); // 每50毫秒更新一次进度
});
</script>

<template>
  <!-- 加载阶段 -->
  <div class="loading-container">
    <div class="loading-text">正在启动 EMBERSTAR OS...</div>
    <div class="progress-bar">
      <div class="progress-fill" id="progressFill" :style="{ width: progressPercentage + '%' }"></div>
    </div>
    <div class="progress-percent" id="progressPercent">{{ progressPercentage }}%</div>
    <div class="loading-status" id="loadingStatus">{{ loadingStatus }}</div>
  </div>
</template>

<style scoped>
/* 加载界面 */
.loading-container {
  max-width: 400px;
  text-align: center;
  margin: 0 auto;
}

.loading-text {
  margin-bottom: 20px;
  font-size: clamp(1rem, 4vw, 1.2rem);
}

.progress-bar {
  width: 100%;
  height: 20px;
  background-color: rgba(0, 0, 0, 0.5);
  border: 1px solid #00ffff;
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 20px;
}

.progress-fill {
  height: 100%;
  width: 0;
  background: linear-gradient(90deg, #00aaff, #00ffff);
  transition: width 0.5s ease;
  box-shadow: 0 0 10px rgba(0, 255, 255, 0.7);
}

.progress-percent {
  font-size: 1rem;
  margin-bottom: 30px;
}

.loading-status {
  font-size: 0.9rem;
  color: #00aaff;
  margin-top: 10px;
  min-height: 20px;
}
</style>
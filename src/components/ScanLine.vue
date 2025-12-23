<template>
  <!-- 扫描线容器：铺满整个屏幕，作为扫描效果的载体 -->
  <div class="scan-line-container" :style="containerStyle">
    <!-- 背景遮罩：增强扫描线的对比度 -->
    <div class="scan-background"></div>
    <!-- 核心扫描线：带发光效果的渐变条 -->
    <div class="scan-line" :style="scanLineStyle"></div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

// 定义组件props，支持自定义配置
const props = defineProps({
  // 扫描线颜色（默认蓝色）
  color: {
    type: String,
    default: '#00ffff'
  },
  // 扫描速度（单位：秒/次，默认3秒从顶部扫到底部）
  speed: {
    type: Number,
    default: 3,
    validator: (value) => value > 0 // 确保速度为正数
  },
  // 扫描线厚度（单位：px，默认1px）
  thickness: {
    type: Number,
    default: 1,
    validator: (value) => value >= 1 // 确保厚度至少1px
  },
  // 发光强度（0-1之间，默认0.8）
  glowIntensity: {
    type: Number,
    default: 0.5,
    validator: (value) => value >= 0 && value <= 1
  },
  // 是否显示背景遮罩
  showBackground: {
    type: Boolean,
    default: true
  }
});

// 计算扫描线的样式（整合props配置）
const scanLineStyle = computed(() => ({
  background: `linear-gradient(to bottom,
    transparent,
    ${props.color}80,  /* 半透明的主色 */
    ${props.color},
    ${props.color}80,
    transparent)`,
  height: `${props.thickness}px`,
  // 发光效果：使用box-shadow实现
  boxShadow: `0 0 20px 5px ${props.color}${Math.floor(props.glowIntensity * 255).toString(16)}`,
  // 动画：linear表示匀速，infinite表示循环
  animation: `scanMove ${props.speed}s linear infinite`
}));

// 容器样式（控制背景遮罩显示/隐藏）
const containerStyle = computed(() => ({
  '--scan-background-opacity': props.showBackground ? '0.15' : '0'
}));

// 注入全局CSS动画（确保只注入一次）
const style = document.createElement('style');
style.textContent = `
  @keyframes scanMove {
    0% {
      top: -50px; /* 从屏幕上方外侧开始 */
    }
    100% {
      top: 100vh; /* 扫描到屏幕底部外侧结束 */
    }
  }
`;
document.head.appendChild(style);
</script>

<style scoped>
/* 扫描线容器：固定定位，铺满整个屏幕 */
.scan-line-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 999; /* 确保在页面内容上方，但不会遮挡重要UI元素 */
  pointer-events: none; /* 允许鼠标事件穿透，不影响页面交互 */
  overflow: hidden; /* 隐藏超出容器的内容 */
}

/* 背景遮罩：增强扫描线的视觉效果 */
.scan-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
      to bottom,
      transparent,
      rgba(0, 0, 0, var(--scan-background-opacity)),
      transparent
  );
}

/* 扫描线：绝对定位，水平铺满屏幕 */
.scan-line {
  position: absolute;
  left: 0;
  width: 100%;
  border-radius: 50%; /* 圆角让扫描线更圆润 */
}
</style>
<template>
  <!-- 二进制雨Canvas容器，铺满整个视口 -->
  <div class="binary-rain-container">
    <canvas ref="rainCanvas" class="rain-canvas"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue';

// 获取Canvas元素引用
const rainCanvas = ref(null);
// 动画帧ID，用于停止动画
let animationId = null;
// 存储所有数字流的信息
let streams = [];
// Canvas上下文
let ctx = null;

// 组件挂载后初始化
onMounted(async () => {
  await nextTick(); // 确保DOM已渲染
  initCanvas();
  initStreams();
  startAnimation();
});

// 组件卸载时停止动画，避免内存泄漏
onUnmounted(() => {
  cancelAnimationFrame(animationId);
});

/**
 * 初始化Canvas尺寸和上下文
 */
function initCanvas() {
  const canvas = rainCanvas.value;
  ctx = canvas.getContext('2d');

  // 设置Canvas尺寸为窗口大小
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  // 初始设置尺寸
  resizeCanvas();
  // 窗口大小变化时重新设置
  window.addEventListener('resize', resizeCanvas);
}

/**
 * 初始化数字流（每一列数字）
 */
function initStreams() {
  const canvas = rainCanvas.value;
  // 数字流数量（控制密度，可调整）
  const streamCount = Math.floor(canvas.width / 25); // 每25px一列
  streams = [];

  for (let i = 0; i < streamCount; i++) {
    // 随机生成每个数字流的初始属性
    streams.push({
      x: i * 25, // 列的X坐标（每列间隔25px）
      y: Math.random() * -canvas.height, // 初始Y坐标（随机从屏幕上方开始）
      speed: 1 + Math.random() * 2, // 下落速度（1-3px/帧，已降低）
      length: 8 + Math.floor(Math.random() * 12), // 数字流长度（8-20个字符）
      charIndex: 0, // 当前显示的字符索引
      density: 0.8 + Math.random() * 0.2, // 字符密度（0.8-1.0）
      // 添加字符存储和变化计时器
      characters: [], // 存储每个位置的字符
      lastChangeTime: 0, // 上次变化时间
      changeInterval: 500 + Math.random() * 1000, // 字符变化间隔（500-1500ms）
      frameCount: 0 // 帧计数，用于控制更新频率
    });
  }
}

/**
 * 生成随机二进制字符（0或1）
 */
function getRandomBinaryChar() {
  return Math.random() > 0.5 ? '1' : '0';
}

/**
 * 绘制单个数字流
 * @param {Object} stream - 数字流配置
 */
function drawStream(stream) {
  const canvas = rainCanvas.value;
  ctx.fillStyle = 'transparent';
  ctx.fillRect(stream.x - 12, 0, 24, canvas.height); // 绘制列背景，增强视觉效果
  
  // 增加帧计数
  stream.frameCount++;
  
  // 确保字符数组长度足够
  if (stream.characters.length < stream.length) {
    // 初始化字符数组
    for (let i = stream.characters.length; i < stream.length; i++) {
      stream.characters[i] = getRandomBinaryChar();
    }
  }
  
  // 根据时间间隔更新字符（降低变化频率）
  if (stream.frameCount % 30 === 0) { // 大约每0.5秒检查一次（假设60fps）
    const now = Date.now();
    if (now - stream.lastChangeTime > stream.changeInterval) {
      // 随机选择一些字符进行更新（不是所有字符同时变化）
      for (let i = 0; i < stream.length; i++) {
        if (Math.random() > 0.7) { // 30%的概率更新字符
          stream.characters[i] = getRandomBinaryChar();
        }
      }
      stream.lastChangeTime = now;
    }
  }

  // 绘制数字流中的每个字符
  for (let i = 0; i < stream.length; i++) {
    // 计算当前字符的Y坐标
    const y = stream.y + i * 20; // 字符间隔20px
    // 超出屏幕底部则跳过
    if (y > canvas.height) continue;

    // 字符颜色：增加亮度和不透明度，提高可读性
    const opacity = 0.1 + (i / stream.length) * 0.6; // 增加基础不透明度和渐变范围
    ctx.fillStyle = `rgba(0, 255, 255, ${opacity})`;
    // 设置字体（等宽字体，确保0和1对齐）
    ctx.font = '16px Consolas, Monaco, monospace';
    ctx.textAlign = 'center';
    // 绘制存储的字符，而不是每次都生成新的
    ctx.fillText(stream.characters[i], stream.x, y);
  }

  // 更新数字流下一帧位置
  stream.y += stream.speed;
  // 数字流完全超出屏幕底部时，重置到顶部
  if (stream.y > canvas.height + stream.length * 20) {
    stream.y = Math.random() * -canvas.height;
    stream.speed = 1 + Math.random() * 2; // 下落速度（1-3px/帧，已降低）
    stream.length = 8 + Math.floor(Math.random() * 12);
    // 重置字符数组和计数器
    stream.characters = [];
    stream.frameCount = 0;
    stream.lastChangeTime = 0;
  }
}

/**
 * 开始动画循环
 */
function startAnimation() {
  // 清空画布（增加不透明度，减少重影，使字符更清晰）
  ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
  ctx.fillRect(0, 0, rainCanvas.value.width, rainCanvas.value.height);

  // 绘制所有数字流
  streams.forEach(stream => drawStream(stream));

  // 继续下一帧动画
  animationId = requestAnimationFrame(startAnimation);
}
</script>

<style scoped>
.binary-rain-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: -3; /* 最底层背景效果 */
  pointer-events: none; /* 允许鼠标事件穿透，不影响页面交互 */
}

.rain-canvas {
  display: block;
  background-color: #000; /* 黑色背景，突出绿色数字 */
}
</style>
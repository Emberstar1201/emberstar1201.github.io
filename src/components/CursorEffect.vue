<template>
  <!-- Canvas特效容器，铺满屏幕 -->
  <div class="effect-container">
    <canvas ref="effectCanvas" class="effect-canvas"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue';

// Canvas元素引用
const effectCanvas = ref(null);
// Canvas上下文
let ctx = null;
// 存储所有特效粒子
let particles = [];
// 存储鼠标移动的历史位置（用于绘制尾迹）
let mouseTrail = [];
// 鼠标尾迹的最大长度
const TRAIL_LENGTH = 50;
// 动画帧ID
let animationId = null;
// 上次生成鼠标移动粒子的时间
let lastMouseMoveTime = 0;
// 鼠标移动粒子生成的时间间隔（毫秒）
const MOUSE_MOVE_INTERVAL = 200;
// 上次鼠标移动的时间
let lastMouseMoveTimestamp = 0;
// 鼠标静止的时间阈值（毫秒）
const MOUSE_STATIONARY_THRESHOLD = 100;
// 尾迹淡出的速度（每帧移除的点数）
const TRAIL_FADE_SPEED = 0.5;
// 累积的淡出计数（用于处理小数部分）
let fadeAccumulator = 0;

// 组件挂载后初始化
onMounted(async () => {
  await nextTick();
  initCanvas();
  addEventListeners();
  startAnimationLoop();
});

// 组件卸载时清理
onUnmounted(() => {
  removeEventListeners();
  cancelAnimationFrame(animationId);
});
// 设置Canvas铺满屏幕
function resizeCanvas() {
  const canvas = effectCanvas.value;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
/**
 * 初始化Canvas尺寸和上下文
 */
function initCanvas() {
  const canvas = effectCanvas.value;
  ctx = canvas.getContext('2d');

  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);
}

/**
 * 添加事件监听器（鼠标点击和移动事件，以及触摸事件）
 */
function addEventListeners() {
  window.addEventListener('click', handleMouseClick);
  window.addEventListener('mousemove', handleMouseMove);
  // 添加触摸事件监听
  window.addEventListener('touchstart', handleTouchStart, { passive: false });
  window.addEventListener('touchmove', handleTouchMove, { passive: false });
  window.addEventListener('touchend', handleTouchEnd);
}

/**
 * 移除事件监听
 */
function removeEventListeners() {
  window.removeEventListener('click', handleMouseClick);
  window.removeEventListener('mousemove', handleMouseMove);
  window.removeEventListener('resize', resizeCanvas);
  // 移除触摸事件监听
  window.removeEventListener('touchstart', handleTouchStart);
  window.removeEventListener('touchmove', handleTouchMove);
  window.removeEventListener('touchend', handleTouchEnd);
}

/**
 * 处理鼠标点击，创建星尘粒子
 */
function handleMouseClick(e) {
  // 获取点击坐标
  const x = e.clientX;
  const y = e.clientY;
  // 调用创建星尘函数，count=15（保持粒子数量，确保效果饱满）
  createStardust(x, y, 8, true);
}

/**
 * 通用的移动事件处理函数，处理鼠标和触摸移动
 */
function handleMove(x, y) {
  const now = Date.now();
  
  // 更新鼠标/触摸尾迹
  updateMouseTrail(x, y);

  // 更新最后移动时间戳
  lastMouseMoveTimestamp = now;
  
  // 移动时重置淡出累积计数器
  fadeAccumulator = 0;

  // 节流处理：只在指定时间间隔后才生成粒子
  if (now - lastMouseMoveTime > MOUSE_MOVE_INTERVAL) {
    // 生成1个小粒子，isClick设为false以使用较小的移动距离和尺寸
    createStardust(x, y, 1, false);

    // 更新最后生成时间
    lastMouseMoveTime = now;
  }
}

/**
 * 处理鼠标移动，更新尾迹并创建少量星尘粒子（带节流优化）
 */
function handleMouseMove(e) {
  // 获取鼠标坐标
  const x = e.clientX;
  const y = e.clientY;
  
  handleMove(x, y);
}

/**
 * 处理触摸移动事件
 */
function handleTouchMove(e) {
  // 阻止默认的触摸行为，避免页面滚动干扰
  // e.preventDefault();
  
  // 获取第一个触摸点的坐标
  if (e.touches.length > 0) {
    const touch = e.touches[0];
    const x = touch.clientX;
    const y = touch.clientY;
    
    handleMove(x, y);
  }
}

/**
 * 处理触摸开始事件
 */
function handleTouchStart(e) {
  // 获取第一个触摸点的坐标
  if (e.touches.length > 0) {
    const touch = e.touches[0];
    const x = touch.clientX;
    const y = touch.clientY;
    
    // 清空旧的尾迹，开始新的触摸轨迹
    mouseTrail = [];
    handleMove(x, y);
  }
}

/**
 * 处理触摸结束事件
 */
function handleTouchEnd(e) {
  // 触摸结束后，允许尾迹开始淡出
  lastMouseMoveTimestamp = Date.now();
}

/**
 * 更新鼠标尾迹
 */
function updateMouseTrail(x, y) {
  // 添加当前鼠标位置
  mouseTrail.push({ x, y, timestamp: Date.now() });

  // 保持尾迹长度
  if (mouseTrail.length > TRAIL_LENGTH) {
    mouseTrail.shift();
  }
}

/**
 * 创建星尘粒子（核心调整：缩小移动距离，减慢速度）
 * @param {number} x - 生成位置X坐标
 * @param {number} y - 生成位置Y坐标
 * @param {number} count - 粒子数量
 * @param {boolean} isClick - 是否是点击触发（控制扩散范围）
 */
function createStardust(x, y, count = 1, isClick = false) {
  // 颜色数组（扩展为多种颜色，保持星尘的科技感和梦幻感）
  const colors = [
    // 原有的三种颜色
    '#00ffff', // 青色
    '#ffffff', // 白色
    '#d8b3ff', // 紫色
    // 新增的颜色
    '#99ddff', // 浅蓝色
    '#ffccff', // 粉色
    '#ccffff', // 浅青色
    '#e6ccff', // 浅紫色
    '#ffddff', // 淡粉色
    '#aaffff', // 亮青色
    '#f0f0ff'  // 淡紫色
  ];

  for (let i = 0; i < count; i++) {
    // 随机选择颜色
    const color = colors[Math.floor(Math.random() * colors.length)];

    // 随机大小（保持原逻辑：点击时6-18px，非点击时4-12px）
    const size = isClick ? Math.random() * 12 + 6 : Math.random() * 8 + 4;

    // 进一步减小移动距离，降低粒子移动速度
    const tx = (Math.random() - 0.5) * (isClick ? 60 : 30); // 点击时±60px，非点击时±30px
    const ty = (Math.random() - 0.5) * (isClick ? 60 : 30);

    // 初始位置偏移（保持原逻辑：点击时±50px偏移，非点击时无偏移）
    const offsetX = isClick ? (Math.random() - 0.5) * 50 : 0;
    const offsetY = isClick ? (Math.random() - 0.5) * 50 : 0;

    // 对于点击触发的粒子，使用速度向量；非点击粒子保持目标位置
    if (isClick) {
      // 计算速度向量（基于原有的tx/ty，但作为持续的移动速度）
      const velocityX = tx / 5; // 速度缩放，控制移动速率
      const velocityY = ty / 5;

      particles.push({
        x: x + offsetX, // 初始X坐标
        y: y + offsetY, // 初始Y坐标
        startSize: size * 0.5, // 初始大小
        endSize: size * 1.5, // 结束大小
        currentSize: size * 0.5, // 当前大小
        color: color,
        velocityX: velocityX, // X方向速度
        velocityY: velocityY, // Y方向速度
        alpha: 0.8, // 初始透明度
        startTime: Date.now(), // 动画开始时间
        duration: 2500 // 动画时长
      });
    } else {
      // 非点击粒子保持原有目标位置逻辑
      particles.push({
        x: x + offsetX, // 初始X坐标
        y: y + offsetY, // 初始Y坐标
        startSize: size * 0.5, // 初始大小
        endSize: size * 1.5, // 结束大小
        currentSize: size * 0.5, // 当前大小
        color: color,
        targetX: x + offsetX + tx, // 目标X坐标
        targetY: y + offsetY + ty, // 目标Y坐标
        alpha: 0.8, // 初始透明度
        startTime: Date.now(), // 动画开始时间
        duration: 2500 // 动画时长
      });
    }
  }
}

/**
 * 更新并绘制所有粒子和鼠标尾迹
 */
function updateAndDrawParticles() {
  const now = Date.now();

  // 清空画布（完全透明，不影响页面背景）
  ctx.clearRect(0, 0, effectCanvas.value.width, effectCanvas.value.height);

  // 检查鼠标是否静止
  if (now - lastMouseMoveTimestamp > MOUSE_STATIONARY_THRESHOLD && mouseTrail.length > 0) {
    // 鼠标静止，尾迹慢慢消失
    fadeTrail();
  }

  // 绘制鼠标尾迹
  drawMouseTrail();

  // 遍历粒子，更新状态并绘制
  for (let i = particles.length - 1; i >= 0; i--) {
    const particle = particles[i];
    // 计算动画进度（0-1）
    const progress = Math.min((now - particle.startTime) / particle.duration, 1);

    // 位置更新：根据粒子类型使用不同的移动逻辑
    if (particle.velocityX !== undefined && particle.velocityY !== undefined) {
      // 使用速度向量持续移动，并应用速度衰减（点击触发的粒子）
      // 添加速度衰减因子，使粒子逐渐减速
      const decayFactor = 0.98; // 衰减系数，接近1减速较慢，接近0减速较快
      particle.x += particle.velocityX;
      particle.y += particle.velocityY;
      // 应用速度衰减
      particle.velocityX *= decayFactor;
      particle.velocityY *= decayFactor;
    } else {
      // 使用线性插值移动到目标位置（非点击粒子）
      particle.x = lerp(particle.x, particle.targetX, progress);
      particle.y = lerp(particle.y, particle.targetY, progress);
    }

    // 2. 大小更新：从初始大小（0.5倍）过渡到结束大小（1.5倍）
    particle.currentSize = lerp(particle.startSize, particle.endSize, progress);

    // 3. 透明度更新：从0.8渐变为0（ease-out效果，和CSS动画一致）
    particle.alpha = 0.8 * (1 - easeOut(progress));

    // 绘制粒子
    drawParticle(particle);

    // 动画结束后移除粒子
    if (progress >= 1) {
      particles.splice(i, 1);
    }
  }
}

/**
 * 使尾迹慢慢消失
 */
function fadeTrail() {
  // 如果尾迹长度大于0，就逐渐减少
  if (mouseTrail.length > 0) {
    // 累积淡出计数
    fadeAccumulator += TRAIL_FADE_SPEED;
    
    // 移除足够的点
    while (fadeAccumulator >= 1 && mouseTrail.length > 0) {
      mouseTrail.shift();
      fadeAccumulator--;
    }
  } else {
    // 尾迹已经消失，重置累积计数器
    fadeAccumulator = 0;
  }
}

/**
 * 绘制鼠标尾迹
 */
function drawMouseTrail() {
  if (mouseTrail.length < 3) return;

  ctx.save();

  // 创建渐变透明度的尾迹线条
  const gradient = ctx.createLinearGradient(
    mouseTrail[0].x, mouseTrail[0].y,
    mouseTrail[mouseTrail.length - 1].x, mouseTrail[mouseTrail.length - 1].y
  );
  gradient.addColorStop(0, 'rgba(0, 255, 255, 0)');
  gradient.addColorStop(1, 'rgba(0, 255, 255, 0.8)');

  // 设置线条样式
  ctx.strokeStyle = gradient;
  ctx.lineWidth = 2;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  // 使用贝塞尔曲线绘制平滑尾迹
  ctx.beginPath();
  ctx.moveTo(mouseTrail[0].x, mouseTrail[0].y);

  for (let i = 1; i < mouseTrail.length - 2; i++) {
    const xc = (mouseTrail[i].x + mouseTrail[i + 1].x) / 2;
    const yc = (mouseTrail[i].y + mouseTrail[i + 1].y) / 2;
    ctx.quadraticCurveTo(mouseTrail[i].x, mouseTrail[i].y, xc, yc);
  }

  // 绘制最后一段贝塞尔曲线
  ctx.quadraticCurveTo(
    mouseTrail[mouseTrail.length - 2].x, mouseTrail[mouseTrail.length - 2].y,
    mouseTrail[mouseTrail.length - 1].x, mouseTrail[mouseTrail.length - 1].y
  );

  ctx.stroke();

  ctx.restore();
}

/**
 * 绘制单个星尘粒子（还原原DOM版的样式）
 * @param {Object} particle - 粒子对象
 */
function drawParticle(particle) {
  ctx.save();

  // 设置粒子颜色和透明度
  ctx.fillStyle = particle.color;
  ctx.globalAlpha = particle.alpha;

  // 绘制圆形粒子（对应border-radius:50%）
  ctx.beginPath();
  ctx.arc(
    particle.x,
    particle.y,
    particle.currentSize / 2, // arc的radius是直径的一半
    0,
    Math.PI * 2
  );
  ctx.fill();

  // 添加模糊效果（对应原DOM版的filter: blur(1px)）
  ctx.filter = 'blur(1px)';
  ctx.fill();

  ctx.restore();
}

/**
 * 线性插值函数（用于平滑过渡）
 * @param {number} start - 起始值
 * @param {number} end - 结束值
 * @param {number} t - 进度（0-1）
 * @returns {number} 插值结果
 */
function lerp(start, end, t) {
  return start + t * (end - start);
}

/**
 * ease-out缓动函数（还原CSS动画的ease-out效果）
 * @param {number} t - 进度（0-1）
 * @returns {number} 缓动后进度
 */
function easeOut(t) {
  return 1 - Math.pow(1 - t, 3);
}

/**
 * 动画循环
 */
function startAnimationLoop() {
  updateAndDrawParticles();
  animationId = requestAnimationFrame(startAnimationLoop);
}
</script>

<style scoped>
/* 容器：固定定位铺满屏幕，不影响页面交互 */
.effect-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 100;
  pointer-events: none;
  /* 允许鼠标事件穿透 */
  overflow: hidden;
}

/* Canvas：全屏显示，无背景色 */
.effect-canvas {
  display: block;
}
</style>
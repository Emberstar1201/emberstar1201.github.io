<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const cursorRef = ref(null);

const mouseMoveHandler = (e) => {
  if (cursorRef.value) {
    // 光标位置居中
    cursorRef.value.style.left = e.clientX-10 + 'px';
    cursorRef.value.style.top = e.clientY-10 + 'px';
  }
};

const mouseDownHandler = () => {
  if (cursorRef.value) {
    cursorRef.value.style.transform = 'scale(0.8)';
  }
};

const mouseUpHandler = () => {
  if (cursorRef.value) {
    cursorRef.value.style.transform = 'scale(1)';
  }
};

// 在组件挂载后添加事件监听器
onMounted(() => {
  document.addEventListener('mousemove', mouseMoveHandler);
  document.addEventListener('mousedown', mouseDownHandler);
  document.addEventListener('mouseup', mouseUpHandler);
});

// 在组件卸载前移除事件监听器
onUnmounted(() => {
  document.removeEventListener('mousemove', mouseMoveHandler);
  document.removeEventListener('mousedown', mouseDownHandler);
  document.removeEventListener('mouseup', mouseUpHandler);
});
</script>

<template>
  <!-- 自定义光标 -->
  <div class="custom-cursor" ref="cursorRef" id="customCursor">
    <div class="cursor-dot"></div>
    <div class="cursor-ring"></div>
  </div>
</template>

<style scoped>
/* 自定义光标 */
.custom-cursor {
    position: fixed;
    width: 20px;
    height: 20px;
    pointer-events: none;
    z-index: 9999;
    transition: transform 0.1s ease;
    display: block;
}

.cursor-dot {
    width: 4px;
    height: 4px;
    background-color: #00ffff;
    border-radius: 50%;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}

.cursor-ring {
    width: 20px;
    height: 20px;
    border: 1px solid #00ffff;
    border-radius: 50%;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    animation: cursor-pulse 2s infinite;
}

@keyframes cursor-pulse {
    0% {
        transform: translate(-50%, -50%) scale(1);
        opacity: 1;
    }
    50% {
        transform: translate(-50%, -50%) scale(1.2);
        opacity: 0.7;
    }
    100% {
        transform: translate(-50%, -50%) scale(1);
        opacity: 1;
    }
}
</style>
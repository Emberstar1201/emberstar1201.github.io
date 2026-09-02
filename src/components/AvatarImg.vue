<script setup>
import { ref, onMounted, watch } from 'vue';

const props = defineProps({
  // 图片 URL
  src: {
    type: String,
    required: true
  },
  // 是否圆形（默认头像都是圆形）
  circle: {
    type: Boolean,
    default: true
  }
});

// 图片加载状态：loading → loaded / error
const status = ref('loading');
// 预加载的 Image 对象（Vue 的 img onload 有时不够灵敏，手动预加载更稳）
const preloader = ref(null);

// 预加载图片
const loadImage = () => {
  if (!props.src) {
    status.value = 'error';
    return;
  }
  status.value = 'loading';
  preloader.value = new Image();
  preloader.value.onload = () => {
    status.value = 'loaded';
  };
  preloader.value.onerror = () => {
    status.value = 'error';
  };
  preloader.value.src = props.src;
};

onMounted(() => {
  loadImage();
});

// src 变化时重新加载
watch(() => props.src, () => {
  loadImage();
});
</script>

<template>
  <div
    class="avatar-wrap"
    :class="{ circle }"
    :data-status="status"
  >
    <!-- 骨架屏占位：青色脉冲动画 -->
    <div v-if="status === 'loading'" class="avatar-skeleton">
      <div class="skeleton-shimmer"></div>
    </div>

    <!-- 图片本体：预加载完成后才渲染 -->
    <img
      v-if="status === 'loaded'"
      :src="src"
      :alt="''"
      class="avatar-img"
      loading="lazy"
      decoding="async"
    />

    <!-- 加载失败：显示占位字符 -->
    <div v-if="status === 'error'" class="avatar-fallback">?</div>
  </div>
</template>

<style scoped>
.avatar-wrap {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  /* 由外层传入尺寸，这里撑满父元素 */
  width: 100%;
  height: 100%;
  overflow: hidden;
  /* 边框/背景由外层容器控制，这里只负责图片 */
}

.avatar-wrap.circle {
  border-radius: 50%;
}

/* 骨架屏：青色+ shimmer 渐变扫光 */
.avatar-skeleton {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  background: linear-gradient(
    90deg,
    rgba(0, 255, 255, 0.05) 0%,
    rgba(0, 255, 255, 0.15) 50%,
    rgba(0, 255, 255, 0.05) 100%
  );
}

.skeleton-shimmer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.18) 50%,
    transparent 100%
  );
  animation: shimmer 1.4s ease-in-out infinite;
}

@keyframes shimmer {
  0%   { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

/* 图片：预加载完成后淡入，避免突然出现的生硬感 */
.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  animation: fadeIn 0.35s ease-out forwards;
}

@keyframes fadeIn {
  from { opacity: 0; transform: scale(1.02); }
  to   { opacity: 1; transform: scale(1); }
}

/* 加载失败占位 */
.avatar-fallback {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #00ffff;
  font-size: 1.8rem;
  background-color: rgba(255, 100, 100, 0.1);
}
</style>

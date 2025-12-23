<script setup>
import { useUserStore } from "@/stores/user.js";
import { getUserByUsername } from "@/services/userService.js";
// 引入独立的多语言打字机组件
import MultilingualTypewriter from "./MultilingualTypewriter.vue";

const userStore = useUserStore();

// 接收父组件传递的stage更新方法
const props = defineProps({
  updateStage: {
    type: Function,
    required: true
  }
});

// 切换到登录阶段的处理函数
const goToLoginStage = () => {
  props.updateStage(1); // 1 代表登录阶段
};

/**
 * 处理跳过登录逻辑
 */
const handleSkipLogin = () => {
  userStore.login(getUserByUsername("Emberstar"));
  props.updateStage(2); // 2 代表加载阶段
};
</script>

<template>
  <!-- 欢迎阶段 -->
  <div class="greeting-container" @click="goToLoginStage">
    <div class="greeting" id="osTitle">EMBERSTAR OS</div>
    <!-- 引入独立的多语言打字机组件 -->
    <MultilingualTypewriter @skipLogin="handleSkipLogin" />
    <div class="subtitle">正在初始化系统...</div>
  </div>
</template>

<style scoped>
/* 欢迎界面 */
.greeting-container {
  display: flex;
  flex-direction: column;
  height: 500px;
  justify-content: center;
}

.greeting {
  font-size: clamp(2rem, 8vw, 3rem);
  text-align: center;
  text-shadow: 0 0 10px #00ffff, 0 0 20px #00ffff;
  animation: flicker 2s ease-in-out infinite alternate;
  margin-bottom: 10px;
  word-break: break-word;
}

.subtitle {
  font-size: clamp(0.8rem, 3vw, 1rem);
  opacity: 0.7;
  animation: fadeIn 4s ease-in;
  text-align: center;
}

/* 原有动画 */
@keyframes flicker {
  0% { opacity: 0.8; }
  100% { opacity: 1; }
}

@keyframes fadeIn {
  0% { opacity: 0; }
  100% { opacity: 0.7; }
}
</style>
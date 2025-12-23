<script setup>
import GreetingComponent from "@/components/GreetingComponent.vue";
import {ref} from "vue";
import LoginFrom from "@/components/LoginFrom.vue";
import LoadingProgress from "@/components/LoadingProgress.vue";
import BinaryRain from "@/components/BinaryRain.vue";
const stage = ref(0); // 0: 欢迎阶段, 1: 登录阶段, 2: 加载阶段

// 提供给子组件的stage更新方法
const updateStage = (newStage) => {
  // 验证stage值的有效性
  if ([0, 1, 2].includes(newStage)) {
    stage.value = newStage;
  } else {
    console.error('Invalid stage value provided. Must be 0, 1, or 2.');
  }
};

</script>

<template>
  <BinaryRain />
  <!-- 使用Vue的Transition组件添加淡入淡出效果 -->
  <Transition name="fade" mode="out-in">
    <div v-if="stage===0" :key="'greeting'">
      <GreetingComponent :update-stage="updateStage" />
    </div>
    <div v-else-if="stage===1" :key="'login'">
      <LoginFrom :update-stage="updateStage" />
    </div>
    <div v-else-if="stage===2" :key="'loading'">
      <LoadingProgress :update-stage="updateStage" />
    </div>
  </Transition>
</template>

<style scoped>
/* 淡入淡出动画样式 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from {
  opacity: 0;
}

.fade-leave-to {
  opacity: 0;
}

/* 为了让动画效果更明显，可以为过渡元素添加一些额外样式 */
.fade-enter-active {
  transition-delay: 0.1s;
}

</style>
<script setup>
import {useUserStore} from '@/stores/user'
import {onMounted, ref} from "vue";

const userStore = useUserStore()

const currentTime = ref(new Date());
const isTimerShowing = ref(false);
const timerDuration = ref(120); // 120秒倒计时
const desaturateEasterEgg = () => {
  if (document.body.classList.contains('desaturate')) return;

  // 添加褪色类
  document.body.classList.add('desaturate');

  // 显示倒计时
  isTimerShowing.value = true;

  timerDuration.value = 120;

  // 倒计时
  const countdown = setInterval(() => {
    timerDuration.value--;

    if (timerDuration.value <= 0) {
      clearInterval(countdown);
      document.body.classList.remove('desaturate');
      isTimerShowing.value = false;
    }
  }, 1000);
}
onMounted(() => {
  // 更新时间显示
  setInterval(() => {
    currentTime.value = new Date();
  }, 1000);
})
</script>

<template>
  <!-- 褪色倒计时 -->
  <div class="desaturate-timer" v-show="isTimerShowing">{{ timerDuration }}</div>

  <div class="system-header">
    <div class="system-title-container">
      <div class="system-title">EMBERSTAR OS 2.1
        <span class="permission-badge" id="currentUserBadge">权限：{{ userStore.currentUser?.permission || '未登录' }}</span>
      </div>
      <div class="access-granted">当前用户: <span id="currentUserName">{{ userStore.currentUser?.displayName || '未登录' }}</span></div>
    </div>
    <div class="system-time-container">
      <div class="system-time" id="systemTime">始源历14200年1月{{ currentTime.getDate() }}日{{ currentTime.getHours().toString().padStart(2, '0') }}:{{ currentTime.getMinutes().toString().padStart(2, '0') }}:{{ currentTime.getSeconds().toString().padStart(2, '0') }}</div>
      <div class="heartbeat" @click="desaturateEasterEgg">最后心跳:
        <span id="lastHeartbeat"> {{ currentTime.getHours().toString().padStart(2, '0') }}:{{ currentTime.getMinutes().toString().padStart(2, '0') }}:{{ currentTime.getSeconds().toString().padStart(2, '0') }}</span><span class="blink">_</span></div>
    </div>
  </div>
</template>

<style scoped>
/* 褪色倒计时 */
.desaturate-timer {
  position: fixed;
  top: 20px;
  right: 20px;
  background: rgba(0, 0, 0, 0.7);
  color: #fff;
  padding: 10px 15px;
  border-radius: 5px;
  font-size: 1.2rem;
  z-index: 10000;
  border: 1px solid #fff;
}

.access-granted {
  font-size: 0.7rem;
  opacity: 0.5;
  margin-top: 5px;
}

.system-time-container {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.system-time {
  font-size: 0.8rem;
  color: #00aaff;
  margin-bottom: 5px;
}

.heartbeat {
  font-size: 0.7rem;
  opacity: 0.7;
  transition: all 0.3s ease;
}

.heartbeat:hover {
  opacity: 1;
  text-shadow: 0 0 5px rgba(255, 255, 255, 0.5);
}

.system-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 10px 0;
  border-bottom: 1px solid rgba(0, 255, 255, 0.3);
  margin-bottom: 15px;
  flex-wrap: wrap;
  position: relative;
}

.system-title-container {
  display: flex;
  flex-direction: column;
}

.system-title {
  font-size: clamp(1rem, 5vw, 1.5rem);
  text-shadow: 0 0 5px #00ffff;
  margin-bottom: 5px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}

/* 权限徽章样式 */
.permission-badge {
  display: inline-block;
  padding: 2px 8px;
  background-color: rgba(0, 255, 255, 0.2);
  border: 1px solid rgba(0, 255, 255, 0.5);
  border-radius: 3px;
  font-size: 0.7rem;
  margin-left: 10px;
  vertical-align: middle;
  transition: all 0.3s ease;
}

.permission-badge:hover {
  background-color: rgba(0, 255, 255, 0.3);
  transform: scale(1.05);
}
@media (max-width: 767px) {
  .system-header {
    flex-direction: column;
    align-items: flex-start;
    padding: 8px 0;
    margin-bottom: 10px;
  }
  
  .system-time-container {
    align-items: flex-start;
    margin-top: 8px;
  }
  
  .permission-badge {
    margin-left: 5px;
    margin-top: 5px;
  }
  
  .system-title {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .system-time, .heartbeat, .access-granted {
    font-size: 0.65rem;
  }
}
</style>
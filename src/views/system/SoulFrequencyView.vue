<script setup>
import { getAllSouls } from "@/services/soulService.js";
import { onMounted, ref } from "vue";

const souls = ref([])

const updateSoulStatus = () => {
  if (souls.value){
    for (let soul of souls.value) {
      // 模拟频率变化
      if (soul.deceased) continue; // 已逝灵魂不再变化
      const frequencyChange = (Math.random() * 20 - 10).toFixed(2);
      let newFrequency = parseFloat(soul.frequency) + parseFloat(frequencyChange);
      if (newFrequency < 0) newFrequency = 0;
      soul.frequency = newFrequency.toFixed(2)+"Hz";

      // 根据频率更新状态
      if (newFrequency <= 20) {
        soul.status = "濒死";
        soul.dying = true;
        soul.deceased = false;
      } else if (newFrequency <= 0.1) {
        soul.status = "已逝";
        soul.dying = false;
        soul.deceased = true;
      } else {
        soul.status = "稳定";
        soul.dying = false;
        soul.deceased = false;
      }
    }
  }
}

onMounted(() => {
  souls.value = getAllSouls();
  setInterval(() => {
    updateSoulStatus();
  }, 10000); // 每10秒更新一次
})
</script>

<template>
  <!-- 灵魂频率监测内容 -->
  <div class="content-section soul-frequency-content" id="soul-frequency-content">
    <h2 class="content-title">灵魂频率监测</h2>
    <p>实时监测各角色的灵魂状态。灵魂外观为带有核心的火球，其脉动频率反映生命状态。</p>

    <div class="soul-grid" id="soulGrid">
      <div class="soul-card" v-for="soul in souls" :key="soul.name"
        :class="{ 'dying': soul.dying, 'deceased': soul.deceased }">
        <div class="soul-name">{{ soul.name }}</div>
        <div class="soul-visualization">
          <div class="soul-core" :style="{ backgroundColor: soul.color }"></div>
          <div class="soul-flame" :style="{ backgroundColor: soul.color }"></div>
        </div>
        <div class="soul-status">状态: {{ soul.status }}</div>
        <div class="soul-frequency">频率: {{ soul.frequency }}</div>
      </div>
    </div>

    <div class="auto-refresh-notice">灵魂频率每10秒自动刷新</div>
  </div>
</template>

<style scoped>
/* 灵魂频率监测样式 */
.soul-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.soul-card {
  background-color: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(0, 255, 255, 0.3);
  border-radius: 10px;
  padding: 20px;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.soul-name {
  font-size: 1.1rem;
  margin-bottom: 15px;
  color: #00aaff;
}

.soul-visualization {
  width: 120px;
  height: 120px;
  margin: 0 auto 15px;
  position: relative;
}

.soul-core {
  width: 40px;
  height: 40px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  filter: blur(5px);
  animation: soul-pulse 2s infinite ease-in-out;
}

.soul-flame {
  width: 80px;
  height: 80px;
  opacity: 0.6;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  filter: blur(10px);
  animation: soul-flicker 3s infinite alternate;
}

.soul-status {
  font-size: 0.9rem;
  margin-top: 10px;
  color: #00ffff;
}

.soul-frequency {
  font-size: 0.8rem;
  margin-top: 5px;
  color: #00aaff;
}

.deceased {
  color: #ff6666;
}

/* 濒死状态样式 */
.soul-card.dying .soul-status {
  opacity: 0.6;
  color: #ff9900;
}

.soul-card.dying .soul-core,
.soul-card.dying .soul-flame {
  opacity: 0.4;
  animation-duration: 3s;
}

.soul-card.dying .soul-core {
  width: 30px !important;
  height: 30px !important;
}

.soul-card.dying .soul-flame {
  width: 60px !important;
  height: 60px !important;
}

/* 死亡状态样式 */
.soul-card.deceased {
  border-color: rgba(255, 102, 102, 0.5);
}

.soul-card.deceased .soul-status {
  color: #ff6666;
}

.soul-card.deceased .soul-core,
.soul-card.deceased .soul-flame {
  opacity: 0.2;
  background-color: #ff6666 !important;
  animation: none;
}

.soul-card.deceased .soul-frequency {
  color: #ff6666;
  opacity: 0.7;
}

@keyframes soul-pulse {

  0%,
  100% {
    transform: translate(-50%, -50%) scale(1);
  }

  50% {
    transform: translate(-50%, -50%) scale(1.1);
  }
}

@keyframes soul-flicker {

  0%,
  100% {
    opacity: 0.8;
  }

  25% {
    opacity: 0.6;
  }

  50% {
    opacity: 0.9;
  }

  75% {
    opacity: 0.7;
  }
}

.auto-refresh-notice {
  text-align: center;
  margin-top: 20px;
  font-size: 0.8rem;
  opacity: 0.7;
  color: #00aaff;
}
</style>
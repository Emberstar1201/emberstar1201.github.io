<script setup>

</script>

<template>
  <!-- 日常检测报告内容 -->
  <div class="content-section" id="monitor-content">
    <h2 class="content-title">日常检测报告</h2>

    <div class="status-grid">
      <div class="status-card">
        <h4>维度稳定性</h4>
        <div class="status-value">98.7%</div>
        <p>边界法则运行正常</p>
      </div>

      <div class="status-card">
        <h4>传送网络频率状态</h4>
        <div class="status-value">99.3%</div>
        <p>频率稳定</p>
      </div>
    </div>

    <div class="content-section">
      <h3>最近事件</h3>
      <p>边界迷雾检测到异常波动，已自动修正。</p>
    </div>
  </div>
</template>

<style scoped>
.status-grid {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 15px;
  margin-top: 15px;
}

@media (min-width: 480px) {
  .status-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

.status-card {
  background-color: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(0, 255, 255, 0.3);
  border-radius: 5px;
  padding: 15px;
}

.status-card h4 {
  color: #00aaff;
  margin-bottom: 10px;
  font-size: 1rem;
}

.status-value {
  font-size: 1.2rem;
  color: #00ffff;
  text-shadow: 0 0 5px #00ffff;
}
</style>
<script setup>

</script>

<template>
  <!-- 防御系统内容 -->
  <div class="content-section" id="defense-content">
    <h2 class="content-title">防御系统状态</h2>

    <div class="defense-status">
      <div class="defense-item">
        <div class="defense-name">边界迷雾系统</div>
        <div class="defense-status-indicator"></div>
      </div>

      <div class="defense-item">
        <div class="defense-name">空间循环法则</div>
        <div class="defense-status-indicator"></div>
      </div>
    </div>

    <div class="content-section">
      <h3>防御日志</h3>
      <p>边界迷雾激活，阻止未授权访问尝试。</p>
    </div>
  </div>
</template>

<style scoped>
.defense-status {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.defense-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background-color: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(0, 255, 255, 0.3);
  border-radius: 5px;
}

.defense-name {
  color: #00aaff;
  font-size: 0.9rem;
}

.defense-status-indicator {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: #00ff00;
}

.defense-status-indicator.warning {
  background-color: #ffff00;
}

.defense-status-indicator.critical {
  background-color: #ff0000;
}
</style>
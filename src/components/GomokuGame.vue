<script setup>

</script>

<template>
  <!-- 五子棋游戏界面 -->
  <div class="gomoku-game" id="gomokuGame">
    <div class="gomoku-header">
      <div class="gomoku-title">五子棋</div>
      <div class="gomoku-controls">
        <button class="gomoku-button" id="restartButton">重新开始</button>
        <button class="gomoku-button" id="closeGameButton">关闭游戏</button>
      </div>
    </div>
    <div class="gomoku-board" id="gomokuBoard"></div>
    <div class="gomoku-status" id="gomokuStatus">黑方回合</div>
  </div>
</template>

<style scoped>

</style>
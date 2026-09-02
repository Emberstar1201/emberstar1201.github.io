<script setup>
import { ref, computed, onUnmounted } from 'vue'

const SIZE = 15
const board = ref([])       // 0=空 1=黑(玩家) 2=白(小烬)
const currentPlayer = ref(1) // 1=黑 2=白
const gameOver = ref(false)
const winner = ref(0)        // 0=进行中 1=玩家胜 2=小烬胜 3=平局
const aiThinking = ref(false)
const lastMove = ref(null)   // {r, c}
const moveCount = ref(0)

// 初始化棋盘
const initBoard = () => {
  board.value = Array.from({ length: SIZE }, () => Array(SIZE).fill(0))
  currentPlayer.value = 1
  gameOver.value = false
  winner.value = 0
  aiThinking.value = false
  lastMove.value = null
  moveCount.value = 0
}
initBoard()

const statusText = computed(() => {
  if (gameOver.value) {
    if (winner.value === 1) return '🎉 你赢了！'
    if (winner.value === 2) return '🤖 小烬赢了！'
    return '🤝 平局'
  }
  if (aiThinking.value) return '小烬思考中...'
  if (currentPlayer.value === 1) return '轮到你了（黑棋）'
  return '轮到小烬（白棋）'
})

// 检查五连
const checkWin = (r, c, player) => {
  const dirs = [[0,1],[1,0],[1,1],[1,-1]]
  for (const [dr, dc] of dirs) {
    let count = 1
    // 正向
    for (let i = 1; i < 5; i++) {
      const nr = r + dr*i, nc = c + dc*i
      if (nr < 0 || nr >= SIZE || nc < 0 || nc >= SIZE) break
      if (board.value[nr][nc] !== player) break
      count++
    }
    // 反向
    for (let i = 1; i < 5; i++) {
      const nr = r - dr*i, nc = c - dc*i
      if (nr < 0 || nr >= SIZE || nc < 0 || nc >= SIZE) break
      if (board.value[nr][nc] !== player) break
      count++
    }
    if (count >= 5) return true
  }
  return false
}

// 简单 AI：评估每个空位得分，选最高分
const scorePosition = (r, c, player) => {
  if (board.value[r][c] !== 0) return -1
  let score = 0
  const dirs = [[0,1],[1,0],[1,1],[1,-1]]
  const opp = 3 - player

  for (const [dr, dc] of dirs) {
    // 自己的连线得分
    let myCount = 0, myOpen = 0
    for (let i = 1; i <= 4; i++) {
      const nr = r + dr*i, nc = c + dc*i
      if (nr < 0 || nr >= SIZE || nc < 0 || nc >= SIZE) break
      if (board.value[nr][nc] === player) myCount++
      else { if (board.value[nr][nc] === 0) myOpen++; break }
    }
    let myCount2 = 0, myOpen2 = 0
    for (let i = 1; i <= 4; i++) {
      const nr = r - dr*i, nc = c - dc*i
      if (nr < 0 || nr >= SIZE || nc < 0 || nc >= SIZE) break
      if (board.value[nr][nc] === player) myCount2++
      else { if (board.value[nr][nc] === 0) myOpen2++; break }
    }
    const totalMy = myCount + myCount2
    const totalOpen = myOpen + myOpen2
    if (totalMy >= 4) score += 100000
    else if (totalMy === 3 && totalOpen === 2) score += 10000
    else if (totalMy === 3) score += 1000
    else if (totalMy === 2 && totalOpen === 2) score += 500
    else if (totalMy === 2) score += 100
    else score += 10 * totalMy

    // 对手的连线（防守）
    let oppCount = 0, oppOpen = 0
    for (let i = 1; i <= 4; i++) {
      const nr = r + dr*i, nc = c + dc*i
      if (nr < 0 || nr >= SIZE || nc < 0 || nc >= SIZE) break
      if (board.value[nr][nc] === opp) oppCount++
      else { if (board.value[nr][nc] === 0) oppOpen++; break }
    }
    let oppCount2 = 0, oppOpen2 = 0
    for (let i = 1; i <= 4; i++) {
      const nr = r - dr*i, nc = c - dc*i
      if (nr < 0 || nr >= SIZE || nc < 0 || nc >= SIZE) break
      if (board.value[nr][nc] === opp) oppCount2++
      else { if (board.value[nr][nc] === 0) oppOpen2++; break }
    }
    const totalOpp = oppCount + oppCount2
    const totalOppOpen = oppOpen + oppOpen2
    if (totalOpp >= 4) score += 80000  // 必防
    else if (totalOpp === 3 && totalOppOpen === 2) score += 8000
    else if (totalOpp === 3) score += 800
    else if (totalOpp === 2 && totalOppOpen === 2) score += 400
    else if (totalOpp === 2) score += 80
  }
  return score
}

const aiMove = () => {
  if (gameOver.value) return
  aiThinking.value = true

  setTimeout(() => {
    let bestScore = -1
    let bestMoves = []

    for (let r = 0; r < SIZE; r++) {
      for (let c = 0; c < SIZE; c++) {
        if (board.value[r][c] !== 0) continue
        // 只考虑已有棋子附近
        let hasNeighbor = false
        for (let dr = -2; dr <= 2 && !hasNeighbor; dr++) {
          for (let dc = -2; dc <= 2 && !hasNeighbor; dc++) {
            const nr = r + dr, nc = c + dc
            if (nr >= 0 && nr < SIZE && nc >= 0 && nc < SIZE && board.value[nr][nc] !== 0) {
              hasNeighbor = true
            }
          }
        }
        if (!hasNeighbor && moveCount.value > 0) continue

        const score = scorePosition(r, c, 2)
        if (score > bestScore) {
          bestScore = score
          bestMoves = [{ r, c }]
        } else if (score === bestScore) {
          bestMoves.push({ r, c })
        }
      }
    }

    // 第一步下天元
    if (moveCount.value === 0) {
      bestMoves = [{ r: 7, c: 7 }]
    }

    const move = bestMoves[Math.floor(Math.random() * bestMoves.length)]
    if (move) {
      board.value[move.r][move.c] = 2
      lastMove.value = { r: move.r, c: move.c }
      moveCount.value++

      if (checkWin(move.r, move.c, 2)) {
        gameOver.value = true
        winner.value = 2
      } else if (moveCount.value >= SIZE * SIZE) {
        gameOver.value = true
        winner.value = 3
      } else {
        currentPlayer.value = 1
      }
    }
    aiThinking.value = false
  }, 500)
}

// 玩家落子
const placeStone = (r, c) => {
  if (gameOver.value || aiThinking.value || currentPlayer.value !== 1) return
  if (board.value[r][c] !== 0) return

  board.value[r][c] = 1
  lastMove.value = { r, c }
  moveCount.value++

  if (checkWin(r, c, 1)) {
    gameOver.value = true
    winner.value = 1
    return
  }
  if (moveCount.value >= SIZE * SIZE) {
    gameOver.value = true
    winner.value = 3
    return
  }

  currentPlayer.value = 2
  aiMove()
}

const emit = defineEmits(['exit'])
onUnmounted(() => {})
</script>

<template>
  <div class="gomoku-game">
    <div class="game-header">
      <span class="game-status">{{ statusText }}</span>
      <button class="game-btn restart" @click="initBoard">重新开始</button>
      <button class="game-btn exit" @click="emit('exit')">退出游戏</button>
    </div>
    <div class="board-container">
      <div class="board">
        <div class="cell" v-for="r in SIZE" :key="'r'+r">
          <div
            class="cell-item"
            v-for="c in SIZE"
            :key="'c'+c"
            @click="placeStone(r-1, c-1)"
            :class="{
              'last-move': lastMove && lastMove.r === r-1 && lastMove.c === c-1,
              'disabled': gameOver || aiThinking || currentPlayer !== 1
            }"
          >
            <div v-if="board[r-1][c-1] === 1" class="stone black"></div>
            <div v-else-if="board[r-1][c-1] === 2" class="stone white"></div>
          </div>
        </div>
      </div>
    </div>
    <div class="game-info">
      <span>⚫ 你</span>
      <span>⚪ 小烬</span>
    </div>
  </div>
</template>

<style scoped>
.gomoku-game {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 16px;
}

.game-header {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: center;
}

.game-status {
  color: #00ffff;
  font-size: 0.95rem;
  font-weight: bold;
  min-width: 140px;
  text-align: center;
}

.game-btn {
  background: transparent;
  border: 1px solid rgba(0, 255, 255, 0.3);
  border-radius: 4px;
  color: #00dddd;
  padding: 4px 12px;
  font-size: 0.78rem;
  cursor: pointer;
  transition: all 0.2s;
  font-family: inherit;
}
.game-btn:hover {
  background: rgba(0, 255, 255, 0.1);
  border-color: #00ffff;
}
.game-btn.exit {
  border-color: rgba(255, 80, 80, 0.4);
  color: #ff6666;
}
.game-btn.exit:hover {
  background: rgba(255, 80, 80, 0.1);
}

.board-container {
  overflow: auto;
  max-width: 100%;
}

.board {
  display: inline-grid;
  grid-template-columns: repeat(15, 30px);
  background: rgba(0, 170, 200, 0.15);
  border: 2px solid rgba(0, 255, 255, 0.3);
  border-radius: 4px;
  padding: 3px;
  gap: 0;
}

.cell {
  display: contents;
}

.cell-item {
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;
  transition: background 0.15s;
  border: 1px solid rgba(0, 255, 255, 0.18);
  background: rgba(15, 15, 30, 0.6);
}

.cell-item:not(.disabled):hover {
  background: rgba(0, 255, 255, 0.08);
}

.cell-item.disabled {
  cursor: default;
}

.cell-item.last-move::after {
  content: '';
  position: absolute;
  inset: 2px;
  border: 1.5px solid rgba(0, 255, 0, 0.6);
  border-radius: 50%;
  pointer-events: none;
}

.stone {
  width: 26px;
  height: 26px;
  border-radius: 50%;
}

.stone.black {
  background: radial-gradient(circle at 35% 35%, #555, #000);
  box-shadow: 0 1px 3px rgba(0,0,0,0.5);
}

.stone.white {
  background: radial-gradient(circle at 35% 35%, #fff, #aaa);
  box-shadow: 0 1px 3px rgba(0,0,0,0.5);
}

.game-info {
  display: flex;
  gap: 20px;
  font-size: 0.85rem;
  color: rgba(0, 255, 255, 0.6);
}

@media (max-width: 480px) {
  .cell-item {
    width: 22px;
    height: 22px;
  }
  .stone {
    width: 18px;
    height: 18px;
  }
}
</style>

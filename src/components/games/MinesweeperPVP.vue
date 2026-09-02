<script setup>
import { ref, computed } from 'vue'

const SIZE = 10
const MINE_COUNT = 15

// 0-8: 周围雷数  -1: 雷  null: 未翻开
const board = ref([])        // 实际地雷布局
const revealed = ref([])     // 翻开状态
const currentPlayer = ref(1)  // 1=玩家 2=小烬
const gameOver = ref(false)
const winner = ref(0)        // 0=进行中 1=玩家胜 2=小烬胜
const loser = ref(0)         // 谁踩到雷
const aiThinking = ref(false)
const explodeCell = ref(null) // 踩雷的格子
const moveCount = ref(0)

const initBoard = () => {
  // 先生成空棋盘
  const b = Array.from({ length: SIZE }, () => Array(SIZE).fill(0))
  const rev = Array.from({ length: SIZE }, () => Array(SIZE).fill(null))

  // 随机放雷
  let placed = 0
  while (placed < MINE_COUNT) {
    const r = Math.floor(Math.random() * SIZE)
    const c = Math.floor(Math.random() * SIZE)
    if (b[r][c] !== -1) {
      b[r][c] = -1
      placed++
    }
  }

  // 计算每个格子周围的雷数
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (b[r][c] === -1) continue
      let count = 0
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dr === 0 && dc === 0) continue
          const nr = r + dr, nc = c + dc
          if (nr >= 0 && nr < SIZE && nc >= 0 && nc < SIZE && b[nr][nc] === -1) {
            count++
          }
        }
      }
      b[r][c] = count
    }
  }

  board.value = b
  revealed.value = rev
  currentPlayer.value = 1
  gameOver.value = false
  winner.value = 0
  loser.value = 0
  aiThinking.value = false
  explodeCell.value = null
  moveCount.value = 0
}
initBoard()

const safeCells = computed(() => SIZE * SIZE - MINE_COUNT)

const statusText = computed(() => {
  if (gameOver.value) {
    if (winner.value === 1) return '🎉 小烬踩到雷了，你赢了！'
    if (winner.value === 2) return '💥 你踩到雷了，小烬赢了！'
    return ''
  }
  if (aiThinking.value) return '小烬选择中...'
  if (currentPlayer.value === 1) return '轮到你点击（小心雷！）'
  return '轮到小烬'
})

// 翻开一个格子（如果是0则自动展开周围）
const revealCell = (r, c) => {
  if (revealed.value[r][c] !== null) return false
  const val = board.value[r][c]

  if (val === -1) {
    // 踩雷
    revealed.value[r][c] = -1
    explodeCell.value = { r, c }
    return true // 踩到雷
  }

  // BFS 展开
  const queue = [[r, c]]
  while (queue.length > 0) {
    const [cr, cc] = queue.shift()
    if (revealed.value[cr][cc] !== null) continue
    const cv = board.value[cr][cc]
    revealed.value[cr][cc] = cv
    moveCount.value++
    if (cv === 0) {
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dr === 0 && dc === 0) continue
          const nr = cr + dr, nc = cc + dc
          if (nr >= 0 && nr < SIZE && nc >= 0 && nc < SIZE && revealed.value[nr][nc] === null) {
            queue.push([nr, nc])
          }
        }
      }
    }
  }
  return false
}

// 玩家点击
const handleClick = (r, c) => {
  if (gameOver.value || aiThinking.value || currentPlayer.value !== 1) return
  if (revealed.value[r][c] !== null) return

  const hitMine = revealCell(r, c)

  if (hitMine) {
    gameOver.value = true
    winner.value = 2
    loser.value = 1
    // 揭示所有雷
    for (let i = 0; i < SIZE; i++) {
      for (let j = 0; j < SIZE; j++) {
        if (board.value[i][j] === -1 && revealed.value[i][j] === null) {
          revealed.value[i][j] = -1
        }
      }
    }
    return
  }

  // 检查是否所有安全格都翻了
  if (moveCount.value >= safeCells.value) {
    gameOver.value = true
    winner.value = 1
    return
  }

  // 切换到 AI
  currentPlayer.value = 2
  aiTurn()
}

// AI 回合
const aiTurn = () => {
  if (gameOver.value) return
  aiThinking.value = true

  setTimeout(() => {
    // 收集未翻开的格子
    const candidates = []
    for (let r = 0; r < SIZE; r++) {
      for (let c = 0; c < SIZE; c++) {
        if (revealed.value[r][c] === null) {
          candidates.push({ r, c })
        }
      }
    }

    if (candidates.length === 0) {
      aiThinking.value = false
      return
    }

    // 简单策略：优先选周围有已翻开数字但不是雷标记的格子
    // 如果周围有数字=1且只对应一个未翻开格，可能是雷，避开
    // 简化版：随机选，但稍微偏好已翻开区域附近的格子
    let pick = null

    // 找"安全"格子：周围有已翻开的0（说明该区域无雷）
    const safeCands = candidates.filter(({ r, c }) => {
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          const nr = r + dr, nc = c + dc
          if (nr >= 0 && nr < SIZE && nc >= 0 && nc < SIZE && revealed.value[nr][nc] === 0) {
            return true
          }
        }
      }
      return false
    })

    if (safeCands.length > 0) {
      pick = safeCands[Math.floor(Math.random() * safeCands.length)]
    } else {
      pick = candidates[Math.floor(Math.random() * candidates.length)]
    }

    const hitMine = revealCell(pick.r, pick.c)

    if (hitMine) {
      gameOver.value = true
      winner.value = 1
      loser.value = 2
      for (let i = 0; i < SIZE; i++) {
        for (let j = 0; j < SIZE; j++) {
          if (board.value[i][j] === -1 && revealed.value[i][j] === null) {
            revealed.value[i][j] = -1
          }
        }
      }
      aiThinking.value = false
      return
    }

    if (moveCount.value >= safeCells.value) {
      gameOver.value = true
      winner.value = 2
      aiThinking.value = false
      return
    }

    currentPlayer.value = 1
    aiThinking.value = false
  }, 600)
}

const cellClass = (r, c) => {
  const val = revealed.value[r][c]
  if (val === null) return 'hidden'
  if (val === -1) return 'mine'
  return 'revealed'
}

const cellContent = (r, c) => {
  const val = revealed.value[r][c]
  if (val === null) return ''
  if (val === -1) return '💣'
  if (val === 0) return ''
  return val
}

const emit = defineEmits(['exit'])
</script>

<template>
  <div class="mine-game">
    <div class="game-header">
      <span class="game-status">{{ statusText }}</span>
      <button class="game-btn restart" @click="initBoard">重新开始</button>
      <button class="game-btn exit" @click="emit('exit')">退出游戏</button>
    </div>
    <div class="game-info">
      <span>💣 {{ MINE_COUNT }} 雷</span>
      <span>🛡️ 已翻开 {{ moveCount }}/{{ safeCells }}</span>
    </div>
    <div class="grid-container">
      <div class="grid">
        <div class="cell-row" v-for="r in SIZE" :key="'r'+r">
          <div
            class="cell"
            v-for="c in SIZE"
            :key="'c'+c"
            :class="[cellClass(r-1, c-1), {
              'explode': explodeCell && explodeCell.r === r-1 && explodeCell.c === c-1,
              'current': currentPlayer === 1 && !gameOver && !aiThinking && revealed[r-1][c-1] === null
            }]"
            @click="handleClick(r-1, c-1)"
          >
            <span class="cell-text" :class="'num-' + (revealed[r-1][c-1] || 0)">{{ cellContent(r-1, c-1) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.mine-game {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
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
  min-width: 160px;
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

.game-info {
  display: flex;
  gap: 20px;
  font-size: 0.8rem;
  color: rgba(0, 255, 255, 0.5);
}

.grid-container {
  overflow: auto;
  max-width: 100%;
}

.grid {
  display: inline-grid;
  grid-template-columns: repeat(10, 34px);
  gap: 2px;
  background: rgba(0, 255, 255, 0.1);
  padding: 2px;
  border-radius: 4px;
}

.cell-row {
  display: contents;
}

.cell {
  width: 34px;
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: bold;
  border-radius: 3px;
  transition: all 0.15s;
  user-select: none;
}

.cell.hidden {
  background: rgba(30, 30, 50, 0.9);
  border: 1px solid rgba(0, 255, 255, 0.15);
}

.cell.hidden:hover {
  background: rgba(40, 40, 60, 0.9);
}

.cell.current:hover {
  background: rgba(0, 255, 255, 0.12);
  border-color: rgba(0, 255, 255, 0.4);
}

.cell.revealed {
  background: rgba(15, 15, 25, 0.6);
  border: 1px solid rgba(0, 255, 255, 0.05);
  cursor: default;
}

.cell.mine {
  background: rgba(255, 80, 80, 0.2);
  border: 1px solid rgba(255, 80, 80, 0.3);
}

.cell.explode {
  background: rgba(255, 80, 80, 0.5) !important;
  border: 2px solid #ff4444 !important;
  animation: shake 0.4s ease;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-3px); }
  75% { transform: translateX(3px); }
}

.cell-text {
  line-height: 1;
}

.num-1 { color: #66ccff; }
.num-2 { color: #66ff99; }
.num-3 { color: #ff9966; }
.num-4 { color: #cc66ff; }
.num-5 { color: #ff6666; }
.num-6 { color: #66ffff; }
.num-7 { color: #ffff66; }
.num-8 { color: #ffffff; }

@media (max-width: 480px) {
  .cell {
    width: 28px;
    height: 28px;
    font-size: 0.75rem;
  }
}
</style>

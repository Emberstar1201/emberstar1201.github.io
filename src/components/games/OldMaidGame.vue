<script setup>
import { computed, ref } from 'vue'

const createHand = () => Array.from({ length: 10 }, (_, index) => ({
  id: `pair-${index}-a`, pair: index, label: String(index + 1), joker: false
})).flatMap((card) => [
  card,
  { ...card, id: card.id.replace('-a', '-b') }
])

const playerHand = ref([])
const aiHand = ref([])
const currentPlayer = ref(1)
const gameOver = ref(false)
const winner = ref(0)
const message = ref('')
const aiThinking = ref(false)

const statusText = computed(() => {
  if (gameOver.value) return winner.value === 1 ? '你赢了，小烬拿到了鬼牌' : '小烬赢了，你拿到了鬼牌'
  if (aiThinking.value) return '小烬正在抽牌...'
  if (message.value) return message.value
  return currentPlayer.value === 1 ? '轮到你：抽小烬的一张牌' : '小烬的回合'
})

const discardPairs = (hand) => {
  const counts = new Map()
  for (const card of hand) {
    if (!card.joker) counts.set(card.pair, (counts.get(card.pair) || 0) + 1)
  }
  return hand.filter((card) => card.joker || counts.get(card.pair) % 2 !== 0)
}

const finishIfNeeded = () => {
  if (playerHand.value.length === 0 && aiHand.value.length === 0) {
    gameOver.value = true
    winner.value = playerHand.value.some((card) => card.joker) ? 2 : 1
  } else if (playerHand.value.length === 0) {
    gameOver.value = true
    winner.value = 1
  } else if (aiHand.value.length === 0) {
    gameOver.value = true
    winner.value = 2
  }
  if (gameOver.value) message.value = ''
  else if (playerHand.value.length === 0 || aiHand.value.length === 0) {
    currentPlayer.value = playerHand.value.length === 0 ? 2 : 1
    message.value = '一方手牌已空，等待最后抽牌'
  }
}

const initGame = () => {
  const deck = [...createHand(), { id: 'joker', pair: null, label: '鬼牌', joker: true }]
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[deck[i], deck[j]] = [deck[j], deck[i]]
  }
  playerHand.value = discardPairs(deck.slice(0, 11))
  aiHand.value = discardPairs(deck.slice(11))
  currentPlayer.value = 1
  gameOver.value = false
  winner.value = 0
  message.value = ''
  aiThinking.value = false
  finishIfNeeded()
}

const drawForPlayer = (index) => {
  const [card] = aiHand.value.splice(index, 1)
  const hadPair = !card.joker && playerHand.value.some((item) => item.pair === card.pair)
  playerHand.value.push(card)
  playerHand.value = discardPairs(playerHand.value)
  message.value = card.joker ? '抽到了鬼牌！' : hadPair ? `抽到 ${card.label}，配对后弃掉` : `抽到 ${card.label}`
  finishIfNeeded()
  if (!gameOver.value) {
    currentPlayer.value = 2
    window.setTimeout(aiTurn, 650)
  }
}

const aiTurn = () => {
  if (gameOver.value) return
  aiThinking.value = true
  window.setTimeout(() => {
    if (playerHand.value.length === 0) {
      aiThinking.value = false
      finishIfNeeded()
      return
    }
    const index = Math.floor(Math.random() * playerHand.value.length)
    const [card] = playerHand.value.splice(index, 1)
    const hadPair = !card.joker && aiHand.value.some((item) => item.pair === card.pair)
    aiHand.value.push(card)
    aiHand.value = discardPairs(aiHand.value)
    message.value = card.joker ? '小烬抽到了鬼牌！' : hadPair ? '小烬抽到一张牌并弃掉了对子' : '小烬抽到一张牌'
    finishIfNeeded()
    aiThinking.value = false
    if (!gameOver.value) currentPlayer.value = 1
  }, 650)
}

const selectCard = (index) => {
  if (gameOver.value || aiThinking.value || currentPlayer.value !== 1) return
  drawForPlayer(index)
}

const emit = defineEmits(['exit'])
initGame()
</script>

<template>
  <section class="old-maid">
    <header class="game-header">
      <strong>{{ statusText }}</strong>
      <button class="control-btn" @click="initGame">重新开始</button>
      <button class="control-btn exit" @click="emit('exit')">退出游戏</button>
    </header>
    <div class="table">
      <section class="hand opponent">
        <h3>小烬 · {{ aiHand.length }} 张</h3>
        <div class="cards">
          <button v-for="n in aiHand.length" :key="`ai-${n}`" class="card back" :disabled="gameOver || currentPlayer !== 1 || aiThinking" :aria-label="`抽取小烬的第 ${n} 张牌`" @click="selectCard(n - 1)">✦</button>
        </div>
      </section>
      <div class="table-note">{{ message || '成对的牌会自动弃掉，只能看到自己的牌面' }}</div>
      <section class="hand player">
        <h3>你 · {{ playerHand.length }} 张</h3>
        <div class="cards">
          <div v-for="card in playerHand" :key="card.id" class="card face" :class="{ joker: card.joker }" :aria-label="card.label">
            <span>{{ card.joker ? '★' : card.label }}</span><small>{{ card.joker ? '鬼牌' : '火花' }}</small>
          </div>
        </div>
      </section>
    </div>
  </section>
</template>

<style scoped>
.old-maid { width: 100%; max-width: 900px; color: #e9f7fa; padding: 18px; }
.game-header { display: flex; align-items: center; justify-content: center; gap: 12px; flex-wrap: wrap; margin-bottom: 22px; }
.game-header strong { color: #6ce4df; min-width: 210px; text-align: center; }
.control-btn { background: transparent; border: 1px solid #387f83; border-radius: 4px; color: #b8f2e9; padding: 7px 12px; cursor: pointer; }
.control-btn:hover { background: #15383d; }
.control-btn.exit { color: #ff9292; border-color: #854c57; }
.table { display: grid; gap: 24px; }
.hand { min-width: 0; }
.hand h3 { font-size: 0.95rem; font-weight: 500; color: #9bbfc4; margin: 0 0 12px; }
.cards { display: flex; justify-content: center; flex-wrap: wrap; gap: 8px; min-height: 100px; }
.card { width: 58px; height: 86px; flex: 0 0 58px; border-radius: 5px; cursor: pointer; }
.card.back { border: 1px solid #4fb7b4; background: repeating-linear-gradient(135deg, #17454b 0 6px, #1d5558 6px 12px); color: #c5ffed; font-size: 24px; }
.card.back:hover:not(:disabled) { transform: translateY(-5px); }
.card.face { display: flex; flex-direction: column; justify-content: space-between; align-items: flex-start; padding: 8px; border: 1px solid #c8d9d5; background: #f2f5ef; color: #183d40; text-align: left; }
.card.face span { font-size: 20px; font-weight: 700; }
.card.face small { font-size: 10px; }
.card.face.joker { color: #a33255; border-color: #e38ca4; }
.card:disabled { cursor: default; opacity: 0.8; }
.table-note { min-height: 22px; text-align: center; color: #90b9bf; font-size: 0.9rem; }
@media (max-width: 520px) { .old-maid { padding: 10px 2px; } .cards { gap: 5px; } .card { width: 45px; flex-basis: 45px; height: 68px; } .card.face { padding: 5px; } }
</style>

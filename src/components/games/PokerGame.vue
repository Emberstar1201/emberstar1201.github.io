<script setup>
import { computed, ref } from 'vue'

const suits = ['♠', '♥', '♦', '♣']
const ranks = [
  { value: 3, label: '3' }, { value: 4, label: '4' }, { value: 5, label: '5' },
  { value: 6, label: '6' }, { value: 7, label: '7' }, { value: 8, label: '8' },
  { value: 9, label: '9' }, { value: 10, label: '10' }, { value: 11, label: 'J' },
  { value: 12, label: 'Q' }, { value: 13, label: 'K' }, { value: 14, label: 'A' },
  { value: 15, label: '2' }
]

const playerHand = ref([])
const aiHand = ref([])
const selectedIds = ref([])
const tablePlay = ref(null)
const currentPlayer = ref(1)
const leadPlayer = ref(1)
const passCount = ref(0)
const gameOver = ref(false)
const winner = ref(0)
const aiThinking = ref(false)
const cheating = ref(false)
const message = ref('')

const cardText = (card) => card.joker ? card.label : `${card.label}${card.suit}`
const sorted = (hand) => [...hand].sort((a, b) => a.value - b.value || a.suit.localeCompare(b.suit))

const createDeck = () => {
  const deck = []
  for (const suit of suits) {
    for (const rank of ranks) deck.push({ id: `${suit}-${rank.value}`, suit, ...rank, joker: false })
  }
  deck.push({ id: 'small-joker', value: 16, label: '小王', joker: true })
  deck.push({ id: 'big-joker', value: 17, label: '大王', joker: true })
  return deck
}

const shuffle = (deck) => {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[deck[i], deck[j]] = [deck[j], deck[i]]
  }
  return deck
}

const playType = (cards) => {
  if (!cards.length) return null
  const values = cards.map((card) => card.value).sort((a, b) => a - b)
  const counts = new Map()
  values.forEach((value) => counts.set(value, (counts.get(value) || 0) + 1))
  const groups = [...counts.entries()].sort((a, b) => a[0] - b[0])
  const same = (count) => groups.length === 1 && groups[0][1] === count
  if (cards.length === 2 && values.includes(16) && values.includes(17)) return { name: '王炸', kind: 'rocket', size: 2, power: 17 }
  if (same(1)) return { name: '单牌', kind: 'single', size: 1, power: values[0] }
  if (same(2)) return { name: '对子', kind: 'pair', size: 2, power: values[0] }
  if (same(3)) return { name: '三张', kind: 'triple', size: 3, power: values[0] }
  if (same(4)) return { name: '炸弹', kind: 'bomb', size: 4, power: values[0] }
  if (cards.length === 5 && groups.length === 2 && groups.some((group) => group[1] === 3) && groups.some((group) => group[1] === 2)) {
    return { name: '三带二', kind: 'fullhouse', size: 5, power: groups.find((group) => group[1] === 3)[0] }
  }
  const isStraight = cards.length >= 5 && groups.length === cards.length && values.every((value, index) => value < 15 && (index === 0 || value === values[index - 1] + 1))
  if (isStraight) return { name: '顺子', kind: 'straight', size: cards.length, power: values[values.length - 1] }
  const isPairStraight = cards.length >= 6 && cards.length % 2 === 0 && groups.length === cards.length / 2 && groups.every((group) => group[1] === 2) && groups.every((group, index) => group[0] < 15 && (index === 0 || group[0] === groups[index - 1][0] + 1))
  if (isPairStraight) return { name: '连对', kind: 'pairStraight', size: cards.length, power: groups[groups.length - 1][0] }
  return null
}

const canBeat = (candidate, previous) => {
  if (!candidate) return false
  if (!previous) return true
  if (candidate.kind === 'rocket') return true
  if (previous.kind === 'rocket') return false
  if (candidate.kind === 'bomb' && previous.kind !== 'bomb') return true
  if (candidate.kind !== previous.kind || candidate.size !== previous.size) return false
  return candidate.power > previous.power
}

const statusText = computed(() => {
  if (gameOver.value) return winner.value === 1 ? '🎉 你先出完了，获得胜利！' : '🤖 小烬先出完了'
  if (aiThinking.value) return cheating.value ? '小烬正在作弊，寻找最优牌型...' : '小烬思考中...'
  if (message.value) return message.value
  if (currentPlayer.value === 1) return tablePlay.value ? `轮到你出牌，需压过${tablePlay.value.type.name}` : '轮到你先出牌'
  return tablePlay.value ? `小烬需要压过${tablePlay.value.type.name}` : '小烬先出牌'
})

const selectable = (card) => currentPlayer.value === 1 && !gameOver.value && !aiThinking.value && selectedIds.value.includes(card.id)

const toggleCard = (card) => {
  if (currentPlayer.value !== 1 || gameOver.value || aiThinking.value) return
  selectedIds.value = selectedIds.value.includes(card.id)
    ? selectedIds.value.filter((id) => id !== card.id)
    : [...selectedIds.value, card.id]
  message.value = ''
}

const clearSelection = () => { selectedIds.value = [] }

const removeCards = (hand, cards) => hand.filter((card) => !cards.some((item) => item.id === card.id))

const finishTurn = (player, cards, type) => {
  if (player === 1) playerHand.value = removeCards(playerHand.value, cards)
  else aiHand.value = removeCards(aiHand.value, cards)
  tablePlay.value = { cards, type, player }
  leadPlayer.value = player
  passCount.value = 0
  selectedIds.value = []
  message.value = `${player === 1 ? '你' : '小烬'}出了${type.name}：${cards.map(cardText).join(' ')}`
  if ((player === 1 ? playerHand.value : aiHand.value).length === 0) {
    gameOver.value = true
    winner.value = player
    return
  }
  currentPlayer.value = player === 1 ? 2 : 1
}

const pass = () => {
  if (currentPlayer.value !== 1 || gameOver.value || !tablePlay.value) return
  passCount.value++
  message.value = '你选择不要，小烬继续出牌'
  currentPlayer.value = 2
  window.setTimeout(aiTurn, 650)
}

const submitPlay = () => {
  const cards = playerHand.value.filter((card) => selectedIds.value.includes(card.id))
  const type = playType(cards)
  if (!type) { message.value = '这组牌不是支持的合法牌型'; return }
  if (!canBeat(type, tablePlay.value?.type)) { message.value = '这组牌压不过桌面上的牌'; return }
  finishTurn(1, cards, type)
  if (!gameOver.value) window.setTimeout(aiTurn, 650)
}

const findAiPlay = (hand, previous, forceStrong = false) => {
  const choices = []
  const push = (cards) => {
    const type = playType(cards)
    if (type && canBeat(type, previous)) choices.push({ cards, type })
  }
  const byValue = new Map()
  for (const card of hand) byValue.set(card.value, [...(byValue.get(card.value) || []), card])
  for (const cards of byValue.values()) push([cards[0]])
  for (const cards of byValue.values()) if (cards.length >= 2) push(cards.slice(0, 2))
  for (const cards of byValue.values()) if (cards.length >= 3) push(cards.slice(0, 3))
  for (const cards of byValue.values()) if (cards.length >= 4) push(cards.slice(0, 4))
  const values = [...byValue.keys()].sort((a, b) => a - b)
  for (let start = 0; start < values.length; start++) {
    for (let end = start + 5; end <= values.length; end++) {
      const run = values.slice(start, end)
      if (run.every((value, index) => value < 15 && (index === 0 || value === run[index - 1] + 1))) {
        push(run.flatMap((value) => byValue.get(value).slice(0, 1)))
      }
    }
  }
  for (let start = 0; start < values.length; start++) {
    for (let end = start + 3; end <= values.length; end++) {
      const run = values.slice(start, end)
      if (run.every((value, index) => value < 15 && byValue.get(value).length >= 2 && (index === 0 || value === run[index - 1] + 1))) {
        push(run.flatMap((value) => byValue.get(value).slice(0, 2)))
      }
    }
  }
  for (const triple of byValue.values()) {
    if (triple.length < 3) continue
    for (const pair of byValue.values()) {
      if (pair[0].value !== triple[0].value && pair.length >= 2) push([...triple.slice(0, 3), ...pair.slice(0, 2)])
    }
  }
  if (hand.some((card) => card.value === 16) && hand.some((card) => card.value === 17)) push(hand.filter((card) => card.value >= 16))
  if (!choices.length) return null
  choices.sort((a, b) => a.type.power - b.type.power || a.cards.length - b.cards.length)
  return forceStrong ? choices[choices.length - 1] : choices[0]
}

const aiTurn = () => {
  if (gameOver.value) return
  currentPlayer.value = 2
  aiThinking.value = true
  cheating.value = Math.random() < 0.25
  window.setTimeout(() => {
    const play = findAiPlay(aiHand.value, tablePlay.value?.type, cheating.value)
    if (play) finishTurn(2, play.cards, play.type)
    else {
      passCount.value++
      if (passCount.value >= 1) {
        tablePlay.value = null
        leadPlayer.value = 2
        passCount.value = 0
        message.value = '小烬让牌，你需要重新出牌'
      } else message.value = '小烬选择不出'
      currentPlayer.value = 1
    }
    cheating.value = false
    aiThinking.value = false
  }, 650)
}

const initGame = () => {
  const deck = shuffle(createDeck())
  playerHand.value = sorted(deck.slice(0, 27))
  aiHand.value = sorted(deck.slice(27))
  selectedIds.value = []
  tablePlay.value = null
  currentPlayer.value = 1
  leadPlayer.value = 1
  passCount.value = 0
  gameOver.value = false
  winner.value = 0
  aiThinking.value = false
  cheating.value = false
  message.value = '54张牌已洗牌，你和小烬各持27张'
}

const emit = defineEmits(['exit'])
initGame()
</script>

<template>
  <section class="poker-game">
    <header class="game-header">
      <strong>{{ statusText }}</strong>
      <button class="control-btn" @click="initGame">重新开始</button>
      <button class="control-btn exit" @click="emit('exit')">退出游戏</button>
    </header>
    <div class="game-info">
      <span>你：{{ playerHand.length }} 张</span>
      <span>小烬：{{ aiHand.length }} 张</span>
      <span v-if="tablePlay">桌面：{{ tablePlay.type.name }}</span>
      <span v-else>桌面：自由出牌</span>
    </div>
    <section class="opponent">
      <h3>小烬 · {{ aiHand.length }} 张</h3>
      <div class="back-row"><span v-for="n in Math.min(aiHand.length, 18)" :key="n" class="card back">✦</span></div>
    </section>
    <div class="table-area">
      <div v-if="tablePlay" class="table-play">
        <span class="table-label">{{ tablePlay.player === 1 ? '你的出牌' : '小烬的出牌' }} · {{ tablePlay.type.name }}</span>
        <span v-for="card in tablePlay.cards" :key="card.id" class="card face mini" :class="{ red: card.suit === '♥' || card.suit === '♦' }">{{ cardText(card) }}</span>
      </div>
      <span v-else class="table-empty">等待出牌</span>
    </div>
    <section class="player-hand">
      <h3>你 · {{ playerHand.length }} 张</h3>
      <div class="cards">
        <button v-for="card in playerHand" :key="card.id" class="card face" :class="{ selected: selectable(card), red: card.suit === '♥' || card.suit === '♦' }" @click="toggleCard(card)">{{ cardText(card) }}</button>
      </div>
    </section>
    <div class="actions">
      <button class="control-btn primary" :disabled="currentPlayer !== 1 || gameOver || aiThinking" @click="submitPlay">出牌</button>
      <button class="control-btn" :disabled="currentPlayer !== 1 || !tablePlay || gameOver || aiThinking" @click="pass">不要</button>
      <button class="control-btn" :disabled="selectedIds.length === 0 || gameOver || aiThinking" @click="clearSelection">清除选择</button>
    </div>
    <p class="rules">支持单牌、对子、三张、顺子、连对、三带二、炸弹、王炸；炸弹可压普通牌。</p>
  </section>
</template>

<style scoped>
.poker-game { width: 100%; max-width: 960px; color: #e9f7fa; padding: 16px; box-sizing: border-box; }
.game-header, .game-info, .actions { display: flex; align-items: center; justify-content: center; gap: 10px; flex-wrap: wrap; }
.game-header { margin-bottom: 12px; }
.game-header strong { color: #6ce4df; min-width: 260px; text-align: center; }
.game-info { color: #91bdc3; font-size: .82rem; margin-bottom: 16px; }
.control-btn { background: transparent; border: 1px solid #387f83; border-radius: 4px; color: #b8f2e9; padding: 7px 12px; cursor: pointer; font-family: inherit; }
.control-btn:hover:not(:disabled) { background: #15383d; }
.control-btn:disabled { cursor: default; opacity: .4; }
.control-btn.exit { color: #ff9292; border-color: #854c57; }
.control-btn.primary { color: #75ffff; border-color: #75ffff; }
.opponent h3, .player-hand h3 { color: #9bbfc4; font-size: .9rem; font-weight: 500; margin: 0 0 9px; }
.back-row { display: flex; flex-wrap: wrap; justify-content: center; gap: 3px; min-height: 56px; }
.table-area { min-height: 115px; display: flex; align-items: center; justify-content: center; border-top: 1px solid rgba(90, 200, 190, .15); border-bottom: 1px solid rgba(90, 200, 190, .15); margin: 16px 0; }
.table-play { display: flex; align-items: center; justify-content: center; flex-wrap: wrap; gap: 6px; }
.table-label, .table-empty { color: #86bfc0; font-size: .8rem; margin-right: 8px; }
.cards { display: flex; justify-content: center; flex-wrap: wrap; gap: 6px; min-height: 100px; }
.card { box-sizing: border-box; }
.card.back { width: 29px; height: 48px; border: 1px solid #4fb7b4; border-radius: 4px; background: repeating-linear-gradient(135deg, #17454b 0 5px, #1d5558 5px 10px); color: #c5ffed; }
.card.face { width: 54px; height: 76px; border: 1px solid #c8d9d5; border-radius: 5px; background: #f2f5ef; color: #183d40; cursor: pointer; font-weight: 700; font-size: 1rem; }
.card.face:hover { transform: translateY(-5px); }
.card.face.selected { transform: translateY(-10px); border-color: #6ce4df; box-shadow: 0 0 10px rgba(108, 228, 223, .55); }
.card.face.red { color: #a33255; }
.card.face.mini { width: 43px; height: 60px; cursor: default; display: flex; align-items: center; justify-content: center; }
.card.face.mini:hover { transform: none; }
.rules { color: #71989e; font-size: .76rem; text-align: center; margin: 16px 0 0; }
@media (max-width: 540px) { .poker-game { padding: 10px 2px; } .card.face { width: 40px; height: 59px; font-size: .82rem; } .card.face.mini { width: 34px; height: 50px; } .card.back { width: 22px; height: 38px; } }
</style>
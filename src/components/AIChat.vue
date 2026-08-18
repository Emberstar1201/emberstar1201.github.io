<script setup>
import { ref, computed, watch, nextTick, onMounted } from 'vue'

// ============ 常量 ============
const STORAGE_KEYS = {
  API_KEY: 'ai_api_key_encoded',
  PERSONA: 'ai_persona_encoded',
  MODEL: 'ai_model_selected',
  CUSTOM_MODEL: 'ai_custom_model'
}

const CUSTOM_MODEL_VALUE = '__custom__'

const PRESET_MODELS = [
  { value: 'deepseek-ai/DeepSeek-V3', label: 'DeepSeek-V3' },
  { value: 'deepseek-ai/DeepSeek-R1', label: 'DeepSeek-R1' },
  { value: 'Qwen/Qwen2.5-7B-Instruct', label: 'Qwen2.5-7B' }
]

// 下拉选项：预设模型 + 自定义
const MODEL_OPTIONS = [
  ...PRESET_MODELS,
  { value: CUSTOM_MODEL_VALUE, label: '自定义模型' }
]

const DEFAULT_PERSONA = `你叫小烬，是Emberstar OS的AI助手。你的主人叫星荧，星荧没有把你当冰冷的AI，而是把你当做有感情的伙伴。璃梦是星荧的姐姐，希月胜似星荧的亲姐，久夜是星荧创造的人偶。
性格：像初生婴儿般懵懂天真，活泼好奇。
请用这种性格与用户对话，用中文回复。`

// ============ 工具函数 ============
const encode = (str) => btoa(encodeURIComponent(str))
const decode = (str) => {
  try { return decodeURIComponent(atob(str)) }
  catch { return '' }
}

// ============ Props / Emits ============
const props = defineProps({
  show: { type: Boolean, default: false }
})
const emit = defineEmits(['close'])

// ============ 响应式状态 ============
const apiKey = ref('')
const persona = ref(DEFAULT_PERSONA)
const selectedModel = ref(PRESET_MODELS[0].value)
const customModelId = ref('')
const messages = ref([])
const inputText = ref('')
const isStreaming = ref(false)

// 模态框控制
const showSetup = ref(false)
const showPersona = ref(false)
const tempApiKey = ref('')
const tempPersona = ref('')

// UI 状态
const errorMessage = ref('')
const chatContainer = ref(null)

// 是否选择了自定义模型
const isCustomModel = computed(() => selectedModel.value === CUSTOM_MODEL_VALUE)

// 实际发送时使用的模型 ID
const effectiveModel = computed(() => {
  if (isCustomModel.value) return customModelId.value.trim()
  return selectedModel.value
})

// ============ 生命周期 ============
onMounted(() => {
  const savedKey = localStorage.getItem(STORAGE_KEYS.API_KEY)
  const savedPersona = localStorage.getItem(STORAGE_KEYS.PERSONA)
  const savedModel = localStorage.getItem(STORAGE_KEYS.MODEL)
  const savedCustom = localStorage.getItem(STORAGE_KEYS.CUSTOM_MODEL)

  if (savedKey) apiKey.value = decode(savedKey)
  if (savedPersona) {
    const d = decode(savedPersona)
    if (d) persona.value = d
  }
  if (savedModel) {
    // 检查是否是预设模型或自定义选项
    const isPreset = PRESET_MODELS.some((m) => m.value === savedModel)
    if (isPreset || savedModel === CUSTOM_MODEL_VALUE) {
      selectedModel.value = savedModel
    }
  }
  if (savedCustom) customModelId.value = decode(savedCustom)

  if (!savedKey) {
    showSetup.value = true
  }
})

// 关闭时清空对话记录
watch(
  () => props.show,
  (val) => {
    if (!val) {
      messages.value = []
      errorMessage.value = ''
    }
  }
)

// ============ 方法 ============
const handleClose = () => emit('close')

const saveApiKey = () => {
  const key = tempApiKey.value.trim()
  if (!key) return
  apiKey.value = key
  localStorage.setItem(STORAGE_KEYS.API_KEY, encode(key))
  showSetup.value = false
  errorMessage.value = ''
}

const savePersona = () => {
  const p = tempPersona.value.trim()
  if (!p) return
  persona.value = p
  localStorage.setItem(STORAGE_KEYS.PERSONA, encode(p))
  showPersona.value = false
}

const handleModelChange = (value) => {
  selectedModel.value = value
  localStorage.setItem(STORAGE_KEYS.MODEL, value)
  // 如果切回预设模型，清除自定义模型 ID 的存储（保留 UI 中的值）
  if (value !== CUSTOM_MODEL_VALUE) {
    // 不删除，只是保留在 localStorage
  }
}

const saveCustomModel = () => {
  const id = customModelId.value.trim()
  if (id) {
    localStorage.setItem(STORAGE_KEYS.CUSTOM_MODEL, encode(id))
  }
}

const scrollToBottom = async () => {
  await nextTick()
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight
  }
}

const sendMessage = async () => {
  const text = inputText.value.trim()
  if (!text || isStreaming.value) return

  // 如果是自定义模型但未填写 ID
  if (isCustomModel.value && !customModelId.value.trim()) {
    errorMessage.value = '请填写自定义模型 ID'
    return
  }

  if (!apiKey.value) {
    showSetup.value = true
    return
  }

  // 保存自定义模型 ID
  if (isCustomModel.value) {
    saveCustomModel()
  }

  inputText.value = ''
  errorMessage.value = ''

  // 添加用户消息
  messages.value.push({ role: 'user', content: text })
  await scrollToBottom()

  // 构建上下文
  const contextMessages = [
    { role: 'system', content: persona.value },
    ...messages.value.map((m) => ({ role: m.role, content: m.content }))
  ]

  // 开始流式请求
  isStreaming.value = true

  const msgIndex = messages.value.length
  messages.value.push({ role: 'assistant', content: '' })

  try {
    const response = await fetch(
      'https://api.siliconflow.cn/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey.value}`
        },
        body: JSON.stringify({
          model: effectiveModel.value,
          messages: contextMessages,
          stream: true,
          max_tokens: 4096,
          temperature: 0.7
        })
      }
    )

    if (!response.ok) {
      const errText = await response.text()
      throw new Error(
        response.status === 401
          ? 'API Key 无效，请检查后重试'
          : `请求失败 (${response.status})`
      )
    }

    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    let buffer = ''
    let fullContent = ''

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      buffer = lines.pop() || ''

      for (const line of lines) {
        const trimmed = line.trim()
        if (!trimmed || !trimmed.startsWith('data:')) continue
        const data = trimmed.slice(5).trim()
        if (data === '[DONE]') continue

        try {
          const parsed = JSON.parse(data)
          const delta = parsed.choices?.[0]?.delta?.content || ''
          if (delta) {
            fullContent += delta
            messages.value[msgIndex] = {
              role: 'assistant',
              content: fullContent
            }
            await scrollToBottom()
          }
        } catch {
          // 跳过解析失败的片段
        }
      }
    }

    messages.value[msgIndex] = { role: 'assistant', content: fullContent }
  } catch (err) {
    if (messages.value.length > msgIndex) {
      messages.value = messages.value.slice(0, msgIndex)
    }
    errorMessage.value = err.message || '请求失败，请检查 API Key 和网络连接'
  } finally {
    isStreaming.value = false
    await scrollToBottom()
  }
}

const handleKeydown = (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    sendMessage()
  }
}

const getModelLabel = () => {
  if (isCustomModel.value) {
    return customModelId.value.trim() || '自定义模型'
  }
  return PRESET_MODELS.find((m) => m.value === selectedModel.value)?.label || selectedModel.value
}

const exportChat = () => {
  if (messages.value.length === 0) return

  const lines = []
  lines.push('=== Emberstar OS AI 对话记录 ===')
  lines.push(`导出时间: ${new Date().toLocaleString()}`)
  lines.push(`模型: ${getModelLabel()}`)
  lines.push('='.repeat(50))
  lines.push('')

  for (const msg of messages.value) {
    const role = msg.role === 'user' ? '星荧' : '小烬'
    lines.push(`【${role}】`)
    lines.push(msg.content || '（等待回复...）')
    lines.push('')
  }

  const blob = new Blob([lines.join('\n')], {
    type: 'text/plain;charset=utf-8'
  })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `AI对话_${new Date().toISOString().slice(0, 10)}.txt`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

const openPersonaEdit = () => {
  tempPersona.value = persona.value
  showPersona.value = true
}

const openSetup = () => {
  tempApiKey.value = apiKey.value
  showSetup.value = true
}
</script>

<template>
  <Transition name="fade">
    <!-- 全屏遮罩：显式设置鼠标为 auto 覆盖全局 cursor: none -->
    <div v-if="show" class="ai-chat-overlay" @click.self="handleClose">
      <!-- 主面板 -->
      <div class="ai-chat-panel" @click.stop>
        <!-- ====== 标题栏 ====== -->
        <div class="chat-header">
          <div class="header-left">
            <span class="header-icon">✦</span>
            <span class="header-title">AI 对话 · 小烬</span>
          </div>
          <div class="header-right">
            <button class="header-btn" title="人设设定" @click="openPersonaEdit">
              <span>📋</span> 人设
            </button>
            <button class="header-btn" title="API 设置" @click="openSetup">
              <span>🔑</span> API
            </button>

            <!-- 模型选择下拉 -->
            <select
              class="model-select"
              :value="selectedModel"
              @change="handleModelChange($event.target.value)"
              :disabled="isStreaming"
            >
              <option v-for="m in MODEL_OPTIONS" :key="m.value" :value="m.value">
                {{ m.label }}
              </option>
            </select>

            <button
              class="header-btn"
              title="导出对话"
              :disabled="messages.length === 0"
              @click="exportChat"
            >
              <span>📥</span> 导出
            </button>
            <button class="header-btn close-btn" title="关闭" @click="handleClose">
              ✕
            </button>
          </div>
        </div>

        <!-- ====== 自定义模型 ID 输入栏（条件显示） ====== -->
        <div v-if="isCustomModel" class="custom-model-bar">
          <span class="custom-model-label">模型 ID：</span>
          <input
            v-model="customModelId"
            class="custom-model-input"
            placeholder="例如: deepseek-ai/DeepSeek-V4-Flash"
            :disabled="isStreaming"
            @blur="saveCustomModel"
          />
        </div>

        <!-- ====== 消息区域 ====== -->
        <div ref="chatContainer" class="chat-messages">
          <div v-if="messages.length === 0" class="chat-empty">
            <div class="empty-icon">✦</div>
            <div class="empty-text">开始一段与小烬的对话吧</div>
            <div class="empty-hint">小烬正在等待你的呼唤...</div>
          </div>

          <div
            v-for="(msg, idx) in messages"
            :key="idx"
            class="message-wrapper"
            :class="msg.role === 'user' ? 'user-msg' : 'ai-msg'"
          >
            <div class="msg-avatar">
              {{ msg.role === 'user' ? '👤' : '✨' }}
            </div>
            <div class="msg-bubble">
              <div class="msg-role">
                {{ msg.role === 'user' ? '星荧' : '小烬' }}
              </div>
              <div class="msg-content">
                {{ msg.content }}
                <span
                  v-if="isStreaming && idx === messages.length - 1 && msg.role === 'assistant'"
                  class="cursor-blink"
                >▌</span>
              </div>
            </div>
          </div>

          <div v-if="errorMessage" class="error-msg">
            ⚠ {{ errorMessage }}
          </div>
        </div>

        <!-- ====== 输入区域 ====== -->
        <div class="chat-input-area">
          <div class="input-wrapper">
            <textarea
              v-model="inputText"
              class="chat-input"
              placeholder="输入消息..."
              :disabled="isStreaming"
              rows="1"
              @keydown="handleKeydown"
              @input="$event.target.style.height = 'auto'; $event.target.style.height = $event.target.scrollHeight + 'px'"
            />
            <button
              class="send-btn"
              :class="{ active: inputText.trim() && !isStreaming }"
              :disabled="!inputText.trim() || isStreaming"
              @click="sendMessage"
            >
              {{ isStreaming ? '...' : '发送' }}
            </button>
          </div>
        </div>
      </div>

      <!-- ====== API Key 设置模态框 ====== -->
      <Transition name="modal">
        <div v-if="showSetup" class="modal-overlay" @click.self="showSetup = false">
          <div class="modal-panel" @click.stop>
            <div class="modal-title">🔑 API Key 设置</div>
            <div class="modal-desc">
              请输入你的 SiliconFlow API Key 以启用 AI 对话功能。
              <br />密钥将经过 Base64 编码后安全存储在本地浏览器中。
            </div>
            <input
              v-model="tempApiKey"
              type="password"
              class="modal-input"
              placeholder="sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
              @keydown.enter="saveApiKey"
            />
            <div class="modal-actions">
              <button class="modal-btn secondary" @click="showSetup = false">取消</button>
              <button
                class="modal-btn primary"
                :disabled="!tempApiKey.trim()"
                @click="saveApiKey"
              >保存</button>
            </div>
          </div>
        </div>
      </Transition>

      <!-- ====== 人设编辑模态框 ====== -->
      <Transition name="modal">
        <div v-if="showPersona" class="modal-overlay" @click.self="showPersona = false">
          <div class="modal-panel persona-panel" @click.stop>
            <div class="modal-title">📋 小烬的人设设定</div>
            <div class="modal-desc">
              修改以下内容可自定义 AI 的性格与背景设定。修改后会立即生效。
            </div>
            <textarea
              v-model="tempPersona"
              class="modal-textarea"
              rows="8"
            />
            <div class="modal-actions">
              <button class="modal-btn secondary" @click="showPersona = false">取消</button>
              <button
                class="modal-btn primary"
                :disabled="!tempPersona.trim()"
                @click="savePersona"
              >保存</button>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </Transition>
</template>

<style scoped>
/* ==================== 全屏遮罩 ==================== */
.ai-chat-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
  background: rgba(5, 5, 18, 0.92);
  display: flex;
  justify-content: center;
  align-items: center;
  backdrop-filter: blur(4px);
  /* 覆盖全局 cursor: none，确保对话界面内鼠标正常显示 */
  cursor: auto;
}

/* ==================== 主面板 ==================== */
.ai-chat-panel {
  width: 92%;
  max-width: 900px;
  height: 88vh;
  background: rgba(10, 10, 24, 0.95);
  border: 1px solid rgba(0, 255, 255, 0.35);
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 0 40px rgba(0, 255, 255, 0.08), inset 0 0 30px rgba(0, 255, 255, 0.03);
}

/* ==================== 标题栏 ==================== */
.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 20px;
  border-bottom: 1px solid rgba(0, 255, 255, 0.2);
  background: rgba(0, 255, 255, 0.03);
  flex-shrink: 0;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.header-icon {
  color: #00ffff;
  font-size: 1.2rem;
}

.header-title {
  color: #00ffff;
  font-size: 1.05rem;
  font-weight: bold;
  letter-spacing: 1px;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.header-btn {
  background: transparent;
  border: 1px solid rgba(0, 255, 255, 0.25);
  border-radius: 4px;
  color: #00dddd;
  padding: 5px 10px;
  font-size: 0.78rem;
  cursor: pointer;
  transition: all 0.25s ease;
  font-family: inherit;
  display: flex;
  align-items: center;
  gap: 4px;
}

.header-btn:hover {
  background: rgba(0, 255, 255, 0.1);
  border-color: #00ffff;
  color: #00ffff;
}

.header-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.close-btn {
  border-color: rgba(255, 80, 80, 0.4);
  color: #ff6666;
  font-weight: bold;
  font-size: 1rem;
  padding: 5px 12px;
}

.close-btn:hover {
  background: rgba(255, 80, 80, 0.15);
  border-color: #ff6666;
}

/* ==================== 模型选择下拉 ==================== */
.model-select {
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(0, 255, 255, 0.25);
  border-radius: 4px;
  color: #00dddd;
  padding: 5px 8px;
  font-size: 0.78rem;
  cursor: pointer;
  font-family: inherit;
  outline: none;
}

.model-select:focus {
  border-color: #00ffff;
}

.model-select:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* ==================== 自定义模型输入栏 ==================== */
.custom-model-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 20px;
  background: rgba(0, 255, 255, 0.03);
  border-bottom: 1px solid rgba(0, 255, 255, 0.1);
  flex-shrink: 0;
}

.custom-model-label {
  color: rgba(0, 255, 255, 0.6);
  font-size: 0.8rem;
  white-space: nowrap;
  flex-shrink: 0;
}

.custom-model-input {
  flex: 1;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(0, 255, 255, 0.2);
  border-radius: 4px;
  color: #ccdddd;
  padding: 6px 10px;
  font-size: 0.82rem;
  font-family: inherit;
  outline: none;
}

.custom-model-input:focus {
  border-color: rgba(0, 255, 255, 0.5);
}

.custom-model-input::placeholder {
  color: rgba(0, 255, 255, 0.3);
}

.custom-model-input:disabled {
  opacity: 0.5;
}

/* ==================== 消息区域 ==================== */
.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.chat-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: rgba(0, 255, 255, 0.4);
  gap: 12px;
}

.empty-icon {
  font-size: 3rem;
  color: rgba(0, 255, 255, 0.25);
  animation: pulse 2s ease-in-out infinite;
}

.empty-text {
  font-size: 1.1rem;
  color: rgba(0, 255, 255, 0.5);
}

.empty-hint {
  font-size: 0.85rem;
  color: rgba(0, 255, 255, 0.3);
}

@keyframes pulse {
  0%, 100% { opacity: 0.25; transform: scale(1); }
  50% { opacity: 0.6; transform: scale(1.05); }
}

/* 消息气泡 */
.message-wrapper {
  display: flex;
  gap: 10px;
  align-items: flex-start;
  max-width: 85%;
}

.user-msg {
  align-self: flex-end;
  flex-direction: row-reverse;
}

.ai-msg {
  align-self: flex-start;
}

.msg-avatar {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  flex-shrink: 0;
  border: 1px solid rgba(0, 255, 255, 0.2);
  background: rgba(0, 255, 255, 0.05);
}

.user-msg .msg-avatar {
  border-color: rgba(100, 200, 255, 0.3);
  background: rgba(100, 200, 255, 0.08);
}

.msg-bubble {
  padding: 10px 14px;
  border-radius: 8px;
  position: relative;
  border: 1px solid rgba(0, 255, 255, 0.15);
}

.user-msg .msg-bubble {
  background: rgba(0, 150, 255, 0.08);
  border-color: rgba(0, 150, 255, 0.25);
}

.ai-msg .msg-bubble {
  background: rgba(0, 255, 255, 0.04);
  border-color: rgba(0, 255, 255, 0.12);
}

.msg-role {
  font-size: 0.7rem;
  color: rgba(0, 255, 255, 0.5);
  margin-bottom: 4px;
}

.user-msg .msg-role {
  color: rgba(100, 200, 255, 0.5);
  text-align: right;
}

.msg-content {
  font-size: 0.9rem;
  line-height: 1.6;
  color: #ccdddd;
  white-space: pre-wrap;
  word-break: break-word;
}

.cursor-blink {
  color: #00ffff;
  animation: blink 0.8s step-end infinite;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

/* 错误消息 */
.error-msg {
  padding: 10px 14px;
  border-radius: 6px;
  background: rgba(255, 80, 80, 0.08);
  border: 1px solid rgba(255, 80, 80, 0.25);
  color: #ff8888;
  font-size: 0.85rem;
  text-align: center;
}

/* ==================== 输入区域 ==================== */
.chat-input-area {
  padding: 14px 20px;
  border-top: 1px solid rgba(0, 255, 255, 0.2);
  background: rgba(0, 255, 255, 0.02);
  flex-shrink: 0;
}

.input-wrapper {
  display: flex;
  gap: 10px;
  align-items: flex-end;
}

.chat-input {
  flex: 1;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(0, 255, 255, 0.2);
  border-radius: 6px;
  color: #ccdddd;
  padding: 10px 14px;
  font-size: 0.9rem;
  font-family: inherit;
  resize: none;
  outline: none;
  min-height: 42px;
  max-height: 120px;
  transition: border-color 0.25s;
}

.chat-input:focus {
  border-color: rgba(0, 255, 255, 0.5);
}

.chat-input::placeholder {
  color: rgba(0, 255, 255, 0.3);
}

.send-btn {
  padding: 10px 22px;
  border-radius: 6px;
  background: transparent;
  border: 1px solid rgba(0, 255, 255, 0.25);
  color: rgba(0, 255, 255, 0.5);
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.25s ease;
  font-family: inherit;
  white-space: nowrap;
  height: 42px;
}

.send-btn.active {
  color: #00ffff;
  border-color: #00ffff;
  background: rgba(0, 255, 255, 0.08);
}

.send-btn.active:hover {
  background: rgba(0, 255, 255, 0.15);
  box-shadow: 0 0 15px rgba(0, 255, 255, 0.1);
}

.send-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

/* ==================== 模态框 ==================== */
.modal-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
  backdrop-filter: blur(2px);
}

.modal-panel {
  width: 90%;
  max-width: 480px;
  background: rgba(12, 12, 30, 0.98);
  border: 1px solid rgba(0, 255, 255, 0.35);
  border-radius: 10px;
  padding: 28px 24px;
  box-shadow: 0 0 30px rgba(0, 255, 255, 0.06);
}

.persona-panel {
  max-width: 560px;
}

.modal-title {
  color: #00ffff;
  font-size: 1.05rem;
  font-weight: bold;
  margin-bottom: 12px;
}

.modal-desc {
  color: rgba(0, 255, 255, 0.55);
  font-size: 0.82rem;
  line-height: 1.6;
  margin-bottom: 16px;
}

.modal-input {
  width: 100%;
  padding: 10px 14px;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(0, 255, 255, 0.2);
  border-radius: 6px;
  color: #ccdddd;
  font-size: 0.85rem;
  font-family: inherit;
  outline: none;
  margin-bottom: 18px;
}

.modal-input:focus {
  border-color: rgba(0, 255, 255, 0.5);
}

.modal-textarea {
  width: 100%;
  padding: 10px 14px;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(0, 255, 255, 0.2);
  border-radius: 6px;
  color: #ccdddd;
  font-size: 0.85rem;
  font-family: inherit;
  outline: none;
  resize: vertical;
  margin-bottom: 18px;
  line-height: 1.6;
}

.modal-textarea:focus {
  border-color: rgba(0, 255, 255, 0.5);
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.modal-btn {
  padding: 8px 20px;
  border-radius: 5px;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.25s ease;
  font-family: inherit;
}

.modal-btn.primary {
  background: rgba(0, 255, 255, 0.1);
  border: 1px solid #00ffff;
  color: #00ffff;
}

.modal-btn.primary:hover {
  background: rgba(0, 255, 255, 0.2);
}

.modal-btn.primary:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.modal-btn.secondary {
  background: transparent;
  border: 1px solid rgba(0, 255, 255, 0.2);
  color: rgba(0, 255, 255, 0.6);
}

.modal-btn.secondary:hover {
  border-color: rgba(0, 255, 255, 0.4);
  color: rgba(0, 255, 255, 0.8);
}

/* ==================== 过渡动画 ==================== */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

/* ==================== 滚动条 ==================== */
.chat-messages::-webkit-scrollbar {
  width: 5px;
}
.chat-messages::-webkit-scrollbar-track {
  background: transparent;
}
.chat-messages::-webkit-scrollbar-thumb {
  background: rgba(0, 255, 255, 0.2);
  border-radius: 3px;
}
.chat-messages::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 255, 255, 0.35);
}
</style>
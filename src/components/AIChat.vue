<script setup>
import { ref, computed, watch, nextTick, onMounted } from 'vue'

// ============ 常量 ============
const STORAGE_KEYS = {
  API_KEY: 'ai_api_key_encoded',
  API_URL: 'ai_api_url',
  PROVIDER: 'ai_provider',
  PERSONA: 'ai_persona_encoded',
  MODEL: 'ai_model_selected',
  CUSTOM_MODELS: 'ai_custom_models'
}

// ============ 供应商定义 ============
// 每个供应商都有：预设 API 地址 + 预设常用模型
// 选 "自定义供应商" 时，地址和模型都由用户自己填
const PROVIDERS = [
  {
    id: 'siliconflow',
    name: '硅基流动 SiliconFlow',
    defaultUrl: 'https://api.siliconflow.cn/v1/chat/completions',
    presetModels: [
      { value: 'deepseek-ai/DeepSeek-V3',    label: 'DeepSeek-V3' },
      { value: 'deepseek-ai/DeepSeek-R1',    label: 'DeepSeek-R1' },
      { value: 'deepseek-ai/DeepSeek-V4-Flash', label: 'DeepSeek-V4-Flash' },
      { value: 'Qwen/Qwen2.5-7B-Instruct',   label: 'Qwen2.5-7B' }
    ],
    modelPlaceholder: 'deepseek-ai/DeepSeek-V4-Flash'
  },
  {
    id: 'openai',
    name: 'OpenAI',
    defaultUrl: 'https://api.openai.com/v1/chat/completions',
    presetModels: [
      { value: 'gpt-4o',         label: 'GPT-4o' },
      { value: 'gpt-4o-mini',    label: 'GPT-4o-mini' },
      { value: 'gpt-4.1',        label: 'GPT-4.1' },
      { value: 'o3-mini',        label: 'o3-mini' },
      { value: 'gpt-4',          label: 'GPT-4' }
    ],
    modelPlaceholder: 'gpt-4o'
  },
  {
    id: 'baidu',
    name: '百度千帆 Qianfan',
    defaultUrl: 'https://qianfan.baidubce.com/v2/chat/completions',
    presetModels: [
      { value: 'ernie-4.0-turbo', label: 'ERNIE-4.0 Turbo' },
      { value: 'ernie-3.5-8k',    label: 'ERNIE-3.5' }
    ],
    modelPlaceholder: 'ernie-4.0-turbo'
  },
  {
    id: 'ali',
    name: '阿里通义 DashScope',
    defaultUrl: 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions',
    presetModels: [
      { value: 'qwen-plus',   label: '通义千问 Plus' },
      { value: 'qwen-turbo',  label: '通义千问 Turbo' },
      { value: 'qwen-max',    label: '通义千问 Max' },
      { value: 'qwen-long',   label: '通义千问 Long' }
    ],
    modelPlaceholder: 'qwen-plus'
  },
  {
    id: 'custom',
    name: '自定义供应商',
    defaultUrl: '',  // 自己填
    presetModels: [],
    modelPlaceholder: '例如 my-custom-model-v1'
  }
]

// 默认用硅基流动（兼容老用户）
const DEFAULT_PROVIDER = PROVIDERS[0]

const DEFAULT_PERSONA = `你叫小烬，是Emberstar OS的AI助手。你的主人叫星荧，星荧没有把你当冰冷的AI，而是把你当做有感情的伙伴。璃梦是星荧的姐姐，希月胜似星荧的亲姐，久夜是星荧创造的人偶。
性格：像初生婴儿般懵懂天真，活泼好奇。
请用这种性格与用户对话，用中文回复。`

// ============ 工具函数 ============
const encode = (str) => btoa(encodeURIComponent(str))
const decode = (str) => {
  try { return decodeURIComponent(atob(str)) }
  catch { return '' }
}

// 根据 id 找供应商
const findProvider = (id) => PROVIDERS.find(p => p.id === id) || DEFAULT_PROVIDER

// ============ Props / Emits ============
const props = defineProps({
  show: { type: Boolean, default: false }
})
const emit = defineEmits(['close'])

// ============ 响应式状态 ============
const apiKey = ref('')
const apiUrl = ref('')
const selectedProvider = ref(DEFAULT_PROVIDER.id)   // 当前供应商 id
const persona = ref(DEFAULT_PERSONA)
const selectedModel = ref(DEFAULT_PROVIDER.presetModels[0]?.value || '')
const customModels = ref([]) // [{ id: 'xxx', label: 'xxx' }]
const messages = ref([])
const inputText = ref('')
const isStreaming = ref(false)

// 模态框控制
const showSetup = ref(false)
const showPersona = ref(false)
const showAddModel = ref(false)

// 设置面板里的临时值（点保存才真正写入）
const tempProvider = ref(DEFAULT_PROVIDER.id)
const tempApiUrl = ref('')
const tempApiKey = ref('')
const newModelId = ref('')

// UI 状态
const errorMessage = ref('')
const chatContainer = ref(null)

// 当前选中的供应商对象
const currentProvider = computed(() => findProvider(selectedProvider.value))
// 设置面板里临时选中的供应商对象
const tempProviderObj = computed(() => findProvider(tempProvider.value))

// 合并后的模型下拉列表：当前供应商预设模型 + 所有自定义模型
const modelOptions = computed(() => {
  const currentPresets = currentProvider.value.presetModels
  const customOpts = customModels.value.map(m => ({ value: m.id, label: m.label }))
  return [...currentPresets, ...customOpts]
})

// ============ 生命周期 ============
onMounted(() => {
  // 供应商（新增项，没存过就默认硅基流动）
  const savedProvider = localStorage.getItem(STORAGE_KEYS.PROVIDER)
  if (savedProvider) {
    selectedProvider.value = savedProvider
    tempProvider.value = savedProvider
  }

  // API 地址（新增项，没存过就用当前供应商的默认值）
  const savedUrl = localStorage.getItem(STORAGE_KEYS.API_URL)
  if (savedUrl) {
    apiUrl.value = savedUrl
  } else {
    apiUrl.value = findProvider(selectedProvider.value).defaultUrl
  }
  tempApiUrl.value = apiUrl.value

  // API Key（原有）
  const savedKey = localStorage.getItem(STORAGE_KEYS.API_KEY)
  if (savedKey) apiKey.value = decode(savedKey)
  tempApiKey.value = apiKey.value

  // Persona（原有）
  const savedPersona = localStorage.getItem(STORAGE_KEYS.PERSONA)
  if (savedPersona) {
    const d = decode(savedPersona)
    if (d) persona.value = d
  }

  // 自定义模型（原有）
  const savedCustoms = localStorage.getItem(STORAGE_KEYS.CUSTOM_MODELS)
  if (savedCustoms) {
    try {
      const parsed = JSON.parse(decode(savedCustoms))
      if (Array.isArray(parsed)) customModels.value = parsed
    } catch { /* ignore */ }
  }

  // 模型选择（原有）
  const savedModel = localStorage.getItem(STORAGE_KEYS.MODEL)
  if (savedModel) {
    const allValues = [
      ...findProvider(selectedProvider.value).presetModels.map(m => m.value),
      ...customModels.value.map(m => m.id)
    ]
    if (allValues.includes(savedModel)) {
      selectedModel.value = savedModel
    } else {
      // 存的模型不属于当前供应商，切回预设第一个
      selectedModel.value = findProvider(selectedProvider.value).presetModels[0]?.value || ''
    }
  } else {
    selectedModel.value = findProvider(selectedProvider.value).presetModels[0]?.value || ''
  }

  // 首次使用没有 Key 就弹设置
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

// 打开设置：把当前值灌入临时变量
const openSetup = () => {
  tempProvider.value = selectedProvider.value
  tempApiUrl.value = apiUrl.value
  tempApiKey.value = apiKey.value
  showSetup.value = true
}

// 设置面板里切换供应商：URL 跟着变（除非是自定义，自定义保持用户输入）
const onSetupProviderChange = (newProviderId) => {
  tempProvider.value = newProviderId
  const p = findProvider(newProviderId)
  // 如果不是自定义供应商，自动把 URL 替换成该供应商默认地址
  if (p.id !== 'custom') {
    tempApiUrl.value = p.defaultUrl
  }
}

// 保存设置
const saveSetup = () => {
  const key = tempApiKey.value.trim()
  const url = tempApiUrl.value.trim()
  const providerId = tempProvider.value.trim()

  if (!key) { errorMessage.value = '请填写 API Key'; return }
  if (!url)  { errorMessage.value = '请填写 API 地址'; return }

  apiKey.value = key
  apiUrl.value = url
  selectedProvider.value = providerId

  localStorage.setItem(STORAGE_KEYS.API_KEY, encode(key))
  localStorage.setItem(STORAGE_KEYS.API_URL, url)
  localStorage.setItem(STORAGE_KEYS.PROVIDER, providerId)

  // 如果切换了供应商，模型也重置成该供应商第一个预设
  const p = findProvider(providerId)
  if (p.presetModels.length > 0) {
    const oldVal = selectedModel.value
    const stillValid = [
      ...p.presetModels.map(m => m.value),
      ...customModels.value.map(m => m.id)
    ].includes(oldVal)
    if (!stillValid) {
      selectedModel.value = p.presetModels[0].value
      localStorage.setItem(STORAGE_KEYS.MODEL, selectedModel.value)
    }
  }

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

// 持久化自定义模型列表
const persistCustomModels = () => {
  localStorage.setItem(STORAGE_KEYS.CUSTOM_MODELS, encode(JSON.stringify(customModels.value)))
}

// 添加自定义模型
const addCustomModel = () => {
  const id = newModelId.value.trim()
  if (!id) return

  const exists = modelOptions.value.some(m => m.value === id)
  if (exists) {
    errorMessage.value = '该模型 ID 已存在'
    return
  }

  customModels.value.push({ id, label: id })
  persistCustomModels()
  selectedModel.value = id
  localStorage.setItem(STORAGE_KEYS.MODEL, id)
  showAddModel.value = false
  newModelId.value = ''
  errorMessage.value = ''
}

// 删除自定义模型
const removeCustomModel = (modelId) => {
  customModels.value = customModels.value.filter(m => m.id !== modelId)
  persistCustomModels()

  if (selectedModel.value === modelId) {
    const fallback = currentProvider.value.presetModels[0]?.value
    selectedModel.value = fallback || ''
    localStorage.setItem(STORAGE_KEYS.MODEL, selectedModel.value)
  }
}

const handleModelChange = (value) => {
  selectedModel.value = value
  localStorage.setItem(STORAGE_KEYS.MODEL, value)
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

  if (!apiKey.value || !apiUrl.value) {
    showSetup.value = true
    return
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
    // ✅ 这里不再写死硅基流动 URL，动态使用配置的地址
    const response = await fetch(
      apiUrl.value,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey.value}`
        },
        body: JSON.stringify({
          model: selectedModel.value,
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
          : `请求失败 (${response.status}) - ${errText.slice(0, 80)}`
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
    errorMessage.value = err.message || '请求失败，请检查 API 配置和网络连接'
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

const exportChat = () => {
  if (messages.value.length === 0) return

  const lines = []
  lines.push('=== Emberstar OS AI 对话记录 ===')
  lines.push(`导出时间: ${new Date().toLocaleString()}`)
  lines.push(`供应商: ${currentProvider.value.name}`)
  lines.push(`模型: ${selectedModel.value}`)
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

const openAddModel = () => {
  newModelId.value = ''
  showAddModel.value = true
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
              <span>🔧</span> 配置
            </button>

            <!-- 供应商小标签 -->
            <span v-if="currentProvider" class="provider-badge" :title="apiUrl">
              {{ currentProvider.name }}
            </span>

            <!-- 模型选择下拉 -->
            <select
              class="model-select"
              :value="selectedModel"
              @change="handleModelChange($event.target.value)"
              :disabled="isStreaming"
            >
              <optgroup :label="`${currentProvider.name} - 预设模型`">
                <option v-for="m in currentProvider.presetModels" :key="m.value" :value="m.value">
                  {{ m.label }}
                </option>
              </optgroup>
              <optgroup v-if="customModels.length > 0" label="自定义模型">
                <option v-for="m in customModels" :key="m.id" :value="m.id">
                  {{ m.label }}
                </option>
              </optgroup>
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

        <!-- ====== 自定义模型管理栏 ====== -->
        <div class="custom-model-bar">
          <span class="custom-model-label">已添加：</span>
          <div class="custom-model-tags">
            <span v-if="customModels.length === 0" class="no-custom-hint">无</span>
            <span
              v-for="m in customModels"
              :key="m.id"
              class="custom-tag"
              :class="{ active: selectedModel === m.id }"
              @click="selectedModel = m.id; localStorage.setItem(STORAGE_KEYS.MODEL, m.id)"
            >
              {{ m.label }}
              <button class="tag-remove" @click.stop="removeCustomModel(m.id)" title="删除此模型">✕</button>
            </span>
          </div>
          <button class="add-model-btn" @click="openAddModel">+ 添加自定义模型</button>
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

      <!-- ====== API / 供应商配置 模态框（重构后） ====== -->
      <Transition name="modal">
        <div v-if="showSetup" class="modal-overlay" @click.self="showSetup = false">
          <div class="modal-panel setup-panel" @click.stop>
            <div class="modal-title">🔧 AI 服务配置</div>
            <div class="modal-desc">
              选择一个预设供应商，或自定义 API 地址、Key 与模型。密钥将经过 Base64 编码后安全存储在本地浏览器中。
            </div>

            <!-- 供应商选择 -->
            <div class="form-row">
              <label class="form-label">服务供应商</label>
              <select
                class="modal-input"
                :value="tempProvider"
                @change="onSetupProviderChange($event.target.value)"
              >
                <option v-for="p in PROVIDERS" :key="p.id" :value="p.id">
                  {{ p.name }}
                </option>
              </select>
            </div>

            <!-- API 地址 -->
            <div class="form-row">
              <label class="form-label">API 地址
                <span v-if="tempProviderObj.defaultUrl" class="form-hint">（预设: {{ tempProviderObj.defaultUrl }}）</span>
              </label>
              <input
                v-model="tempApiUrl"
                type="text"
                class="modal-input"
                :placeholder="tempProviderObj.defaultUrl || 'https://your-api.com/v1/chat/completions'"
              />
            </div>

            <!-- API Key -->
            <div class="form-row">
              <label class="form-label">API Key</label>
              <input
                v-model="tempApiKey"
                type="password"
                class="modal-input"
                placeholder="sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                @keydown.enter="saveSetup"
              />
            </div>

            <!-- 错误提示 -->
            <div v-if="errorMessage" class="modal-inline-error">⚠ {{ errorMessage }}</div>

            <div class="modal-actions">
              <button class="modal-btn secondary" @click="showSetup = false">取消</button>
              <button
                class="modal-btn primary"
                :disabled="!tempApiKey.trim() || !tempApiUrl.trim()"
                @click="saveSetup"
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

      <!-- ====== 添加自定义模型模态框 ====== -->
      <Transition name="modal">
        <div v-if="showAddModel" class="modal-overlay" @click.self="showAddModel = false">
          <div class="modal-panel" @click.stop>
            <div class="modal-title">➕ 添加自定义模型</div>
            <div class="modal-desc">
              请输入完整的模型 ID，例如：<code>{{ currentProvider.modelPlaceholder }}</code>
            </div>
            <input
              v-model="newModelId"
              type="text"
              class="modal-input"
              :placeholder="currentProvider.modelPlaceholder"
              @keydown.enter="addCustomModel"
            />
            <div class="modal-actions">
              <button class="modal-btn secondary" @click="showAddModel = false">取消</button>
              <button
                class="modal-btn primary"
                :disabled="!newModelId.trim()"
                @click="addCustomModel"
              >确定</button>
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
  cursor: auto;
}

/* ==================== 主面板 ==================== */
.ai-chat-panel {
  width: 92%;
  max-width: 960px;
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
  gap: 8px;
  flex-wrap: wrap;
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

/* 供应商小标签 */
.provider-badge {
  display: inline-block;
  padding: 4px 10px;
  background: rgba(0, 170, 255, 0.08);
  border: 1px solid rgba(0, 170, 255, 0.3);
  border-radius: 4px;
  color: #66ccff;
  font-size: 0.72rem;
  white-space: nowrap;
  letter-spacing: 0.3px;
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
  max-width: 260px;
}

.model-select:focus {
  border-color: #00ffff;
}

.model-select:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* ==================== 自定义模型管理栏 ==================== */
.custom-model-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 20px;
  background: rgba(0, 255, 255, 0.02);
  border-bottom: 1px solid rgba(0, 255, 255, 0.1);
  flex-shrink: 0;
  flex-wrap: wrap;
}

.custom-model-label {
  color: rgba(0, 255, 255, 0.5);
  font-size: 0.78rem;
  white-space: nowrap;
  flex-shrink: 0;
}

.custom-model-tags {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  flex: 1;
}

.no-custom-hint {
  color: rgba(0, 255, 255, 0.25);
  font-size: 0.78rem;
}

.custom-tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 8px;
  background: rgba(0, 255, 255, 0.06);
  border: 1px solid rgba(0, 255, 255, 0.15);
  border-radius: 4px;
  color: rgba(0, 255, 255, 0.7);
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.custom-tag:hover {
  background: rgba(0, 255, 255, 0.1);
  border-color: rgba(0, 255, 255, 0.3);
}

.custom-tag.active {
  background: rgba(0, 255, 255, 0.12);
  border-color: #00ffff;
  color: #00ffff;
}

.tag-remove {
  background: none;
  border: none;
  color: rgba(255, 80, 80, 0.6);
  cursor: pointer;
  font-size: 0.7rem;
  padding: 0 2px;
  line-height: 1;
  transition: color 0.2s;
}

.tag-remove:hover {
  color: #ff6666;
}

.add-model-btn {
  background: transparent;
  border: 1px dashed rgba(0, 255, 255, 0.25);
  border-radius: 4px;
  color: rgba(0, 255, 255, 0.6);
  padding: 3px 10px;
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;
  white-space: nowrap;
}

.add-model-btn:hover {
  border-color: #00ffff;
  color: #00ffff;
  background: rgba(0, 255, 255, 0.06);
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
  padding: 24px;
  box-shadow: 0 0 30px rgba(0, 255, 255, 0.06);
}

/* 设置面板更宽一点，装得下多行表单 */
.setup-panel {
  max-width: 520px;
}

.persona-panel {
  max-width: 560px;
}

.modal-title {
  color: #00ffff;
  font-size: 1.05rem;
  font-weight: bold;
  margin-bottom: 10px;
}

.modal-desc {
  color: rgba(0, 255, 255, 0.55);
  font-size: 0.82rem;
  line-height: 1.6;
  margin-bottom: 16px;
}

/* ========= 表单行 ========= */
.form-row {
  margin-bottom: 14px;
}

.form-label {
  display: block;
  color: rgba(0, 255, 255, 0.75);
  font-size: 0.8rem;
  margin-bottom: 6px;
}

.form-hint {
  color: rgba(0, 255, 255, 0.35);
  font-size: 0.72rem;
  font-style: italic;
}

.modal-input {
  width: 100%;
  padding: 9px 12px;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(0, 255, 255, 0.2);
  border-radius: 6px;
  color: #ccdddd;
  font-size: 0.85rem;
  font-family: inherit;
  outline: none;
  box-sizing: border-box;
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
  box-sizing: border-box;
}

.modal-textarea:focus {
  border-color: rgba(0, 255, 255, 0.5);
}

.modal-inline-error {
  color: #ff8888;
  font-size: 0.8rem;
  margin-bottom: 12px;
  padding: 6px 10px;
  background: rgba(255, 80, 80, 0.08);
  border-radius: 4px;
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

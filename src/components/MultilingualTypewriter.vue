<script setup>
import { ref, onMounted, onUnmounted, defineEmits } from "vue";

// 定义组件事件（点击跳过登录）
const emit = defineEmits(['skipLogin']);

// 定义四种语言的文本
const languageTexts = [
  "HELLO WORLD!",       // 英语
  "你好，世界！",       // 中文
  "こんにちは、世界！", // 日语
  "안녕하세요, 세계! "   // 韩语
];

// 响应式变量：当前语言索引、当前显示的文本、打字机定时器
const currentLangIndex = ref(0);
const displayText = ref("");
let typewriterTimer = null;
let switchLangTimer = null;

/**
 * 打字机效果核心函数
 * @param {string} text - 要逐字显示的文本
 * @param {number} index - 当前输入到第几个字符
 */
const typewriter = (text, index = 0) => {
  // 清除之前的定时器，避免叠加
  if (typewriterTimer) clearTimeout(typewriterTimer);

  // 逐字拼接文本
  if (index < text.length) {
    displayText.value = text.substring(0, index + 1);
    // 控制打字速度（不同语言字符宽度不同，调整间隔）
    const speed = /[\u4e00-\u9fa5]/.test(text[index]) ? 150 : 100; // 中文字符稍慢
    typewriterTimer = setTimeout(() => {
      typewriter(text, index + 1);
    }, speed);
  } else {
    // 文本显示完成后，等待3秒切换下一种语言
    switchLangTimer = setTimeout(() => {
      switchToNextLanguage();
    }, 3000);
  }
};

/**
 * 切换到下一种语言
 */
const switchToNextLanguage = () => {
  // 更新语言索引（循环切换）
  currentLangIndex.value = (currentLangIndex.value + 1) % languageTexts.length;
  // 清空当前显示文本，开始新的打字机动画
  displayText.value = "";
  typewriter(languageTexts[currentLangIndex.value]);
};

/**
 * 初始化打字机效果
 */
const initTypewriter = () => {
  typewriter(languageTexts[currentLangIndex.value]);
};

/**
 * 处理跳过登录点击事件
 * @param {Event} event - 点击事件对象
 */
const handleSkipLogin = (event) => {
  event.stopPropagation(); // 阻止事件冒泡
  // 停止所有定时器，避免内存泄漏
  if (typewriterTimer) clearTimeout(typewriterTimer);
  if (switchLangTimer) clearTimeout(switchLangTimer);
  // 触发父组件事件
  emit('skipLogin');
};

// 组件挂载时启动打字机效果
onMounted(() => {
  initTypewriter();
});

// 组件卸载时清除定时器，防止内存泄漏
onUnmounted(() => {
  if (typewriterTimer) clearTimeout(typewriterTimer);
  if (switchLangTimer) clearTimeout(switchLangTimer);
});
</script>

<template>
  <div class="hello-world" id="helloWorld" @click="handleSkipLogin">
    {{ displayText }}
    <!-- 添加光标闪烁效果，增强打字机体验 -->
    <span class="cursor">|</span>
  </div>
</template>

<style scoped>
.hello-world {
  font-size: clamp(1.2rem, 5vw, 1.5rem);
  text-align: center;
  text-shadow: 0 0 5px #00ffff, 0 0 10px #00ffff;
  animation: flicker 2s ease-in-out infinite alternate;
  margin-bottom: 20px;
  color: #00aaff;
  word-break: break-word;
  transition: all 0.3s ease;
  position: relative;
}

.hello-world:hover {
  transform: scale(1.05);
  text-shadow: 0 0 10px #00ffff, 0 0 20px #00ffff, 0 0 30px #00ffff;
}

/* 打字机光标样式 */
.cursor {
  animation: blink 1s infinite;
  opacity: 1;
  margin-left: 2px;
}

/* 光标闪烁动画 */
@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

/* 闪烁动画 */
@keyframes flicker {
  0% { opacity: 0.8; }
  100% { opacity: 1; }
}
</style>
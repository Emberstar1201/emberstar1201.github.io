<template>
  <span>
    <template v-for="(part, index) in processedText" :key="index">
      <span 
        v-if="part.highlight" 
        class="highlight"
      >
        {{ part.text }}
      </span>
      <span v-else-if="part.warning" class="warning">
        {{ part.text }}
      </span>
      <span v-else>{{ part.text }}</span>
    </template>
  </span>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  text: {
    type: String,
    required: true
  },
  highlights: {
    type: Array,
    default: () => []
  }
});

const processedText = computed(() => {
  if (!props.highlights || props.highlights.length === 0) {
    return [{ text: props.text, highlight: false }];
  }

  const result = [];
  let remainingText = props.text;

  // 按照高亮文本在原文本中的位置排序
  const sortedHighlights = [...props.highlights].sort((a, b) => {
    const indexA = props.text.indexOf(a);
    const indexB = props.text.indexOf(b);
    return indexA - indexB;
  });

  sortedHighlights.forEach(highlight => {
    const index = remainingText.indexOf(highlight);
    if (index !== -1) {
      // 添加高亮前的普通文本
      if (index > 0) {
        result.push({
          text: remainingText.substring(0, index),
          highlight: false
        });
      }

      // 添加高亮文本
      result.push({
        text: highlight,
        highlight: true
      });

      // 更新剩余文本
      remainingText = remainingText.substring(index + highlight.length);
    }
  });

  // 添加剩余的普通文本
  if (remainingText) {
    result.push({
      text: remainingText,
      highlight: false
    });
  }

  return result;
});
</script>

<style scoped>
.highlight {
  color: #ffff66;
  font-weight: bold;
}

.warning {
  color: #ff6666;
}
</style>
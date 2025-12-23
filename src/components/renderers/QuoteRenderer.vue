<template>
  <div class="quote">
    <div v-if="content.multiline" v-html="formattedText" class="quote-text"></div>
    <div v-else class="quote-text">{{ content.text }}</div>
    <div v-if="content.author" class="quote-author">------ {{ content.author }}</div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  content: {
    type: Object,
    required: true
  }
});

const formattedText = computed(() => {
  return props.content.text;
});
</script>

<style scoped>
.quote {
  border-left: 3px solid #00ffff;
  padding-left: 15px;
  margin: 20px 0;
  font-style: italic;
  opacity: 0.9;
}

.quote-text {
  margin-bottom: 10px;
  line-height: 1.6;
}

.quote-author {
  text-align: right;
  font-size: 0.9rem;
  opacity: 0.8;
}
</style>
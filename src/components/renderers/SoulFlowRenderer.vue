<template>
  <div class="soul-flow">
    <p class="soul-flow-title">
      <HighlightedText :text="content.title" :highlights="content.highlights" />
    </p>
    <p v-for="(item, index) in content.items" :key="index" class="soul-flow-item">
      {{ item }}
    </p>
  </div>
</template>

<script setup>
import HighlightedText from './HighlightedText.vue';

defineProps({
  content: {
    type: Object,
    required: true
  }
});
</script>

<style scoped>
.soul-flow {
  position: relative;
  padding: 15px;
  margin: 15px 0;
  border: 1px dashed #70c070;
  border-radius: 5px;
  background: rgba(16, 48, 16, 0.2);
}

.soul-flow-title {
  font-weight: bold;
  margin-bottom: 10px;
  color: #e0ffa0;
}

.soul-flow-item {
  margin: 8px 0;
  line-height: 1.6;
}
</style>
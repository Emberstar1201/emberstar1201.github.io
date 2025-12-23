<template>
  <div class="log">
    <div v-for="(entry, index) in content.entries" :key="index" class="log-entry">
      <span class="log-label">{{ entry.label }}</span>
      <span class="log-value">
        <HighlightedText :text="entry.value" :highlights="entry.highlights" />
      </span>
    </div>
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
.log {
  font-family: monospace;
  background: rgba(0, 0, 0, 0.3);
  padding: 15px;
  border-radius: 5px;
  border: 1px solid rgba(0, 255, 255, 0.3);
}

.log-entry {
  margin: 8px 0;
  display: flex;
  align-items: flex-start;
}

.log-label {
  color: var(--primary-color, #00ffff);
  margin-right: 10px;
  min-width: 80px;
  font-weight: bold;
}

.log-value {
  color: #ffffff;
  flex: 1;
  word-break: break-word;
}
</style>
<template>
  <div class="dream-record">
    <h3 class="character-name">
      <HighlightedText :text="content.character" :highlights="content.highlights" />
    </h3>
    <div v-for="(entry, index) in content.entries" :key="index" class="dream-entry">
      <p v-if="entry.label" class="entry-label">
        <HighlightedText :text="entry.label" :highlights="entry.highlights" />
        <span v-if="entry.value">{{ entry.value }}</span>
      </p>
      <p v-else class="entry-value">
        <HighlightedText :text="entry.value" :highlights="entry.highlights" />
      </p>
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
.dream-record {
  margin: 20px 0;
  padding: 20px;
  border: 1px dashed #a366ff;
  border-radius: 10px;
  background: rgba(30, 15, 60, 0.4);
  box-shadow: 0 0 15px rgba(168, 119, 255, 0.2);
  transition: all 0.3s ease;
}

.character-name {
  color: #ffccff;
  margin: 0 0 15px 0;
  text-shadow: 0 0 5px #ff99ff;
}

.dream-entry {
  margin: 10px 0;
}

.entry-label {
  margin: 5px 0;
}

.entry-label span:first-child {
  color: #ffccff;
  font-weight: bold;
  text-shadow: 0 0 3px #ff99ff;
}

.entry-value {
  margin: 8px 0;
  line-height: 1.6;
}
</style>
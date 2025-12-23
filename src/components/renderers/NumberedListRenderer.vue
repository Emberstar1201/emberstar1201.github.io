<template>
  <ol class="numbered-list">
    <li v-for="(item, index) in content.items" :key="index" class="numbered-item">
      <HighlightedText :text="item.text" :highlights="item.highlights" />
    </li>
  </ol>
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
.numbered-list {
  margin: 15px 0;
  padding-left: 20px;
}

.numbered-item {
  margin: 8px 0;
}
</style>
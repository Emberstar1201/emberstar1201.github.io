<template>
  <ul class="list">
    <li v-for="(item, index) in content.items" :key="index" class="list-item">
      <HighlightedText :text="item.text" :highlights="item.highlights" />
    </li>
  </ul>
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
.list {
  margin: 15px 0;
  padding-left: 20px;
}

.list-item {
  margin: 8px 0;
}
</style>
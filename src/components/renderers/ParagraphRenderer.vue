<template>
  <p class="paragraph">
    <HighlightedText :text="content.text" :highlights="content.highlights" />
  </p>
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
.paragraph {
  margin: 10px 0;
}
</style>
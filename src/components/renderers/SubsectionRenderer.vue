<template>
  <div class="subsection">
    <h3>{{ content.title }}</h3>
    <template v-for="(item, index) in content.items" :key="index">
      <ParagraphRenderer 
        v-if="item.type === 'paragraph'" 
        :content="item" 
      />
      <HighlightedText 
        v-else
        :text="item.text" 
        :highlights="item.highlights" 
      />
    </template>
  </div>
</template>

<script setup>
import ParagraphRenderer from './ParagraphRenderer.vue';
import HighlightedText from './HighlightedText.vue';

defineProps({
  content: {
    type: Object,
    required: true
  }
});
</script>

<style scoped>
.subsection {
  margin: 20px 0;
}

.subsection h3 {
  color: #55ddff;
  margin: 15px 0 10px;
  font-size: 1.1rem;
}
</style>
<template>
  <ul class="nested-list">
    <li v-for="(item, index) in content.items" :key="index" class="nested-item">
      <HighlightedText :text="item.text" :highlights="item.highlights" />
      <ul v-if="item.subItems" class="sub-list">
        <li v-for="(subItem, subIndex) in item.subItems" :key="subIndex" class="sub-item">
          <HighlightedText :text="subItem" />
        </li>
      </ul>
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
.nested-list {
  margin: 15px 0;
  padding-left: 20px;
}

.nested-item {
  margin: 8px 0;
}

.sub-list {
  margin: 5px 0 5px 20px;
  padding-left: 15px;
}

.sub-item {
  margin: 5px 0;
}
</style>
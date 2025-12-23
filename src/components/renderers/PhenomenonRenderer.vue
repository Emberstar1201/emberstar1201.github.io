<template>
  <div class="phenomenon">
    <h4 v-if="content.title" class="phenomenon-title">
      <HighlightedText :text="content.title" :highlights="content.highlights" />
    </h4>
    
    <template v-for="(item, index) in processedItems" :key="index">
      <p v-if="item.label" class="phenomenon-label">
        <HighlightedText :text="item.label" :highlights="item.highlights" />
        <span v-if="item.value">{{ item.value }}</span>
      </p>
      
      <p v-else-if="item.type === 'warning'" class="phenomenon-warning">
        <HighlightedText :text="item.text" :highlights="item.highlights" />
      </p>
      
      <p v-else class="phenomenon-item">
        <HighlightedText :text="item" :highlights="content.highlights" />
      </p>
    </template>
    
    <ul v-if="content.subItems" class="phenomenon-subitems">
      <li v-for="(subItem, index) in content.subItems" :key="index" class="phenomenon-subitem">
        <HighlightedText 
          v-if="typeof subItem === 'object'"
          :text="subItem.text" 
          :highlights="subItem.highlights" 
          :class="{ warning: subItem.type === 'warning' }"
        />
        <HighlightedText v-else :text="subItem" />
      </li>
    </ul>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import HighlightedText from './HighlightedText.vue';

const props = defineProps({
  content: {
    type: Object,
    required: true
  }
});

const processedItems = computed(() => {
  if (props.content.items && Array.isArray(props.content.items)) {
    return props.content.items.map(item => {
      if (typeof item === 'object') {
        return item;
      }
      return item;
    });
  }
  return [];
});
</script>

<style scoped>
.phenomenon {
  margin: 15px 0;
  padding: 15px;
  border: 1px dashed var(--secondary-color, #7070c0);
  border-radius: 5px;
  background: rgba(16, 16, 48, 0.2);
}

.phenomenon-title {
  color: var(--highlight-color, #e0e0ff);
  margin-bottom: 10px;
  font-weight: bold;
}

.phenomenon-label {
  margin: 8px 0;
}

.phenomenon-label span:first-child {
  color: var(--highlight-color, #e0e0ff);
  font-weight: bold;
}

.phenomenon-item {
  margin: 8px 0;
}

.phenomenon-warning {
  margin: 8px 0;
  color: #ff6666;
}

.phenomenon-subitems {
  margin: 10px 0 10px 20px;
  padding-left: 15px;
}

.phenomenon-subitem {
  margin: 5px 0;
}

.phenomenon-subitem.warning {
  color: #ff6666;
}
</style>
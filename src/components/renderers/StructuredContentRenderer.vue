<template>
  <div class="structured-content" :class="content.style">
    <!-- 标题 -->
    <h3 v-if="content.title" class="content-title">
      <HighlightedText :text="content.title" :highlights="content.highlights" />
    </h3>
    
    <!-- 副标题/角色名 -->
    <h4 v-if="content.subtitle" class="content-subtitle">
      <HighlightedText :text="content.subtitle" :highlights="content.highlights" />
    </h4>
    
    <!-- 内容项列表 -->
    <template v-for="(item, index) in content.items" :key="index">
      <!-- 带标签的内容项 -->
      <div v-if="item.label && item.value" class="content-item labeled-item">
        <span class="item-label">
          <HighlightedText :text="item.label" :highlights="item.highlights" />
        </span>
        <span class="item-value">
          <HighlightedText :text="item.value" :highlights="item.highlights" />
        </span>
      </div>
      
      <!-- 纯文本内容项 -->
      <p v-else-if="item.text || typeof item === 'string'" class="content-item text-item">
        <HighlightedText 
          :text="typeof item === 'string' ? item : item.text" 
          :highlights="(typeof item === 'string' ? content.highlights : item.highlights)" 
          :class="{ warning: item.type === 'warning' }"
        />
      </p>
      
      <!-- 子项列表 -->
      <ul v-if="item.subItems" class="content-subitems">
        <li v-for="(subItem, subIndex) in item.subItems" :key="subIndex" class="content-subitem">
          <HighlightedText 
            v-if="typeof subItem === 'object'"
            :text="subItem.text" 
            :highlights="subItem.highlights" 
            :class="{ warning: subItem.type === 'warning' }"
          />
          <HighlightedText v-else :text="subItem" />
        </li>
      </ul>
    </template>
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
.structured-content {
  margin: 15px 0;
  padding: 15px;
  border-radius: 5px;
  transition: all 0.3s ease;
}

/* 不同风格的样式 */
.structured-content.dream-record {
  border: 1px dashed var(--secondary-color, #a366ff);
  background: rgba(30, 15, 60, 0.4);
  box-shadow: 0 0 15px rgba(168, 119, 255, 0.2);
}

.structured-content.phenomenon {
  border: 1px dashed var(--secondary-color, #7070c0);
  background: rgba(16, 16, 48, 0.2);
}

.structured-content.soul-flow {
  border: 1px dashed var(--secondary-color, #70c070);
  background: rgba(16, 48, 16, 0.2);
}

.content-title {
  color: var(--highlight-color, #ffccff);
  margin: 0 0 15px 0;
  text-shadow: 0 0 5px var(--highlight-color, #ff99ff);
}

.content-subtitle {
  color: var(--highlight-color, #e0e0ff);
  margin: 0 0 10px 0;
  font-weight: bold;
}

.content-item {
  margin: 8px 0;
  line-height: 1.6;
}

.labeled-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.item-label {
  color: var(--highlight-color, #ffccff);
  font-weight: bold;
  text-shadow: 0 0 3px var(--highlight-color, #ff99ff);
}

.item-value {
  padding-left: 10px;
}

.text-item {
  margin: 8px 0;
}

.warning {
  color: #ff6666;
}

.content-subitems {
  margin: 10px 0 10px 20px;
  padding-left: 15px;
}

.content-subitem {
  margin: 5px 0;
}

.content-subitem.warning {
  color: #ff6666;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .structured-content {
    padding: 10px;
  }
  
  .content-subitems {
    margin-left: 10px;
    padding-left: 10px;
  }
}
</style>
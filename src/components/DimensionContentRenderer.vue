<template>
  <div class="dimension-content-renderer">
    <div v-for="section in sections" :key="section.title" class="section">
      <h2>{{ section.title }}</h2>
      
      <!-- 渲染段落 -->
      <template v-for="content in section.content" :key="content.type">
        <ParagraphRenderer 
          v-if="content.type === 'paragraph'" 
          :content="content" 
        />
        
        <!-- 渲染列表 -->
        <ListRenderer 
          v-else-if="content.type === 'list'" 
          :content="content" 
        />
        
        <!-- 渲染有序列表 -->
        <NumberedListRenderer 
          v-else-if="content.type === 'numberedList'" 
          :content="content" 
        />
        
        <!-- 渲染嵌套列表 -->
        <NestedListRenderer 
          v-else-if="content.type === 'nestedList'" 
          :content="content" 
        />
        
        <!-- 渲染子章节 -->
        <SubsectionRenderer 
          v-else-if="content.type === 'subsection'" 
          :content="content" 
        />
        
        <!-- 渲染结构化内容 -->
        <StructuredContentRenderer 
          v-else-if="content.type === 'structuredContent'" 
          :content="content" 
        />
        
        <!-- 渲染访问日志 -->
        <LogRenderer 
          v-else-if="content.type === 'log'" 
          :content="content" 
        />
        
        <!-- 渲染引用 -->
        <QuoteRenderer 
          v-else-if="content.type === 'quote'" 
          :content="content" 
        />
      </template>
      
      <!-- 渲染章节引用 -->
      <QuoteRenderer 
        v-if="section.quote" 
        :content="section.quote" 
      />
    </div>
  </div>
</template>

<script setup>
import ParagraphRenderer from './renderers/ParagraphRenderer.vue';
import ListRenderer from './renderers/ListRenderer.vue';
import NumberedListRenderer from './renderers/NumberedListRenderer.vue';
import NestedListRenderer from './renderers/NestedListRenderer.vue';
import SubsectionRenderer from './renderers/SubsectionRenderer.vue';
import StructuredContentRenderer from './renderers/StructuredContentRenderer.vue';
import LogRenderer from './renderers/LogRenderer.vue';
import QuoteRenderer from './renderers/QuoteRenderer.vue';

defineProps({
  sections: {
    type: Array,
    required: true
  }
});
</script>

<style scoped>
.dimension-content-renderer {
  color: var(--primary-color, #00ffff);
  line-height: 1.6;
  height: 100%;
  overflow-y: auto;
  padding-right: 5px;
}

.section {
  margin-bottom: 30px;
}

.section h2 {
  color: var(--secondary-color, #66ffff);
  margin: 25px 0 15px;
  border-bottom: 1px dashed var(--border-color, #0066ff);
  padding-bottom: 8px;
  text-shadow: 0 0 5px var(--secondary-color, #66ffff);
}
</style>
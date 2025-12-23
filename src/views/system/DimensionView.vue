<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useUserStore } from "@/stores/user.js";
import { useRoute } from "vue-router";
import { dimensionService } from "@/services/dimensionService.js";
import DimensionContentRenderer from "@/components/DimensionContentRenderer.vue";

const userStore = useUserStore();
const route = useRoute();

// 当前选中的维度
const currentDimension = ref("pureland");

// 获取用户当前权限等级
const userPermissionLevel = computed(() => {
  return userStore.currentUser?.permissionLevel || 0;
});

// 获取所有维度列表
const dimensions = computed(() => {
  return dimensionService.getAllDimensions();
});

// 获取当前维度的数据
const currentDimensionData = computed(() => {
  return dimensionService.getDimension(currentDimension.value);
});

// 处理维度切换的方法
const handleDimensionChange = (dimension) => {
  currentDimension.value = dimension;
};

// 从URL参数中获取维度
onMounted(() => {
  const allDimensions = dimensionService.getAllDimensions();
  if (route.query.dimension && allDimensions.some(d => d.id === route.query.dimension)) {
    currentDimension.value = route.query.dimension;
  }
});

// 监听路由参数变化
watch(
  () => route.query.dimension,
  (newDimension) => {
    const allDimensions = dimensionService.getAllDimensions();
    if (newDimension && allDimensions.some(d => d.id === newDimension)) {
      currentDimension.value = newDimension;
    }
  }
);

// 检查用户是否有权限访问当前选中的维度
const hasPermission = computed(() => {
  return dimensionService.hasPermission(currentDimension.value, userPermissionLevel.value);
});

// 获取访问当前维度所需的权限等级
const requiredPermissionLevel = computed(() => {
  return dimensionService.getRequiredPermission(currentDimension.value);
});
</script>

<template>
  <!-- 维度档案资料内容 -->
  <div class="content-section">
    <h2 class="content-title">维度档案资料</h2>
    <div class="main-container">
      <ul class="sub-nav">
        <li v-for="dimension in dimensions" 
          :key="dimension.id"
          class="sub-nav-item" 
          :class="{ active: currentDimension === dimension.id }"
          @click="handleDimensionChange(dimension.id)">
          {{ dimension.name }}
        </li>
      </ul>
      <div class="content">
        <!-- 权限限制提示 -->
        <div v-if="!hasPermission" class="permission-restricted" id="permissionRestricted">
          <div class="restricted-icon">⛔</div>
          <div class="restricted-message">权限不足</div>
          <div class="restricted-detail">
            您当前的权限等级 ({{ userPermissionLevel }}) 无法访问此维度档案。<br>
            该档案需要权限等级: {{ requiredPermissionLevel }}<br>
            请使用更高权限的账户登录。
          </div>
        </div>

        <!-- 维度内容显示逻辑 -->
        <div v-else class="dimension-container">
          <div v-if="currentDimensionData" 
               :class="['dimension-content', `${currentDimension}-content`]"
               :id="`${currentDimension}-dimension`">
            <DimensionContentRenderer :sections="currentDimensionData.content.sections" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

.main-container {
  display: flex;
  gap: 20px;
  height: calc(100% - 50px); /* 减去标题高度 */
}

.sub-nav {
  width: 10%;
  margin-left: 20px;
  margin-top: 5px;
  margin-bottom: 15px;
  list-style-type: none;
  position: sticky;
  top: 50px; /* 标题高度 */
  align-self: flex-start;
}

.content {
  width: 90%;
  height: 100%;
  overflow-y: auto;
  padding-right: 10px;
}

.sub-nav-item {
  padding: 8px 12px;
  margin-bottom: 5px;
  border: 1px solid transparent;
  border-radius: 3px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.85rem;
  color: #00aaff;
}

.sub-nav-item:hover,
.sub-nav-item.active {
  background-color: rgba(0, 170, 255, 0.1);
  border-color: rgba(0, 170, 255, 0.3);
}

/* 权限限制提示样式 */
.permission-restricted {
  width: auto;
  text-align: center;
  padding: 40px 20px;
  color: #ff6666;
}

.restricted-icon {
  font-size: 3rem;
  margin-bottom: 20px;
  opacity: 0.7;
}

.restricted-message {
  font-size: 1.2rem;
  margin-bottom: 10px;
}

.restricted-detail {
  font-size: 0.9rem;
  opacity: 0.8;
}

/* 维度档案内容样式 */
.dimension-content {
  color: #00ffff;
  line-height: 1.6;
  height: 100%;
  overflow-y: auto;
  padding-right: 5px;
}

.dimension-content.active {
  display: block;
}

/* 净土样式 */
.pureland-content {
  color: #00ffff;
}

.pureland-content h2 {
  color: #66ffff;
  margin: 25px 0 15px;
  border-bottom: 1px dashed #0066ff;
  padding-bottom: 8px;
  text-shadow: 0 0 5px #66ffff;
}

.pureland-content .highlight {
  color: #ffff66;
  font-weight: bold;
}

.pureland-content .quote {
  border-left: 3px solid #00ffff;
  padding-left: 15px;
  margin: 20px 0;
  font-style: italic;
  opacity: 0.9;
}

/* 轮回之地样式 */
.cycle-content {
  color: #a0f0a0;
}

.cycle-content h2 {
  color: #90e090;
  margin: 25px 0 15px;
  border-bottom: 1px dashed #408040;
  padding-bottom: 8px;
  text-shadow: 0 0 5px #90e090;
}

.cycle-content .highlight {
  color: #e0ffa0;
  font-weight: bold;
}

.cycle-content .quote {
  border-left: 3px solid #70c070;
  padding-left: 15px;
  margin: 20px 0;
  font-style: italic;
  opacity: 0.9;
  background: rgba(16, 48, 16, 0.3);
  padding: 15px;
  border-radius: 0 5px 5px 0;
}

.soul-flow {
  position: relative;
  padding: 15px;
  margin: 15px 0;
  border: 1px dashed #70c070;
  border-radius: 5px;
  background: rgba(16, 48, 16, 0.2);
}

/* 虚无视界样式 */
.void-content {
  color: #a0a0ff;
}

.void-content h2 {
  color: #9090e0;
  margin: 25px 0 15px;
  border-bottom: 1px dashed #5050a0;
  padding-bottom: 8px;
  text-shadow: 0 0 5px #9090e0;
}

.void-content .highlight {
  color: #e0e0ff;
  font-weight: bold;
}

.void-content .quote {
  border-left: 3px solid #7070c0;
  padding-left: 15px;
  margin: 20px 0;
  font-style: italic;
  opacity: 0.9;
  background: rgba(16, 16, 48, 0.3);
  padding: 15px;
  border-radius: 0 5px 5px 0;
}

.phenomenon {
  margin: 15px 0;
  padding: 15px;
  border: 1px dashed #7070c0;
  border-radius: 5px;
  background: rgba(16, 16, 48, 0.2);
}

/* 梦境世界样式 */
.dream-content {
  color: #d8b3ff;
}

.dream-content h2 {
  color: #c299ff;
  margin: 25px 0 15px;
  border-bottom: 1px dashed #8c52ff;
  padding-bottom: 8px;
  text-shadow: 0 0 8px #c299ff;
}

.dream-content .highlight {
  color: #ffccff;
  font-weight: bold;
  text-shadow: 0 0 5px #ff99ff;
}

.dream-content .quote {
  border-left: 3px solid #a366ff;
  margin: 20px 0;
  font-style: italic;
  opacity: 0.9;
  background: rgba(42, 21, 74, 0.3);
  padding: 15px;
  border-radius: 0 10px 10px 0;
  box-shadow: 0 0 10px rgba(168, 119, 255, 0.2);
}

.dream-record {
  margin: 20px 0;
  padding: 20px;
  border: 1px dashed #a366ff;
  border-radius: 10px;
  background: rgba(30, 15, 60, 0.4);
  box-shadow: 0 0 15px rgba(168, 119, 255, 0.2);
  transition: all 0.3s ease;
}
</style>
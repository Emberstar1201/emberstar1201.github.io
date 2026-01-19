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
          <div class="restricted-icon">public/assets/cover/Insufficient Permission.png" alt="权限不足"</div>
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
/* 布局样式 */
.main-container {
  display: flex;
  gap: 20px;
  height: calc(100% - 50px);
}

.sub-nav {
  width: 10%;
  margin-left: 20px;
  margin-top: 5px;
  margin-bottom: 15px;
  list-style-type: none;
  position: sticky;
  top: 50px;
  align-self: flex-start;
}

.content {
  width: 90%;
  height: 100%;
  overflow-y: auto;
  padding-right: 10px;
}

/* 导航样式 */
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

/* 维度容器样式 */
.dimension-container {
  height: 100%;
  overflow-y: auto;
}

/* 维度内容基础样式 */
.dimension-content {
  height: 100%;
  padding-right: 5px;
}

/* 维度特定颜色主题 */
.pureland-content {
  --primary-color: #00ffff;
  --secondary-color: #66ffff;
  --border-color: #0066ff;
  --highlight-color: #ffff66;
}

.cycle-content {
  --primary-color: #a0f0a0;
  --secondary-color: #90e090;
  --border-color: #408040;
  --highlight-color: #e0ffa0;
}

.void-content {
  --primary-color: #a0a0ff;
  --secondary-color: #9090e0;
  --border-color: #5050a0;
  --highlight-color: #e0e0ff;
}

.dream-content {
  --primary-color: #d8b3ff;
  --secondary-color: #c299ff;
  --border-color: #8c52ff;
  --highlight-color: #ffccff;
}
</style>

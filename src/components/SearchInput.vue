<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { queryCharacters } from '../services/characterService';

// 响应式变量
const searchQuery = ref('');
const searchResults = ref([]);
const showResults = ref(false);
const searchContainer = ref(null);

// 路由
const router = useRouter();

// 搜索类型
const SEARCH_TYPES = {
  CHARACTER: '角色',
  DIMENSION: '维度',
  COMMAND: '命令'
};

// 模拟搜索数据
const mockSearchData = [
  { id: 1, name: '角色', type: SEARCH_TYPES.CHARACTER, detail: '角色档案资料', route: '/system/character' },
  { id: 2, name: '维度', type: SEARCH_TYPES.DIMENSION, detail: '维度档案资料', route: '/system/dimension' },
  { id: 3, name: '监控', type: SEARCH_TYPES.COMMAND, detail: '系统状态实时监控', route: '/system/monitor' },
  { id: 4, name: '守护', type: SEARCH_TYPES.COMMAND, detail: '系统安全守护', route: '/system/defender' },
  { id: 5, name: '灵魂频率', type: SEARCH_TYPES.COMMAND, detail: '灵魂频率分析', route: '/system/soul-frequency' },
  { id: 6, name: '角色档案', type: SEARCH_TYPES.CHARACTER, detail: '查看所有角色信息', route: '/system/character' },
  { id: 7, name: '维度档案', type: SEARCH_TYPES.DIMENSION, detail: '查看所有维度信息', route: '/system/dimension' },
  { id: 8, name: '监控视图', type: SEARCH_TYPES.COMMAND, detail: '实时监控系统状态', route: '/system/monitor' },
  { id: 9, name: '守护视图', type: SEARCH_TYPES.COMMAND, detail: '查看系统安全守护', route: '/system/defender' },
  { id: 10, name: '余烬净土', type: SEARCH_TYPES.DIMENSION, detail: '星荧的庇护所', route: '/system/dimension', dimension: 'pureland' },
  { id: 11, name: '轮回之地', type: SEARCH_TYPES.DIMENSION, detail: '灵魂的归宿', route: '/system/dimension', dimension: 'cycle' },
  { id: 12, name: '虚无视界', type: SEARCH_TYPES.DIMENSION, detail: '虚无的领域', route: '/system/dimension', dimension: 'void' },
  { id: 13, name: '梦境世界', type: SEARCH_TYPES.DIMENSION, detail: '梦境的空间', route: '/system/dimension', dimension: 'dream' }
];

// 计算属性：根据搜索词过滤结果
const filteredResults = computed(() => {
  if (!searchQuery.value.trim()) {
    return [];
  }
  
  const query = searchQuery.value.toLowerCase();
  const results = [];
  
  // 1. 添加真实角色数据
  const characterResults = queryCharacters(query);
  if (characterResults.length > 0) {
    characterResults.forEach(character => {
      results.push({
        id: `character-${character.id}`,
        name: character.name,
        alias: character.alias,
        type: SEARCH_TYPES.CHARACTER,
        detail: `${character.personality.substring(0, 20)}...`,
        route: '/system/character',
        characterId: character.id
      });
    });
  }
  
  // 2. 添加模拟数据（非角色部分）
  const mockResults = mockSearchData.filter(item => 
    item.type !== SEARCH_TYPES.CHARACTER && (
      item.name.toLowerCase().includes(query) ||
      item.detail.toLowerCase().includes(query) ||
      item.type.toLowerCase().includes(query)
    )
  );
  
  return [...results, ...mockResults];
});

// 输入框变化处理函数
const handleInputChange = () => {
  searchResults.value = filteredResults.value;
  showResults.value = searchResults.value.length > 0;
};

// 搜索按钮点击处理函数
const handleSearchClick = () => {
  searchResults.value = filteredResults.value;
  showResults.value = searchResults.value.length > 0;
};

// 结果项点击处理函数
const handleResultClick = (item) => {
  if (item.route) {
    // 如果是维度类型且有dimension参数，则添加到路由查询中
    if (item.type === SEARCH_TYPES.DIMENSION && item.dimension) {
      router.push({ path: item.route, query: { dimension: item.dimension } });
    }
    // 如果是角色类型且有characterId参数，则添加到路由查询中
    else if (item.type === SEARCH_TYPES.CHARACTER && item.characterId) {
      router.push({ path: item.route, query: { characterId: item.characterId } });
    }
    else {
      router.push(item.route);
    }
  }
  searchQuery.value = '';
  showResults.value = false;
};

// 点击外部关闭搜索结果
const handleClickOutside = (event) => {
  if (searchContainer.value && !searchContainer.value.contains(event.target)) {
    showResults.value = false;
  }
};

// 组件挂载时添加点击事件监听
onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

// 组件卸载时移除点击事件监听
onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<template>
  <!-- 搜索栏 -->
  <div class="search-container" ref="searchContainer">
    <input 
      type="text" 
      class="search-input" 
      v-model="searchQuery"
      placeholder="搜索角色、维度或命令..."
      @input="handleInputChange"
      @focus="showResults = searchResults.length > 0"
    >
    <button 
      class="search-button" 
      @click="handleSearchClick"
    >🔍</button>
    <div 
      class="search-results" 
      :class="{ 'active': showResults }"
    >
      <div 
          v-for="item in searchResults" 
          :key="item.id"
          class="search-result-item"
          @click="handleResultClick(item)"
        >
          <span class="result-type">{{ item.type }}</span>
          <span class="result-name">{{ item.name }}{{ item.alias ? ` (${item.alias})` : '' }}</span>
          <div class="result-detail">{{ item.detail }}</div>
        </div>
      <div v-if="searchResults.length === 0 && searchQuery.trim()" class="no-results">
        未找到匹配结果
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 搜索栏样式 */
.search-container {
  position: relative;
  margin: 10px 0 15px;
  width: 100%;
}

.search-input {
  width: 100%;
  background-color: rgba(10, 10, 24, 0.8);
  border: 1px solid #00ffff;
  border-radius: 5px;
  color: #00ffff;
  font-family: 'Monospace', monospace;
  outline: none;
  transition: all 0.3s ease;
  font-size: 14px;
  padding: 12px 40px 12px 15px;
}

/* 响应式搜索栏 */
@media (max-width: 767px) {
  .search-container {
    margin: 8px 0 12px;
  }
  
  .search-input {
    font-size: 13px;
    padding: 10px 35px 10px 12px;
  }
  
  .search-button {
    font-size: 14px;
    right: 8px;
  }
  
  .search-results {
    max-height: 200px;
  }
  
  .search-result-item {
    padding: 10px 12px;
  }
  
  .result-name {
    font-size: 0.8rem;
  }
  
  .result-detail {
    font-size: 0.7rem;
  }
}

.search-input:focus {
  box-shadow: 0 0 10px rgba(0, 255, 255, 0.7);
}

.search-button {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  color: #00ffff;
  font-size: 16px;
  opacity: 0.7;
  transition: opacity 0.3s ease;
}

.search-button:hover {
  opacity: 1;
}

.search-results {
  display: none;
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background-color: rgba(10, 10, 24, 0.95);
  border: 1px solid #00ffff;
  border-radius: 5px;
  margin-top: 5px;
  max-height: 300px;
  overflow-y: auto;
  z-index: 1000;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
}

.search-results.active {
  display: block;
}

.search-result-item {
  padding: 12px 15px;
  border-bottom: 1px solid rgba(0, 255, 255, 0.2);
  transition: all 0.3s ease;
}

.search-result-item:hover {
  background-color: rgba(0, 255, 255, 0.1);
}

.search-result-item:last-child {
  border-bottom: none;
}

.result-type {
  font-size: 0.7rem;
  color: #00aaff;
  background-color: rgba(0, 255, 255, 0.2);
  padding: 2px 6px;
  border-radius: 3px;
  margin-right: 8px;
}

.result-name {
  font-size: 0.9rem;
  color: #00ffff;
}

.result-detail {
  font-size: 0.8rem;
  color: #00aaff;
  margin-top: 5px;
  opacity: 0.8;
}

.no-results {
  padding: 15px;
  text-align: center;
  color: #ff6666;
}

</style>
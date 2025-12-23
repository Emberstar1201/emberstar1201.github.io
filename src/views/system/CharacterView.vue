<script setup>
import { onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { getAllCharacters, getCharacterById } from "@/services/characterService.js";

const characters = ref([]);
const characterDetail = ref(null);
const isShowCharacterDetail = ref(false);
const route = useRoute();

const showCharacterDetail = (c) => {
  isShowCharacterDetail.value = true;
  characterDetail.value = c;
};

// 根据ID显示角色详情
const showCharacterById = (id) => {
  const character = getCharacterById(id);
  if (character) {
    showCharacterDetail(character);
  }
};

onMounted(() => {
  characters.value = getAllCharacters();
  
  // 检查URL参数是否有characterId
  if (route.query.characterId) {
    showCharacterById(route.query.characterId);
  }
});

// 监听路由参数变化
watch(() => route.query.characterId, (newId) => {
  if (newId) {
    showCharacterById(newId);
  }
});
</script>

<template>
  <!-- 角色档案资料内容 -->
  <div class="content-section" id="character-archive-content">
    <h2 class="content-title">角色档案资料</h2>

    <Transition name="fade-slide" mode="out-in">
      <!-- 角色列表 -->
      <div class="character-list" v-if="!isShowCharacterDetail">
        <div class="character-card" v-for="character in characters" :key="character.id"
          @click="showCharacterDetail(character)">
          <img v-if="character.avatar.startsWith('/')" :src="character.avatar" alt="avatar" class="character-avatar"/>
          <div v-else class="character-avatar">{{ character.avatar }}</div>
          <div class="character-name">{{ character.name }}</div>
          <div class="character-alias">{{ character.alias }}</div>
          <div class="character-status" :class="{ active: character.status === 'alive' }">
            {{ character.status === 'alive' ? '存活' : '已逝' }}
          </div>
        </div>
      </div>

      <!-- 角色详情 -->
      <div class="character-detail" v-else>
        <button class="back-to-list" @click="isShowCharacterDetail = false">返回列表</button>
        <div class="detail-header">
          <img v-if="characterDetail.avatar.startsWith('/')" :src="characterDetail.avatar" alt="avatar" class="detail-avatar"/>
          <div v-else class="detail-avatar">{{ characterDetail.avatar }}</div>
          <div class="detail-info">
            <h2 class="detail-name">{{ characterDetail.name }}</h2>
            <div class="detail-alias">{{ characterDetail.alias }}</div>
            <div class="character-status" :class="{ active: characterDetail.status === 'alive' }">
              {{ characterDetail.status === 'alive' ? '存活' : '已逝' }}
            </div>
            <div class="detail-motto">{{ characterDetail.motto }}</div>
          </div>
        </div>
        <div class="detail-sections">
          <div class="detail-section">
            <h3>基本信息</h3>
            <div class="detail-item">
              <div class="detail-label">年龄</div>
              <div class="detail-value">{{ characterDetail.age }}</div>
            </div>
            <div class="detail-item">
              <div class="detail-label">性别</div>
              <div class="detail-value">{{ characterDetail.gender }}</div>
            </div>
            <div class="detail-item">
              <div class="detail-label">身高</div>
              <div class="detail-value">{{ characterDetail.height }}</div>
            </div>
            <div class="detail-item">
              <div class="detail-label">体重</div>
              <div class="detail-value">{{ characterDetail.weight }}</div>
            </div>
            <div class="detail-item">
              <div class="detail-label">种族</div>
              <div class="detail-value">{{ characterDetail.race || '未设定' }}</div>
            </div>
            <div class="detail-item">
              <div class="detail-label">生日</div>
              <div class="detail-value">{{ characterDetail.birthday }}</div>
            </div>
          </div>
          <div class="detail-section">
            <h3>能力与特征</h3>
            <div class="detail-item">
              <div class="detail-label">神之眼</div>
              <div class="detail-value">{{ characterDetail.divineEye || '无' }}</div>
            </div>
            <div class="detail-item">
              <div class="detail-label">灵魂性质</div>
              <div class="detail-value">{{ characterDetail.soulNature }}</div>
            </div>
            <div class="detail-item">
              <div class="detail-label">喜欢的食物</div>
              <div class="detail-value">{{ characterDetail.favoriteFood }}</div>
            </div>
          </div>
          <div class="detail-section">
            <h3>背景与性格</h3>
            <div class="detail-item">
              <div class="detail-label">所属地</div>
              <div class="detail-value">{{ characterDetail.location }}</div>
            </div>
            <div class="detail-description">{{ characterDetail.description }}</div>
            <div class="detail-description">{{ characterDetail.personality }}</div>
          </div>
        </div>
      </div>
    </Transition>
  </div>

</template>

<style scoped>
/* 过渡动画样式 */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.5s ease;
}

/* 入场动画 */
.fade-slide-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

/* 出场动画 */
.fade-slide-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

/* 为了让动画效果更明显，可以为过渡元素添加一些额外样式 */
.fade-enter-active {
  transition-delay: 0.1s;
}

/* 角色档案列表样式 */
.character-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 15px;
  margin-top: 20px;
  max-height: 60%;
}

.character-card {
  background-color: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(0, 255, 255, 0.3);
  border-radius: 5px;
  padding: 15px;
  text-align: center;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.character-card:hover {
  background-color: rgba(0, 255, 255, 0.1);
  border-color: rgba(0, 255, 255, 0.7);
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(0, 255, 255, 0.3);
}

.character-card.active {
  background-color: rgba(0, 255, 255, 0.2);
  border-color: rgba(0, 255, 255, 0.9);
  box-shadow: 0 0 15px rgba(0, 255, 255, 0.5);
}

.character-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  margin: 0 auto 10px;
  background-color: rgba(0, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  color: #00ffff;
  border: 2px solid rgba(0, 255, 255, 0.5);
}

.character-name {
  font-size: 1.1rem;
  margin-bottom: 5px;
  color: #00ffff;
}

.character-alias {
  font-size: 0.8rem;
  opacity: 0.7;
  margin-bottom: 5px;
  color: #00aaff;
}

.character-status {
  font-size: 0.7rem;
  padding: 2px 8px;
  border-radius: 10px;
  display: inline-block;
  margin-top: 5px;
  background-color: rgba(255, 0, 0, 0.2);
  color: #ff6666;
}

.character-status.active {
  background-color: rgba(0, 255, 0, 0.2);
  color: #00ff00;
}


/* 角色详情样式 */
.character-detail {
  margin-top: 20px;
  padding: 20px;
  background-color: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(0, 255, 255, 0.3);
  border-radius: 5px;
}

.character-detail.active {
  display: block;
}

.detail-header {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid rgba(0, 255, 255, 0.3);
}

.detail-avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background-color: rgba(0, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  color: #00ffff;
  border: 3px solid rgba(0, 255, 255, 0.5);
}

.detail-info {
  flex: 1;
  min-width: 200px;
}

.detail-name {
  font-size: 1.8rem;
  margin-bottom: 5px;
  color: #00ffff;
  text-shadow: 0 0 10px #00ffff;
}

.detail-alias {
  font-size: 1rem;
  opacity: 0.8;
  margin-bottom: 10px;
  color: #00aaff;
}

.detail-motto {
  font-style: italic;
  margin-top: 10px;
  padding: 10px;
  border-left: 3px solid #00ffff;
  background-color: rgba(0, 255, 255, 0.1);
}

.detail-sections {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.detail-section {
  margin-bottom: 20px;
}

.detail-section h3 {
  color: #00aaff;
  margin-bottom: 10px;
  font-size: 1.2rem;
  border-bottom: 1px dashed rgba(0, 170, 255, 0.5);
  padding-bottom: 5px;
}

.detail-item {
  margin-bottom: 8px;
  display: flex;
}

.detail-label {
  min-width: 100px;
  color: #00ffff;
  font-weight: bold;
}

.detail-value {
  flex: 1;
  color: #00aaff;
}

.detail-description {
  line-height: 1.6;
  margin-top: 10px;
}

.back-to-list {
  display: inline-block;
  padding: 8px 15px;
  background-color: transparent;
  border: 1px solid #00ffff;
  border-radius: 3px;
  color: #00ffff;
  font-family: 'Monospace', monospace;
  transition: all 0.3s ease;
  margin-bottom: 15px;
}

.back-to-list:hover {
  background-color: rgba(0, 255, 255, 0.1);
}
</style>
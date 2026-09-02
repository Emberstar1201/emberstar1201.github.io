<script setup>
import { ref } from 'vue';
import AvatarImg from '@/components/AvatarImg.vue';

// ===================== ∧-02世界线 角色档案数据 =====================
// TODO: 在这里添加/修改 ∧-02世界线的角色数据
// 注意：这里使用的是独立的数据集，和主时间线的角色档案分开管理
const worldline02Characters = ref([
  {
    id: "emberstar-02",
    name: "星荧",
    alias: "Emberstar",
    age: "10 (?)",
    gender: "无性",
    height: "145cm",
    weight: "24kg",
    race: "人 (?)",
    birthday: "1月60日",
    // ∧-02世界线专用字段：魔女权能（替代神之眼）
    witchPower: "TODO: 填写魔女权能描述",
    // ∧-02世界线专用字段：共鸣力（替代普通能力）
    resonanceAbility: "TODO: 填写共鸣力描述（∧-02时间线限定）",
    favoriteFood: "TODO: 填写喜欢的食物",
    personality: "TODO: 填写性格描述",
    soulNature: "TODO: 填写灵魂性质",
    location: "TODO: 填写所属地",
    description: "TODO: 填写背景故事描述",
    motto: "TODO: 填写座右铭",
    status: "存活",
    avatar: '/assets/avatar/emberstar 02.webp'
  },
  // 可以继续添加更多角色...
]);

// ===================== 交互逻辑 =====================

// 当前选中的角色（null 表示显示列表）
const selectedCharacter = ref(null);

// 是否显示详情
const showDetail = ref(false);

// 查看角色详情
const viewCharacterDetail = (character) => {
  selectedCharacter.value = character;
  showDetail.value = true;
};

// 返回列表
const backToList = () => {
  showDetail.value = false;
  selectedCharacter.value = null;
};
</script>

<template>
  <div class="worldline02-content">
    <!-- 页面标题 -->
    <div class="page-header">
      <h2 class="content-title">角色档案资料</h2>
      <div class="worldline-badge">∧-02 世界线</div>
    </div>

    <!-- 角色列表 -->
    <Transition name="fade-slide" mode="out-in">
      <div class="character-list" v-if="!showDetail">
        <div class="character-card" v-for="character in worldline02Characters" :key="character.id"
          @click="viewCharacterDetail(character)">
          <div class="character-avatar">
            <AvatarImg v-if="character.avatar && character.avatar.startsWith('/')" :src="character.avatar" />
            <span v-else>{{ character.avatar || '?' }}</span>
          </div>
          <div class="character-name">{{ character.name }}</div>
          <div class="character-alias">{{ character.alias }}</div>
          <div class="character-status" :class="{ active: character.status === '存活' }">
            {{ character.status }}
          </div>
        </div>
      </div>

      <!-- 角色详情 -->
      <div class="character-detail" v-else>
        <button class="back-to-list" @click="backToList">← 返回列表</button>

        <div class="detail-header">
          <div class="detail-avatar">
            <AvatarImg v-if="selectedCharacter.avatar && selectedCharacter.avatar.startsWith('/')" :src="selectedCharacter.avatar" />
            <span v-else>{{ selectedCharacter.avatar || '?' }}</span>
          </div>
          <div class="detail-info">
            <h2 class="detail-name">{{ selectedCharacter.name }}</h2>
            <div class="detail-alias">{{ selectedCharacter.alias }}</div>
            <div class="character-status" :class="{ active: selectedCharacter.status === '存活' }">
              {{ selectedCharacter.status }}
            </div>
            <div class="detail-motto">{{ selectedCharacter.motto }}</div>
          </div>
        </div>

        <div class="detail-sections">
          <!-- 基本信息 -->
          <div class="detail-section">
            <h3>基本信息</h3>
            <div class="detail-item">
              <div class="detail-label">年龄</div>
              <div class="detail-value">{{ selectedCharacter.age }}</div>
            </div>
            <div class="detail-item">
              <div class="detail-label">性别</div>
              <div class="detail-value">{{ selectedCharacter.gender }}</div>
            </div>
            <div class="detail-item">
              <div class="detail-label">身高</div>
              <div class="detail-value">{{ selectedCharacter.height }}</div>
            </div>
            <div class="detail-item">
              <div class="detail-label">体重</div>
              <div class="detail-value">{{ selectedCharacter.weight }}</div>
            </div>
            <div class="detail-item">
              <div class="detail-label">种族</div>
              <div class="detail-value">{{ selectedCharacter.race || '未设定' }}</div>
            </div>
            <div class="detail-item">
              <div class="detail-label">生日</div>
              <div class="detail-value">{{ selectedCharacter.birthday }}</div>
            </div>
          </div>

          <!-- ∧-02世界线 专属：魔女权能 & 共鸣力 -->
          <div class="detail-section worldline02-section">
            <h3>魔女权能 & 共鸣力</h3>
            <div class="detail-item">
              <div class="detail-label">魔女权能</div>
              <div class="detail-value witch-power">{{ selectedCharacter.witchPower }}</div>
            </div>
            <div class="detail-item">
              <div class="detail-label">共鸣力<br/><span class="sub-label">（∧-02时间线）</span></div>
              <div class="detail-value resonance">{{ selectedCharacter.resonanceAbility }}</div>
            </div>
            <div class="detail-item">
              <div class="detail-label">灵魂性质</div>
              <div class="detail-value">{{ selectedCharacter.soulNature }}</div>
            </div>
          </div>

          <!-- 背景与性格 -->
          <div class="detail-section">
            <h3>背景与性格</h3>
            <div class="detail-item">
              <div class="detail-label">所属地</div>
              <div class="detail-value">{{ selectedCharacter.location }}</div>
            </div>
            <div class="detail-item">
              <div class="detail-label">喜欢的食物</div>
              <div class="detail-value">{{ selectedCharacter.favoriteFood }}</div>
            </div>
            <div class="detail-description">{{ selectedCharacter.description }}</div>
            <div class="detail-description">{{ selectedCharacter.personality }}</div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
/* ========== 页面标题区域 ========== */
.page-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 18px;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(0, 255, 255, 0.3);
}

.content-title {
  font-size: 1.3rem;
  color: #00ffff;
  margin: 0;
  text-shadow: 0 0 10px rgba(0, 255, 255, 0.4);
}

/* 世界线标签 */
.worldline-badge {
  display: inline-block;
  padding: 3px 10px;
  font-size: 0.75rem;
  color: #ff99cc;
  background-color: rgba(255, 100, 180, 0.1);
  border: 1px solid rgba(255, 100, 180, 0.4);
  border-radius: 3px;
  letter-spacing: 1px;
}

/* ========== 过渡动画 ========== */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.5s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

/* ========== 角色列表 ========== */
.character-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 15px;
  margin-top: 10px;
}

.character-card {
  background-color: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(0, 255, 255, 0.3);
  border-radius: 5px;
  padding: 15px;
  text-align: center;
  transition: all 0.3s ease;
  cursor: pointer;
}

.character-card:hover {
  background-color: rgba(0, 255, 255, 0.1);
  border-color: rgba(255, 153, 204, 0.5);
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(255, 100, 180, 0.2);
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
  object-fit: cover;
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

/* ========== 角色详情 ========== */
.character-detail {
  margin-top: 10px;
  padding: 20px;
  background-color: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(0, 255, 255, 0.3);
  border-radius: 5px;
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
  cursor: pointer;
}

.back-to-list:hover {
  background-color: rgba(0, 255, 255, 0.1);
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
  object-fit: cover;
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
  border-left: 3px solid #ff99cc;
  background-color: rgba(255, 100, 180, 0.08);
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

/* ∧-02世界线专属区块标题高亮 */
.worldline02-section h3 {
  color: #ff99cc;
  border-bottom-color: rgba(255, 100, 180, 0.5);
}

.detail-item {
  margin-bottom: 8px;
  display: flex;
}

.detail-label {
  min-width: 100px;
  color: #00ffff;
  font-weight: bold;
  font-size: 0.9rem;
}

.sub-label {
  font-size: 0.7rem;
  color: #888;
  font-weight: normal;
}

.detail-value {
  flex: 1;
  color: #00aaff;
}

/* 魔女权能 & 共鸣力 特殊样式 */
.witch-power {
  color: #ff99cc;
}

.resonance {
  color: #cc99ff;
}

.detail-description {
  line-height: 1.6;
  margin-top: 10px;
}
</style>

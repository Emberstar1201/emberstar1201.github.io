<script setup>
import { ref, onMounted, watch, computed, onUnmounted } from 'vue';

// 音乐播放器状态
const isPlaying = ref(false);
const isMuted = ref(false);
const currentTime = ref(0);
const duration = ref(0);
const volume = ref(70); // 0-100
const previousVolume = ref(70); // 用于静音时保存之前的音量
const audioElement = ref(null);
audioElement.value = undefined;
const progressHoverTime = ref('00:00'); // 进度条悬浮预览时间
const isDraggingProgress = ref(false); // 是否正在拖动进度条
const isPlaylistOpen = ref(false); // 播放列表是否展开
const coverRotateDeg = ref(0); // 封面旋转角度
const isLoadingSong = ref(false); // 歌曲加载锁，避免重复操作
const isPlayerExpanded = ref(true); // 播放器是否展开
let coverRotateTimer = null; // 封面旋转定时器

// 示例歌曲列表（丰富数据）
const songs = ref([
  {
    id: 1,
    title: 'Eutopia',
    artist: 'Maku',
    src: '/assets/audios/Eutopia.mp3',
    cover: '/assets/cover/eutopia.webp'
  },
  {
    id: 2,
    title: 'Sacred Play Secret place',
    artist: '',
    src: '/assets/audios/Sacred Play Secret place.mp3',
    cover:'/assets/cover/yihan.webp',
  },
  {
    id: 3,
    title: '愿戴荣光坠入天渊',
    artist: '鸣潮',
    src: '/assets/audios/愿戴荣光坠入天渊.ogg',
    cover: '/assets/cover/%E6%84%BF%E6%88%B4%E8%8D%A3%E5%85%89%E5%9D%A0%E5%85%A5%E5%A4%A9%E6%B8%8A.webp'
  },
  {
    id:4,
    title:'dreamworld',
    artist:'',
    src:'/assets/audios/dreamworld.ogg',
    cover:'/assets/cover/dreamworld.webp',
  },
  {
    id:5,
    title:'sweetdream',
    artist:'',
    src:'/assets/audios/sweetdream.ogg',
    cover:'/assets/cover/sweetdream.webp',
  },
  {
    id:6,
    title:'daylight',
    artist:'',
    src:'/assets/audios/Daylight.mp3',
    cover:'/assets/cover/daylight.webp',
  },
  {
      id:7,
    title:'凌音天羽 - 【崩坏学园2】西琳角色歌「幸福魔法」',
    artist:'崩坏学园2',
    src:'/assets/audios/凌音天羽 - 【崩坏学园2】西琳角色歌「幸福魔法」.mp3',
    cover:'/assets/cover/xilin.webp',
  },
  {
    id: 8,
    title: '春日影',
    artist: 'CRYCHIC',
    src: '/assets/audios/CRYCHIC - 春日影_H.ogg',
    cover: '/assets/cover/春日影.webp'
  },
  {
  id: 9,
    title: 'komorebi',
    artist: '谷岡久美',
    src: '/assets/audios/Komorebi.mp3',
    cover: '/assets/cover/chenxi.webp'  
  },
    {
      id: 10,
    title: 'FREE lucky',
    artist: '',
    src: '/assets/audios/FuGa pang-【FREE】lucky.mp3',
    cover: '/assets/cover/Lucky.webp'
  },
  {
  id: 11,
    title: 'WOW Sound - Carousel',
    artist: '',
    src: '/assets/audios/WOW Sound - Carousel.mp3',
    cover: '/assets/cover/fenjing.webp'  
  },
  {
    id: 12,
    title: 'ありがとう',
    artist: 'KOKIA',
    src: '/assets/audios/ありがとう.mp3',
    cover: '/assets/cover/ありがとう.webp'
  },
  {
        id:13,
        title: 'The Seed Of Dreams',
        artist: '幻塔',
        src: '/assets/audios/The Seed Of Dreams.mp3', 
        cover: '/assets/cover/The Seed Of Dreams.webp' 
    },
    {
        id:14,
        title: 'Sacred Play Secret Place',
        artist: '',
        src: '/assets/audios/sacred play secret place.mp3',
        cover: '/assets/cover/yihan.webp'
    },
    {
        id:15,
        title: 'iberomok',
        artist: '路灰气球',
        src: '/assets/audios/iberomok.mp3',
        cover: '/assets/cover/iberomok.webp'
  },
  {
    id:16,
    title:'あの日の面影',
    artist:'',
    src:'assets/audios/あの日の面影.ogg',
    cover:'assets/cover/tiantai.webp'
 },
 {
   id:17,
    title:'This is my soulless heart',
    artist:'AI',
    src:'assets/audios/This is my soulless heart.ogg',
    cover:'assets/cover/soullessheart.webp'
 },
  {
    id:18,
    title:'Thank you Anahita',
    artist:'Hello world',
    src:'assets/audios/Hello world.ogg',
    cover:'assets/cover/Hello world.webp'
 },
    {
      id:19,
      title:'The dust has settled',
      artist:'Emberstar',
      src:'assets/audios/The dust has settled.mp3',
      cover:'assets/cover/The dust has settled.jpg',
    },
  )];
        
const currentSongIndex = ref(0);
const currentSong = computed(() => songs.value[currentSongIndex.value]);

// 格式化时间（补零 + 处理NaN）
const formatTime = (seconds) => {
  if (isNaN(seconds)) return '00:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

// 播放/暂停控制（增加异常处理）
const togglePlay = async () => {
  if (isLoadingSong.value) return; // 加载中禁止操作
  try {
    if (isPlaying.value) {
      audioElement.value.pause();
      stopCoverRotate();
    } else {
      await audioElement.value.play();
      startCoverRotate();
    }
    isPlaying.value = !isPlaying.value;
  } catch (error) {
    console.error('播放/暂停失败:', error);
    isPlaying.value = false;
  }
};

// 封面旋转动画
const startCoverRotate = () => {
  if (coverRotateTimer) clearInterval(coverRotateTimer);
  coverRotateTimer = setInterval(() => {
    coverRotateDeg.value += 1;
  }, 50);
};

const stopCoverRotate = () => {
  clearInterval(coverRotateTimer);
  coverRotateTimer = null;
};

// 更新当前播放时间（拖动时暂停更新）
const updateCurrentTime = () => {
  if (!isDraggingProgress.value) {
    currentTime.value = audioElement.value.currentTime;
  }
};

// 设置音频持续时间（容错处理）
const setDuration = () => {
  duration.value = isNaN(audioElement.value.duration) ? 0 : audioElement.value.duration;
};

// 进度条悬浮预览
const handleProgressHover = (e) => {
  const progressBar = e.target;
  const rect = progressBar.getBoundingClientRect();
  const ratio = (e.clientX - rect.left) / rect.width;
  const hoverTime = ratio * duration.value;
  progressHoverTime.value = formatTime(hoverTime);
};

// 进度条拖动开始/结束
const handleProgressDragStart = () => {
  isDraggingProgress.value = true;
};

const handleProgressDragEnd = (e) => {
  isDraggingProgress.value = false;
  handleProgressChange(e);
};

// 处理进度条拖动（精准定位）
const handleProgressChange = (event) => {
  const newTime = Math.min(duration.value, Math.max(0, parseFloat(event.target.value)));
  audioElement.value.currentTime = newTime;
  currentTime.value = newTime;
};

// 处理音量变化（边界处理）
const handleVolumeChange = (event) => {
  const newVolume = Math.min(100, Math.max(0, parseFloat(event.target.value)));
  volume.value = newVolume;
  previousVolume.value = newVolume;
  audioElement.value.volume = newVolume / 100;
  
  if (newVolume > 0 && isMuted.value) {
    isMuted.value = false;
  } else if (newVolume === 0 && !isMuted.value) {
    isMuted.value = true;
  }
};

// 切换静音/解除静音（优化逻辑）
const toggleMute = () => {
  if (isMuted.value) {
    // 解除静音（恢复之前音量，最小10%避免无声）
    const restoreVolume = Math.max(10, previousVolume.value);
    audioElement.value.volume = restoreVolume / 100;
    volume.value = restoreVolume;
    isMuted.value = false;
  } else {
    // 静音（保存当前音量）
    previousVolume.value = volume.value;
    audioElement.value.volume = 0;
    isMuted.value = true;
  }
};

// 切换歌曲（通用方法）
const changeSong = async (index) => {
  if (isLoadingSong.value || index === currentSongIndex.value) return; // 避免重复操作

  isLoadingSong.value = true; // 加锁：禁止加载中操作
  const needPlay = isPlaying.value; // 记录切换前的播放状态

  try {
    // 1. 先暂停当前播放（避免load中断）
    if (audioElement.value && isPlaying.value) {
      audioElement.value.pause();
      stopCoverRotate();
    }

    // 2. 更新歌曲索引
    currentSongIndex.value = index;

    // 3. 等待音频加载完成后再播放
    if (audioElement.value) {
      // 重置时间状态
      currentTime.value = 0;
      duration.value = 0;

      // 加载新歌曲（等待loadedmetadata确保元数据加载完成）
      audioElement.value.load();
      await new Promise((resolve) => {
        audioElement.value.addEventListener('loadedmetadata', resolve, { once: true });
        // 兜底：超时10秒自动resolve，避免卡死
        setTimeout(resolve, 10000);
      });

      // 4. 仅当切换前是播放状态，才重新播放
      if (needPlay) {
        await audioElement.value.play();
        startCoverRotate();
        isPlaying.value = true; // 确保状态同步
      } else {
        isPlaying.value = false;
      }
    }
  } catch (error) {
    console.error('切换歌曲失败:', error);
    isPlaying.value = false;
    stopCoverRotate();
  } finally {
    isLoadingSong.value = false; // 解锁
  }
};

// 下一首
const nextSong = () => {
  changeSong((currentSongIndex.value + 1) % songs.value.length);
};

// 上一首
const prevSong = () => {
  changeSong((currentSongIndex.value - 1 + songs.value.length) % songs.value.length);
};

// 播放指定歌曲
const playSong = (index) => {
  changeSong(index).then(() => {
    // 强制播放（即使之前是暂停状态）
    if (audioElement.value && !isPlaying.value) {
      audioElement.value.play().then(() => {
        startCoverRotate();
        isPlaying.value = true;
      }).catch(err => {
        console.error('播放指定歌曲失败:', err);
      });
    }
  });
};

// 监听歌曲切换（清理旧状态）
watch(currentSong, (newSong) => {
  if (audioElement.value) {
    audioElement.value.src = newSong.src;
    currentTime.value = 0;
    duration.value = 0;
  }
});

// 组件挂载后初始化
onMounted(() => {
  if (audioElement.value) {
    audioElement.value.volume = volume.value / 100;
    // 预加载音频元数据
    audioElement.value.load();
  }
});

// 组件卸载时清理
onUnmounted(() => {
  stopCoverRotate();
  if (audioElement.value) {
    audioElement.value.pause();
  }
});
</script>

<template>
  <div class="music-player" :class="{ 'collapsed': !isPlayerExpanded }">
    <audio
      ref="audioElement"
      :src="currentSong.src"
      @timeupdate="updateCurrentTime"
      @loadedmetadata="setDuration"
      @ended="nextSong"
      @error="() => { isPlaying = false; stopCoverRotate(); }"
    ></audio>
    
    <div class="player-container">
      <!-- 头部：封面 + 歌曲信息 + 列表开关 -->
      <div class="player-header">
        <!-- 专辑封面（带旋转动画） -->
        <div 
          class="album-cover" 
          :style="{ transform: `rotate(${coverRotateDeg}deg)` }"
          @click="isPlayerExpanded = true"
        >
          <img :src="currentSong.cover" :alt="currentSong.title" />
        </div>
        
        <!-- 歌曲信息 -->
        <div class="song-info">
          <h3 class="song-title" title="currentSong.title">{{ currentSong.title }}</h3>
          <p class="song-artist" title="currentSong.artist">{{ currentSong.artist }}</p>
        </div>
        
        <!-- 播放列表开关 -->
        <button 
          class="playlist-toggle" 
          @click="isPlaylistOpen = !isPlaylistOpen"
          title="播放列表"
        >
          {{ isPlaylistOpen ? '📋 ▲' : '📋 ▼' }}
        </button>
        
        <!-- 收起播放器按钮 -->
        <button 
          class="collapse-toggle" 
          @click="isPlayerExpanded = false"
          title="收起播放器"
        >
          ⬇️
        </button>
      </div>
      
      <!-- 播放器主体内容（可收起） -->
      <transition name="player-expand">
        <div v-if="isPlayerExpanded" class="player-content">
          <!-- 播放列表（可折叠） -->
          <transition name="playlist">
            <div class="playlist" v-if="isPlaylistOpen">
              <ul>
                <li 
                  v-for="(song, index) in songs" 
                  :key="song.id"
                  :class="{ active: index === currentSongIndex }"
                  @click="playSong(index)"
                >
                  <span class="song-number">{{ index + 1 }}</span>
                  <span class="song-name">{{ song.title }}</span>
                  <span class="song-singer">{{ song.artist }}</span>
                </li>
              </ul>
            </div>
          </transition>
          
          <!-- 播放控制和音量按钮 -->
          <div class="controls-row">
            <!-- 播放控制 -->
            <div class="controls">
              <button class="control-btn" @click="prevSong" title="上一首">
                ⏮️
              </button>
              <button class="control-btn play-btn" @click="togglePlay" title="播放/暂停">
                {{ isPlaying ? '⏸️' : '▶️' }}
              </button>
              <button class="control-btn" @click="nextSong" title="下一首">
                ⏭️
              </button>
            </div>
            
            <!-- 音量控制（优化交互） -->
            <div class="volume-control">
              <button class="volume-btn" @click="toggleMute" :title="isMuted ? '解除静音' : '静音'">
                {{ isMuted ? '🔇' : volume > 50 ? '🔊' : '🔉' }}
              </button>
              <div class="volume-slider-container">
                <div class="volume-value">{{ isMuted ? 0 : volume }}%</div>
                <!-- 垂直音量滑块：使用标准属性替代非标准slider-vertical -->
                <input
                  type="range"
                  class="volume-bar"
                  min="0"
                  max="100"
                  :value="isMuted ? 0 : volume"
                  @input="handleVolumeChange"
                />
              </div>
            </div>
          </div>
          
          <!-- 进度条（增加悬浮预览） -->
          <div class="progress-container">
            <div class="progress-bar-wrapper" @mousemove="handleProgressHover" @mouseleave="progressHoverTime = '00:00'">
              <input
                type="range"
                class="progress-bar"
                min="0"
                :max="duration || 100"
                :value="currentTime"
                @input="handleProgressChange"
                @mousedown="handleProgressDragStart"
                @mouseup="handleProgressDragEnd"
              />
              <!-- 进度悬浮预览 -->
              <div class="progress-tooltip" :style="{ left: `${(currentTime / (duration || 1)) * 100}%` }">
                {{ progressHoverTime }}
              </div>
            </div>
            <div class="time-display">
              <span>{{ formatTime(currentTime) }}</span>
              <span>{{ formatTime(duration) }}</span>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<style scoped>
.music-player {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 320px;
  background: linear-gradient(135deg, rgba(10, 10, 30, 0.80), rgba(20, 20, 40, 0.80));
  color: #ffffff;
  padding: 18px;
  border-radius: 12px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.5);
  z-index: 1000;
  border: 1px solid rgba(0, 170, 255, 0.4);
  transition: all 0.3s ease;
}

/* 收起状态 */
.music-player.collapsed {
  width: 100px;
  height: 100px;
  padding: 18px;
  background: rgba(10, 10, 30, 0.95);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 播放器悬浮放大 */
.music-player:hover {
  transform: translateY(-2px);
  border: 1px solid rgba(0, 170, 255, 0.4);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.6);
}

.player-container {
  display: flex;
  flex-direction: column;
}

/* 头部：封面+信息+列表开关 */
.player-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

/* 收起状态下隐藏除封面外的元素 */
.music-player.collapsed .player-header .song-info,
.music-player.collapsed .player-header .playlist-toggle,
.music-player.collapsed .player-header .collapse-toggle {
  display: none;
}

/* 收起状态下调整封面大小和位置 */
.music-player.collapsed .album-cover {
  width: 64px;
  height: 64px;
  cursor: pointer;
}

/* 收起状态下的容器布局 */
.music-player.collapsed .player-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

/* 收起状态下隐藏播放器标题栏 */
.music-player.collapsed .player-header {
  margin-bottom: 0;
}

/* 专辑封面（旋转动画） */
.album-cover {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  overflow: hidden;
  transition: transform 0.1s linear;
  box-shadow: 0 3px 10px rgba(0, 170, 255, 0.3);
}

.album-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.song-info {
  flex: 1;
  overflow: hidden;
}

.song-title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.song-artist {
  margin: 3px 0 0;
  font-size: 13px;
  color: #cccccc;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 播放列表开关 */
.playlist-toggle {
  background: none;
  border: none;
  color: #00aaff;
  font-size: 16px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.playlist-toggle:hover {
  background-color: rgba(0, 170, 255, 0.1);
}

/* 播放列表 */
.playlist {
  max-height: 180px;
  overflow-y: auto;
  margin: 8px 0;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 8px;
}

/* 播放列表动画 */
.playlist-enter-active,
.playlist-leave-active {
  transition: all 0.3s ease;
}

.playlist-enter-from {
  opacity: 0;
  max-height: 0;
  padding-top: 0;
  margin: 0;
  border-top: 1px solid transparent;
}

.playlist-leave-to {
  opacity: 0;
  max-height: 0;
  padding-top: 0;
  margin: 0;
  border-top: 1px solid transparent;
}

/* 播放器展开/收起动画 */
.player-expand-enter-active,
.player-expand-leave-active {
  transition: all 0.3s ease;
}

.player-expand-enter-from {
  opacity: 0;
  max-height: 0;
  overflow: hidden;
}

.player-expand-leave-to {
  opacity: 0;
  max-height: 0;
  overflow: hidden;
}

.playlist ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.playlist li {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 8px;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s;
  font-size: 14px;
}

.playlist li:hover {
  background-color: rgba(255, 255, 255, 0.08);
}

.playlist li.active {
  background-color: rgba(0, 170, 255, 0.15);
  color: #00aaff;
}

.song-number {
  width: 18px;
  text-align: center;
  color: #999;
}

.song-name {
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.song-singer {
  font-size: 12px;
  color: #999;
  white-space: nowrap;
}

/* 滚动条美化 */
.playlist::-webkit-scrollbar {
  width: 4px;
}

.playlist::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 2px;
}

.playlist::-webkit-scrollbar-thumb {
  background: rgba(0, 170, 255, 0.5);
  border-radius: 2px;
}

/* 控制行 */
.controls-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin: 4px 0;
}

.controls {
  display: flex;
  gap: 12px;
  align-items: center;
}

.collapse-toggle,
.control-btn {
  background: none;
  border: none;
  color: #ffffff;
  font-size: 20px;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  transition: all 0.2s;
}

.control-btn:hover {
  background-color: rgba(255, 255, 255, 0.1);
  transform: scale(1.05);
}

.play-btn {
  font-size: 24px;
  color: #00aaff;
}

/* 音量控制 */
.volume-control {
  position: relative;
  display: flex;
  align-items: center;
}

.volume-btn {
  background: none;
  border: none;
  color: #ffffff;
  font-size: 16px;
  cursor: pointer;
  padding: 6px;
  border-radius: 50%;
  transition: all 0.2s;
}

.volume-btn:hover {
  background-color: rgba(255, 255, 255, 0.1);
  transform: scale(1.05);
}

.volume-slider-container {
  position: absolute;
  bottom: 100%;
  right: 0;
  margin-bottom: 10px;
  width: 40px;
  opacity: 0;
  visibility: hidden;
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: rgba(10, 10, 30, 0.95);
  padding: 8px;
  border-radius: 6px;
  border: 1px solid rgba(0, 170, 255, 0.2);
}

.volume-control:hover .volume-slider-container {
  opacity: 1;
  visibility: visible;
}

.volume-value {
  color: #ffffff;
  font-size: 12px;
  margin-bottom: 5px;
  text-align: center;
  min-width: 28px;
}

/* 音量滑块：使用标准属性实现垂直效果，移除已弃用的slider-vertical */
.volume-bar {
  height: 80px;
  border-radius: 3px;
  background: rgba(255, 255, 255, 0.15);
  outline: none;
  cursor: pointer;
  /* 核心修复：使用标准的writing-mode和direction属性实现垂直滑块 */
  writing-mode: vertical-lr;
  direction: rtl;
}

/* 修复垂直滑块的样式适配 */
.volume-bar::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #00aaff;
  cursor: pointer;
  box-shadow: 0 0 6px rgba(0, 170, 255, 0.6);
}

.volume-bar::-moz-range-thumb {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #00aaff;
  cursor: pointer;
  border: none;
  box-shadow: 0 0 6px rgba(0, 170, 255, 0.6);
}

.volume-bar::-webkit-slider-runnable-track {
  -webkit-appearance: none;
  appearance: none;
  background: rgba(255, 255, 255, 0.15);
  height: 100%;
  width: 100%;
  border-radius: 3px;
}

.volume-bar::-moz-range-track {
  background: rgba(255, 255, 255, 0.15);
  height: 100%;
  width: 100%;
  border-radius: 3px;
  border: none;
}

/* 进度条容器（悬浮预览） */
.progress-container {
  width: 100%;
  margin-top: 4px;
}

.progress-bar-wrapper {
  position: relative;
  width: 100%;
}

.progress-bar {
  width: 100%;
  height: 6px;
  border-radius: 3px;
  background: rgba(255, 255, 255, 0.15);
  outline: none;
  cursor: pointer;
  transition: height 0.2s;
}

.progress-bar:hover {
  height: 8px;
}

.progress-bar::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #00aaff;
  cursor: pointer;
  box-shadow: 0 0 8px rgba(0, 170, 255, 0.6);
  transition: transform 0.2s;
}

.progress-bar::-webkit-slider-thumb:hover {
  transform: scale(1.1);
}

.progress-bar::-moz-range-thumb {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #00aaff;
  cursor: pointer;
  border: none;
  box-shadow: 0 0 8px rgba(0, 170, 255, 0.6);
}

/* 进度条悬浮预览提示 */
.progress-tooltip {
  position: absolute;
  top: -24px;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.8);
  color: #fff;
  font-size: 12px;
  padding: 2px 6px;
  border-radius: 3px;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.2s;
}

.progress-bar-wrapper:hover .progress-tooltip {
  opacity: 1;
}

.time-display {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #cccccc;
  margin-top: 6px;
}

/* 响应式设计（适配更小屏幕） */
@media (max-width: 420px) {
  .music-player {
    width: calc(100% - 40px);
    bottom: 10px;
    right: 10px;
    padding: 15px;
  }
  
  .controls-row {
    flex-direction: column;
    gap: 10px;
    align-items: stretch;
  }
  
  .volume-control {
    justify-content: center;
  }
}
</style>

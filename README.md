# Emberstar - 星荧交互式角色系统

<div align="center">

![Emberstar Logo](https://img.shields.io/badge/Emberstar-星荧-8A2BE2?style=for-the-badge&logo=vue.js&logoColor=white)

[![Vue.js](https://img.shields.io/badge/Vue.js-3.5.25-4FC08D?style=flat-square&logo=vue.js&logoColor=white)](https://vuejs.org/)
[![Vite](https://img.shields.io/badge/Vite-7.2.4-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Pinia](https://img.shields.io/badge/Pinia-3.0.4-yellow?style=flat-square&logo=pinia&logoColor=white)](https://pinia.vuejs.org/)

**一个基于 Vue 3 + Vite 构建的赛博朋克风格交互式角色系统**

[在线演示](#) · [开始使用](#开始使用) · [文档](#文档) · [贡献指南](#贡献指南)

</div>

## ✨ 项目特色

- 🌌 **赛博朋克 UI** - 独特的视觉设计，沉浸式用户体验
- 🎵 **音乐播放器** - 完整的音频播放系统，支持多首歌曲
- 🎮 **五子棋游戏** - 内置的经典棋类游戏
- 🌍 **维度探索** - 复杂的维度系统，支持权限管理
- 👥 **角色管理** - 详细的角色信息展示和管理
- 🎨 **特效系统** - 二进制雨、自定义光标、扫描线效果
- 📱 **响应式设计** - 完美适配各种屏幕尺寸

## 🚀 快速开始

### 环境要求

- **Node.js**: `^20.19.0 || >=22.12.0`
- **包管理器**: npm 或 yarn

### 安装依赖

```bash
# 克隆项目
git clone https://gitee.com/yukikage/emberstar.git
cd emberstar

# 安装依赖
npm install
```

### 开发模式

```bash
npm run dev
```

访问 [http://localhost:5173](http://localhost:5173) 查看项目

### 构建生产版本

```bash
npm run build
```

### 预览生产版本

```bash
npm run preview
```

## 📁 项目结构

```
emberstar/
├── public/                 # 静态资源
│   └── assets/
│       ├── audios/        # 音频文件
│       ├── avatar/        # 角色头像
│       └── cover/         # 音乐封面
├── src/
│   ├── assets/            # 样式文件
│   ├── components/        # Vue 组件
│   │   ├── renderers/     # 内容渲染器
│   │   ├── BinaryRain.vue
│   │   ├── CustomCursor.vue
│   │   ├── DimensionContentRenderer.vue
│   │   ├── GomokuGame.vue
│   │   ├── MusicPlayer.vue
│   │   └── ...
│   ├── router/            # 路由配置
│   ├── services/          # 服务层
│   │   ├── characterService.js
│   │   ├── dimensionService.js
│   │   ├── soulService.js
│   │   └── userService.js
│   ├── stores/            # Pinia 状态管理
│   ├── views/             # 页面视图
│   │   └── system/        # 系统子页面
│   ├── App.vue
│   └── main.js
├── 维度添加指南.md         # 开发指南
├── IFLOW.md              # 项目文档
└── package.json
```

## 🎮 核心功能

### 欢迎系统
- 多阶段欢迎流程：问候 → 登录 → 加载
- 二进制雨背景效果
- 平滑的过渡动画

### 系统界面
- **系统监控** - 实时系统状态展示
- **防御系统** - 安全防护功能
- **灵魂频率** - 灵魂数据管理
- **角色管理** - 角色信息查看和搜索
- **维度探索** - 多维度内容浏览

### 音乐播放器
- 支持多首歌曲播放
- 音量控制和静音功能
- 进度条拖动
- 播放列表管理
- 封面旋转动画

### 五子棋游戏
- 完整的游戏逻辑
- 重新开始功能
- 游戏状态显示

## 🛠️ 技术栈

| 技术 | 版本 | 说明 |
|------|------|------|
| [Vue.js](https://vuejs.org/) | 3.5.25 | 渐进式 JavaScript 框架 |
| [Vite](https://vitejs.dev/) | 7.2.4 | 下一代前端构建工具 |
| [Pinia](https://pinia.vuejs.org/) | 3.0.4 | Vue 的状态管理库 |
| [Vue Router](https://router.vuejs.org/) | 4.6.3 | Vue.js 的官方路由 |
| [Vue DevTools](https://devtools.vuejs.org/) | 8.0.5 | Vue.js 开发者工具 |

## 🎨 组件系统

### 特效组件
- `BinaryRain.vue` - 二进制雨背景效果
- `CustomCursor.vue` - 自定义光标
- `ScanLine.vue` - 扫描线效果
- `CursorEffect.vue` - 光标跟随效果

### 内容渲染器
- `StructuredContentRenderer.vue` - 通用结构化内容渲染器
- `ParagraphRenderer.vue` - 段落渲染器
- `ListRenderer.vue` - 列表渲染器
- `LogRenderer.vue` - 日志渲染器
- `QuoteRenderer.vue` - 引用渲染器

### 功能组件
- `MusicPlayer.vue` - 音乐播放器
- `GomokuGame.vue` - 五子棋游戏
- `SearchInput.vue` - 搜索输入组件
- `DimensionContentRenderer.vue` - 维度内容渲染器

## 📖 开发指南

### 添加新维度

详细的维度添加指南请参考：[维度添加指南.md](./维度添加指南.md)

### 代码规范

- 使用 **PascalCase** 命名组件文件
- 使用 **Composition API** 和 `<script setup>` 语法
- 使用 **scoped CSS** 避免样式污染
- 遵循 Vue 3 最佳实践

### 状态管理

项目使用 Pinia 进行状态管理：

```javascript
// 用户状态
import { useUserStore } from '@/stores/user'

// 角色数据
import { characterService } from '@/services/characterService'

// 维度数据
import { dimensionService } from '@/services/dimensionService'
```

## 🎯 角色系统

项目包含 8 个主要角色：

| 角色 | 别名 | 描述 |
|------|------|------|
| 星荧 | Emberstar | 主角，维度继承者 |
| 希月 | Cielune | 协理者 |
| 久夜 | Seren | 观察者 |
| 璃梦 | Lumiere | 守护者 |
| ... | ... | ... |

每个角色包含详细的信息：年龄、身高、种族、能力、性格等。

## 🌍 维度系统

### 可用维度

1. **余烬净土** (pureland) - 权限等级 7
2. **循环维度** (cycle) - 权限等级 7  
3. **虚空维度** (void) - 权限等级 6
4. **梦境维度** (dream) - 权限等级 6

### 维度权限

每个维度都有对应的权限等级要求，用户需要达到相应权限才能访问。

## 🎵 音乐资源

项目包含以下音乐：

- `愿戴荣光坠入天渊.ogg`
- `CRYCHIC - 春日影_H.ogg`
- `Eutopia.mp3`
- `Sacred Play Secret place.mp3`

## 🔧 配置说明

### Vite 配置

```javascript
// vite.config.js
export default defineConfig({
  plugins: [vue(), vueDevTools()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
```

### 路由配置

```javascript
// router/index.js
const routes = [
  { path: "/", redirect: "/welcome" },
  { path: "/welcome", component: WelcomeView },
  { 
    path: "/system", 
    component: SystemView,
    children: [
      // 系统子页面路由
    ]
  }
]
```

## 🎨 主题定制

项目使用 CSS 变量定义主题色彩：

```css
:root {
  --primary-color: #00ffff;
  --secondary-color: #66ffff;
  --highlight-color: #ffccff;
  --border-color: #0066ff;
}
```

## 📱 浏览器兼容性

| 浏览器 | 版本 | 支持情况 |
|--------|------|----------|
| Chrome | 90+ | ✅ 完全支持 |
| Firefox | 88+ | ✅ 完全支持 |
| Safari | 14+ | ✅ 完全支持 |
| Edge | 90+ | ✅ 完全支持 |

## 🤝 贡献指南

我们欢迎所有形式的贡献！

### 开发流程

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

### 代码提交规范

```
feat: 新功能
fix: 修复问题
docs: 文档更新
style: 代码格式调整
refactor: 代码重构
test: 测试相关
chore: 构建过程或辅助工具的变动
```

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 🙏 致谢

- [Vue.js](https://vuejs.org/) - 渐进式 JavaScript 框架
- [Vite](https://vitejs.dev/) - 下一代前端构建工具
- [Pinia](https://pinia.vuejs.org/) - Vue 的状态管理库

## 📞 联系方式

- 项目主页：[https://gitee.com/yukikage/emberstar](https://gitee.com/yukikage/emberstar)
- 问题反馈：[Issues](https://gitee.com/yukikage/emberstar/issues)

---

<div align="center">

**[⬆ 回到顶部](#emberstar---星荧交互式角色系统)**

Made with ❤️ by Emberstar Team

</div>
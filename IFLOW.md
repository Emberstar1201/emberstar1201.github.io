# Emberstar 项目文档

## 项目概述

Emberstar 是一个基于 Vue 3 + Vite 构建的交互式角色系统网站，具有赛博朋克风格的用户界面和丰富的角色管理功能。该项目展示了一个名为"星荧"(Emberstar)的角色及其相关角色的详细信息，并提供了系统监控、角色管理、维度探索、五子棋游戏等功能模块。

### 技术栈

- **前端框架**: Vue 3 (Composition API)
- **构建工具**: Vite 7.2.4
- **状态管理**: Pinia 3.0.4
- **路由管理**: Vue Router 4.6.3
- **样式**: 原生 CSS + 自定义样式
- **开发工具**: Vue DevTools 8.0.5
- **项目名称**: helloworld (version 0.0.0)

### 项目特色

- 赛博朋克风格的 UI 设计
- 完整的音乐播放器系统
- 自定义光标效果和扫描线动画
- 多语言打字机效果
- 角色数据管理系统
- 响应式设计
- 维度内容渲染系统
- 五子棋游戏功能
- 丰富的内容渲染器组件

## 项目结构

```
emberstar/
├── public/                 # 静态资源
│   ├── assets/
│   │   ├── audios/        # 音频文件
│   │   │   ├── 愿戴荣光坠入天渊.ogg
│   │   │   ├── CRYCHIC - 春日影_H.ogg
│   │   │   ├── Eutopia.mp3
│   │   │   └── Sacred Play Secret place.mp3
│   │   ├── avatar/        # 角色头像
│   │   │   ├── cielune.jpg
│   │   │   ├── emberstar.jpg
│   │   │   ├── etherealvelos.jpg
│   │   │   ├── lumiere.jpg
│   │   │   ├── lumirise.jpg
│   │   │   ├── qiyubai.jpg
│   │   │   ├── seren.jpg
│   │   │   └── vanya.jpg
│   │   └── cover/         # 音乐封面
│   │       ├── 春日影.webp
│   │       └── 愿戴荣光坠入天渊.webp
│   └── favicon.ico
├── src/
│   ├── assets/            # 样式文件
│   │   ├── main.css
│   │   └── styles.css
│   ├── components/        # Vue 组件
│   │   ├── renderers/     # 内容渲染器组件
│   │   │   ├── ContentBlockRenderer.vue
│   │   │   ├── HighlightedText.vue
│   │   │   ├── ListRenderer.vue
│   │   │   ├── LogRenderer.vue
│   │   │   ├── NestedListRenderer.vue
│   │   │   ├── NumberedListRenderer.vue
│   │   │   ├── ParagraphRenderer.vue
│   │   │   ├── QuoteRenderer.vue
│   │   │   └── SubsectionRenderer.vue
│   │   ├── BinaryRain.vue
│   │   ├── CursorEffect.vue
│   │   ├── CustomCursor.vue
│   │   ├── DimensionContentRenderer.vue
│   │   ├── GomokuGame.vue
│   │   ├── GreetingComponent.vue
│   │   ├── LoadingProgress.vue
│   │   ├── LoginFrom.vue
│   │   ├── MultilingualTypewriter.vue
│   │   ├── MusicPlayer.vue
│   │   ├── ScanLine.vue
│   │   ├── SearchInput.vue
│   │   ├── SideBar.vue
│   │   ├── SystemFooter.vue
│   │   └── SystemHeader.vue
│   ├── router/            # 路由配置
│   │   └── index.js
│   ├── services/          # 服务层
│   │   ├── characterService.js
│   │   ├── dimensionService.js
│   │   ├── soulService.js
│   │   └── userService.js
│   ├── stores/            # Pinia 状态管理
│   │   ├── counter.js
│   │   └── user.js
│   ├── views/             # 页面视图
│   │   ├── SystemView.vue
│   │   ├── WelcomeView.vue
│   │   └── system/
│   │       ├── CharacterView.vue
│   │       ├── DefenderView.vue
│   │       ├── DimensionView.vue
│   │       ├── MonitorView.vue
│   │       └── SoulFrequencyView.vue
│   ├── App.vue
│   └── main.js
├── index.html             # 入口 HTML
├── package.json           # 项目配置
├── vite.config.js         # Vite 配置
├── jsconfig.json          # JavaScript 配置
├── README.md              # 项目说明
└── IFLOW.md              # 项目文档
```

## 核心功能模块

### 1. 欢迎系统 (WelcomeView)
- 多阶段欢迎流程：问候 → 登录 → 加载
- 二进制雨背景效果
- 平滑的过渡动画

### 2. 系统界面 (SystemView)
- 系统监控 (MonitorView)
- 防御系统 (DefenderView)
- 灵魂频率 (SoulFrequencyView)
- 角色管理 (CharacterView)
- 维度探索 (DimensionView)

### 3. 音乐播放器 (MusicPlayer)
- 支持多首歌曲播放 (4首曲目)
- 音量控制和静音功能
- 进度条拖动
- 播放列表管理
- 封面旋转动画
- 支持格式：MP3, OGG

### 4. 角色系统
- 详细的角色信息展示
- 角色搜索和筛选
- 角色状态管理
- 8个角色头像资源

### 5. 维度探索系统
- 维度权限管理 (pureland: 7, cycle: 7, void: 6, dream: 6)
- 结构化维度内容渲染
- 多种内容类型支持 (段落、列表、引用、子章节等)
- 维度数据服务管理

### 6. 五子棋游戏 (GomokuGame)
- 完整的五子棋游戏逻辑
- 重新开始功能
- 游戏状态显示
- 关闭游戏功能

## 开发指南

### 环境要求

- Node.js: ^20.19.0 || >=22.12.0
- npm 或 yarn

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

### 预览生产版本

```bash
npm run preview
```

## 开发规范

### 组件命名
- 使用 PascalCase 命名组件文件
- 组件在模板中使用 PascalCase

### 状态管理
- 使用 Pinia 进行状态管理
- 用户状态存储在 `stores/user.js`
- 计数器状态存储在 `stores/counter.js`
- 使用 Composition API 风格

### 路由配置
- 路由配置在 `router/index.js`
- 使用懒加载组件
- 嵌套路由用于系统子页面
- 根路径重定向到 `/welcome`

### 样式规范
- 使用 scoped CSS 避免样式污染
- 响应式设计优先
- 使用 CSS 变量定义主题颜色

## 资源管理

### 静态资源
- 音频文件存放在 `public/assets/audios/` (4个文件)
- 角色头像存放在 `public/assets/avatar/` (8个角色)
- 音乐封面存放在 `public/assets/cover/` (2个封面)

### 服务层
- `characterService.js`: 角色数据管理
- `dimensionService.js`: 维度数据管理 (960行代码，复杂的维度系统)
- `soulService.js`: 灵魂频率管理
- `userService.js`: 用户数据管理

## 维度系统详解

### 维度类型
1. **余烬净土 (pureland)** - 权限等级 7
   - 面积：960万平方公里
   - 边界迷雾：300万平方公里的法则雾霭
   - 中心为星荧居所

2. **循环维度 (cycle)** - 权限等级 7
3. **虚空维度 (void)** - 权限等级 6
4. **梦境维度 (dream)** - 权限等级 6

### 内容渲染系统
- **DimensionContentRenderer**: 主要维度内容渲染器
- **ParagraphRenderer**: 段落内容渲染
- **ListRenderer**: 列表内容渲染
- **NumberedListRenderer**: 有序列表渲染
- **NestedListRenderer**: 嵌套列表渲染
- **SubsectionRenderer**: 子章节渲染
- **QuoteRenderer**: 引用内容渲染
- **HighlightedText**: 高亮文本渲染
- **LogRenderer**: 日志内容渲染

## 部署说明

项目构建后会在 `dist` 目录生成静态文件，可部署到任何静态文件服务器。

## 浏览器兼容性

- 支持现代浏览器 (Chrome, Firefox, Safari, Edge)
- 需要 ES2020+ 支持

## 开发工具推荐

- IDE: VS Code + Vue (Official) 扩展
- 浏览器: Chrome + Vue.js devtools
- 开启 Custom Object Formatter 以获得更好的调试体验

## 项目特色组件

### 特效组件
- `BinaryRain.vue`: 二进制雨背景效果
- `CustomCursor.vue`: 自定义光标
- `ScanLine.vue`: 扫描线效果
- `CursorEffect.vue`: 光标跟随效果

### 功能组件
- `MusicPlayer.vue`: 完整的音乐播放器
- `GreetingComponent.vue`: 问候组件
- `LoginFrom.vue`: 登录表单
- `LoadingProgress.vue`: 加载进度条
- `MultilingualTypewriter.vue`: 多语言打字机效果
- `SearchInput.vue`: 搜索输入组件
- `GomokuGame.vue`: 五子棋游戏
- `DimensionContentRenderer.vue`: 维度内容渲染器

### 系统组件
- `SideBar.vue`: 侧边栏导航
- `SystemHeader.vue`: 系统头部
- `SystemFooter.vue`: 系统底部

## 注意事项

1. 项目使用 Vite 的别名配置，`@` 指向 `src` 目录
2. 所有组件都使用 Composition API 和 `<script setup>` 语法
3. 样式采用赛博朋克风格，主要使用蓝色和紫色色调
4. 项目包含丰富的动画效果和交互体验
5. 维度系统包含复杂的权限管理和内容渲染逻辑
6. 项目支持多种音频格式和完整的音乐播放功能

## 角色数据结构

角色数据包含以下字段：
- `id`: 唯一标识符
- `name`: 角色名称
- `alias`: 别名
- `age`: 年龄
- `gender`: 性别
- `height`: 身高
- `weight`: 体重
- `race`: 种族
- `birthday`: 生日
- `divineEye`: 神之眼能力
- `favoriteFood`: 喜欢的食物
- `personality`: 性格描述
- `soulNature`: 灵魂本质
- `location`: 所在位置
- `description`: 详细描述
- `motto`: 座右铭
- `status`: 状态
- `avatar`: 头像路径

## 项目更新日志

### 最新更新
- 添加了完整的维度探索系统
- 新增五子棋游戏功能
- 完善了内容渲染器组件系统
- 扩展了音频资源库
- 优化了维度数据服务架构
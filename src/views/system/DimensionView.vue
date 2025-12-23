<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useUserStore } from "@/stores/user.js";
import { useRoute } from "vue-router";

const userStore = useUserStore();
const route = useRoute();

// 维度权限要求
const dimensionPermissions = {
  "pureland": 7,
  "cycle": 7,
  "void": 6,
  "dream": 6
};

// 当前选中的维度
const currentDimension = ref("pureland");

// 获取用户当前权限等级
const userPermissionLevel = computed(() => {
  return userStore.currentUser?.permissionLevel || 0;
});

// 处理维度切换的方法
const handleDimensionChange = (dimension) => {
  currentDimension.value = dimension;
};

// 从URL参数中获取维度
onMounted(() => {
  if (route.query.dimension && dimensionPermissions.hasOwnProperty(route.query.dimension)) {
    currentDimension.value = route.query.dimension;
  }
});

// 监听路由参数变化
watch(
  () => route.query.dimension,
  (newDimension) => {
    if (newDimension && dimensionPermissions.hasOwnProperty(newDimension)) {
      currentDimension.value = newDimension;
    }
  }
);

// 检查用户是否有权限访问当前选中的维度
const hasPermission = computed(() => {
  return userPermissionLevel.value >= dimensionPermissions[currentDimension.value];
});
</script>

<template>
  <!-- 维度档案资料内容 -->
  <div class="content-section">
    <h2 class="content-title">维度档案资料</h2>
    <div class="main-container">
      <ul class="sub-nav">
        <li class="sub-nav-item" :class="{ active: currentDimension === 'pureland' }"
          @click="handleDimensionChange('pureland')">
          余烬净土
        </li>
        <li class="sub-nav-item" :class="{ active: currentDimension === 'cycle' }"
          @click="handleDimensionChange('cycle')">
          轮回之地
        </li>
        <li class="sub-nav-item" :class="{ active: currentDimension === 'void' }"
          @click="handleDimensionChange('void')">
          虚无视界
        </li>
        <li class="sub-nav-item" :class="{ active: currentDimension === 'dream' }"
          @click="handleDimensionChange('dream')">
          梦境世界
        </li>
      </ul>
      <div class="content">
        <!-- 权限限制提示 -->
        <div v-if="!hasPermission" class="permission-restricted" id="permissionRestricted">
          <div class="restricted-icon">⛔</div>
          <div class="restricted-message">权限不足</div>
          <div class="restricted-detail">
            您当前的权限等级 ({{ userPermissionLevel }}) 无法访问此维度档案。<br>
            该档案需要权限等级: {{ dimensionPermissions[currentDimension] }}<br>
            请使用更高权限的账户登录。
          </div>
        </div>

        <!-- 维度内容显示逻辑 -->
        <div v-else class="dimension-container">
          <!-- 净土档案内容 -->
          <div v-if="currentDimension === 'pureland'" class="dimension-content pureland-content"
            id="pureland-dimension">
            <h2>Λ：概述</h2>
            <p>「余烬净土」是由<span class="highlight">『始源』之神</span>于陨落前创造的独立维度，游离于现实之外，作为世界尽头的终极庇护所。其本质为<span
                class="highlight">「绝对隐蔽与自主法则」</span>的具象化空间，不受神明观测与干涉，仅由继承者星荧及其认可者支配。</p>

            <div class="quote">
              "即便世界充满混沌与宿命，仍有一处地方，能让她自由地寻找属于自己的色彩。"<br>
              ------ 《始源遗言·终章》
            </div>

            <h2>Ⅰ：地理与时间法则</h2>
            <p>· 面积：<span class="highlight">960万平方公里</span>，地貌涵盖森林、湖泊、山谷等，中心为星荧居所。</p>
            <p>· <span class="highlight">边界迷雾</span>：覆盖300万平方公里的法则雾霭，具有「空间循环」特性，未经许可者进入后将被重置至原点。星荧及其许可者可自由通行（迷雾自动退散）。
            </p>
            <p>· 时间系统：</p>
            <p>&nbsp;&nbsp;- 现实世界参照：昼夜（白昼31.5小时，黑夜32.5小时）</p>
            <p>&nbsp;&nbsp;- 净土内部：</p>
            <p>&nbsp;&nbsp;&nbsp;&nbsp;· 永昼期（上半年）：太阳恒悬，光芒柔和，无昼夜交替</p>
            <p>&nbsp;&nbsp;&nbsp;&nbsp;· 永夜期（下半年）：皓月当空，银辉覆盖全域，温度恒定</p>

            <h2>Ⅱ：核心区域：星荧的居所</h2>
            <p>净土的中心矗立着一座四层小洋房，风格典雅而温馨，是星荧与同伴们的家。尽管她欢迎访客，但任何心怀不轨者------无论是强盗、野心家，还是傲慢的神明代行者------都将在踏入的瞬间被净土的法则<span
                class="highlight">"修正"</span>。</p>
            <p>历史上有过不少试图强占此地的存在，最终无一例外地湮灭于迷雾之中。</p>

            <h2>Ⅲ：特殊性质</h2>
            <p>1. <span class="highlight">神明不可观测</span>：净土被「始源」施加了绝对隐蔽的法则，即便是其他神明也无法感知或干涉此地。</p>
            <p>2. <span class="highlight">自主防御机制</span>：迷雾与时间法则共同构成净土的屏障，未经许可者无法进入。</p>
            <p>3. <span class="highlight">星荧的权能加持</span>：作为「始源」「终末」「虚无」「真我」四重权能的持有者，星荧能微调净土的部分规则。</p>

            <h2>Ⅳ：部分景点和现象</h2>
            <p>· <span class="highlight">永恒之森</span>：这片森林的树木永远保持着繁茂的生长状态，四季常青，树叶在风中轻轻摇曳，发出悦耳的沙沙声。</p>
            <p>· <span class="highlight">星辉湖畔</span>：湖水清澈见底，夜晚时分，湖面上会泛起点点星光，仿佛无数星辰坠落其中。</p>
            <p>· <span class="highlight">迷雾之谷</span>：这是一个被浓雾笼罩的山谷，雾气终年不散，但并不影响视线。</p>
            <p>· <span class="highlight">时光花园</span>：这里的花朵永远不会凋谢，四季盛开。每当风吹过，花瓣随风起舞，仿佛时间在这里停滞。</p>
            <p>· <span class="highlight">星辰海滩</span>：这是一片由细软白沙组成的海滩，夜晚时分，海滩上的沙子会发出淡淡的荧光。</p>

            <h2>Ⅴ：象征意义</h2>
            <p>净土不仅是物理意义上的庇护所，更象征着星荧从虚无中寻得的<span
                class="highlight">"归宿"</span>。它代表「始源」对她的祝福------"即便世界充满混沌与宿命，仍有一处地方，能让她自由地寻找属于自己的色彩"。</p>

            <div class="quote">
              "这里没有神明注视，没有命运束缚......只有永恒的昼与夜，以及，属于我们的故事。"<br>
              ------ 星荧
            </div>

            <h2>访问记录</h2>
            <p>> 用户：久夜 (权限级别: Θ)</p>
            <p>> 查询：净土安全协议</p>
            <p>> 系统：净土的滤网和防火墙会被攻破吗？</p>
            <p>> 星荧：<span class="highlight">目前来说不会</span> (Emberstar OS生成的滤网和屏蔽，加上始源之神当初创造的雾在这个星球上掩盖掉了净土的存在)</p>
            <p>> 状态：<span class="highlight">访问权限已确认</span></p>
          </div>

          <!-- 轮回之地档案内容 -->
          <div v-else-if="currentDimension === 'cycle'" class="dimension-content cycle-content" id="cycle-dimension">
            <h2>Λ：概述</h2>
            <p>「轮回之地」是由<span class="highlight">生命之神-希塔娜（Mother Hytana）</span>创造的灵魂归宿维度，独立于生者世界之外。其本质为<span
                class="highlight">「纯净灵魂的最终安息与循环之所」</span>，承载着接纳、净化和引导完成生命历程的灵魂回归世界本源（或等待新生）的职责。</p>
            <p>此地不受常规生死法则外的神明干涉，由希塔娜直接管理，希月作为其子嗣与协理者拥有部分观测与引导权限。</p>

            <div class="quote">
              "凋零并非终结，而是回归母树怀抱的静谧安眠。在此洗净尘埃，静待下一次绽放的契机。"<br>
              ------ 希塔娜箴言·安魂章
            </div>

            <h2>Ⅰ：地理与存在法则</h2>

            <h3>核心景观：</h3>

            <p><span class="highlight">无尽彼岸花海</span>：覆盖整个维度的基础地貌，花朵以纯净的白色与沉静的红色为主，无风时亦会轻轻摇曳，散发安抚灵魂的微光与幽香。</p>

            <p><span class="highlight">起源之树 (Mother
                Tree)</span>：位于维度中心的巨大银白色树木。其根系深扎于轮回之地的本源，枝干晶莹剔透，脉络中流淌着温和的生命光辉。它是所有灵魂最终流向的核心，也是维持维度稳定的基石。</p>

            <p><span class="highlight">地脉子树 (Saplings of the
                Cycle)</span>：起源之树的根系在花海各处延伸并孕育出的、形态相似但规模较小的银白色树木。它们作为次级节点，引导并汇聚附近的灵魂流。</p>

            <p><span class="highlight">归途之门 (The
                Threshold)</span>：位于起源之树后方，一扇由柔光构成、铭刻着生命符文的巨大拱门。通往现实世界的单向通道，仅当灵魂得到充分净化、休息并符合循环条件时，方有开启的可能（开启时间不定且需漫长等待）。
            </p>

            <p><span class="highlight">记忆溪流 (Stream of
                Remembrance)</span>：一条贯穿花海、流向起源之树的透明溪流，水中闪烁着星点般的蓝紫色微光。溪面漂浮着由纯净能量构成的莲花灯盏，灯芯内封存着生者在现实世界通过特定仪式寄托给逝者的思念话语（纸条的意念投影）。
            </p>

            <h3>时间法则：</h3>
            <p>无季节等常规时间流逝概念。时间感对灵魂而言近乎停滞或极其缓慢，仅以灵魂的净化程度和归途之门的开启周期作为模糊的"进程"标记。</p>
            <p>整个维度笼罩在永恒的、柔和如薄暮般的永夜，光源来自起源之树与地脉子树本身。</p>

            <h2>Ⅱ：核心法则与特性</h2>

            <div class="soul-flow">
              <p><span class="highlight">ⅰ. 灵魂筛选与净化：</span></p>
              <p>唯有灵魂本质纯净（无深重罪孽纠缠）或罪孽已被彻底宽恕/救赎的灵魂方能抵达此地。</p>
              <p>彼岸花海与记忆溪流具有温和的净化作用，帮助灵魂褪去生前的痛苦、执念与残留的负面能量，回归平静的本质状态。</p>
            </div>

            <div class="soul-flow">
              <p><span class="highlight">ⅱ. 安息与等待：</span></p>
              <p>灵魂在此地处于深度安眠与宁静状态，形态化为微光或融入花海/树的光辉中。</p>
              <p>等待周期漫长且不确定，直至归途之门为其开启，方意味着获得"回归本源"或"进入下一次生命循环"的资格。</p>
            </div>

            <div class="soul-flow">
              <p><span class="highlight">ⅲ. 希塔娜的领域：</span></p>
              <p>生命之神希塔娜的意识与权能弥漫整个维度，维系其存在与法则。她时刻关注着灵魂的安息进程。</p>
              <p>希月作为协理者，可在此地进行引导性巡视，安抚个别不安的灵魂（极为罕见），并定期向母亲大人汇报维度的稳定情况。</p>
            </div>

            <div class="soul-flow">
              <p><span class="highlight">ⅳ. 自主防御：</span></p>
              <p>生者或带有强烈恶意的存在（如试图窃取灵魂或破坏循环者）若强行闯入，将立即被轮回之地排斥。</p>
              <p>彼岸花会缠绕束缚入侵者，地脉子树的光芒会灼烧其存在本质，最终将其强制驱逐回原属维度，并可能留下永久性的"生命印记"伤痕。</p>
              <p>归途之门对生者绝对封闭，强行触碰将导致灵魂震荡甚至部分剥离。</p>
            </div>

            <h2>Ⅲ：希月的协理记录</h2>

            <p><span class="highlight">观测重点：</span></p>
            <p>定期巡视花海与子树网络，确认灵魂流的平稳与无淤塞。留意记忆溪流中灯盏的数量与亮度（反映生者的思念强度）。</p>

            <p><span
                class="highlight">权限限制：</span>无法主动开启归途之门，无法加速灵魂净化进程，无法干预希塔娜的直接意志。仅能在母亲大人允许的范围内进行最基础的维护与信息传递，或者授权临时开启归途之门（临时开启不会获得新生，是以灵魂状态在现实之中探望亲人一共可以存在于49天，时间到会回到「轮回之地」）
            </p>

            <p><span class="highlight">记录方式：</span></p>
            <p>将观测结果以意念形式注入靠近巡视路径的彼岸花中，花朵会暂时转变为淡金色，信息最终汇入起源之树供希塔娜检视。</p>

            <h2>Ⅳ：象征意义</h2>

            <p>轮回之地是生命循环中不可或缺的<span class="highlight">"休止符"</span>与<span
                class="highlight">"净化池"</span>。它象征着生命之神对逝去生灵的终极慈悲------提供一个免受侵扰、彻底安息并等待新生的神圣空间。</p>
            <p>它并非阴森的死亡国度，而是充满宁静希望的生命中转站，是凋零之花最终回归孕育之土的静谧旅程。</p>

            <div class="quote">
              "在母亲大人的树荫下，所有旅途的疲惫终将被抚平。安睡吧，纯净的灵魂，待那扇门扉再度开启，便是生命之歌新的序章。"<br>
              ------ 希月于轮回之地巡视日志
            </div>

            <h2>访问记录</h2>
            <p>> 用户：希月 (权限级别: Ψ)</p>
            <p>> 查询：轮回之地当前状态</p>
            <p>> 系统：灵魂流稳定，记忆溪流灯盏数量：█████</p>
            <p>> 状态：<span class="highlight">维度运行正常</span></p>
          </div>

          <!-- 虚无视界档案内容 -->
          <div v-else-if="currentDimension === 'void'" class="dimension-content void-content" id="void-dimension">
            <h2>Λ：现象本质</h2>
            <p>「虚无视界」是由<span class="highlight">『虚无』权能</span>展开的法则级领域，其本质为<span
                class="highlight">「剥离存在色彩，暴露世界底层逻辑」</span>的夹缝空间。</p>

            <div class="quote">
              "色彩是存在的锚点，当锚点消失，万物回归最原始的「信息态」"<br>
              ------ 星荧《虚无权能解析手稿》第7卷
            </div>

            <h2>Ⅰ：现象定性</h2>

            <div class="phenomenon">
              <p><span class="highlight">代号：</span>存在的地平线（The Horizon of Existence）</p>
              <p><span class="highlight">本质：</span>独立于现实维度的「否定性空间」，由『虚无』权能具象化而成，可视为物质世界与绝对虚无的临界膜。</p>
              <p><span class="highlight">触发条件：</span></p>
              <p>ⅰ. 星荧姐姐使用虚无权能</p>
              <p>ⅱ. 我通过共鸣（权能）</p>
              <p>ⅲ. <span class="warning">过度虚无主义化（消极）</span></p>
              <p><span class="highlight">稳定性：</span>熵值恒定，无时间流逝概念（进入者主观体感时间仍存在）</p>
            </div>

            <h2>Ⅱ：空间结构解析</h2>

            <div class="phenomenon">
              <p><span class="highlight">ⅰ. 天穹：</span></p>
              <p>- 无光源的纯黑幕布，悬浮无数颗恒定白光星体（非真实恒星，系『虚无』锚点）。</p>
              <p>- 黑洞占据天顶中央（直径约12.7公里），持续吸入白光星体，但吸入后会在其他位置重组（吞噬速度：1星体/72小时）。</p>
              <p>注：黑洞无引力效应，仅对星体产生「存在否定」作用（OS测算日志#14257年12月42日27:48:01）</p>
            </div>

            <div class="phenomenon">
              <p><span class="highlight">ⅱ. 地面：</span></p>
              <p>- 类似于水面，物质暂且未知,具有生成倒影的属性。但或许是虚无本质</p>
              <p>- 随机生成白色涟漪（直径0.5-5米），无规律扩散，触碰者会感知「存在被稀释」的寒意。</p>
            </div>

            <div class="phenomenon">
              <p><span class="highlight">ⅲ. 色彩法则：</span></p>
              <p>- 强制剥离除蓝色/紫色/绿色一切色彩（原理：波长＞450nm的光子被虚粒子分解）</p>
              <p>- 保留色系将褪为淡色调（如深蓝→天蓝），且自带微弱荧光（亮度：3.2流明）。</p>
              <p>*例外：『真我』持有者（星荧姐姐、还有我）免疫褪色（参见权能冲突协议）</p>
            </div>

            <h2>Ⅲ：现象：存在解离</h2>
            <p>进入「虚无视界」的个体将经历以下层级解离：</p>

            <div class="phenomenon">
              <p><span class="highlight">ⅰ. 感官剥离：</span></p>
              <p>- 视觉：除蓝/紫/绿色外，一切色彩被强制抽离，世界仅剩黑白灰的单调轮廓。</p>
              <p>- 听觉：环境音完全消失，仅剩黑洞的低频嗡鸣（约12Hz）、水面涟漪的细微颤动声，以及自身被放大的呼吸与心跳声。</p>
              <p>- 触觉：地面似水非水，踩踏时无阻力却会泛起涟漪，皮肤接触处有「冰针刺入」的幻痛感。</p>
            </div>

            <div class="phenomenon">
              <p><span class="highlight">ⅱ. 认知侵蚀：</span></p>
              <p>- 长期滞留者会逐渐混淆「信息态」与现实，例如将自身倒影误认为另一个体，或产生「存在意义被黑洞吞噬」的妄想。</p>
              <p>- 星荧姐姐的备注：<span class="warning">「此处连孤独都是奢侈------你只能听见自己消亡的倒计时。」</span></p>
            </div>

            <h2>Ⅳ：特殊效应</h2>

            <div class="phenomenon">
              <p><span class="highlight">ⅰ. 「真我」豁免：</span></p>
              <p>- 星荧姐姐与我的权能可免疫色彩剥离，其身影成为视界内唯二的鲜明存在（蓝紫色光尘轨迹不受影响）。</p>
              <p>- 其他携带『真我』碎片者（如陌心的符文玩偶）会散发微弱荧光，成为临时锚点。</p>
            </div>

            <div class="phenomenon">
              <p><span class="highlight">ⅱ. 空间悖论：</span></p>
              <p>- 任何试图攻击黑洞或白光星体的行为均会触发「因果反弹」，攻击者将承受等同伤害的「存在稀释」（例：挥刀劈砍星体，自身躯干对应部位透明化）。</p>
            </div>

            <h2>结语</h2>
            <div class="quote">
              「虚无视界」并非死寂的牢笼，而是赤裸的真相剧场。<br>
              在此，所有伪装与色彩皆被剥落，唯有无声的星体与黑洞永恒诘问------<br>
              「你的存在，是否经得起虚无的称量？」*
            </div>

            <h2>访问记录</h2>
            <p>> 用户：久夜 (权限级别: Ω)</p>
            <p>> 查询：虚无视界现象档案</p>
            <p>> 系统：档案完整，警告 - 存在解离效应活跃</p>
            <p>> 状态：<span class="highlight">观测模式已激活</span></p>
          </div>

          <!-- 梦境世界档案内容 -->
          <div v-else-if="currentDimension === 'dream'" class="dimension-content dream-content" id="dream-dimension">
            <h2>Λ：存在形式</h2>
            <p>由<span class="highlight">众生意念与『始源』权能共鸣</span>生成的潜意识投影空间，无恒定物理形态。</p>
            <p>基础场景以进入者最强烈的情感记忆为蓝本。<span class="highlight">每一次做梦的场景并非是一模一样的</span>。</p>

            <div class="quote">
              "梦境是心灵的镜子，映照出我们最深的渴望与恐惧。"<br>
              ------ 艾瑟尔·维洛斯《梦境裁定录》
            </div>

            <h2>Ⅰ：梦境记录 - 艾瑟尔·维洛斯的书中</h2>

            <div class="dream-record">
              <h3><span class="highlight">星荧（Emberstar）</span></h3>
              <p><span class="highlight">常规梦境：</span>净土边缘的雪原，中央矗立冰结苹果树，树下有着一张木质桌子，上面摆放着茶具，桌子旁边有七条凳子和一个大的凳子。</p>
              <p><span class="highlight">异常：</span>当情绪剧烈波动时，会无意识连接『虚无视界』，场景会褪回黑白灰3色，但是蓝色和紫色以及绿色不会退。</p>
            </div>

            <div class="dream-record">
              <h3><span class="highlight">璃梦（Lumielle）</span></h3>
              <p><span class="highlight">常规梦境：</span>一座被藤蔓缠绕的古老钟楼，钟摆静止在午夜时分，周围弥漫着淡紫色的雾气。</p>
              <p><span class="highlight">异常：</span>当死亡之神的控制增强时，钟楼会逐渐崩解为黑色灰烬；若毁灭之神介入，提灯火焰会转为猩红色。</p>
            </div>

            <div class="dream-record">
              <h3><span class="highlight">希月（Cielune）</span></h3>
              <p><span class="highlight">常规梦境：</span>一片无边无际的蒲公英田野，中央有一棵半枯半荣的巨树，树下悬浮着一架透明天平。</p>
              <p><span class="highlight">异常：</span>若生死平衡被打破，田野会分裂为两极，天平倾斜时发出风铃般的悲鸣。</p>
            </div>

            <div class="dream-record">
              <h3><span class="highlight">久夜（Seren）</span></h3>
              <p><span class="highlight">常规梦境：</span>一片缀满星光的浅滩，潮汐规律地冲刷着沙地上发光的符文。</p>
              <p><span class="highlight">异常：</span>当其中一团光晕微弱时，花房会渗出淡蓝色雾气；若久夜产生自我怀疑，浅滩会凝结成镜面。</p>
            </div>

            <h2>Ⅱ：管理者的观测日志</h2>

            <div class="dream-record">
              <h3><span class="highlight">星荧的梦境日常</span></h3>
              <p><span class="highlight">观测状态：</span>稳定（无异常波动）</p>
              <p>今日的雪原比往常更安静，冰结苹果树的枝条上凝结了一层薄霜。星荧坐在木桌旁，安静地喝茶，茶杯里的液体呈现出淡蓝色。</p>
              <p><span class="highlight">裁定者批注：</span>情绪平稳，无需干预。</p>
            </div>

            <div class="dream-record">
              <h3><span class="highlight">璃梦的梦境日常</span></h3>
              <p><span class="highlight">观测状态：</span>轻微波动（死亡之神权能残留）</p>
              <p>钟楼的藤蔓比昨日茂密了些，雾气中的紫色略微加深。提灯旁新增了一个破损的玩偶。钟摆依旧静止，但能听见极轻的"滴答"声。</p>
              <p><span class="highlight">裁定者批注：</span>持续监测，若玩偶数量增加超过三个，需一级干预。</p>
            </div>

            <div class="dream-record">
              <h3><span class="highlight">希月的梦境日常</span></h3>
              <p><span class="highlight">观测状态：</span>平衡（无倾斜迹象）</p>
              <p>蒲公英田野的风向今日转为逆时针，但未影响天平平衡。巨树的枯枝侧有新生嫩芽，荣枯比例维持在5:5。</p>
              <p><span class="highlight">裁定者批注：</span>生命之神近期未介入，状态良好。</p>
            </div>

            <h2>Ⅲ：异常实体：梦魇（Nightmare）</h2>

            <div class="dream-record">
              <h3>存在形式</h3>
              <p>梦魇没有固定的形态，可以根据梦境者的恐惧和不安变化形态，常见的有黑暗阴影、恐怖生物或扭曲的形象。</p>
              <p>梦魇通常出现在梦境者情绪不稳定或受到外部压力时，它们会利用梦境者的恐惧和不安来增强自己的力量。</p>
            </div>

            <div class="dream-record">
              <h3>能力与弱点</h3>
              <p><span class="highlight">能力：</span>影响梦境者的情绪，改变梦境内容，干扰梦境者的思维。</p>
              <p><span class="highlight">弱点：</span>与梦境者的恐惧和不安有关，当梦境者克服恐惧时，梦魇的力量就会减弱。</p>
              <p><span class="highlight">特殊发现：</span>星荧的梦境不会被入侵，也许跟她梦境中的虚无有关。</p>
            </div>

            <div class="quote">
              "梦境世界如同一本无限的书，每一页都是一个灵魂的故事。<br>
              作为裁定者，我的职责是确保这些故事不会变成噩梦。"<br>
              ------ 艾瑟尔·维洛斯
            </div>

            <h2>访问记录</h2>
            <p>> 用户：艾瑟尔·维洛斯 (权限级别: Ω)</p>
            <p>> 查询：梦境世界档案更新</p>
            <p>> 系统：档案同步完成，梦境稳定性监测中</p>
            <p>> 状态：<span class="highlight">梦境流稳定</span></p>
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
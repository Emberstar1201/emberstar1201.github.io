// 维度数据服务
export class DimensionService {
  constructor() {
    // 维度权限要求
    this.dimensionPermissions = {
      "pureland": 7,
      "cycle": 6,
      "void": 6,
      "dream": 6
    };

    // 维度数据 - 使用纯结构化数据
    this.dimensions = {
      pureland: {
        id: "pureland",
        name: "余烬净土",
        content: {
          sections: [
            {
              title: "Λ：概述",
              content: [
                {
                  type: "paragraph",
                  text: "「余烬净土」是由『始源』之神于陨落前创造的独立维度，游离于现实之外，作为世界尽头的终极庇护所。其本质为「绝对隐蔽与自主法则」的具象化空间，不受神明观测与干涉，仅由继承者星荧及其认可者支配。",
                  highlights: ["『始源』之神", "「绝对隐蔽与自主法则」"]
                }
              ],
              quote: {
                text: "即便世界充满混沌与宿命，仍有一处地方，能让她自由地寻找属于自己的色彩。",
                author: "《始源遗言·终章》"
              }
            },
            {
              title: "Ⅰ：地理与时间法则",
              content: [
                {
                  type: "list",
                  items: [
                    {
                      text: "面积：960万平方公里，地貌涵盖森林、湖泊、山谷等，中心为星荧居所。",
                      highlights: ["960万平方公里"]
                    },
                    {
                      text: "边界迷雾：覆盖300万平方公里的法则雾霭，具有「空间循环」特性，未经许可者进入后将被重置至原点。星荧及其许可者可自由通行（迷雾自动退散）。",
                      highlights: ["边界迷雾"]
                    }
                  ]
                },
                {
                  type: "paragraph",
                  text: "时间系统："
                },
                {
                  type: "nestedList",
                  items: [
                    {
                      text: "现实世界参照：昼夜（白昼31.5小时，黑夜32.5小时）"
                    },
                    {
                      text: "净土内部：",
                      subItems: [
                        "永昼期（上半年）：太阳恒悬，光芒柔和，无昼夜交替",
                        "永夜期（下半年）：皓月当空，银辉覆盖全域，温度恒定"
                      ]
                    }
                  ]
                }
              ]
            },
            {
              title: "Ⅱ：核心区域：星荧的居所",
              content: [
                {
                  type: "paragraph",
                  text: "净土的中心矗立着一座四层小洋房，风格典雅而温馨，是星荧与同伴们的家。尽管她欢迎访客，但任何心怀不轨者------无论是强盗、野心家，还是傲慢的神明代行者------都将在踏入的瞬间被净土的法则「修正」。",
                  highlights: ["修正"]
                },
                {
                  type: "paragraph",
                  text: "历史上有过不少试图强占此地的存在，最终无一例外地湮灭于迷雾之中。"
                }
              ]
            },
            {
              title: "Ⅲ：特殊性质",
              content: [
                {
                  type: "numberedList",
                  items: [
                    {
                      text: "神明不可观测：净土被「始源」施加了绝对隐蔽的法则，即便是其他神明也无法感知或干涉此地。",
                      highlights: ["神明不可观测"]
                    },
                    {
                      text: "自主防御机制：迷雾与时间法则共同构成净土的屏障，未经许可者无法进入。",
                      highlights: ["自主防御机制"]
                    },
                    {
                      text: "星荧的权能加持：作为「始源」「终末」「虚无」「真我」四重权能的持有者，星荧能微调净土的部分规则。",
                      highlights: ["星荧的权能加持"]
                    }
                  ]
                }
              ]
            },
            {
              title: "Ⅳ：部分景点和现象",
              content: [
                {
                  type: "list",
                  items: [
                    {
                      text: "永恒之森：这片森林的树木永远保持着繁茂的生长状态，四季常青，树叶在风中轻轻摇曳，发出悦耳的沙沙声。",
                      highlights: ["永恒之森"]
                    },
                    {
                      text: "星辉湖畔：湖水清澈见底，夜晚时分，湖面上会泛起点点星光，仿佛无数星辰坠落其中。",
                      highlights: ["星辉湖畔"]
                    },
                    {
                      text: "迷雾之谷：这是一个被浓雾笼罩的山谷，雾气终年不散，但并不影响视线。",
                      highlights: ["迷雾之谷"]
                    },
                    {
                      text: "时光花园：这里的花朵永远不会凋谢，四季盛开。每当风吹过，花瓣随风起舞，仿佛时间在这里停滞。",
                      highlights: ["时光花园"]
                    },
                    {
                      text: "星辰海滩：这是一片由细软白沙组成的海滩，夜晚时分，海滩上的沙子会发出淡淡的荧光。",
                      highlights: ["星辰海滩"]
                    }
                  ]
                }
              ]
            },
            {
              title: "Ⅴ：象征意义",
              content: [
                {
                  type: "paragraph",
                  text: "净土不仅是物理意义上的庇护所，更象征着星荧从虚无中寻得的「归宿」。它代表「始源」对她的祝福------\"即便世界充满混沌与宿命，仍有一处地方，能让她自由地寻找属于自己的色彩\"。",
                  highlights: ["归宿"]
                }
              ],
              quote: {
                text: "这里没有神明注视，没有命运束缚......只有永恒的昼与夜，以及，属于我们的故事。",
                author: "星荧"
              }
            },
            {
              title: "访问记录",
              content: [
                {
                  type: "log",
                  items: [
                    { label: "用户", value: "久夜 (权限级别: Θ)" },
                    { label: "查询", value: "净土安全协议" },
                    { label: "系统", value: "净土的滤网和防火墙会被攻破吗？" },
                    { 
                      label: "星荧", 
                      value: "目前来说不会 (Emberstar OS生成的滤网和屏蔽，加上始源之神当初创造的雾在这个星球上掩盖掉了净土的存在)",
                      highlights: ["目前来说不会"]
                    },
                    { 
                      label: "状态", 
                      value: "访问权限已确认",
                      highlights: ["访问权限已确认"]
                    }
                  ]
                }
              ]
            }
          ]
        }
      },
      cycle: {
        id: "cycle",
        name: "轮回之地",
        content: {
          sections: [
            {
              title: "Λ：概述",
              content: [
                {
                  type: "paragraph",
                  text: "「轮回之地」是由生命之神-希塔娜（Mother Hytana）创造的灵魂归宿维度，独立于生者世界之外。其本质为「纯净灵魂的最终安息与循环之所」，承载着接纳、净化和引导完成生命历程的灵魂回归世界本源（或等待新生）的职责。",
                  highlights: ["生命之神-希塔娜（Mother Hytana）", "「纯净灵魂的最终安息与循环之所」"]
                },
                {
                  type: "paragraph",
                  text: "此地不受常规生死法则外的神明干涉，由希塔娜直接管理，希月作为其子嗣与协理者拥有部分观测与引导权限。"
                }
              ],
              quote: {
                text: "凋零并非终结，而是回归母树怀抱的静谧安眠。在此洗净尘埃，静待下一次绽放的契机。",
                author: "希塔娜箴言·安魂章"
              }
            },
            {
              title: "Ⅰ：地理与存在法则",
              content: [
                {
                  type: "subsection",
                  title: "核心景观：",
                  items: [
                    {
                      type: "paragraph",
                      text: "无尽彼岸花海：覆盖整个维度的基础地貌，花朵以纯净的白色与沉静的红色为主，无风时亦会轻轻摇曳，散发安抚灵魂的微光与幽香。",
                      highlights: ["无尽彼岸花海"]
                    },
                    {
                      type: "paragraph",
                      text: "起源之树 (Mother Tree)：位于维度中心的巨大银白色树木。其根系深扎于轮回之地的本源，枝干晶莹剔透，脉络中流淌着温和的生命光辉。它是所有灵魂最终流向的核心，也是维持维度稳定的基石。",
                      highlights: ["起源之树 (Mother Tree)"]
                    },
                    {
                      type: "paragraph",
                      text: "地脉子树 (Saplings of the Cycle)：起源之树的根系在花海各处延伸并孕育出的、形态相似但规模较小的银白色树木。它们作为次级节点，引导并汇聚附近的灵魂流。",
                      highlights: ["地脉子树 (Saplings of the Cycle)"]
                    },
                    {
                      type: "paragraph",
                      text: "归途之门 (The Threshold)：位于起源之树后方，一扇由柔光构成、铭刻着生命符文的巨大拱门。通往现实世界的单向通道，仅当灵魂得到充分净化、休息并符合循环条件时，方有开启的可能（开启时间不定且需漫长等待）。",
                      highlights: ["归途之门 (The Threshold)"]
                    },
                    {
                      type: "paragraph",
                      text: "记忆溪流 (Stream of Remembrance)：一条贯穿花海、流向起源之树的透明溪流，水中闪烁着星点般的蓝紫色微光。溪面漂浮着由纯净能量构成的莲花灯盏，灯芯内封存着生者在现实世界通过特定仪式寄托给逝者的思念话语（纸条的意念投影）。",
                      highlights: ["记忆溪流 (Stream of Remembrance)"]
                    }
                  ]
                },
                {
                  type: "subsection",
                  title: "时间法则：",
                  items: [
                    {
                      type: "paragraph",
                      text: "无季节等常规时间流逝概念。时间感对灵魂而言近乎停滞或极其缓慢，仅以灵魂的净化程度和归途之门的开启周期作为模糊的「进程」标记。"
                    },
                    {
                      type: "paragraph",
                      text: "整个维度笼罩在永恒的、柔和如薄暮般的永夜，光源来自起源之树与地脉子树本身。"
                    }
                  ]
                }
              ]
            },
            {
              title: "Ⅱ：核心法则与特性",
              content: [
                {
                  type: "structuredContent",
                  style: "soul-flow",
                  title: "ⅰ. 灵魂筛选与净化：",
                  highlights: ["ⅰ. 灵魂筛选与净化："],
                  items: [
                    {
                      text: "唯有灵魂本质纯净（无深重罪孽纠缠）或罪孽已被彻底宽恕/救赎的灵魂方能抵达此地。"
                    },
                    {
                      text: "彼岸花海与记忆溪流具有温和的净化作用，帮助灵魂褪去生前的痛苦、执念与残留的负面能量，回归平静的本质状态。"
                    }
                  ]
                },
                {
                  type: "structuredContent",
                  style: "soul-flow",
                  title: "ⅱ. 安息与等待：",
                  highlights: ["ⅱ. 安息与等待："],
                  items: [
                    {
                      text: "灵魂在此地处于深度安眠与宁静状态，形态化为微光或融入花海/树的光辉中。"
                    },
                    {
                      text: "等待周期漫长且不确定，直至归途之门为其开启，方意味着获得「回归本源」或「进入下一次生命循环」的资格。"
                    }
                  ]
                },
                {
                  type: "structuredContent",
                  style: "soul-flow",
                  title: "ⅲ. 希塔娜的领域：",
                  highlights: ["ⅲ. 希塔娜的领域："],
                  items: [
                    {
                      text: "生命之神希塔娜的意识与权能弥漫整个维度，维系其存在与法则。她时刻关注着灵魂的安息进程。"
                    },
                    {
                      text: "希月作为协理者，可在此地进行引导性巡视，安抚个别不安的灵魂（极为罕见），并定期向母亲大人汇报维度的稳定情况。"
                    }
                  ]
                },
                {
                  type: "structuredContent",
                  style: "soul-flow",
                  title: "ⅳ. 自主防御：",
                  highlights: ["ⅳ. 自主防御："],
                  items: [
                    {
                      text: "生者或带有强烈恶意的存在（如试图窃取灵魂或破坏循环者）若强行闯入，将立即被轮回之地排斥。"
                    },
                    {
                      text: "彼岸花会缠绕束缚入侵者，地脉子树的光芒会灼烧其存在本质，最终将其强制驱逐回原属维度，并可能留下永久性的「生命印记」伤痕。"
                    },
                    {
                      text: "归途之门对生者绝对封闭，强行触碰将导致灵魂震荡甚至部分剥离。"
                    }
                  ]
                }
              ]
            },
            {
              title: "Ⅲ：希月的协理记录",
              content: [
                {
                  type: "paragraph",
                  text: "观测重点：",
                  highlights: ["观测重点："]
                },
                {
                  type: "paragraph",
                  text: "定期巡视花海与子树网络，确认灵魂流的平稳与无淤塞。留意记忆溪流中灯盏的数量与亮度（反映生者的思念强度）。"
                },
                {
                  type: "paragraph",
                  text: "权限限制：无法主动开启归途之门，无法加速灵魂净化进程，无法干预希塔娜的直接意志。仅能在母亲大人允许的范围内进行最基础的维护与信息传递，或者授权临时开启归途之门（临时开启不会获得新生，是以灵魂状态在现实之中探望亲人一共可以存在于49天，时间到会回到「轮回之地」）",
                  highlights: ["权限限制："]
                },
                {
                  type: "paragraph",
                  text: "记录方式：",
                  highlights: ["记录方式："]
                },
                {
                  type: "paragraph",
                  text: "将观测结果以意念形式注入靠近巡视路径的彼岸花中，花朵会暂时转变为淡金色，信息最终汇入起源之树供希塔娜检视。"
                }
              ]
            },
            {
              title: "Ⅳ：象征意义",
              content: [
                {
                  type: "paragraph",
                  text: "轮回之地是生命循环中不可或缺的「休止符」与「净化池」。它象征着生命之神对逝去生灵的终极慈悲------提供一个免受侵扰、彻底安息并等待新生的神圣空间。",
                  highlights: ["休止符", "净化池"]
                },
                {
                  type: "paragraph",
                  text: "它并非阴森的死亡国度，而是充满宁静希望的生命中转站，是凋零之花最终回归孕育之土的静谧旅程。"
                }
              ],
              quote: {
                text: "在母亲大人的树荫下，所有旅途的疲惫终将被抚平。安睡吧，纯净的灵魂，待那扇门扉再度开启，便是生命之歌新的序章。",
                author: "希月于轮回之地巡视日志"
              }
            },
            {
              title: "访问记录",
              content: [
                {
                  type: "log",
                  items: [
                    { label: "用户", value: "希月 (权限级别: Ψ)" },
                    { label: "查询", value: "轮回之地当前状态" },
                    { label: "系统", value: "灵魂流稳定，记忆溪流灯盏数量：█████" },
                    { 
                      label: "状态", 
                      value: "维度运行正常",
                      highlights: ["维度运行正常"]
                    }
                  ]
                }
              ]
            }
          ]
        }
      },
      void: {
        id: "void",
        name: "虚无视界",
        content: {
          sections: [
            {
              title: "Λ：现象本质",
              content: [
                {
                  type: "paragraph",
                  text: "「虚无视界」是由『虚无』权能展开的法则级领域，其本质为「剥离存在色彩，暴露世界底层逻辑」的夹缝空间。",
                  highlights: ["『虚无』权能", "「剥离存在色彩，暴露世界底层逻辑」"]
                }
              ],
              quote: {
                text: "色彩是存在的锚点，当锚点消失，万物回归最原始的「信息态」",
                author: "星荧《虚无权能解析手稿》第7卷"
              }
            },
            {
              title: "Ⅰ：现象定性",
              content: [
                {
                  type: "structuredContent",
                  style: "phenomenon",
                  items: [
                    {
                      label: "代号：",
                      value: "存在的地平线（The Horizon of Existence）"
                    },
                    {
                      label: "本质：",
                      value: "独立于现实维度的「否定性空间」，由『虚无』权能具象化而成，可视为物质世界与绝对虚无的临界膜。"
                    },
                    {
                      label: "触发条件：",
                      value: "",
                      subItems: [
                        "ⅰ. 星荧姐姐使用虚无权能",
                        "ⅱ. 我通过共鸣（权能）",
                        "ⅲ. 过度虚无主义化（消极）",
                        { text: "过度虚无主义化（消极）", type: "warning" }
                      ]
                    },
                    {
                      label: "稳定性：",
                      value: "熵值恒定，无时间流逝概念（进入者主观体感时间仍存在）"
                    }
                  ]
                }
              ]
            },
            {
              title: "Ⅱ：空间结构解析",
              content: [
                {
                  type: "structuredContent",
                  style: "phenomenon",
                  title: "ⅰ. 天穹：",
                  items: [
                    "- 无光源的纯黑幕布，悬浮无数颗恒定白光星体（非真实恒星，系『虚无』锚点）。",
                    "- 黑洞占据天顶中央（直径约12.7公里），持续吸入白光星体，但吸入后会在其他位置重组（吞噬速度：1星体/72小时）。",
                    "注：黑洞无引力效应，仅对星体产生「存在否定」作用（OS测算日志#14257年12月42日27:48:01）"
                  ]
                },
                {
                  type: "structuredContent",
                  style: "phenomenon",
                  title: "ⅱ. 地面：",
                  items: [
                    "- 类似于水面，物质暂且未知,具有生成倒影的属性。但或许是虚无本质",
                    "- 随机生成白色涟漪（直径0.5-5米），无规律扩散，触碰者会感知「存在被稀释」的寒意。"
                  ]
                },
                {
                  type: "structuredContent",
                  style: "phenomenon",
                  title: "ⅲ. 色彩法则：",
                  items: [
                    "- 强制剥离除蓝色/紫色/绿色一切色彩（原理：波长＞450nm的光子被虚粒子分解）",
                    "- 保留色系将褪为淡色调（如深蓝→天蓝），且自带微弱荧光（亮度：3.2流明）。",
                    "*例外：『真我』持有者（星荧姐姐、还有我）免疫褪色（参见权能冲突协议）"
                  ]
                }
              ]
            },
            {
              title: "Ⅲ：现象：存在解离",
              content: [
                {
                  type: "paragraph",
                  text: "进入「虚无视界」的个体将经历以下层级解离："
                },
                {
                  type: "structuredContent",
                  style: "phenomenon",
                  title: "ⅰ. 感官剥离：",
                  items: [
                    "- 视觉：除蓝/紫/绿色外，一切色彩被强制抽离，世界仅剩黑白灰的单调轮廓。",
                    "- 听觉：环境音完全消失，仅剩黑洞的低频嗡鸣（约12Hz）、水面涟漪的细微颤动声，以及自身被放大的呼吸与心跳声。",
                    "- 触觉：地面似水非水，踩踏时无阻力却会泛起涟漪，皮肤接触处有「冰针刺入」的幻痛感。"
                  ],
                  highlights: ["ⅰ. 感官剥离："]
                },
                {
                  type: "structuredContent",
                  style: "phenomenon",
                  title: "ⅱ. 认知侵蚀：",
                  items: [
                    "- 长期滞留者会逐渐混淆「信息态」与现实，例如将自身倒影误认为另一个体，或产生「存在意义被黑洞吞噬」的妄想。",
                    "- 星荧姐姐的备注：「此处连孤独都是奢侈------你只能听见自己消亡的倒计时。」"
                  ],
                  highlights: ["ⅱ. 认知侵蚀："],
                  warnings: ["「此处连孤独都是奢侈------你只能听见自己消亡的倒计时。」"]
                }
              ]
            },
            {
              title: "Ⅳ：特殊效应",
              content: [
                {
                  type: "structuredContent",
                  style: "phenomenon",
                  title: "ⅰ. 「真我」豁免：",
                  items: [
                    "- 星荧姐姐与我的权能可免疫色彩剥离，其身影成为视界内唯二的鲜明存在（蓝紫色光尘轨迹不受影响）。",
                    "- 其他携带『真我』碎片者（如陌心的符文玩偶）会散发微弱荧光，成为临时锚点。"
                  ],
                  highlights: ["ⅰ. 「真我」豁免："]
                },
                {
                  type: "structuredContent",
                  style: "phenomenon",
                  title: "ⅱ. 空间悖论：",
                  items: [
                    "- 任何试图攻击黑洞或白光星体的行为均会触发「因果反弹」，攻击者将承受等同伤害的「存在稀释」（例：挥刀劈砍星体，自身躯干对应部位透明化）。"
                  ],
                  highlights: ["ⅱ. 空间悖论："]
                }
              ]
            },
            {
              title: "结语",
              content: [
                {
                  type: "quote",
                  text: "「虚无视界」并非死寂的牢笼，而是赤裸的真相剧场。<br>在此，所有伪装与色彩皆被剥落，唯有无声的星体与黑洞永恒诘问------<br>「你的存在，是否经得起虚无的称量？」*",
                  multiline: true
                }
              ]
            },
            {
              title: "访问记录",
              content: [
                {
                  type: "log",
                  items: [
                    { label: "用户", value: "久夜 (权限级别: Ω)" },
                    { label: "查询", value: "虚无视界现象档案" },
                    { label: "系统", value: "档案完整，警告 - 存在解离效应活跃" },
                    { 
                      label: "状态", 
                      value: "观测模式已激活",
                      highlights: ["观测模式已激活"]
                    }
                  ]
                }
              ]
            }
          ]
        }
      },
      dream: {
        id: "dream",
        name: "梦境世界",
        content: {
          sections: [
            {
              title: "Λ：存在形式",
              content: [
                {
                  type: "paragraph",
                  text: "由众生意念与『始源』权能共鸣生成的潜意识投影空间，无恒定物理形态。",
                  highlights: ["众生意念与『始源』权能共鸣"]
                },
                {
                  type: "paragraph",
                  text: "基础场景以进入者最强烈的情感记忆为蓝本。每一次做梦的场景并非是一模一样的。",
                  highlights: ["每一次做梦的场景并非是一模一样的"]
                }
              ],
              quote: {
                text: "梦境是心灵的镜子，映照出我们最深的渴望与恐惧。",
                author: "艾瑟尔·维洛斯《梦境裁定录》"
              }
            },
            {
              title: "Ⅰ：梦境记录 - 艾瑟尔·维洛斯的书中",
              content: [
                {
                  type: "structuredContent",
                  style: "dream-record",
                  subtitle: "星荧（Emberstar）",
                  items: [
                    {
                      label: "常规梦境：",
                      value: "净土边缘的雪原，中央矗立冰结苹果树，树下有着一张木质桌子，上面摆放着茶具，桌子旁边有七条凳子和一个大的凳子。"
                    },
                    {
                      label: "异常：",
                      value: "当情绪剧烈波动时，会无意识连接『虚无视界』，场景会褪回黑白灰3色，但是蓝色和紫色以及绿色不会退。"
                    }
                  ],
                  highlights: ["星荧（Emberstar）"]
                },
                {
                  type: "structuredContent",
                  style: "dream-record",
                  subtitle: "璃梦（Lumielle）",
                  items: [
                    {
                      label: "常规梦境：",
                      value: "一座被藤蔓缠绕的古老钟楼，钟摆静止在午夜时分，周围弥漫着淡紫色的雾气。"
                    },
                    {
                      label: "异常：",
                      value: "当死亡之神的控制增强时，钟楼会逐渐崩解为黑色灰烬；若毁灭之神介入，提灯火焰会转为猩红色。"
                    }
                  ],
                  highlights: ["璃梦（Lumielle）"]
                },
                {
                  type: "structuredContent",
                  style: "dream-record",
                  subtitle: "希月（Cielune）",
                  items: [
                    {
                      label: "常规梦境：",
                      value: "一片无边无际的蒲公英田野，中央有一棵半枯半荣的巨树，树下悬浮着一架透明天平。"
                    },
                    {
                      label: "异常：",
                      value: "若生死平衡被打破，田野会分裂为两极，天平倾斜时发出风铃般的悲鸣。"
                    }
                  ],
                  highlights: ["希月（Cielune）"]
                },
                {
                  type: "structuredContent",
                  style: "dream-record",
                  subtitle: "久夜（Seren）",
                  highlights: ["久夜（Seren）"],
                  items: [
                    {
                      label: "常规梦境：",
                      value: "一片缀满星光的浅滩，潮汐规律地冲刷着沙地上发光的符文。"
                    },
                    {
                      label: "异常：",
                      value: "当其中一团光晕微弱时，花房会渗出淡蓝色雾气；若久夜产生自我怀疑，浅滩会凝结成镜面。"
                    }
                  ]
                }
              ]
            },
            {
              title: "Ⅱ：管理者的观测日志",
              content: [
                {
                  type: "structuredContent",
                  style: "dream-record",
                  subtitle: "星荧的梦境日常",
                  items: [
                    {
                      label: "观测状态：",
                      value: "稳定（无异常波动）"
                    },
                    {
                      label: "",
                      value: "今日的雪原比往常更安静，冰结苹果树的枝条上凝结了一层薄霜。星荧坐在木桌旁，安静地喝茶，茶杯里的液体呈现出淡蓝色。"
                    },
                    {
                      label: "裁定者批注：",
                      value: "情绪平稳，无需干预。"
                    }
                  ],
                  highlights: ["星荧的梦境日常"]
                },
                {
                  type: "structuredContent",
                  style: "dream-record",
                  subtitle: "璃梦的梦境日常",
                  items: [
                    {
                      label: "观测状态：",
                      value: "轻微波动（死亡之神权能残留）"
                    },
                    {
                      label: "",
                      value: "钟楼的藤蔓比昨日茂密了些，雾气中的紫色略微加深。提灯旁新增了一个破损的玩偶。钟摆依旧静止，但能听见极轻的「滴答」声。"
                    },
                    {
                      label: "裁定者批注：",
                      value: "持续监测，若玩偶数量增加超过三个，需一级干预。"
                    }
                  ],
                  highlights: ["璃梦的梦境日常"]
                },
                {
                  type: "structuredContent",
                  style: "dream-record",
                  subtitle: "希月的梦境日常",
                  items: [
                    {
                      label: "观测状态：",
                      value: "平衡（无倾斜迹象）"
                    },
                    {
                      label: "",
                      value: "蒲公英田野的风向今日转为逆时针，但未影响天平平衡。巨树的枯枝侧有新生嫩芽，荣枯比例维持在5:5。"
                    },
                    {
                      label: "裁定者批注：",
                      value: "生命之神近期未介入，状态良好。"
                    }
                  ],
                  highlights: ["希月的梦境日常"]
                }
              ]
            },
            {
              title: "Ⅲ：异常实体：梦魇（Nightmare）",
              content: [
                {
                  type: "structuredContent",
                  style: "dream-record",
                  subtitle: "存在形式",
                  items: [
                    "梦魇没有固定的形态，可以根据梦境者的恐惧和不安变化形态，常见的有黑暗阴影、恐怖生物或扭曲的形象。",
                    "梦魇通常出现在梦境者情绪不稳定或受到外部压力时，它们会利用梦境者的恐惧和不安来增强自己的力量。"
                  ]
                },
                {
                  type: "structuredContent",
                  style: "dream-record",
                  subtitle: "能力与弱点",
                  items: [
                    {
                      label: "能力：",
                      value: "影响梦境者的情绪，改变梦境内容，干扰梦境者的思维。"
                    },
                    {
                      label: "弱点：",
                      value: "与梦境者的恐惧和不安有关，当梦境者克服恐惧时，梦魇的力量就会减弱。"
                    },
                    {
                      label: "特殊发现：",
                      value: "星荧的梦境不会被入侵，也许跟她梦境中的虚无有关。"
                    }
                  ]
                }
              ]
            },
            {
              title: "结语",
              content: [
                {
                  type: "quote",
                  text: "梦境世界如同一本无限的书，每一页都是一个灵魂的故事。<br>作为裁定者，我的职责是确保这些故事不会变成噩梦。",
                  author: "艾瑟尔·维洛斯"
                }
              ]
            },
            {
              title: "访问记录",
              content: [
                {
                  type: "log",
                  items: [
                    { label: "用户", value: "艾瑟尔·维洛斯 (权限级别: Ω)" },
                    { label: "查询", value: "梦境世界档案更新" },
                    { label: "系统", value: "档案同步完成，梦境稳定性监测中" },
                    { 
                      label: "状态", 
                      value: "梦境流稳定",
                      highlights: ["梦境流稳定"]
                    }
                  ]
                }
              ]
            }
          ]
        }
      }
    };
  }

  // 获取所有维度列表
  getAllDimensions() {
    return Object.keys(this.dimensions).map(key => ({
      id: key,
      name: this.dimensions[key].name
    }));
  }

  // 获取指定维度的数据
  getDimension(dimensionId) {
    return this.dimensions[dimensionId] || null;
  }

  // 检查用户是否有权限访问指定维度
  hasPermission(dimensionId, userPermissionLevel) {
    const requiredLevel = this.getRequiredPermission(dimensionId);
    return userPermissionLevel >= requiredLevel;
  }

  // 获取访问指定维度所需的权限等级
  getRequiredPermission(dimensionId) {
    return this.dimensionPermissions[dimensionId] || 0;
  }

  // 搜索维度
  searchDimensions(query) {
    if (!query || typeof query !== 'string') {
      return [];
    }

    const searchQuery = query.toLowerCase().trim();
    const results = [];

    // 搜索维度名称
    Object.keys(this.dimensions).forEach(dimensionId => {
      const dimension = this.dimensions[dimensionId];
      if (!dimension || !dimension.name) return;
      
      const name = typeof dimension.name === 'string' ? dimension.name.toLowerCase() : '';
      const id = typeof dimensionId === 'string' ? dimensionId.toLowerCase() : '';

      // 检查名称或ID是否匹配查询
      if (name.includes(searchQuery) || id.includes(searchQuery)) {
        results.push({
          id: dimensionId,
          name: dimension.name,
          type: '维度',
          detail: this.getDimensionDescription(dimensionId),
          route: '/system/dimension',
          dimension: dimensionId
        });
      }
    });

    // 搜索维度内容中的关键词
    Object.keys(this.dimensions).forEach(dimensionId => {
      const dimension = this.dimensions[dimensionId];
      if (!dimension || !dimension.content || !dimension.content.sections) return;
      
      // 搜索章节标题
      dimension.content.sections.forEach(section => {
        if (!section || !section.title) return;
        
        const title = typeof section.title === 'string' ? section.title.toLowerCase() : '';
        if (title.includes(searchQuery)) {
          // 避免重复添加
          const exists = results.some(r => r.id === dimensionId);
          if (!exists) {
            results.push({
              id: dimensionId,
              name: dimension.name,
              type: '维度',
              detail: `包含章节: ${section.title}`,
              route: '/system/dimension',
              dimension: dimensionId
            });
          }
        }

        // 搜索内容文本
        if (section.content && Array.isArray(section.content)) {
          section.content.forEach(contentItem => {
            if (!contentItem) return;
            
            if (contentItem.text && typeof contentItem.text === 'string') {
              const text = contentItem.text.toLowerCase();
              if (text.includes(searchQuery)) {
                // 避免重复添加
                const exists = results.some(r => r.id === dimensionId);
                if (!exists) {
                  results.push({
                    id: dimensionId,
                    name: dimension.name,
                    type: '维度',
                    detail: `内容匹配: ${section.title}`,
                    route: '/system/dimension',
                    dimension: dimensionId
                  });
                }
              }
            }

            // 搜索列表项
            if (contentItem.items && Array.isArray(contentItem.items)) {
              contentItem.items.forEach(item => {
                if (!item) return;
                
                const itemText = typeof item.text === 'string' ? item.text : 
                               typeof item === 'string' ? item : '';
                if (itemText && typeof itemText === 'string') {
                  const lowerItemText = itemText.toLowerCase();
                  if (lowerItemText.includes(searchQuery)) {
                    // 避免重复添加
                    const exists = results.some(r => r.id === dimensionId);
                    if (!exists) {
                      results.push({
                        id: dimensionId,
                        name: dimension.name,
                        type: '维度',
                        detail: `内容匹配: ${section.title}`,
                        route: '/system/dimension',
                        dimension: dimensionId
                      });
                    }
                  }
                }
              });
            }
          });
        }
      });
    });

    return results;
  }

  // 获取维度描述
  getDimensionDescription(dimensionId) {
    const dimension = this.dimensions[dimensionId];
    if (!dimension || !dimension.content.sections || dimension.content.sections.length === 0) {
      return '';
    }

    // 返回第一个章节的前50个字符作为描述
    const firstSection = dimension.content.sections[0];
    if (firstSection.content && firstSection.content.length > 0) {
      const firstContent = firstSection.content[0];
      if (firstContent.text) {
        return firstContent.text.substring(0, 50) + '...';
      }
    }

    return '';
  }

  // 获取所有可搜索的关键词
  getSearchableKeywords() {
    const keywords = new Set();

    Object.keys(this.dimensions).forEach(dimensionId => {
      const dimension = this.dimensions[dimensionId];
      if (!dimension) return;
      
      // 添加维度名称和ID
      if (dimension.name && typeof dimension.name === 'string') {
        keywords.add(dimension.name);
      }
      if (dimensionId && typeof dimensionId === 'string') {
        keywords.add(dimensionId);
      }

      // 添加章节标题
      if (dimension.content && dimension.content.sections) {
        dimension.content.sections.forEach(section => {
          if (!section) return;
          
          if (section.title && typeof section.title === 'string') {
            keywords.add(section.title);
          }

          // 添加内容中的关键词
          if (section.content && Array.isArray(section.content)) {
            section.content.forEach(contentItem => {
              if (!contentItem) return;
              
              if (contentItem.text && typeof contentItem.text === 'string') {
                // 提取文本中的关键词（这里可以优化为更智能的提取）
                const words = contentItem.text.match(/[\u4e00-\u9fa5]+|[a-zA-Z]+/g);
                if (words) {
                  words.forEach(word => {
                    if (word && word.length >= 2) { // 只添加长度>=2的词
                      keywords.add(word);
                    }
                  });
                }
              }

              // 添加高亮词汇
              if (contentItem.highlights && Array.isArray(contentItem.highlights)) {
                contentItem.highlights.forEach(highlight => {
                  if (highlight && typeof highlight === 'string') {
                    keywords.add(highlight);
                  }
                });
              }
            });
          }
        });
      }
    });

    return Array.from(keywords);
  }
}

// 创建单例实例
export const dimensionService = new DimensionService();

// 灵魂数据定义 - 更新濒死状态
const soulData = [
  {
    name: "星荧",
    color: "#ffffff",
    status: "稳定",
    frequency: "72.4Hz",
    deceased: false,
    dying: false
  },
  {
    name: "久夜",
    color: "#ffffff",
    status: "稳定",
    frequency: "71.8Hz",
    deceased: false,
    dying: false
  },
  {
    name: "银铃",
    color: "#b0e0e6",
    status: "濒死",
    frequency: "11.2Hz",
    deceased: false,
    dying: true
  },
  {
    name: "璃梦",
    color: "#8a2be2",
    status: "稳定",
    frequency: "69.7Hz",
    deceased: false,
    dying: false
  },
  {
    name: "檀玖",
    color: "#E0B0FF",
    status: "稳定",
    frequency: "70.1Hz",
    deceased: false,
    dying: false
  },
  {
    name: "陌叶",
    color: "#00ffff",
    status: "稳定",
    frequency: "73.5Hz",
    deceased: false,
    dying: false
  },
  {
    name: "陌心",
    color: "#00ffff",
    status: "稳定",
    frequency: "74.2Hz",
    deceased: false,
    dying: false
  },
  {
    name: "戚紫萱",
    color: "#ff0000",
    status: "已逝",
    frequency: "0.0Hz",
    deceased: true,
    dying: false
  },
  {
    name: "戚羽白",
    color: "#ff6347",
    status: "波动",
    frequency: "66.5Hz",
    deceased: false,
    dying: false
  },
  {
    name: "希月",
    color: "#90ee90",
    status: "稳定",
    frequency: "75.3Hz",
    deceased: false,
    dying: false
  },
  {
    name: "艾瑟尔·维洛斯",
    color: "#dda0dd",
    status: "稳定",
    frequency: "76.8Hz",
    deceased: false,
    dying: false
  },
  {
    name: "璃依",
    color: "#ffb6c1",
    status: "稳定",
    frequency: "71.2Hz",
    deceased: false,
    dying: false
  }
  ];
    
export function getAllSouls() {
  return soulData;
}

// 用户数据定义
const users = [
  {
    username: "Emberstar",
    password: "Emberstar0160",
    displayName: "星荧",
    permission: "✧", // 最高权限
    permissionLevel: 7
  },
  {
    username: "Lumirise",
    password: "Lumirise0430",
    displayName: "璃梦",
    permission: "Ⅹ", // 一级权限
    permissionLevel: 6
  },
  {
    username: "Cielune",
    password: "Cielune0501",
    displayName: "希月",
    permission: "Ⅹ", // 一级权限
    permissionLevel: 6
  },
  {
    username: "Seren",
    password: "Seren1160",
    displayName: "久夜",
    permission: "Ⅹ", // 一级权限
    permissionLevel: 6
  },
  {
    username: "Vanya",
    password: "Vanya0959",
    displayName: "银铃",
    permission: "Ⅹ", // 一级权限
    permissionLevel: 6
  },
  {
    username: "TanJiu",
    password: "TanJiu0425",
    displayName: "檀玖",
    permission: "Ω", // 二级权限
    permissionLevel: 5
  },
  {
    username: "Lumiere",
    password: "Lumiere0660",
    displayName: "璃依",
    permission: "Ω", // 二级权限
    permissionLevel: 5
  },
  {
    username: "QiZixuan",
    password: "QiZixuan1031",
    displayName: "戚紫萱",
    permission: "Ψ", // 三级权限
    permissionLevel: 4
  },
  {
    username: "Selaine",
    password: "Selaine0715",
    displayName: "陌叶",
    permission: "Θ", // 四级权限
    permissionLevel: 3
  },
  {
    username: "Lumina",
    password: "Lumina1201",
    displayName: "陌心",
    permission: "Θ", // 四级权限
    permissionLevel: 3
  },
  {
    username: "EtherealVelos",
    password: "EtherealVelos0860",
    displayName: "艾瑟尔·维洛斯",
    permission: "Ψ", // 三级权限
    permissionLevel: 4
  },
  {
    username: "QiYubai",
    password: "QiYubai0228",
    displayName: "戚羽白",
    permission: "Ψ", // 三级权限
    permissionLevel: 4
  }
];

function getAllUsers() {
  return users;
}

function getUserByUsername(username) {
  return users.find(user => user.username === username);
}

export {getAllUsers, getUserByUsername}

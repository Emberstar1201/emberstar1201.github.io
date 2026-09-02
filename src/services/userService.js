// ============================================================
// 用户服务 - 本地存储版
// 说明：
//   1. 内置一批固定账号（角色账号），始终可用
//   2. 用户自己注册的账号存在 localStorage 里，跨页面/刷新/重开浏览器都不丢
//   3. 没有后端，所以密码是明文存 localStorage（这是前端唯一的限制）
// ============================================================

const STORAGE_KEY = 'emberstar_os_users_v1'

// ============ 1. 内置默认账号（角色账号，永远可用，不会被修改） ============
const DEFAULT_USERS = [
  {
    username: "Emberstar",
    password: "Emberstar0160",
    displayName: "星荧",
    permission: "✧",
    permissionLevel: 7
  },
  {
    username: "Lumirise",
    password: "Lumirise0430",
    displayName: "璃梦",
    permission: "Ⅹ",
    permissionLevel: 6
  },
  {
    username: "Cielune",
    password: "Cielune0501",
    displayName: "希月",
    permission: "Ⅹ",
    permissionLevel: 6
  },
  {
    username: "Seren",
    password: "Seren1160",
    displayName: "久夜",
    permission: "Ⅹ",
    permissionLevel: 6
  },
  {
    username: "Vanya",
    password: "Vanya0959",
    displayName: "银铃",
    permission: "Ⅹ",
    permissionLevel: 6
  },
  {
    username: "TanJiu",
    password: "TanJiu0425",
    displayName: "檀玖",
    permission: "Ω",
    permissionLevel: 5
  },
  {
    username: "Lumiere",
    password: "Lumiere0660",
    displayName: "璃依",
    permission: "Ω",
    permissionLevel: 5
  },
  {
    username: "QiZixuan",
    password: "QiZixuan1031",
    displayName: "戚紫萱",
    permission: "Ψ",
    permissionLevel: 4
  },
  {
    username: "Selaine",
    password: "Selaine0715",
    displayName: "陌叶",
    permission: "Θ",
    permissionLevel: 3
  },
  {
    username: "Lumina",
    password: "Lumina1201",
    displayName: "陌心",
    permission: "Θ",
    permissionLevel: 3
  },
  {
    username: "EtherealVelos",
    password: "EtherealVelos0860",
    displayName: "艾瑟尔·维洛斯",
    permission: "Ψ",
    permissionLevel: 4
  },
  {
    username: "QiYubai",
    password: "QiYubai0228",
    displayName: "戚羽白",
    permission: "Ψ",
    permissionLevel: 4
  },
  // ============ 额外预置一个演示用的"正式账户" ============
  {
    username: "Guest",
    password: "guest888",
    displayName: "访客",
    permission: "◇",
    permissionLevel: 1
  }
]

// ============ 2. 自建账号（从 localStorage 读） ============
const getCustomUsers = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

const saveCustomUsers = (list) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
}

// ============ 3. 合并账号列表 ============
const getAllUsers = () => {
  return [...DEFAULT_USERS, ...getCustomUsers()]
}

const getUserByUsername = (username) => {
  // 先找内置
  const found = DEFAULT_USERS.find(u => u.username === username)
  if (found) return found
  // 再找自建
  return getCustomUsers().find(u => u.username === username)
}

// ============ 4. 注册新账号 ============
// 返回 { ok: true, user } 或 { ok: false, message }
function registerUser(username, password, displayName) {
  username = (username || '').trim()
  password = (password || '').trim()
  displayName = (displayName || '').trim() || username

  // 校验
  if (!username)       return { ok: false, message: '用户名不能为空' }
  if (username.length < 3) return { ok: false, message: '用户名至少 3 个字符' }
  if (!password)       return { ok: false, message: '密码不能为空' }
  if (password.length < 4) return { ok: false, message: '密码至少 4 个字符' }

  // 不能和内置账号重名
  if (DEFAULT_USERS.some(u => u.username.toLowerCase() === username.toLowerCase())) {
    return { ok: false, message: '该用户名已被占用（内置角色账号）' }
  }
  // 不能和已注册账号重名
  const customs = getCustomUsers()
  if (customs.some(u => u.username.toLowerCase() === username.toLowerCase())) {
    return { ok: false, message: '该用户名已被注册' }
  }

  const newUser = {
    username,
    password,
    displayName,
    permission: "◇",
    permissionLevel: 1,
    createdAt: new Date().toISOString()
  }

  customs.push(newUser)
  saveCustomUsers(customs)

  return { ok: true, user: newUser }
}

// ============ 导出 ============
export { getAllUsers, getUserByUsername, registerUser }

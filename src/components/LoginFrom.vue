<script setup>
import {ref} from "vue";
import {getAllUsers, getUserByUsername, registerUser} from "@/services/userService.js";
import {useUserStore} from '@/stores/user'
import MultilingualTypewriter from "@/components/MultilingualTypewriter.vue";

const userStore = useUserStore()

// 接收父组件传递的stage更新方法
const props = defineProps({
  updateStage: {
    type: Function,
    required: true
  }
});

const isUserSelectionActive = ref(false);
const isRegisterActive = ref(false);        // 注册弹窗
const userList = ref([]); // 用户列表数据，可以通过API获取或静态定义
const username = ref('');
const password = ref('');

// 注册表单
const regUsername = ref('');
const regPassword = ref('');
const regPassword2 = ref('');
const regDisplayName = ref('');
const regError = ref('');
const regSuccess = ref('');

const openUserSelection = () => {
  isUserSelectionActive.value = true;
  if (userList.value.length === 0) {
    userList.value = getAllUsers();
  }
};
const closeUserSelection = () => {
  isUserSelectionActive.value = false;
};

// 登录处理函数
const handleLogin = () => {
  // 这里可以添加实际的登录验证逻辑
  // 为了演示，我们假设任何非空的用户名和密码都可以登录
  if (username.value.trim() && password.value.trim()) {
    // 登录成功，切换到加载阶段
    const user = getUserByUsername(username.value)
    if (user && user.password === password.value) {
      userStore.login(user)
      props.updateStage(2); // 2 代表加载阶段
    } else {
      // 显示错误消息
      const errorMessage = document.getElementById('errorMessage');
      if (errorMessage) {
        errorMessage.style.display = 'block';
        // 3秒后隐藏错误消息
        setTimeout(() => {
          errorMessage.style.display = 'none';
        }, 3000);
      }
    }
  } else {
    // 显示错误消息
    const errorMessage = document.getElementById('errorMessage');
    if (errorMessage) {
      errorMessage.style.display = 'block';
      // 3秒后隐藏错误消息
      setTimeout(() => {
        errorMessage.style.display = 'none';
      }, 3000);
    }
  }
};

// 选择用户登录
const selectUser = (user) => {
  username.value = user.username;
  password.value = user.password;
  closeUserSelection();
  // 自动登录
  handleLogin();
}

const skipLogin = () => {
  userStore.login(getUserByUsername("Emberstar"))
  props.updateStage(2); // 2 代表加载阶段
};

// ============ 注册弹窗 ============
const openRegister = () => {
  regUsername.value = ''
  regPassword.value = ''
  regPassword2.value = ''
  regDisplayName.value = ''
  regError.value = ''
  regSuccess.value = ''
  isRegisterActive.value = true
}
const closeRegister = () => {
  isRegisterActive.value = false
}
const handleRegister = () => {
  regError.value = ''
  regSuccess.value = ''
  if (!regUsername.value.trim()) { regError.value = '请输入用户名'; return }
  if (!regPassword.value.trim()) { regError.value = '请输入密码'; return }
  if (regPassword.value !== regPassword2.value) { regError.value = '两次密码不一致'; return }

  const res = registerUser(regUsername.value, regPassword.value, regDisplayName.value)
  if (res.ok) {
    regSuccess.value = `注册成功！欢迎 ${res.user.displayName} ✨`
    // 自动把新账号填到登录框
    setTimeout(() => {
      username.value = regUsername.value
      password.value = regPassword.value
      isRegisterActive.value = false
    }, 1200)
  } else {
    regError.value = res.message
  }
}
</script>

<template>
  <div class="login-container">
    <!-- 注册弹窗 (z-index 最高，盖在一切之上) -->
    <Teleport to="body">
      <div v-if="isRegisterActive" class="modal-backdrop" @click.self="closeRegister">
        <div class="register-modal">
          <div class="register-title">✦ 创建正式账户 ✦</div>

          <div class="form-group">
            <label class="form-label">用户名</label>
            <input type="text" class="form-input" placeholder="至少 3 个字符" v-model="regUsername" @keyup.enter="handleRegister">
          </div>

          <div class="form-group">
            <label class="form-label">显示昵称（可选）</label>
            <input type="text" class="form-input" placeholder="登录后显示的名字" v-model="regDisplayName" @keyup.enter="handleRegister">
          </div>

          <div class="form-group">
            <label class="form-label">密码</label>
            <input type="password" class="form-input" placeholder="至少 4 个字符" v-model="regPassword" @keyup.enter="handleRegister">
          </div>

          <div class="form-group">
            <label class="form-label">确认密码</label>
            <input type="password" class="form-input" placeholder="再输一次密码" v-model="regPassword2" @keyup.enter="handleRegister">
          </div>

          <div v-if="regError" class="error-message" style="display:block">{{ regError }}</div>
          <div v-if="regSuccess" class="success-message">{{ regSuccess }}</div>

          <div class="modal-buttons">
            <button class="login-button" @click="handleRegister">注册</button>
            <button class="login-button secondary" @click="closeRegister">取消</button>
          </div>

          <div class="register-tip">⚠ 前端站点，数据保存在浏览器 localStorage；换设备/清缓存会丢失</div>
        </div>
      </div>
    </Teleport>

    <!-- 使用Vue的Transition组件添加切换动画 -->
    <Transition name="fade-slide" mode="out-in">
      <div v-if="isUserSelectionActive" :key="'userSelection'">
        <!-- 用户选择阶段 -->
        <div class="user-selection" id="userSelectionStage">
          <div class="greeting">选择用户</div>
          <div class="user-list" id="userList">
            <div class="user-list-title">可用账户列表</div>
            <!-- 为每个用户渲染一个用户项 -->
            <div v-for="user in userList" :key="user.username" class="user-item" @click="selectUser(user)">
              <div class="user-info">
                <div class="user-display-name">{{ user.displayName }}</div>
                <div class="user-username">{{ user.username }}</div>
              </div>
              <div class="user-permission">{{ user.permission }}</div>
            </div>
            <!-- 处理空列表的情况 -->
            <div v-if="userList.length === 0" class="no-users">暂无可用账户</div>
          </div>
          <button class="back-button" @click="closeUserSelection" id="backToLoginButton">返回登录</button>
        </div>
      </div>
      <div v-else :key="'loginForm'">
        <!-- 登录阶段 -->
        <div class="login-form" id="loginForm">
          <MultilingualTypewriter class="easter-egg" @skipLogin="skipLogin" />
          <div class="form-group">
            <label class="form-label">用户名</label>
            <input type="text" class="form-input" id="usernameInput" placeholder="输入用户名..." v-model="username">
          </div>
          <div class="form-group">
            <label class="form-label">密码</label>
            <input type="password" class="form-input" id="passwordInput" placeholder="输入密码..." v-model="password">
          </div>
          <button class="login-button" id="loginButton" @click="handleLogin">登录</button>
          <button class="login-button" id="userSelectButton" style="margin-top: 10px;" @click="openUserSelection">选择用户</button>
          <button class="login-button secondary" style="margin-top: 10px;" @click="openRegister">创建正式账户</button>
          <div class="error-message" id="errorMessage">用户名或密码错误，请重试</div>
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

/* 登录界面 */
.login-form {
  background-color: rgba(10, 10, 18, 0.9);
  padding: 20px;
  border-radius: 5px;
  border: 1px solid #00ffff;
  box-shadow: 0 0 15px rgba(0, 255, 255, 0.5);
  width: 100%;
  max-width: 320px;
  margin: 0 auto;
  transition: transform 0.5s ease;
  position: relative;
}

.easter-egg {
  position: absolute;
  top: -30px;
  right: 10px;
  font-size: 0.8rem;
  color: #00aaff;
  opacity: 0.7;
  transition: all 0.3s ease;
  text-shadow: 0 0 5px rgba(0, 170, 255, 0.5);
}

.easter-egg:hover {
  opacity: 1;
  transform: scale(1.1);
  text-shadow: 0 0 10px rgba(0, 170, 255, 0.8);
}

.form-group {
  margin-bottom: 15px;
  position: relative;
}

.form-label {
  display: block;
  margin-bottom: 8px;
  font-size: 0.9rem;
  color: #00ffff;
}

.form-input {
  width: 100%;
  padding: 12px;
  background-color: rgba(0, 0, 0, 0.5);
  border: 1px solid #00ffff;
  border-radius: 3px;
  color: #00ffff;
  font-family: 'Monospace', monospace;
  outline: none;
  transition: all 0.3s ease;
  font-size: 16px;
}

.form-input:focus {
  box-shadow: 0 0 10px rgba(0, 255, 255, 0.7);
}

.login-button {
  width: 100%;
  padding: 12px;
  background-color: transparent;
  border: 1px solid #00ffff;
  border-radius: 3px;
  color: #00ffff;
  font-family: 'Monospace', monospace;
  transition: all 0.3s ease;
  opacity: 1;
  transform: translateY(10px);
  font-size: 16px;
  touch-action: manipulation;
}

.login-button:hover, .login-button:active {
  background-color: rgba(0, 255, 255, 0.1);
  box-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
}

.error-message {
  color: #ff6666;
  font-size: 0.8rem;
  margin-top: 10px;
  text-align: center;
  display: none;
}

/* 用户选择界面样式 */
.user-selection {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 400px;
  min-height: 400px;
  background-color: rgba(10, 10, 18, 0.9);
  border: 1px solid #00ffff;
  border-radius: 5px;
  box-shadow: 0 0 15px rgba(0, 255, 255, 0.5);
  margin: 0 auto;
  padding: 20px;
  z-index: 4;
}


.user-list {
  width: 100%;
  max-width: 500px;
  background-color: rgba(20, 20, 30, 0.7);
  border: 1px solid rgba(0, 255, 255, 0.3);
  border-radius: 5px;
  padding: 10px;
  margin-top: 20px;
  max-height: 300px;
  overflow-y: auto;
}

/* 自定义滚动条样式 */
.user-list::-webkit-scrollbar {
  width: 6px;
}

.user-list::-webkit-scrollbar-track {
  background: rgba(0, 255, 255, 0.1);
  border-radius: 3px;
}

.user-list::-webkit-scrollbar-thumb {
  background: rgba(0, 255, 255, 0.5);
  border-radius: 3px;
}

.user-list::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 255, 255, 0.8);
}

.user-list-title {
  font-size: 1.2rem;
  margin-bottom: 15px;
  color: #00aaff;
  text-align: center;
  border-bottom: 1px solid rgba(0, 255, 255, 0.3);
  padding-bottom: 10px;
}

.user-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 15px;
  margin-bottom: 8px;
  border-radius: 6px;
  background-color: rgba(30, 30, 50, 0.5);
  border: 1px solid transparent;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  touch-action: manipulation;
}

.user-item::before {
  content: '';
  position: absolute;
  left: -100%;
  top: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(0, 255, 255, 0.1), transparent);
  transition: left 0.5s ease;
}

.user-item:hover {
  background-color: rgba(30, 30, 50, 0.9);
  border-color: rgba(0, 255, 255, 0.4);
  transform: translateX(5px);
  box-shadow: 0 2px 10px rgba(0, 255, 255, 0.2);
}

.user-item:hover::before {
  left: 100%;
}

.user-item:active {
  background-color: rgba(30, 30, 50, 1);
  transform: translateX(2px);
}

.user-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.user-display-name {
  font-weight: bold;
  color: #00ffff;
  font-size: 1rem;
}

.user-username {
  font-size: 0.85rem;
  color: #aaa;
  font-style: italic;
}

.user-permission {
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 0.85rem;
  font-weight: 500;
  color: #fff;
  background-color: rgba(0, 255, 255, 0.2);
  border: 1px solid rgba(0, 255, 255, 0.3);
  transition: all 0.3s ease;
}

/* 空用户列表提示样式 */
.no-users {
  text-align: center;
  color: #888;
  padding: 20px;
  font-size: 0.9rem;
  opacity: 0.7;
}

.back-button {
  margin-top: 20px;
  padding: 10px 20px;
  background-color: transparent;
  border: 1px solid #00ffff;
  border-radius: 3px;
  color: #00ffff;
  transition: all 0.3s ease;
}

.back-button:hover {
  background-color: rgba(0, 255, 255, 0.1);
}

/* ============ 注册弹窗 ============ */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.65);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  animation: fadeIn 0.2s ease;
}
@keyframes fadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}

.register-modal {
  background-color: rgba(10, 10, 18, 0.96);
  padding: 28px 24px 20px;
  border-radius: 8px;
  border: 1px solid #00ffff;
  box-shadow: 0 0 30px rgba(0, 255, 255, 0.5);
  width: 90%;
  max-width: 360px;
  animation: slideUp 0.25s ease;
}
@keyframes slideUp {
  from { transform: translateY(20px); opacity: 0; }
  to   { transform: translateY(0);     opacity: 1; }
}

.register-title {
  text-align: center;
  font-size: 1.15rem;
  color: #00ffff;
  margin-bottom: 18px;
  text-shadow: 0 0 8px rgba(0, 255, 255, 0.6);
  letter-spacing: 2px;
}

.modal-buttons {
  display: flex;
  gap: 10px;
  margin-top: 15px;
}
.modal-buttons .login-button { flex: 1; transform: none; }

.login-button.secondary {
  background-color: rgba(0, 120, 180, 0.15);
  border-color: #00aaff;
  color: #7ad7ff;
}
.login-button.secondary:hover {
  background-color: rgba(0, 170, 255, 0.2);
  box-shadow: 0 0 10px rgba(0, 170, 255, 0.5);
}

.success-message {
  color: #7affb0;
  font-size: 0.85rem;
  margin-top: 10px;
  text-align: center;
  text-shadow: 0 0 5px rgba(122, 255, 176, 0.4);
}

.register-tip {
  margin-top: 14px;
  font-size: 0.7rem;
  color: #888;
  text-align: center;
  opacity: 0.8;
  line-height: 1.4;
}
</style>
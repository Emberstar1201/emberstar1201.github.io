import {ref} from "vue";
import {defineStore} from "pinia";

export const useUserStore = defineStore('user', () => {
  const currentUser = ref(null)
  const isLoggedIn = ref(false)

  function login(user) {
    currentUser.value = user
    isLoggedIn.value = true
  }

  function logout() {
    currentUser.value = null
    isLoggedIn.value = false
  }

  return { currentUser, isLoggedIn, login, logout }
})
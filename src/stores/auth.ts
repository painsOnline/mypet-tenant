import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { login as loginApi } from '@/api/auth'

export const useAuthStore = defineStore('auth', () => {
  const token = ref('')
  const adminInfo = ref({
    account: '',
    lastLoginTime: ''
  })

  const isLoggedIn = computed(() => !!token.value)

  async function login(account, password, captchaToken?, captchaInput?) {
    const data = await loginApi(account, password, captchaToken, captchaInput)
    token.value = data.token
    adminInfo.value = {
      account: data.adminName || data.account || account,
      lastLoginTime: data.lastLoginTime || ''
    }
  }

  function logout() {
    token.value = ''
    adminInfo.value = { account: '', lastLoginTime: '' }
  }

  return { token, adminInfo, isLoggedIn, login, logout }
}, {
  persist: true
})

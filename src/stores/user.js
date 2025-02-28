import { defineStore } from 'pinia'
import axios from 'axios'

export const useUserStore = defineStore('user', {
  state: () => ({
    uid: null,
    role: null,
    userInfo: null, // Lưu thông tin chi tiết user
  }),
  actions: {
    setUser(user) {
      this.uid = user.uid
      this.role = user.role
    },
    async fetchUserInfo() {
      if (!this.uid) return

      try {
        const response = await axios.get(`http://localhost:5121/api/users/detail/${this.uid}`)
        this.userInfo = response.data
      } catch (error) {
        console.error('Lỗi khi lấy thông tin user:', error)
      }
    },
    logout() {
      this.uid = null
      this.role = null
      this.userInfo = null
    },
  },
})

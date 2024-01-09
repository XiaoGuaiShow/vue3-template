import { defineStore } from 'pinia'

const KEY = 'globalStore'
export const useGlobalStore = defineStore('main', {
  id: KEY,
  state: () => {
    return {
      msg: 'vue + vite + ts + pinia + element-plus',
      count: 0
    }
  },
  getters: {
    getCount(state) {
      return state.count + 1
    }
  },
  actions: {
    changeState() {
      this.count += 1
    }
  },
  persist: {
    key: KEY,
    storage: window.localStorage
  }
})

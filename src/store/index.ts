import { createStore } from 'vuex'

interface AppState {
  sidebarCollapsed: boolean
}

interface AuthState {
  token: string
  adminId: number
  username: string
  nickname: string
  role: string
  expiresIn: number
}

const appModule = {
  namespaced: true,
  state: (): AppState => ({
    sidebarCollapsed: false
  }),
  mutations: {
    TOGGLE_SIDEBAR(state: AppState) {
      state.sidebarCollapsed = !state.sidebarCollapsed
    },
    SET_SIDEBAR_COLLAPSED(state: AppState, collapsed: boolean) {
      state.sidebarCollapsed = collapsed
    }
  },
  actions: {
    toggleSidebar({ commit }: any) {
      commit('TOGGLE_SIDEBAR')
    }
  }
}

const authModule = {
  namespaced: true,
  state: (): AuthState => ({
    token: localStorage.getItem('kellychat_token') || sessionStorage.getItem('kellychat_token') || '',
    adminId: Number(localStorage.getItem('kellychat_adminId') || sessionStorage.getItem('kellychat_adminId') || 0),
    username: localStorage.getItem('kellychat_username') || sessionStorage.getItem('kellychat_username') || '',
    nickname: localStorage.getItem('kellychat_nickname') || sessionStorage.getItem('kellychat_nickname') || '',
    role: localStorage.getItem('kellychat_role') || sessionStorage.getItem('kellychat_role') || '',
    expiresIn: Number(localStorage.getItem('kellychat_expiresIn') || sessionStorage.getItem('kellychat_expiresIn') || 0)
  }),
  getters: {
    isLoggedIn: (state: AuthState) => !!state.token
  },
  mutations: {
    SET_AUTH(state: AuthState, payload: { token: string; adminId: number; username: string; nickname: string; role: string; expiresIn: number }) {
      state.token = payload.token
      state.adminId = payload.adminId
      state.username = payload.username
      state.nickname = payload.nickname
      state.role = payload.role
      state.expiresIn = payload.expiresIn
    },
    CLEAR_AUTH(state: AuthState) {
      state.token = ''
      state.adminId = 0
      state.username = ''
      state.nickname = ''
      state.role = ''
      state.expiresIn = 0
    }
  },
  actions: {
    login({ commit }: any, payload: { token: string; adminId: number; username: string; nickname: string; role: string; expiresIn: number; remember: boolean }) {
      const { remember, ...authData } = payload
      commit('SET_AUTH', authData)

      const storage = remember ? localStorage : sessionStorage
      storage.setItem('kellychat_token', authData.token)
      storage.setItem('kellychat_adminId', String(authData.adminId))
      storage.setItem('kellychat_username', authData.username)
      storage.setItem('kellychat_nickname', authData.nickname)
      storage.setItem('kellychat_role', authData.role)
      storage.setItem('kellychat_expiresIn', String(authData.expiresIn))
    },
    logout({ commit }: any) {
      commit('CLEAR_AUTH')
      const keys = ['kellychat_token', 'kellychat_adminId', 'kellychat_username', 'kellychat_nickname', 'kellychat_role', 'kellychat_expiresIn']
      keys.forEach(key => {
        localStorage.removeItem(key)
        sessionStorage.removeItem(key)
      })
    }
  }
}

export default createStore({
  modules: {
    app: appModule,
    auth: authModule
  }
})

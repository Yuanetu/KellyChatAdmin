import { createRouter, createWebHistory } from 'vue-router'
import store from '@/store'
import MainLayout from '@/layout/MainLayout.vue'
import Dashboard from '@/views/Dashboard.vue'
import UserList from '@/views/UserList.vue'
import ReportList from '@/views/ReportList.vue'
import FeedbackList from '@/views/FeedbackList.vue'
import Login from '@/views/Login.vue'
import OfficialWebsite from '@/views/OfficialWebsite.vue'

const routes = [
  {
    path: '/home',
    name: 'OfficialWebsite',
    component: OfficialWebsite,
    meta: { title: 'kellyChat - 遇见有趣的灵魂', requiresAuth: false }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { title: '登录', requiresAuth: false }
  },
  {
    path: '/',
    component: MainLayout,
    redirect: '/dashboard',
    meta: { requiresAuth: true },
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: Dashboard,
        meta: { title: '数据统计', icon: 'chart', requiresAuth: true }
      },
      {
        path: 'users',
        name: 'UserList',
        component: UserList,
        meta: { title: '用户列表', icon: 'user', requiresAuth: true }
      },
      {
        path: 'reports',
        name: 'ReportList',
        component: ReportList,
        meta: { title: '举报列表', icon: 'report', requiresAuth: true }
      },
      {
        path: 'feedback',
        name: 'FeedbackList',
        component: FeedbackList,
        meta: { title: '用户反馈', icon: 'feedback', requiresAuth: true }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, _from, next) => {
  const isLoggedIn = store.getters['auth/isLoggedIn']

  if (to.meta.requiresAuth && !isLoggedIn) {
    next({ name: 'Login', query: { redirect: to.fullPath } })
  } else if (to.name === 'Login' && isLoggedIn) {
    next({ name: 'Dashboard' })
  } else {
    next()
  }
})

export default router

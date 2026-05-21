<template>
  <aside class="sidebar" :class="{ collapsed: sidebarCollapsed }">
    <div class="sidebar-header">
      <div class="logo" @click="$router.push('/dashboard')">
        <el-icon :size="28" color="#4361ee"><ChatDotRound /></el-icon>
        <span v-show="!sidebarCollapsed" class="logo-text">kellyChat</span>
      </div>
    </div>

    <el-menu
      :default-active="currentRoute"
      :collapse="sidebarCollapsed"
      :collapse-transition="true"
      background-color="transparent"
      text-color="rgba(255,255,255,0.65)"
      active-text-color="#fff"
      router
      class="sidebar-menu"
    >
      <el-menu-item v-for="item in menuItems" :key="item.path" :index="item.path">
        <el-icon><component :is="item.icon" /></el-icon>
        <template #title>{{ item.title }}</template>
      </el-menu-item>
    </el-menu>

    <div class="sidebar-footer">
      <button class="logout-btn" @click="handleLogout">
        <el-icon :size="18"><SwitchButton /></el-icon>
        <span v-show="!sidebarCollapsed" class="btn-text">退出登录</span>
      </button>
      <button class="toggle-btn" @click="toggleSidebar">
        <el-icon :size="18">
          <DArrowLeft v-if="!sidebarCollapsed" />
          <DArrowRight v-else />
        </el-icon>
      </button>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import { ChatDotRound, DataAnalysis, User, Flag, ChatLineSquare, DArrowLeft, DArrowRight, SwitchButton } from '@element-plus/icons-vue'

const store = useStore()
const route = useRoute()
const router = useRouter()
const sidebarCollapsed = computed(() => store.state.app.sidebarCollapsed)
const currentRoute = computed(() => route.path)

const menuItems = [
  { path: '/dashboard', title: '数据统计', icon: DataAnalysis },
  { path: '/users', title: '用户列表', icon: User },
  { path: '/reports', title: '举报列表', icon: Flag },
  { path: '/feedback', title: '用户反馈', icon: ChatLineSquare }
]

function toggleSidebar() {
  store.dispatch('app/toggleSidebar')
}

function handleLogout() {
  store.dispatch('auth/logout')
  router.push('/login')
}
</script>

<style scoped lang="scss">
.sidebar {
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  width: $sidebar-width;
  background: $sidebar-bg;
  display: flex;
  flex-direction: column;
  transition: width 0.3s ease;
  z-index: 100;
  overflow: hidden;

  &.collapsed {
    width: $sidebar-collapsed-width;
  }
}

.sidebar-header {
  display: flex;
  align-items: center;
  padding: 20px 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  min-height: 64px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  overflow: hidden;
}

.logo-text {
  font-size: $font-size-xl;
  font-weight: 700;
  color: $sidebar-text-active;
  white-space: nowrap;
  letter-spacing: -0.5px;
}

.sidebar-menu {
  flex: 1;
  border-right: none;
  padding: 8px;

  :deep(.el-menu-item) {
    margin-bottom: 4px;
    border-radius: $border-radius;
    height: 48px;
    line-height: 48px;

    &:hover {
      background: $sidebar-hover-bg !important;
    }

    &.is-active {
      background: $primary-color !important;
      color: #fff !important;
      box-shadow: 0 2px 8px rgba(67, 97, 238, 0.4);
    }
  }
}

.sidebar-footer {
  padding: 12px 8px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.logout-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 12px;
  border-radius: $border-radius;
  color: rgba(255, 255, 255, 0.45);
  background: none;
  transition: $transition-base;
  cursor: pointer;

  .btn-text {
    font-size: $font-size-sm;
    white-space: nowrap;
  }

  &:hover {
    background: rgba(231, 76, 60, 0.15);
    color: #e74c3c;
  }
}

.toggle-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 12px;
  border-radius: $border-radius;
  color: $sidebar-text;
  background: none;
  transition: $transition-base;
  cursor: pointer;

  &:hover {
    background: $sidebar-hover-bg;
    color: $sidebar-text-active;
  }
}
</style>

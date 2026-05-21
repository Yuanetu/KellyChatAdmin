<template>
  <div class="main-layout">
    <Sidebar />
    <div class="main-content" :class="{ collapsed: sidebarCollapsed }">
      <div class="content-wrapper">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useStore } from 'vuex'
import Sidebar from '@/components/Sidebar.vue'

const store = useStore()
const sidebarCollapsed = computed(() => store.state.app.sidebarCollapsed)
</script>

<style scoped lang="scss">
.main-layout {
  display: flex;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

.main-content {
  flex: 1;
  margin-left: $sidebar-width;
  background: $bg-color;
  transition: margin-left 0.3s ease;
  overflow-y: auto;
  @include scrollbar;

  &.collapsed {
    margin-left: $sidebar-collapsed-width;
  }
}

.content-wrapper {
  padding: 24px;
  min-height: 100%;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

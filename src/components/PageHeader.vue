<template>
  <div class="page-header">
    <div class="header-left">
      <h1 class="page-title">{{ title }}</h1>
    </div>
    <div class="header-right">
      <slot name="actions" />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
}>()
</script>

<style scoped lang="scss">
.page-header {
  @include flex-between;
  margin-bottom: 24px;
}

.page-title {
  font-size: $font-size-xxl;
  font-weight: 700;
  color: $text-primary;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 12px;
}
</style>

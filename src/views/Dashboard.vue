<template>
  <div class="dashboard">
    <div class="dashboard-header">
      <PageHeader title="数据统计" />
      <div class="refresh-area">
        <el-button type="primary" :icon="Refresh" :loading="refreshing" @click="handleRefresh">
          刷新
        </el-button>
        <span v-if="lastRefreshTime" class="refresh-time">最新：{{ lastRefreshTime }}</span>
      </div>
    </div>

    <el-card shadow="never" class="section-card">
      <template #header>
        <div class="section-header">
          <span class="section-title">
            <el-icon><User /></el-icon> 用户数
          </span>
          <span class="update-time">截止时间：{{ dashboardData.userStats.updateTime }}</span>
        </div>
      </template>
      <el-row :gutter="16">
        <el-col :span="6" v-for="card in userCards" :key="card.label">
          <div class="stat-card">
            <div class="card-period">{{ card.period }}</div>
            <div class="card-value">{{ formatNumber(card.value) }}</div>
            <div class="card-bottom">
              <span class="card-label">{{ card.label }}</span>
              <span v-if="card.change !== undefined" class="card-change" :class="card.change >= 0 ? 'up' : 'down'">
                <el-icon v-if="card.change >= 0"><Top /></el-icon>
                <el-icon v-else><Bottom /></el-icon>
                {{ Math.abs(card.change) }}%
              </span>
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="stat-card total-card">
            <div class="card-period">累计</div>
            <div class="card-value">{{ formatNumber(dashboardData.userStats.totalUsers) }}</div>
            <div class="card-bottom">
              <span class="card-label">当前总用户数</span>
            </div>
          </div>
        </el-col>
      </el-row>
    </el-card>

    <el-card shadow="never" class="section-card">
      <template #header>
        <div class="section-header">
          <span class="section-title">
            <el-icon><TrendCharts /></el-icon> 活跃情况
          </span>
          <span class="update-time">截止时间：{{ dashboardData.activityStats.updateTime }}</span>
        </div>
      </template>
      <el-row :gutter="16">
        <el-col :span="8" v-for="card in activityCards" :key="card.label">
          <div class="stat-card">
            <div class="card-period">{{ card.period }}</div>
            <div class="card-value">{{ formatNumber(card.value) }}</div>
            <div class="card-bottom">
              <span class="card-label">{{ card.label }}</span>
              <span v-if="card.change !== undefined" class="card-change" :class="card.change >= 0 ? 'up' : 'down'">
                <el-icon v-if="card.change >= 0"><Top /></el-icon>
                <el-icon v-else><Bottom /></el-icon>
                {{ Math.abs(card.change) }}%
              </span>
            </div>
          </div>
        </el-col>
      </el-row>
    </el-card>

    <el-card shadow="never" class="section-card">
      <template #header>
        <div class="section-header">
          <span class="section-title">
            <el-icon><Clock /></el-icon> 留存情况
          </span>
          <span class="update-time">截止时间：{{ dashboardData.retentionStats.updateTime }}</span>
        </div>
      </template>
      <el-row :gutter="16">
        <el-col :span="6" v-for="item in dashboardData.retentionStats.items" :key="item.label">
          <div class="stat-card retention-card">
            <div class="card-period">{{ item.registerDate }}注册</div>
            <div class="card-value">{{ item.rate }}<span class="rate-unit">%</span></div>
            <div class="card-bottom">
              <span class="card-label">{{ item.label }}</span>
              <span class="card-change" :class="item.change >= 0 ? 'up' : 'down'">
                <el-icon v-if="item.change >= 0"><Top /></el-icon>
                <el-icon v-else><Bottom /></el-icon>
                {{ Math.abs(item.change) }}%
              </span>
            </div>
          </div>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Refresh, User, TrendCharts, Clock, Top, Bottom } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import PageHeader from '@/components/PageHeader.vue'
import { getStats } from '@/api/dashboard'
import { getMockDashboardData } from '@/mock'
import type { DashboardData, StatsData } from '@/types'

const STORAGE_KEY = 'kellychat_last_refresh_time'

function getCurrentTimeStr(): string {
  const now = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`
}

function saveRefreshTime() {
  const timeStr = getCurrentTimeStr()
  localStorage.setItem(STORAGE_KEY, timeStr)
  return timeStr
}

function getDatePeriod(): { today: string; weekRange: string; monthRange: string } {
  const now = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  const today = `${pad(now.getDate())}号`
  const dayOfWeek = now.getDay() || 7
  const monday = new Date(now)
  monday.setDate(now.getDate() - dayOfWeek + 1)
  const weekRange = `${pad(monday.getDate())}-${pad(now.getDate())}号`
  const monthRange = `01-${pad(now.getDate())}号`
  return { today, weekRange, monthRange }
}

function transformStatsData(data: StatsData): DashboardData {
  const { today, weekRange, monthRange } = getDatePeriod()

  return {
    userStats: {
      todayNew: { label: '今日新增', value: data.userStats.todayNew, change: data.userStats.yesterdayNewWoW, period: today },
      weekNew: { label: '本周新增', value: data.userStats.weekNew, change: data.userStats.lastWeekNewWoW, period: weekRange },
      monthNew: { label: '本月新增', value: data.userStats.monthNew, change: data.userStats.lastMonthNewMoM, period: monthRange },
      totalUsers: data.userStats.totalUsers,
      updateTime: data.userStats.cutoffTime
    },
    activityStats: {
      todayActive: { label: '今日活跃', value: data.activeStats.todayActive, change: data.activeStats.yesterdayActiveRate, period: today },
      weekActive: { label: '本周活跃', value: data.activeStats.weekActive, change: data.activeStats.lastWeekActiveRate, period: weekRange },
      monthActive: { label: '本月活跃', value: data.activeStats.monthActive, change: data.activeStats.lastMonthActiveRate, period: monthRange },
      updateTime: data.activeStats.cutoffTime
    },
    retentionStats: {
      items: [
        { label: '次日留存', rate: data.retentionStats.day1.rate, change: data.retentionStats.day1.wow, registerDate: data.retentionStats.day1.regDate },
        { label: '3日留存', rate: data.retentionStats.day3.rate, change: data.retentionStats.day3.wow, registerDate: data.retentionStats.day3.regDate },
        { label: '7日留存', rate: data.retentionStats.day7.rate, change: data.retentionStats.day7.wow, registerDate: data.retentionStats.day7.regDate },
        { label: '30日留存', rate: data.retentionStats.day30.rate, change: data.retentionStats.day30.wow, registerDate: data.retentionStats.day30.regDate }
      ],
      updateTime: data.retentionStats.cutoffTime
    }
  }
}

const dashboardData = ref<DashboardData>(getMockDashboardData())
const lastRefreshTime = ref<string>(saveRefreshTime())
const refreshing = ref(false)

const userCards = computed(() => [
  dashboardData.value.userStats.todayNew,
  dashboardData.value.userStats.weekNew,
  dashboardData.value.userStats.monthNew
])

const activityCards = computed(() => [
  dashboardData.value.activityStats.todayActive,
  dashboardData.value.activityStats.weekActive,
  dashboardData.value.activityStats.monthActive
])

function formatNumber(num: number | string): string {
  const n = typeof num === 'string' ? parseFloat(num) : num
  if (isNaN(n)) return String(num)
  if (n >= 10000) {
    return (n / 10000).toFixed(1) + '万'
  }
  return n.toLocaleString()
}

async function fetchData() {
  try {
    const res = await getStats()
    if (res.code === 200) {
      dashboardData.value = transformStatsData(res.data)
    } else {
      ElMessage.error(res.message || '获取统计数据失败')
    }
  } catch (error: any) {
    ElMessage.error(error?.response?.data?.message || '获取统计数据失败，请检查网络连接')
  } finally {
    refreshing.value = false
  }
}

async function handleRefresh() {
  refreshing.value = true
  await fetchData()
  lastRefreshTime.value = saveRefreshTime()
  refreshing.value = false
}

fetchData()
</script>

<style scoped lang="scss">
.dashboard {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

.dashboard-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 20px;

  :deep(.page-header) {
    margin-bottom: 0;
  }
}

.refresh-area {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}

.refresh-time {
  font-size: $font-size-sm;
  color: $text-secondary;
  white-space: nowrap;
}

.section-card {
  margin-bottom: 20px;

  :deep(.el-card__header) {
    padding: 16px 20px;
  }

  :deep(.el-card__body) {
    padding: 20px;
  }
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 16px;
  font-weight: 600;
  color: $text-primary;

  .el-icon {
    color: $primary-color;
    font-size: 18px;
  }
}

.update-time {
  font-size: $font-size-sm;
  color: $text-secondary;
}

.stat-card {
  background: $bg-color;
  border-radius: $border-radius;
  padding: 20px;
  position: relative;
  transition: $transition-base;

  &:hover {
    box-shadow: $shadow-sm;
    transform: translateY(-1px);
  }
}

.card-period {
  position: absolute;
  top: 12px;
  right: 14px;
  font-size: $font-size-xs;
  color: $text-disabled;
  background: $content-bg;
  padding: 2px 8px;
  border-radius: 10px;
}

.card-value {
  font-size: 28px;
  font-weight: 700;
  color: $text-primary;
  line-height: 1.3;
  margin-bottom: 8px;
  padding-top: 4px;
}

.rate-unit {
  font-size: $font-size-lg;
  font-weight: 500;
  color: $text-secondary;
  margin-left: 2px;
}

.card-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.card-label {
  font-size: $font-size-sm;
  color: $text-secondary;
}

.card-change {
  display: flex;
  align-items: center;
  gap: 2px;
  font-size: $font-size-sm;
  font-weight: 500;

  .el-icon {
    font-size: 12px;
  }

  &.up {
    color: $success-color;
  }

  &.down {
    color: $danger-color;
  }
}

.total-card {
  .card-value {
    color: $primary-color;
  }
}

.retention-card {
  .card-value {
    color: #409eff;
  }
}
</style>

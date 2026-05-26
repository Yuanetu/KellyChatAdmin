<template>
  <div class="report-list">
    <PageHeader title="举报列表" />

    <el-card shadow="never" class="filter-card">
      <el-form :model="filters" label-width="auto" label-position="top" @submit.prevent="handleSearch">
        <el-row :gutter="16">
          <el-col :span="6">
            <el-form-item label="搜索">
              <el-input v-model="filters.keyword" placeholder="举报/被举报人 昵称或手机号" clearable @keyup.enter="handleSearch" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="举报理由">
              <el-select v-model="filters.reason" multiple placeholder="不限" clearable style="width:100%">
                <el-option v-for="opt in reasonOptions" :key="opt.value" :label="opt.label" :value="opt.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="处理状态">
              <el-select v-model="filters.status" multiple placeholder="不限" clearable style="width:100%">
                <el-option v-for="opt in statusOptions" :key="opt.value" :label="opt.label" :value="opt.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="举报时间">
              <el-date-picker v-model="filters.reportTimeRange" type="datetimerange" range-separator="~" start-placeholder="开始" end-placeholder="结束" format="YYYY-MM-DD HH:mm:ss" value-format="YYYY-MM-DD HH:mm:ss" style="width:100%" />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="处理时间">
              <el-date-picker v-model="filters.handleTimeRange" type="datetimerange" range-separator="~" start-placeholder="开始" end-placeholder="结束" format="YYYY-MM-DD HH:mm:ss" value-format="YYYY-MM-DD HH:mm:ss" style="width:100%" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="16">
          <el-col :span="4">
            <el-form-item label="处理方式">
              <el-select v-model="filters.handleType" multiple placeholder="不限" clearable style="width:100%">
                <el-option v-for="opt in handleTypeOptions" :key="opt.value" :label="opt.label" :value="opt.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="20" style="text-align:right;padding-top:28px">
            <el-button type="primary" @click="handleSearch">查询</el-button>
            <el-button @click="handleReset">重置</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <div class="result-info">
      共 <strong>{{ total }}</strong> 条举报
    </div>

    <el-card shadow="never">
      <el-table :data="reportList" stripe border style="width:100%" max-height="600" v-loading="loading">
        <el-table-column type="index" label="序号" width="60" align="center" :index="(i: number) => (page - 1) * pageSize + i + 1" />
        <el-table-column prop="id" label="举报ID" width="110" />
        <el-table-column label="举报理由" width="140">
          <template #default="{ row }">
            <el-tag size="small" type="info">{{ reasonMap[row.reportType] || row.reportType || '未知' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="举报描述" width="160" show-overflow-tooltip>
          <template #default="{ row }">
            <span v-if="row.description" style="cursor:pointer" @click="openDescModal(row)">{{ row.description }}</span>
            <span v-else style="color:#999">--</span>
          </template>
        </el-table-column>
        <el-table-column label="图片证据" width="130">
          <template #default="{ row }">
            <div v-if="!row.images" style="color:#999">--</div>
            <div v-else style="display:flex;gap:4px;flex-wrap:wrap">
              <el-image v-for="(img, ii) in parseImages(row.images)" :key="ii" :src="img" style="width:36px;height:36px;border-radius:4px;cursor:pointer" fit="cover" :preview-src-list="parseImages(row.images)" :initial-index="ii" />
            </div>
          </template>
        </el-table-column>
        <el-table-column label="被举报人ID" width="110">
          <template #default="{ row }">{{ row.reportedUserId }}</template>
        </el-table-column>
        <el-table-column label="举报人ID" width="110">
          <template #default="{ row }">{{ row.reporterUserId }}</template>
        </el-table-column>
        <el-table-column prop="createdAt" label="举报时间" width="170" />
        <el-table-column label="处理状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="statusTagType[row.status]" size="small">{{ statusMap[row.status] }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="处理方式" width="90" align="center">
          <template #default="{ row }">
            <el-tag v-if="row.handleType" :type="handleTypeTagType[row.handleType]" size="small">{{ handleTypeMap[row.handleType] }}</el-tag>
            <span v-else style="color:#999">--</span>
          </template>
        </el-table-column>
        <el-table-column label="处理时间" width="170">
          <template #default="{ row }">{{ row.handleTime || '--' }}</template>
        </el-table-column>
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <el-button type="warning" link size="small" @click="openMuteModal(row)">禁言</el-button>
            <el-button type="danger" link size="small" @click="openBanModal(row)">封禁</el-button>
            <el-button link size="small" @click="handleInvalid(row)">无效举报</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div style="display:flex;justify-content:flex-end;margin-top:16px">
        <el-pagination v-model:current-page="page" v-model:page-size="pageSize" :page-sizes="[10, 30, 50]" :total="total" layout="total, sizes, prev, pager, next" @current-change="loadData" @size-change="loadData" />
      </div>
    </el-card>

    <el-dialog v-model="descModalVisible" title="举报描述" width="500px" destroy-on-close>
      <p style="line-height:1.8;color:#333">{{ descModalData }}</p>
    </el-dialog>

    <el-dialog v-model="muteModalVisible" :title="`禁言设置 - 被举报人ID:${muteModalReport?.reportedUserId || ''}`" width="520px" destroy-on-close>
      <el-form label-width="120px">
        <el-form-item label="是否开启禁言">
          <el-radio-group v-model="muteEnabled">
            <el-radio :value="true">开启</el-radio>
            <el-radio :value="false">关闭</el-radio>
          </el-radio-group>
        </el-form-item>
        <template v-if="muteEnabled">
          <el-form-item label="禁言起始时间">
            <span>立即开始</span>
          </el-form-item>
          <el-form-item label="禁言时长">
            <el-radio-group v-model="muteDurationType" @change="onMuteDurationTypeChange">
              <el-radio value="1">1天</el-radio>
              <el-radio value="3">3天</el-radio>
              <el-radio value="5">5天</el-radio>
              <el-radio value="7">7天</el-radio>
              <el-radio value="15">15天</el-radio>
              <el-radio value="30">30天</el-radio>
              <el-radio value="custom">自定义</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="muteDurationType === 'custom'" label="禁言结束时间">
            <el-date-picker v-model="muteCustomEndTime" type="datetime" placeholder="选择禁言结束时间" format="YYYY-MM-DD HH:mm" value-format="YYYY-MM-DD HH:mm" :disabled-date="(d: Date) => d.getTime() < Date.now()" />
          </el-form-item>
          <el-form-item label="禁言结束时间">
            <span v-if="muteDurationType !== 'custom'" style="color:#409eff;font-weight:500">{{ muteEndTimeDisplay }}</span>
            <span v-else style="color:#999">请选择结束时间</span>
          </el-form-item>
        </template>
      </el-form>
      <el-alert v-if="muteEnabled" type="info" :closable="false" show-icon style="margin-top:8px">
        <template #title>禁言后，用户在App上点击「聊一聊」「敲一下」时将提示"你已被禁言到 {{ muteEndTimeDisplay }}"</template>
      </el-alert>
      <template #footer>
        <el-button @click="muteModalVisible = false">取消</el-button>
        <el-button type="primary" @click="submitMute">确定</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="banModalVisible" :title="`封禁设置 - 被举报人ID:${banModalReport?.reportedUserId || ''}`" width="520px" destroy-on-close>
      <el-form label-width="120px">
        <el-form-item label="是否封禁">
          <el-radio-group v-model="banEnabled">
            <el-radio :value="true">开启</el-radio>
            <el-radio :value="false">关闭</el-radio>
          </el-radio-group>
        </el-form-item>
        <template v-if="banEnabled">
          <el-form-item label="封禁起始时间">
            <span>立即开始</span>
          </el-form-item>
          <el-form-item label="封禁时长">
            <el-radio-group v-model="banDurationType" @change="onBanDurationTypeChange">
              <el-radio value="1">1天</el-radio>
              <el-radio value="3">3天</el-radio>
              <el-radio value="5">5天</el-radio>
              <el-radio value="7">7天</el-radio>
              <el-radio value="15">15天</el-radio>
              <el-radio value="30">30天</el-radio>
              <el-radio value="custom">自定义</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="banDurationType === 'custom'" label="封禁结束时间">
            <el-date-picker v-model="banCustomEndTime" type="datetime" placeholder="选择封禁结束时间" format="YYYY-MM-DD HH:mm" value-format="YYYY-MM-DD HH:mm" :disabled-date="(d: Date) => d.getTime() < Date.now()" />
          </el-form-item>
          <el-form-item label="封禁结束时间">
            <span v-if="banDurationType !== 'custom'" style="color:#409eff;font-weight:500">{{ banEndTimeDisplay }}</span>
            <span v-else style="color:#999">请选择结束时间</span>
          </el-form-item>
        </template>
      </el-form>
      <el-alert v-if="banEnabled" type="warning" :closable="false" show-icon style="margin-top:8px">
        <template #title>封禁后，用户不可登录，登录时将提示"你的账号已被封禁到 {{ banEndTimeDisplay }}"</template>
      </el-alert>
      <template #footer>
        <el-button @click="banModalVisible = false">取消</el-button>
        <el-button type="primary" @click="submitBan">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { ElMessage } from 'element-plus'
import PageHeader from '@/components/PageHeader.vue'
import { getReportList, handleReport } from '@/api/reports'
import type { ApiReport } from '@/types'
import type { ReportQueryRequest } from '@/api/reports'

const reasonMap: Record<string, string> = {
  PORNOGRAPHIC: '色情低俗',
  POLITICAL_SENSITIVE: '政治敏感',
  FRAUD: '涉嫌欺诈',
  INSULT: '谩骂嘲讽',
  DISCRIMINATION: '歧视',
  CYBERBULLYING: '网络暴力',
  IMPERSONATION: '冒充他人',
  ILLEGAL: '违法违规',
  UNDERAGE_CONTENT: '涉及未成年不当内容',
  PUBLIC_ORDER: '违反公德良序',
  PERSONAL_SAFETY: '危害人身安全',
  OTHER: '其他违规类型'
}
const statusMap: Record<number, string> = { 0: '待处理', 1: '已处理', 2: '无效举报' }
const handleTypeMap: Record<number, string> = { 1: '禁言', 2: '封禁' }
const statusTagType: Record<number, string> = { 0: 'warning', 1: 'success', 2: 'info' }
const handleTypeTagType: Record<number, string> = { 1: 'warning', 2: 'danger' }

const reasonOptions = Object.entries(reasonMap).map(([value, label]) => ({ value, label }))
const statusOptions = Object.entries(statusMap).map(([value, label]) => ({ value: Number(value), label }))
const handleTypeOptions = Object.entries(handleTypeMap).map(([value, label]) => ({ value: Number(value), label }))

interface FilterState {
  keyword: string
  reason: string[]
  status: number[]
  reportTimeRange: string[] | null
  handleTimeRange: string[] | null
  handleType: number[]
}

function createDefaultFilters(): FilterState {
  return { keyword: '', reason: [], status: [], reportTimeRange: null, handleTimeRange: null, handleType: [] }
}

const filters = ref<FilterState>(createDefaultFilters())
const page = ref(1)
const pageSize = ref(10)
const reportList = ref<ApiReport[]>([])
const total = ref(0)
const loading = ref(false)

function parseImages(images: string): string[] {
  if (!images) return []
  try {
    const parsed = JSON.parse(images)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return images ? [images] : []
  }
}

async function loadData() {
  loading.value = true
  try {
    const f = filters.value
    const params: ReportQueryRequest = {
      keyword: f.keyword || undefined,
      reason: f.reason.length > 0 ? f.reason[0] : undefined,
      status: f.status.length > 0 ? f.status[0] : undefined,
      handleType: f.handleType.length > 0 ? f.handleType[0] : undefined,
      reportTimeStart: f.reportTimeRange?.[0] || undefined,
      reportTimeEnd: f.reportTimeRange?.[1] || undefined,
      handleTimeStart: f.handleTimeRange?.[0] || undefined,
      handleTimeEnd: f.handleTimeRange?.[1] || undefined,
      page: page.value,
      size: pageSize.value
    }
    const res = await getReportList(params)
    if (res.code === 200) {
      reportList.value = res.data.list
      total.value = res.data.total
    } else {
      ElMessage.error(res.message || '获取举报列表失败')
    }
  } catch {
    reportList.value = []
    total.value = 0
  } finally {
    loading.value = false
  }
}

function handleSearch() { page.value = 1; loadData() }
function handleReset() { filters.value = createDefaultFilters(); page.value = 1; loadData() }
watch(page, loadData)
loadData()

const descModalVisible = ref(false)
const descModalData = ref('')
function openDescModal(report: ApiReport) { descModalData.value = report.description; descModalVisible.value = true }

function formatDateTimeStr(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`
}

const muteModalVisible = ref(false)
const muteModalReport = ref<ApiReport | null>(null)
const muteEnabled = ref(false)
const muteDurationType = ref('1')
const muteCustomEndTime = ref('')

const muteEndTimeDisplay = computed(() => {
  if (muteDurationType.value === 'custom') return muteCustomEndTime.value || '--'
  const days = parseInt(muteDurationType.value)
  if (isNaN(days) || days <= 0) return '--'
  return formatDateTimeStr(new Date(Date.now() + days * 86400000))
})

function onMuteDurationTypeChange() { muteCustomEndTime.value = '' }

function openMuteModal(report: ApiReport) {
  muteModalReport.value = report
  muteEnabled.value = true
  muteDurationType.value = '1'
  muteCustomEndTime.value = ''
  muteModalVisible.value = true
}

async function submitMute() {
  if (!muteModalReport.value) return
  if (!muteEnabled.value) {
    muteModalVisible.value = false
    return
  }
  let days: number | undefined = undefined
  if (muteDurationType.value === 'custom') {
    if (!muteCustomEndTime.value) { ElMessage.warning('请选择禁言结束时间'); return }
    const diff = new Date(muteCustomEndTime.value).getTime() - Date.now()
    if (diff <= 0) { ElMessage.warning('结束时间必须晚于当前时间'); return }
    days = Math.ceil(diff / 86400000)
  } else {
    days = parseInt(muteDurationType.value)
  }
  if (days !== undefined && days <= 0) {
    days = undefined
  }
  try {
    const res = await handleReport(muteModalReport.value.id, { action: 'mute', days })
    if (res.code === 200) {
      ElMessage.success('禁言设置成功')
      loadData()
    } else {
      ElMessage.error(res.message || '禁言设置失败')
    }
  } catch {
    ElMessage.error('禁言设置失败')
  }
  muteModalVisible.value = false
}

const banModalVisible = ref(false)
const banModalReport = ref<ApiReport | null>(null)
const banEnabled = ref(false)
const banDurationType = ref('1')
const banCustomEndTime = ref('')

const banEndTimeDisplay = computed(() => {
  if (banDurationType.value === 'custom') return banCustomEndTime.value || '--'
  const days = parseInt(banDurationType.value)
  if (isNaN(days) || days <= 0) return '--'
  return formatDateTimeStr(new Date(Date.now() + days * 86400000))
})

function onBanDurationTypeChange() { banCustomEndTime.value = '' }

function openBanModal(report: ApiReport) {
  banModalReport.value = report
  banEnabled.value = true
  banDurationType.value = '1'
  banCustomEndTime.value = ''
  banModalVisible.value = true
}

async function submitBan() {
  if (!banModalReport.value) return
  if (!banEnabled.value) {
    banModalVisible.value = false
    return
  }
  let days: number | undefined = undefined
  if (banDurationType.value === 'custom') {
    if (!banCustomEndTime.value) { ElMessage.warning('请选择封禁结束时间'); return }
    const diff = new Date(banCustomEndTime.value).getTime() - Date.now()
    if (diff <= 0) { ElMessage.warning('结束时间必须晚于当前时间'); return }
    days = Math.ceil(diff / 86400000)
  } else {
    days = parseInt(banDurationType.value)
  }
  if (days !== undefined && days <= 0) {
    days = undefined
  }
  try {
    const res = await handleReport(banModalReport.value.id, { action: 'ban', days })
    if (res.code === 200) {
      ElMessage.success('封禁设置成功')
      loadData()
    } else {
      ElMessage.error(res.message || '封禁设置失败')
    }
  } catch {
    ElMessage.error('封禁设置失败')
  }
  banModalVisible.value = false
}

async function handleInvalid(report: ApiReport) {
  try {
    const res = await handleReport(report.id, { action: 'invalid' })
    if (res.code === 200) {
      ElMessage.success('操作成功')
      loadData()
    } else {
      ElMessage.error(res.message || '操作失败')
    }
  } catch {
    ElMessage.error('操作失败')
  }
}
</script>

<style scoped lang="scss">
.report-list {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

.filter-card { margin-bottom: 16px; }

.result-info {
  margin-bottom: 12px;
  font-size: $font-size-sm;
  color: $text-secondary;
  strong { color: $primary-color; font-weight: 600; }
}
</style>

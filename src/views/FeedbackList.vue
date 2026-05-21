<template>
  <div class="feedback-list">
    <PageHeader title="用户反馈" />

    <el-card shadow="never" class="filter-card">
      <el-form :model="filters" label-width="auto" label-position="top" @submit.prevent="handleSearch">
        <el-row :gutter="16">
          <el-col :span="8">
            <el-form-item label="关键词">
              <el-input v-model="filters.keyword" placeholder="反馈人昵称 / 手机号 / 联系方式 / 反馈内容" clearable @keyup.enter="handleSearch" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="反馈时间">
              <el-date-picker v-model="filters.feedbackTimeRange" type="datetimerange" range-separator="~" start-placeholder="开始" end-placeholder="结束" format="YYYY-MM-DD HH:mm:ss" value-format="YYYY-MM-DD HH:mm:ss" style="width:100%" />
            </el-form-item>
          </el-col>
          <el-col :span="8" style="padding-top:28px;text-align:right">
            <el-button type="primary" @click="handleSearch">查询</el-button>
            <el-button @click="handleReset">重置</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <div class="result-info">
      共 <strong>{{ total }}</strong> 条反馈
    </div>

    <el-card shadow="never">
      <el-table :data="feedbackList" stripe border style="width:100%" max-height="600" v-loading="loading">
        <el-table-column type="index" label="序号" width="60" align="center" :index="i => (page - 1) * pageSize + i + 1" />
        <el-table-column prop="id" label="反馈ID" width="110" />
        <el-table-column label="反馈内容" min-width="250" show-overflow-tooltip>
          <template #default="{ row }">
            <span v-if="row.content" style="cursor:pointer" @click="openContentModal(row)">{{ row.content }}</span>
            <span v-else style="color:#999">--</span>
          </template>
        </el-table-column>
        <el-table-column label="图片" width="130">
          <template #default="{ row }">
            <div v-if="!row.images" style="color:#999">--</div>
            <div v-else style="display:flex;gap:4px;flex-wrap:wrap">
              <el-image v-for="(img, ii) in parseImages(row.images)" :key="ii" :src="img" style="width:36px;height:36px;border-radius:4px;cursor:pointer" fit="cover" :preview-src-list="parseImages(row.images)" :initial-index="ii" />
            </div>
          </template>
        </el-table-column>
        <el-table-column label="反馈人ID" width="110">
          <template #default="{ row }">{{ row.userId }}</template>
        </el-table-column>
        <el-table-column label="联系方式" width="130">
          <template #default="{ row }">
            <span v-if="row.contact">{{ row.contact }}</span>
            <span v-else style="color:#999">--</span>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="反馈时间" width="170" />
      </el-table>

      <div style="display:flex;justify-content:flex-end;margin-top:16px">
        <el-pagination v-model:current-page="page" v-model:page-size="pageSize" :page-sizes="[10, 30, 50]" :total="total" layout="total, sizes, prev, pager, next" @current-change="loadData" @size-change="loadData" />
      </div>
    </el-card>

    <el-dialog v-model="contentModalVisible" title="反馈详情" width="560px" destroy-on-close>
      <div v-if="contentModalData" style="line-height:1.8;color:#333">{{ contentModalData.content }}</div>
      <div v-if="contentModalData && contentModalData.images" style="margin-top:16px">
        <p style="font-size:14px;color:#666;margin-bottom:8px">图片证据：</p>
        <div style="display:flex;gap:8px;flex-wrap:wrap">
          <el-image v-for="(img, ii) in parseImages(contentModalData.images)" :key="ii" :src="img" style="width:80px;height:80px;border-radius:8px;cursor:pointer" fit="cover" :preview-src-list="parseImages(contentModalData.images)" :initial-index="ii" />
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import PageHeader from '@/components/PageHeader.vue'
import { getFeedbackList } from '@/api/feedback'
import type { ApiFeedback } from '@/types'

interface FilterState {
  keyword: string
  feedbackTimeRange: string[] | null
}

function createDefaultFilters(): FilterState {
  return { keyword: '', feedbackTimeRange: null }
}

const filters = ref<FilterState>(createDefaultFilters())
const page = ref(1)
const pageSize = ref(10)
const feedbackList = ref<ApiFeedback[]>([])
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
    const res = await getFeedbackList({ page: page.value, size: pageSize.value })
    if (res.code === 200) {
      feedbackList.value = res.data.list
      total.value = res.data.total
    } else {
      ElMessage.error(res.message || '获取反馈列表失败')
    }
  } catch {
    feedbackList.value = []
    total.value = 0
  } finally {
    loading.value = false
  }
}

function handleSearch() { page.value = 1; loadData() }
function handleReset() { filters.value = createDefaultFilters(); page.value = 1; loadData() }
watch(page, loadData)
loadData()

const contentModalVisible = ref(false)
const contentModalData = ref<ApiFeedback | null>(null)
function openContentModal(feedback: ApiFeedback) { contentModalData.value = feedback; contentModalVisible.value = true }
</script>

<style scoped lang="scss">
.feedback-list {
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

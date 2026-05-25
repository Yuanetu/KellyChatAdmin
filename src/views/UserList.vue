<template>
  <div class="user-list">
    <PageHeader title="用户列表" />

    <el-card shadow="never" class="filter-card">
      <el-form :model="filters" label-width="auto" label-position="top" @submit.prevent="handleSearch">
        <el-row :gutter="16">
          <el-col :span="6">
            <el-form-item label="搜索">
              <el-input v-model="filters.keyword" placeholder="昵称 / 手机号" clearable @keyup.enter="handleSearch" />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="性别">
              <el-select v-model="filters.gender" multiple placeholder="不限" clearable style="width:100%">
                <el-option v-for="opt in genderOptions" :key="opt.value" :label="opt.label" :value="opt.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="年龄">
              <el-input v-model.number="filters.maxAge" placeholder="年龄≤" type="number" clearable>
                <template #prepend>年龄≤</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="注册时间">
              <el-date-picker v-model="filters.registerTimeRange" type="datetimerange" range-separator="~" start-placeholder="开始" end-placeholder="结束" format="YYYY-MM-DD HH:mm:ss" value-format="YYYY-MM-DD HH:mm:ss" style="width:100%" />
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="最近活跃">
              <el-date-picker v-model="filters.lastActiveRange" type="datetimerange" range-separator="~" start-placeholder="开始" end-placeholder="结束" format="YYYY-MM-DD HH:mm:ss" value-format="YYYY-MM-DD HH:mm:ss" style="width:100%" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="16">
          <el-col :span="4">
            <el-form-item label="审核状态">
              <el-select v-model="filters.auditStatus" multiple placeholder="不限" clearable style="width:100%">
                <el-option v-for="opt in auditStatusOptions" :key="opt.value" :label="opt.label" :value="opt.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="异常项">
              <el-select v-model="filters.anomalyItems" multiple placeholder="不限" clearable style="width:100%">
                <el-option v-for="opt in anomalyOptions" :key="opt.value" :label="opt.label" :value="opt.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="用户状态">
              <el-select v-model="filters.userStatus" multiple placeholder="不限" clearable style="width:100%">
                <el-option v-for="opt in userStatusOptions" :key="opt.value" :label="opt.label" :value="opt.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="禁言时长">
              <el-input v-model.number="filters.muteDurationDays" placeholder="天数" type="number" clearable>
                <template #prepend>
                  <el-select v-model="filters.muteDurationOp" style="width:110px">
                    <el-option label="禁言时长≤" value="<=" />
                    <el-option label="禁言时长>" value=">" />
                  </el-select>
                </template>
                <template #append>天</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="封禁时长">
              <el-input v-model.number="filters.banDurationDays" placeholder="天数" type="number" clearable>
                <template #prepend>
                  <el-select v-model="filters.banDurationOp" style="width:110px">
                    <el-option label="封禁时长≤" value="<=" />
                    <el-option label="封禁时长>" value=">" />
                  </el-select>
                </template>
                <template #append>天</template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24" style="text-align:right">
            <el-button type="primary" @click="handleSearch">查询</el-button>
            <el-button @click="handleReset">重置</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <div class="result-info">
      共 <strong>{{ total }}</strong> 个用户
    </div>

    <el-card shadow="never">
      <el-table :data="userList" stripe border style="width:100%" max-height="600" v-loading="loading">
        <el-table-column type="index" label="序号" width="60" align="center" :index="(i: number) => (page - 1) * pageSize + i + 1" />
        <el-table-column prop="id" label="用户ID" width="110" />
        <el-table-column label="头像" width="70" align="center">
          <template #default="{ row }">
            <el-avatar v-if="row.avatar" :size="36" :src="row.avatar" style="cursor:pointer" @click="previewImage(row.avatar)" />
            <el-avatar v-else :size="36" style="cursor:pointer;background:#4361ee" @click="previewImage('')">{{ row.nickname?.charAt(0) || '?' }}</el-avatar>
          </template>
        </el-table-column>
        <el-table-column prop="nickname" label="昵称" width="100" show-overflow-tooltip />
        <el-table-column label="性别" width="70" align="center">
          <template #default="{ row }">{{ genderMap[row.gender] || '未知' }}</template>
        </el-table-column>
        <el-table-column label="年龄" width="60" align="center">
          <template #default="{ row }">{{ calcAge(row.birthday) }}</template>
        </el-table-column>
        <el-table-column prop="birthday" label="生日" width="110" />
        <el-table-column label="地区" width="120" show-overflow-tooltip>
          <template #default="{ row }">{{ formatRegion(row) }}</template>
        </el-table-column>
        <el-table-column prop="phone" label="手机号" width="130" />
        <el-table-column prop="signature" label="个人简介" width="160" show-overflow-tooltip>
          <template #default="{ row }">
            <span v-if="row.signature" style="cursor:pointer" @click="openBioModal(row)">{{ row.signature }}</span>
            <span v-else style="color:#999">--</span>
          </template>
        </el-table-column>
        <el-table-column prop="lastIp" label="最新IP" width="140" />
        <el-table-column prop="lastIpRegion" label="IP地" width="80" />
        <el-table-column label="审核状态" width="90" align="center">
          <template #default="{ row }">
            <el-tag :type="auditStatusTagType[row.auditStatus]" size="small">{{ auditStatusMap[row.auditStatus] }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="用户状态" width="90" align="center">
          <template #default="{ row }">
            <el-tag :type="userStatusTagType[row.userStatus]" size="small">{{ userStatusMap[row.userStatus] }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="注册时间" width="170" />
        <el-table-column prop="updatedAt" label="最近活跃" width="170" />
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="openAuditModal(row)">审核</el-button>
            <el-button type="warning" link size="small" @click="openMuteModal(row)">禁言</el-button>
            <el-button type="danger" link size="small" @click="openBanModal(row)">封禁</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div style="display:flex;justify-content:flex-end;margin-top:16px">
        <el-pagination v-model:current-page="page" v-model:page-size="pageSize" :page-sizes="[10, 30, 50]" :total="total" layout="total, sizes, prev, pager, next" @current-change="loadData" @size-change="loadData" />
      </div>
    </el-card>

    <el-dialog v-model="imagePreviewVisible" title="头像预览" width="300px" destroy-on-close>
      <div style="text-align:center">
        <el-avatar v-if="imagePreviewUrl" :size="160" :src="imagePreviewUrl" />
        <el-avatar v-else :size="160" style="background:#4361ee;font-size:48px">?</el-avatar>
      </div>
    </el-dialog>

    <el-dialog v-model="bioModalVisible" title="个人简介" width="480px" destroy-on-close>
      <p style="line-height:1.8;color:#333">{{ bioModalData }}</p>
    </el-dialog>

    <el-dialog v-model="auditModalVisible" title="资料审核" width="800px" destroy-on-close>
      <div class="audit-user-info">
        <span><strong>用户ID：</strong>{{ auditModalUser?.id }}</span>
        <span style="margin-left:24px"><strong>昵称：</strong>{{ auditModalUser?.nickname }}</span>
      </div>
      <el-table :data="auditTableData" border style="width:100%;margin-top:12px" max-height="400">
        <el-table-column label="项目" width="100" align="center">
          <template #default="{ row }">{{ row.label }}</template>
        </el-table-column>
        <el-table-column label="内容" min-width="150">
          <template #default="{ row }">
            <div v-if="row.key === 'avatar'">
              <el-avatar v-if="auditModalUser?.avatar" :size="48" :src="auditModalUser.avatar" style="cursor:pointer" @click="previewImage(auditModalUser.avatar)" />
              <span v-else style="color:#999">--</span>
            </div>
            <div v-else-if="row.key === 'tags'">
              <div v-if="auditTags.length > 0">
                <div v-for="(tag, ti) in auditTags" :key="ti" style="margin-bottom:4px"><el-tag size="small" type="info">{{ tag }}</el-tag></div>
              </div>
              <span v-else style="color:#999">--</span>
            </div>
            <div v-else-if="row.key === 'photoWall'">
              <div v-if="auditPhotos.length > 0" style="display:flex;flex-wrap:wrap;gap:6px">
                <div v-for="(photo, pi) in auditPhotos" :key="pi" class="audit-photo-thumb" :style="{ backgroundImage: `url(${photo})` }" @click="previewImage(photo)"></div>
              </div>
              <span v-else style="color:#999">--</span>
            </div>
            <div v-else>
              <span>{{ row.getValue(auditModalUser!) || '--' }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="审核状态" width="150" align="center">
          <template #default="{ row }">
            <el-select v-model="auditForm[row.fieldKey as keyof typeof auditForm]" placeholder="不修改" style="width:110px" size="small">
              <el-option :value="null" label="不修改" />
              <el-option :value="0" label="正常" />
              <el-option :value="1" label="待审核" />
              <el-option :value="2" label="违规" />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="说明" width="200">
          <template #default="{ row }">{{ row.description }}</template>
        </el-table-column>
      </el-table>
      <template #footer>
        <el-button @click="auditModalVisible = false">取消</el-button>
        <el-button type="primary" @click="submitAudit">确定</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="muteModalVisible" :title="`禁言设置 - ${muteModalUser?.nickname || ''}`" width="520px" destroy-on-close>
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
          <el-form-item v-else label="禁言结束时间">
            <span v-if="muteDurationType !== 'custom'" style="color:#409eff;font-weight:500">{{ muteEndTimeDisplay }}</span>
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

    <el-dialog v-model="banModalVisible" :title="`封禁设置 - ${banModalUser?.nickname || ''}`" width="520px" destroy-on-close>
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
          <el-form-item v-else label="封禁结束时间">
            <span v-if="banDurationType !== 'custom'" style="color:#409eff;font-weight:500">{{ banEndTimeDisplay }}</span>
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
import { ref, reactive, watch, computed } from 'vue'
import { ElMessage } from 'element-plus'
import PageHeader from '@/components/PageHeader.vue'
import { getUserList, auditUser, muteUser, unmuteUser, banUser, unbanUser } from '@/api/users'
import type { ApiUser } from '@/types'

const genderMap: Record<number, string> = { 0: '未知', 1: '男', 2: '女' }
const auditStatusMap: Record<number, string> = { 0: '正常', 1: '待审核', 2: '违规' }
const userStatusMap: Record<number, string> = { 0: '正常', 1: '禁言', 2: '封禁' }
const auditStatusTagType: Record<number, string> = { 0: 'success', 1: 'warning', 2: 'danger' }
const userStatusTagType: Record<number, string> = { 0: 'success', 1: 'warning', 2: 'danger' }

const genderOptions = [{ value: 1, label: '男' }, { value: 2, label: '女' }]
const auditStatusOptions = [{ value: 0, label: '正常' }, { value: 1, label: '待审核' }, { value: 2, label: '违规' }]
const anomalyOptions = [
  { value: 'avatar', label: '头像' }, { value: 'nickname', label: '昵称' },
  { value: 'tags', label: '标签' }, { value: 'bio', label: '个人简介' }, { value: 'photoWall', label: '照片墙' }
]
const userStatusOptions = [{ value: 0, label: '正常' }, { value: 1, label: '禁言' }, { value: 2, label: '封禁' }]

interface FilterState {
  keyword: string
  gender: number[]
  maxAge: number | undefined
  registerTimeRange: string[] | null
  lastActiveRange: string[] | null
  auditStatus: number[]
  anomalyItems: string[]
  userStatus: number[]
  muteDurationOp: string
  muteDurationDays: number | undefined
  banDurationOp: string
  banDurationDays: number | undefined
}

function createDefaultFilters(): FilterState {
  return {
    keyword: '', gender: [], maxAge: undefined,
    registerTimeRange: null, lastActiveRange: null,
    auditStatus: [], anomalyItems: [], userStatus: [],
    muteDurationOp: '<=', muteDurationDays: undefined,
    banDurationOp: '<=', banDurationDays: undefined
  }
}

const filters = ref<FilterState>(createDefaultFilters())
const page = ref(1)
const pageSize = ref(10)
const userList = ref<ApiUser[]>([])
const total = ref(0)
const loading = ref(false)

function calcAge(birthday: string): number {
  if (!birthday) return 0
  const birth = new Date(birthday)
  const now = new Date()
  let age = now.getFullYear() - birth.getFullYear()
  const m = now.getMonth() - birth.getMonth()
  if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age--
  return age
}

function formatRegion(row: ApiUser): string {
  return [row.province, row.city, row.district].filter(Boolean).join(' ') || '--'
}

async function loadData() {
  loading.value = true
  try {
    const f = filters.value
    const params: any = {
      keyword: f.keyword || undefined,
      gender: f.gender.length > 0 ? f.gender[0] : undefined,
      regStart: f.registerTimeRange?.[0] || undefined,
      regEnd: f.registerTimeRange?.[1] || undefined,
      page: page.value,
      size: pageSize.value
    }
    const res = await getUserList(params)
    if (res.code === 200) {
      userList.value = res.data.list
      total.value = res.data.total
    } else {
      ElMessage.error(res.message || '获取用户列表失败')
    }
  } catch {
    userList.value = []
    total.value = 0
  } finally {
    loading.value = false
  }
}

function handleSearch() { page.value = 1; loadData() }
function handleReset() { filters.value = createDefaultFilters(); page.value = 1; loadData() }
watch(page, loadData)
loadData()

const imagePreviewVisible = ref(false)
const imagePreviewUrl = ref('')
function previewImage(url: string) { imagePreviewUrl.value = url; imagePreviewVisible.value = true }

const bioModalVisible = ref(false)
const bioModalData = ref('')
function openBioModal(user: ApiUser) { bioModalData.value = user.signature; bioModalVisible.value = true }

const auditModalVisible = ref(false)
const auditModalUser = ref<ApiUser | null>(null)
const auditTags = ref<string[]>([])
const auditPhotos = ref<string[]>([])

const auditTableData = [
  {
    key: 'avatar',
    fieldKey: 'avatarAudit',
    label: '用户头像',
    description: '标记异常后，App上将显示系统默认头像',
    getValue: (u: ApiUser) => u.avatar || ''
  },
  {
    key: 'nickname',
    fieldKey: 'nicknameAudit',
    label: '用户昵称',
    description: '标记异常后，App上将显示系统默认昵称',
    getValue: (u: ApiUser) => u.nickname || ''
  },
  {
    key: 'tags',
    fieldKey: 'tagAudit',
    label: '用户标签',
    description: '标记异常后，App上将隐藏该标签',
    getValue: () => ''
  },
  {
    key: 'signature',
    fieldKey: 'bioAudit',
    label: '个人简介',
    description: '标记异常后，App上将隐藏个人简介',
    getValue: (u: ApiUser) => u.signature || ''
  },
  {
    key: 'photoWall',
    fieldKey: 'photosAudit',
    label: '照片墙',
    description: '标记异常后，App上将隐藏对应照片',
    getValue: () => ''
  }
]

interface AuditForm {
  avatarAudit: number | null
  nicknameAudit: number | null
  tagAudit: number | null
  bioAudit: number | null
  photosAudit: number | null
}

const auditForm = reactive<AuditForm>({
  avatarAudit: null,
  nicknameAudit: null,
  tagAudit: null,
  bioAudit: null,
  photosAudit: null
})

function openAuditModal(user: ApiUser) {
  auditModalUser.value = user
  auditForm.avatarAudit = null
  auditForm.nicknameAudit = null
  auditForm.tagAudit = null
  auditForm.bioAudit = null
  auditForm.photosAudit = null
  auditTags.value = []
  auditPhotos.value = []
  auditModalVisible.value = true
}

async function submitAudit() {
  if (!auditModalUser.value) return
  
  try {
    const res = await auditUser(auditModalUser.value.id, auditForm)
    if (res.code === 200) {
      ElMessage.success('审核提交成功')
      loadData()
    } else {
      ElMessage.error(res.message || '审核失败')
    }
  } catch {
    ElMessage.error('审核失败')
  }
  auditModalVisible.value = false
}

const muteModalVisible = ref(false)
const muteModalUser = ref<ApiUser | null>(null)
const muteEnabled = ref(false)
const muteDurationType = ref('1')
const muteCustomEndTime = ref('')

function formatDateTimeStr(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`
}

const muteEndTimeDisplay = computed(() => {
  if (muteDurationType.value === 'custom') {
    return muteCustomEndTime.value || '--'
  }
  const days = parseInt(muteDurationType.value)
  if (isNaN(days) || days <= 0) return '--'
  return formatDateTimeStr(new Date(Date.now() + days * 86400000))
})

function onMuteDurationTypeChange() {
  muteCustomEndTime.value = ''
}

function isUserMuted(user: ApiUser): boolean {
  return user.isMuted
}

function openMuteModal(user: ApiUser) {
  muteModalUser.value = user
  const muted = isUserMuted(user)
  muteEnabled.value = muted
  if (muted) {
    muteDurationType.value = '1'
  } else {
    muteDurationType.value = '1'
  }
  muteCustomEndTime.value = ''
  muteModalVisible.value = true
}

async function submitMute() {
  if (!muteModalUser.value) return
  if (!muteEnabled.value) {
    try {
      const res = await unmuteUser(muteModalUser.value.id)
      if (res.code === 200) {
        ElMessage.success('已取消禁言')
        loadData()
      } else {
        ElMessage.error(res.message || '操作失败')
      }
    } catch {
      ElMessage.error('操作失败')
    }
    muteModalVisible.value = false
    return
  }
  let days: number | undefined = undefined
  if (muteDurationType.value === 'custom') {
    if (!muteCustomEndTime.value) {
      ElMessage.warning('请选择禁言结束时间')
      return
    }
    const end = new Date(muteCustomEndTime.value).getTime()
    const diff = end - Date.now()
    if (diff <= 0) {
      ElMessage.warning('结束时间必须晚于当前时间')
      return
    }
    days = Math.ceil(diff / 86400000)
  } else {
    days = parseInt(muteDurationType.value)
  }
  if (days !== undefined && days <= 0) {
    days = undefined
  }
  try {
    const res = await muteUser(muteModalUser.value.id, { days })
    if (res.code === 200) {
      ElMessage.success(days !== undefined ? '禁言设置成功' : '已设置永久禁言')
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
const banModalUser = ref<ApiUser | null>(null)
const banEnabled = ref(false)
const banDurationType = ref('1')
const banCustomEndTime = ref('')

const banEndTimeDisplay = computed(() => {
  if (banDurationType.value === 'custom') {
    return banCustomEndTime.value || '--'
  }
  const days = parseInt(banDurationType.value)
  if (isNaN(days) || days <= 0) return '--'
  return formatDateTimeStr(new Date(Date.now() + days * 86400000))
})

function onBanDurationTypeChange() {
  banCustomEndTime.value = ''
}

function isUserBanned(user: ApiUser): boolean {
  return user.isBanned
}

function openBanModal(user: ApiUser) {
  banModalUser.value = user
  const banned = isUserBanned(user)
  banEnabled.value = banned
  banDurationType.value = '1'
  banCustomEndTime.value = ''
  banModalVisible.value = true
}

async function submitBan() {
  if (!banModalUser.value) return
  if (!banEnabled.value) {
    try {
      const res = await unbanUser(banModalUser.value.id)
      if (res.code === 200) {
        ElMessage.success('已取消封禁')
        loadData()
      } else {
        ElMessage.error(res.message || '操作失败')
      }
    } catch {
      ElMessage.error('操作失败')
    }
    banModalVisible.value = false
    return
  }
  let days: number | undefined = undefined
  if (banDurationType.value === 'custom') {
    if (!banCustomEndTime.value) {
      ElMessage.warning('请选择封禁结束时间')
      return
    }
    const end = new Date(banCustomEndTime.value).getTime()
    const diff = end - Date.now()
    if (diff <= 0) {
      ElMessage.warning('结束时间必须晚于当前时间')
      return
    }
    days = Math.ceil(diff / 86400000)
  } else {
    days = parseInt(banDurationType.value)
  }
  if (days !== undefined && days <= 0) {
    days = undefined
  }
  try {
    const res = await banUser({ days, userId: banModalUser.value.id })
    if (res.code === 200) {
      ElMessage.success(days !== undefined ? '封禁设置成功' : '已设置永久封禁')
      loadData()
    } else {
      ElMessage.error(res.message || '封禁设置失败')
    }
  } catch {
    ElMessage.error('封禁设置失败')
  }
  banModalVisible.value = false
}
</script>

<style scoped lang="scss">
.user-list {
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

.audit-user-info {
  margin-bottom: 8px;
  font-size: 14px;
}

.audit-photo-thumb {
  width: 48px;
  height: 48px;
  border-radius: 6px;
  background-size: cover;
  background-position: center;
  cursor: pointer;
  transition: $transition-base;
  &:hover { transform: scale(1.1); }
}
</style>

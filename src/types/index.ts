export interface StatsUserStats {
  cutoffTime: string
  todayNew: number
  yesterdayNewWoW: number
  weekNew: number
  lastWeekNewWoW: number
  monthNew: number
  lastMonthNewMoM: number
  totalUsers: number
}

export interface StatsActiveStats {
  cutoffTime: string
  todayActive: number
  yesterdayActiveRate: number
  weekActive: number
  lastWeekActiveRate: number
  monthActive: number
  lastMonthActiveRate: number
}

export interface StatsRetentionItem {
  rate: number
  wow: number
  regDate: string
}

export interface StatsRetentionStats {
  cutoffTime: string
  day1: StatsRetentionItem
  day3: StatsRetentionItem
  day7: StatsRetentionItem
  day30: StatsRetentionItem
}

export interface StatsData {
  userStats: StatsUserStats
  activeStats: StatsActiveStats
  retentionStats: StatsRetentionStats
}

export interface StatCard {
  label: string
  value: number | string
  change?: number
  changeLabel?: string
  period?: string
}

export interface UserStats {
  todayNew: StatCard
  weekNew: StatCard
  monthNew: StatCard
  totalUsers: number
  updateTime: string
}

export interface ActivityStats {
  todayActive: StatCard
  weekActive: StatCard
  monthActive: StatCard
  updateTime: string
}

export interface RetentionItem {
  label: string
  rate: number
  change: number
  registerDate: string
}

export interface RetentionStats {
  items: RetentionItem[]
  updateTime: string
}

export interface DashboardData {
  userStats: UserStats
  activityStats: ActivityStats
  retentionStats: RetentionStats
}

export interface TrendData {
  dates: string[]
  userGrowth: number[]
  activeUsers: number[]
  messages: number[]
}

export type Gender = 'male' | 'female'
export type AuditStatus = 'normal' | 'pending' | 'violation'
export type ProfileAnomalyItem = 'avatar' | 'nickname' | 'tags' | 'bio' | 'photoWall'
export type UserStatus = 'normal' | 'muted' | 'banned'

export interface ApiUser {
  id: number
  phone: string
  nickname: string
  avatar: string
  gender: number
  birthday: string
  province: string
  city: string
  district: string
  signature: string
  lastIp: string
  lastIpRegion: string
  lastUserAgent: string
  auditStatus: number
  userStatus: number
  isMuted: boolean
  muteEndTime: string
  isBanned: boolean
  banEndTime: string
  profileVector: string
  vectorUpdatedAt: string
  status: number
  deactivationTime: string
  createdAt: string
  updatedAt: string
}

export interface ApiUserListData {
  total: number
  list: ApiUser[]
  page: number
  size: number
  pages: number
}

export interface User {
  id: string
  avatar: string
  nickname: string
  gender: Gender | ''
  age: number
  birthday: string
  region: string
  phone: string
  tags: string[]
  bio: string
  photoWall: string[]
  latestIp: string
  latestIpRegion: string
  registeredAt: string
  lastActiveAt: string
  auditStatus: AuditStatus
  anomalyItems: ProfileAnomalyItem[]
  userStatus: UserStatus
  muteEndTime?: string
  banEndTime?: string
}

export interface UserListParams {
  keyword?: string
  gender?: Gender[]
  maxAge?: number
  registerTimeStart?: string
  registerTimeEnd?: string
  lastActiveStart?: string
  lastActiveEnd?: string
  auditStatus?: AuditStatus[]
  anomalyItems?: ProfileAnomalyItem[]
  userStatus?: UserStatus[]
  muteDurationOp?: '<=' | '>'
  muteDurationDays?: number
  banDurationOp?: '<=' | '>'
  banDurationDays?: number
  page: number
  pageSize: number
}

export interface UserListResponse {
  list: User[]
  total: number
  page: number
  pageSize: number
}

export interface ApiReport {
  id: number
  reporterUserId: number
  reportedUserId: number
  reportType: number
  reason: string
  description: string
  images: string
  status: number
  handleType: number
  handleTime: string
  createdAt: string
}

export interface ApiReportListData {
  total: number
  list: ApiReport[]
  page: number
  size: number
  pages: number
}

export type ReportReason = 'pornography' | 'politics' | 'fraud' | 'abuse' | 'discrimination' | 'cyberbullying' | 'impersonation' | 'illegal' | 'minor' | 'immoral' | 'safety' | 'other'
export type ReportStatus = 'pending' | 'handled' | 'invalid'
export type HandleMethod = 'mute' | 'ban' | ''

export interface Report {
  id: string
  targetAvatar: string
  targetNickname: string
  targetId: string
  targetPhone: string
  reporterAvatar: string
  reporterNickname: string
  reporterId: string
  reporterPhone: string
  reason: ReportReason
  description: string
  images: string[]
  status: ReportStatus
  handleMethod: HandleMethod
  createdAt: string
  handledAt?: string
}

export interface ReportListParams {
  keyword?: string
  reasons?: ReportReason[]
  status?: ReportStatus[]
  reportTimeStart?: string
  reportTimeEnd?: string
  handleTimeStart?: string
  handleTimeEnd?: string
  handleMethod?: HandleMethod[]
  page: number
  pageSize: number
}

export interface ReportListResponse {
  list: Report[]
  total: number
  page: number
  pageSize: number
}

export interface ApiFeedback {
  id: number
  userId: number
  content: string
  images: string
  contact: string
  createdAt: string
}

export interface ApiFeedbackListData {
  total: number
  list: ApiFeedback[]
  page: number
  size: number
  pages: number
}

export interface Feedback {
  id: string
  content: string
  images: string[]
  userAvatar: string
  userNickname: string
  userId: string
  userPhone: string
  contactInfo: string
  createdAt: string
}

export interface FeedbackListParams {
  keyword?: string
  feedbackTimeStart?: string
  feedbackTimeEnd?: string
  page: number
  pageSize: number
}

export interface FeedbackListResponse {
  list: Feedback[]
  total: number
  page: number
  pageSize: number
}

export interface PageResult<T> {
  list: T[]
  total: number
  page: number
  pageSize: number
}

export interface LoginParams {
  username: string
  password: string
}

export interface LoginData {
  token: string
  adminId: number
  username: string
  nickname: string
  role: string
  expiresIn: number
}

export interface ApiResponse<T> {
  code: number
  message: string
  data: T
}

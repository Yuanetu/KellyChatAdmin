import type { DashboardData, TrendData, User, Report, Feedback } from '@/types'

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function formatDate(daysAgo: number): string {
  const d = new Date()
  d.setDate(d.getDate() - daysAgo)
  return d.toISOString().slice(0, 10)
}

function formatDateTime(daysAgo: number): string {
  const d = new Date()
  d.setDate(d.getDate() - daysAgo)
  d.setHours(randomInt(0, 23), randomInt(0, 59), randomInt(0, 59))
  return d.toISOString().replace('T', ' ').slice(0, 19)
}

function formatNow(): string {
  const d = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
}

function getDaySuffix(day: number): string {
  return `${day}号`
}

function getWeekRange(): string {
  const now = new Date()
  const dayOfWeek = now.getDay() === 0 ? 7 : now.getDay()
  const monday = new Date(now)
  monday.setDate(now.getDate() - dayOfWeek + 1)
  return `${getDaySuffix(monday.getDate())}-${getDaySuffix(now.getDate())}`
}

function getMonthRange(): string {
  const now = new Date()
  return `01-${getDaySuffix(now.getDate())}`
}

export function getMockDashboardData(): DashboardData {
  const now = new Date()
  const updateTime = formatNow()

  return {
    userStats: {
      todayNew: { label: '今日新增', value: 0, change: 0, period: getDaySuffix(now.getDate()) },
      weekNew: { label: '本周新增', value: 0, change: 0, period: getWeekRange() },
      monthNew: { label: '本月新增', value: 0, change: 0, period: getMonthRange() },
      totalUsers: 0,
      updateTime
    },
    activityStats: {
      todayActive: { label: '今日活跃', value: 0, change: 0, period: getDaySuffix(now.getDate()) },
      weekActive: { label: '本周活跃', value: 0, change: 0, period: getWeekRange() },
      monthActive: { label: '本月活跃', value: 0, change: 0, period: getMonthRange() },
      updateTime
    },
    retentionStats: {
      items: [
        { label: '次日留存', rate: 0, change: 0, registerDate: '' },
        { label: '3日留存', rate: 0, change: 0, registerDate: '' },
        { label: '7日留存', rate: 0, change: 0, registerDate: '' },
        { label: '30日留存', rate: 0, change: 0, registerDate: '' }
      ],
      updateTime
    }
  }
}

export function getMockTrendData(range: '7d' | '30d'): TrendData {
  const days = range === '7d' ? 7 : 30
  const dates: string[] = []
  const userGrowth: number[] = []
  const activeUsers: number[] = []
  const messages: number[] = []

  for (let i = days - 1; i >= 0; i--) {
    dates.push(formatDate(i))
    userGrowth.push(randomInt(200, 600))
    activeUsers.push(randomInt(15000, 30000))
    messages.push(randomInt(60000, 120000))
  }

  return { dates, userGrowth, activeUsers, messages }
}

const avatarColors = ['#4361ee', '#e74c3c', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c', '#e67e22', '#3498db']

const nicknames = ['张小明', '李华', '王芳', '赵强', '刘洋', '陈静', '杨磊', '黄丽', '周杰', '吴敏', '郑伟', '孙娜', '马超', '朱婷', '胡波', '林峰', '何雪', '高远', '梁宇', '谢琳']

const tagPool = ['旅行', '美食', '摄影', '音乐', '运动', '阅读', '游戏', '电影', '绘画', '编程', '瑜伽', '咖啡', '宠物', '时尚', '健身']
const regionPool = ['北京', '上海', '广州', '深圳', '杭州', '成都', '武汉', '南京', '重庆', '西安', '苏州', '长沙', '天津', '青岛', '厦门']
const bioPool = [
  '热爱生活，喜欢旅行和摄影，记录每一个美好瞬间。',
  '美食爱好者，厨房是我的游乐场。',
  '音乐是灵魂的语言，用旋律表达自己。',
  '运动让我充满活力，每天都要出点汗！',
  '书虫一枚，阅读是我最好的陪伴。',
  '代码改变世界，编程让我快乐。',
  '用画笔描绘心中的色彩，艺术无处不在。',
  '咖啡与猫，这就是我的理想生活。'
]

const allMockUsers: User[] = Array.from({ length: 86 }, (_, i): User => {
  const gender: User['gender'] = i % 3 === 0 ? 'male' : i % 3 === 1 ? 'female' : ''
  const age = randomInt(18, 45)
  const birthYear = new Date().getFullYear() - age
  const birthMonth = randomInt(1, 12)
  const birthDay = randomInt(1, 28)
  const birthday = `${birthYear}-${String(birthMonth).padStart(2, '0')}-${String(birthDay).padStart(2, '0')}`
  const userTags = Array.from({ length: randomInt(1, 5) }, () => tagPool[randomInt(0, tagPool.length - 1)])
  const uniqueTags = [...new Set(userTags)]
  const anomalyItems: User['anomalyItems'] = []
  if (i % 11 === 0) anomalyItems.push('avatar')
  if (i % 13 === 0) anomalyItems.push('nickname')
  if (i % 17 === 0) anomalyItems.push('tags')
  if (i % 19 === 0) anomalyItems.push('bio')
  if (i % 23 === 0) anomalyItems.push('photoWall')
  const auditStatus: User['auditStatus'] = anomalyItems.length > 0 ? 'violation' : i % 9 === 0 ? 'pending' : 'normal'
  const userStatus: User['userStatus'] = i % 7 === 0 ? 'banned' : i % 5 === 0 ? 'muted' : 'normal'
  const muteEndTime = userStatus === 'muted' || userStatus === 'banned'
    ? new Date(Date.now() + randomInt(1, 30) * 86400000).toISOString().replace('T', ' ').slice(0, 19)
    : undefined
  const banEndTime = userStatus === 'banned'
    ? new Date(Date.now() + randomInt(1, 90) * 86400000).toISOString().replace('T', ' ').slice(0, 19)
    : undefined
  const photoCount = randomInt(0, 6)
  const photoWall = Array.from({ length: photoCount }, () =>
    avatarColors[randomInt(0, avatarColors.length - 1)]
  )
  return {
    id: `U${String(10001 + i).padStart(6, '0')}`,
    avatar: avatarColors[i % avatarColors.length],
    nickname: nicknames[i % nicknames.length] + (i >= nicknames.length ? i : ''),
    gender,
    age,
    birthday,
    region: regionPool[i % regionPool.length],
    phone: `1${randomInt(30, 99)}${String(randomInt(10000000, 99999999))}`,
    tags: uniqueTags,
    bio: bioPool[i % bioPool.length],
    photoWall,
    latestIp: `${randomInt(100, 220)}.${randomInt(0, 255)}.${randomInt(0, 255)}.${randomInt(1, 254)}`,
    latestIpRegion: regionPool[randomInt(0, regionPool.length - 1)],
    registeredAt: formatDateTime(randomInt(30, 365)),
    lastActiveAt: formatDateTime(randomInt(0, 7)),
    auditStatus,
    anomalyItems,
    userStatus,
    muteEndTime,
    banEndTime
  }
})

export function getMockUsers(params: import('@/types').UserListParams) {
  let filtered = [...allMockUsers]

  if (params.keyword) {
    const kw = params.keyword.toLowerCase()
    filtered = filtered.filter(u => u.nickname.toLowerCase().includes(kw) || u.phone.includes(kw))
  }
  if (params.gender && params.gender.length > 0) {
    filtered = filtered.filter(u => params.gender!.includes(u.gender as any))
  }
  if (params.maxAge !== undefined && params.maxAge > 0) {
    filtered = filtered.filter(u => u.age <= params.maxAge!)
  }
  if (params.registerTimeStart) {
    filtered = filtered.filter(u => u.registeredAt >= params.registerTimeStart!)
  }
  if (params.registerTimeEnd) {
    filtered = filtered.filter(u => u.registeredAt <= params.registerTimeEnd!)
  }
  if (params.lastActiveStart) {
    filtered = filtered.filter(u => u.lastActiveAt >= params.lastActiveStart!)
  }
  if (params.lastActiveEnd) {
    filtered = filtered.filter(u => u.lastActiveAt <= params.lastActiveEnd!)
  }
  if (params.auditStatus && params.auditStatus.length > 0) {
    filtered = filtered.filter(u => params.auditStatus!.includes(u.auditStatus))
  }
  if (params.anomalyItems && params.anomalyItems.length > 0) {
    filtered = filtered.filter(u => u.anomalyItems.some(item => params.anomalyItems!.includes(item)))
  }
  if (params.userStatus && params.userStatus.length > 0) {
    filtered = filtered.filter(u => params.userStatus!.includes(u.userStatus))
  }
  if (params.muteDurationOp && params.muteDurationDays !== undefined) {
    filtered = filtered.filter(u => {
      if (!u.muteEndTime) return false
      const remaining = Math.ceil((new Date(u.muteEndTime).getTime() - Date.now()) / 86400000)
      return params.muteDurationOp === '<=' ? remaining <= params.muteDurationDays! : remaining > params.muteDurationDays!
    })
  }
  if (params.banDurationOp && params.banDurationDays !== undefined) {
    filtered = filtered.filter(u => {
      if (!u.banEndTime) return false
      const remaining = Math.ceil((new Date(u.banEndTime).getTime() - Date.now()) / 86400000)
      return params.banDurationOp === '<=' ? remaining <= params.banDurationDays! : remaining > params.banDurationDays!
    })
  }

  const start = (params.page - 1) * params.pageSize
  return {
    list: filtered.slice(start, start + params.pageSize),
    total: filtered.length,
    page: params.page,
    pageSize: params.pageSize
  }
}

const reportReasons: Report['reason'][] = ['pornography', 'politics', 'fraud', 'abuse', 'discrimination', 'cyberbullying', 'impersonation', 'illegal', 'minor', 'immoral', 'safety', 'other']
const reportReasonLabels: Record<string, string> = {
  pornography: '色情低俗', politics: '政治敏感', fraud: '涉嫌欺诈', abuse: '谩骂嘲讽',
  discrimination: '歧视', cyberbullying: '网络暴力', impersonation: '冒充他人', illegal: '违法违规',
  minor: '涉及未成年不当内容', immoral: '违反公德良序', safety: '危害人身安全', other: '其他违规类型'
}
export { reportReasonLabels }

const reportDescriptions = [
  '该用户在聊天中频繁发送色情低俗内容，严重影响平台氛围，已截图保存证据。',
  '该用户发布涉及政治敏感的言论，可能造成不良社会影响，请尽快处理。',
  '该用户以投资理财为名进行诈骗活动，诱导他人转账，已有多人受骗。',
  '该用户在聊天中使用侮辱性语言进行人身攻击，对他人造成精神伤害。',
  '该用户在个人资料和聊天中对特定群体发表歧视性言论，违反社区规范。',
  '该用户组织多人对他人进行网络暴力，包括人肉搜索和恶意传播隐私信息。',
  '该用户冒充他人身份进行聊天，盗用他人照片和信息，涉嫌身份欺诈。',
  '该用户在平台上发布违法违规信息，涉及赌博和非法交易活动。',
  '该用户与未成年人进行不当交流，内容涉及诱导和不良信息传播。',
  '该用户的行为严重违反公德良序，在公共聊天室散布谣言和虚假信息。',
  '该用户多次发送威胁他人人身安全的信息，已造成受害者心理恐慌。',
  '该用户存在其他违规行为，多次违反平台使用规范，建议尽快处理。'
]

const allMockReports: Report[] = Array.from({ length: 54 }, (_, i): Report => {
  const reason = reportReasons[i % reportReasons.length]
  const status: Report['status'] = i < 10 ? 'pending' : i % 4 === 0 ? 'invalid' : 'handled'
  const handleMethod: Report['handleMethod'] = status === 'pending' ? '' : status === 'invalid' ? '' : (i % 2 === 0 ? 'mute' : 'ban')
  const imageCount = randomInt(0, 3)
  return {
    id: `R${String(20001 + i).padStart(6, '0')}`,
    targetAvatar: avatarColors[(i + 5) % avatarColors.length],
    targetNickname: nicknames[(i + 5) % nicknames.length] + ((i + 5) >= nicknames.length ? (i + 5) : ''),
    targetId: `U${String(10001 + ((i + 5) % 20)).padStart(6, '0')}`,
    targetPhone: `1${randomInt(30, 99)}${String(randomInt(10000000, 99999999))}`,
    reporterAvatar: avatarColors[i % avatarColors.length],
    reporterNickname: nicknames[i % nicknames.length] + (i >= nicknames.length ? i : ''),
    reporterId: `U${String(10001 + (i % 20)).padStart(6, '0')}`,
    reporterPhone: `1${randomInt(30, 99)}${String(randomInt(10000000, 99999999))}`,
    reason,
    description: reportDescriptions[i % reportDescriptions.length],
    images: Array.from({ length: imageCount }, () => avatarColors[randomInt(0, avatarColors.length - 1)]),
    status,
    handleMethod,
    createdAt: formatDateTime(randomInt(1, 30)),
    handledAt: status !== 'pending' ? formatDateTime(randomInt(0, 5)) : undefined
  }
})

export function getMockReports(params: import('@/types').ReportListParams) {
  let filtered = [...allMockReports]

  if (params.keyword) {
    const kw = params.keyword.toLowerCase()
    filtered = filtered.filter(r =>
      r.targetNickname.toLowerCase().includes(kw) || r.targetPhone.includes(kw) ||
      r.reporterNickname.toLowerCase().includes(kw) || r.reporterPhone.includes(kw)
    )
  }
  if (params.reasons && params.reasons.length > 0) {
    filtered = filtered.filter(r => params.reasons!.includes(r.reason))
  }
  if (params.status && params.status.length > 0) {
    filtered = filtered.filter(r => params.status!.includes(r.status))
  }
  if (params.reportTimeStart) {
    filtered = filtered.filter(r => r.createdAt >= params.reportTimeStart!)
  }
  if (params.reportTimeEnd) {
    filtered = filtered.filter(r => r.createdAt <= params.reportTimeEnd!)
  }
  if (params.handleTimeStart) {
    filtered = filtered.filter(r => r.handledAt && r.handledAt >= params.handleTimeStart!)
  }
  if (params.handleTimeEnd) {
    filtered = filtered.filter(r => r.handledAt && r.handledAt <= params.handleTimeEnd!)
  }
  if (params.handleMethod && params.handleMethod.length > 0) {
    filtered = filtered.filter(r => params.handleMethod!.includes(r.handleMethod))
  }

  const start = (params.page - 1) * params.pageSize
  return {
    list: filtered.slice(start, start + params.pageSize),
    total: filtered.length,
    page: params.page,
    pageSize: params.pageSize
  }
}

const feedbackContents = [
  '应用在使用过程中经常闪退，特别是在发送图片的时候，希望能尽快修复这个问题。',
  '建议增加群聊功能，方便团队协作使用，目前只能一对一聊天不太方便。',
  '消息推送延迟严重，经常几分钟之后才能收到通知，影响沟通效率。',
  '希望能增加消息撤回功能，有时候发错消息无法撤回很尴尬。',
  '夜间模式下部分文字看不清楚，对比度太低，建议优化。',
  '语音消息播放有杂音，使用的是WiFi网络，其他应用正常。',
  '建议增加消息搜索功能，历史消息太多找不到重要内容。',
  '登录页面验证码经常加载失败，需要刷新好几次才能显示。',
  '聊天记录偶尔会丢失，重启App后部分消息不见了，非常影响使用体验。',
  '希望能支持自定义聊天气泡样式和主题颜色，让界面更有个性化。',
  '视频通话画面卡顿严重，网络状况良好的情况下也会出现延迟。',
  '建议增加好友分组功能，联系人太多不好管理。'
]

const allMockFeedback: Feedback[] = Array.from({ length: 42 }, (_, i): Feedback => {
  const imageCount = randomInt(0, 3)
  return {
    id: `F${String(30001 + i).padStart(6, '0')}`,
    content: feedbackContents[i % feedbackContents.length],
    images: Array.from({ length: imageCount }, () => avatarColors[randomInt(0, avatarColors.length - 1)]),
    userAvatar: avatarColors[i % avatarColors.length],
    userNickname: nicknames[i % nicknames.length] + (i >= nicknames.length ? i : ''),
    userId: `U${String(10001 + (i % 20)).padStart(6, '0')}`,
    userPhone: `1${randomInt(30, 99)}${String(randomInt(10000000, 99999999))}`,
    contactInfo: i % 3 === 0 ? '' : `1${randomInt(30, 99)}${String(randomInt(10000000, 99999999))}`,
    createdAt: formatDateTime(randomInt(1, 30))
  }
})

export function getMockFeedback(params: import('@/types').FeedbackListParams) {
  let filtered = [...allMockFeedback]

  if (params.keyword) {
    const kw = params.keyword.toLowerCase()
    filtered = filtered.filter(f =>
      f.userNickname.toLowerCase().includes(kw) ||
      f.userPhone.includes(kw) ||
      f.contactInfo.includes(kw) ||
      f.content.toLowerCase().includes(kw)
    )
  }
  if (params.feedbackTimeStart) {
    filtered = filtered.filter(f => f.createdAt >= params.feedbackTimeStart!)
  }
  if (params.feedbackTimeEnd) {
    filtered = filtered.filter(f => f.createdAt <= params.feedbackTimeEnd!)
  }

  const start = (params.page - 1) * params.pageSize
  return {
    list: filtered.slice(start, start + params.pageSize),
    total: filtered.length,
    page: params.page,
    pageSize: params.pageSize
  }
}

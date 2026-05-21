<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-left">
        <div class="brand-area">
          <el-icon :size="48" color="#4361ee"><ChatDotRound /></el-icon>
          <h1 class="brand-title">kellyChat</h1>
          <p class="brand-desc">管理后台</p>
        </div>
        <div class="feature-list">
          <div class="feature-item">
            <el-icon :size="20"><DataAnalysis /></el-icon>
            <span>数据统计与分析</span>
          </div>
          <div class="feature-item">
            <el-icon :size="20"><User /></el-icon>
            <span>用户管理与审核</span>
          </div>
          <div class="feature-item">
            <el-icon :size="20"><Flag /></el-icon>
            <span>举报处理与追踪</span>
          </div>
          <div class="feature-item">
            <el-icon :size="20"><ChatLineSquare /></el-icon>
            <span>用户反馈跟进</span>
          </div>
        </div>
      </div>

      <div class="login-right">
        <div class="login-form-wrap">
          <h2 class="form-title">欢迎登录</h2>
          <p class="form-subtitle">请输入您的账号信息</p>

          <el-form ref="formRef" :model="form" :rules="rules" size="large" @submit.prevent="handleLogin">
            <el-form-item prop="username">
              <el-input v-model="form.username" placeholder="请输入用户名" :prefix-icon="User" />
            </el-form-item>
            <el-form-item prop="password">
              <el-input v-model="form.password" type="password" placeholder="请输入密码" :prefix-icon="Lock" show-password @keyup.enter="handleLogin" />
            </el-form-item>

            <div class="form-options">
              <el-checkbox v-model="form.remember">记住登录</el-checkbox>
            </div>

            <el-form-item>
              <el-button type="primary" :loading="loading" style="width:100%" @click="handleLogin">
                {{ loading ? '登录中...' : '登 录' }}
              </el-button>
            </el-form-item>
          </el-form>

          <div class="form-footer">
            <span>kellyChat Admin &copy; {{ new Date().getFullYear() }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { ElMessage } from 'element-plus'
import { ChatDotRound, DataAnalysis, User, Flag, ChatLineSquare, Lock } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'
import { login } from '@/api/auth'
import type { ApiResponse, LoginData } from '@/types'

const router = useRouter()
const store = useStore()
const formRef = ref<FormInstance>()
const loading = ref(false)

const form = reactive({
  username: localStorage.getItem('kellychat_remember_username') || '',
  password: localStorage.getItem('kellychat_remember_password') || '',
  remember: localStorage.getItem('kellychat_remember') === 'true'
})

const rules: FormRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 2, max: 20, message: '用户名长度为2-20个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 30, message: '密码长度为6-30个字符', trigger: 'blur' }
  ]
}

async function handleLogin() {
  if (!formRef.value) return
  const valid = await formRef.value.validate().catch(() => false)
  if (!valid) return

  loading.value = true
  try {
    const res: ApiResponse<LoginData> = await login({
      username: form.username,
      password: form.password
    })

    if (res.code === 200) {
      const data = res.data
      store.dispatch('auth/login', { ...data, remember: form.remember })
      if (form.remember) {
        localStorage.setItem('kellychat_remember_username', form.username)
        localStorage.setItem('kellychat_remember_password', form.password)
        localStorage.setItem('kellychat_remember', 'true')
      } else {
        localStorage.removeItem('kellychat_remember_username')
        localStorage.removeItem('kellychat_remember_password')
        localStorage.removeItem('kellychat_remember')
      }
      ElMessage.success('登录成功')
      const redirect = (router.currentRoute.value.query.redirect as string) || '/dashboard'
      router.push(redirect)
    } else {
      ElMessage.error(res.message || '登录失败')
    }
  } catch (error: any) {
    ElMessage.error(error?.response?.data?.message || '登录失败，请检查网络连接')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped lang="scss">
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.login-container {
  display: flex;
  width: 900px;
  max-width: 100%;
  min-height: 520px;
  background: #fff;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
}

.login-left {
  flex: 1;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  padding: 48px 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.brand-area {
  margin-bottom: 48px;
}

.brand-title {
  font-size: 28px;
  font-weight: 700;
  color: #fff;
  margin: 16px 0 8px;
}

.brand-desc {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.6);
}

.feature-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 12px;
  color: rgba(255, 255, 255, 0.75);
  font-size: 15px;

  .el-icon {
    color: #4361ee;
  }
}

.login-right {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 48px 40px;
}

.login-form-wrap {
  width: 100%;
  max-width: 340px;
}

.form-title {
  font-size: 26px;
  font-weight: 700;
  color: #1a1a2e;
  margin-bottom: 8px;
}

.form-subtitle {
  font-size: 14px;
  color: #999;
  margin-bottom: 32px;
}

.form-options {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}

.form-footer {
  text-align: center;
  margin-top: 32px;
  font-size: 12px;
  color: #ccc;
}

@media (max-width: 768px) {
  .login-left {
    display: none;
  }

  .login-container {
    width: 100%;
    max-width: 420px;
  }
}
</style>

<template>
  <div class="invite-page">
    <div class="invite-bg">
      <img src="https://file.onemayy.com/images/2.0.0/invite-bgi.jpg" alt="" class="bg-img" />
    </div>

    <div class="invite-content">
      <header class="invite-header">
        <div class="header-left">
          <img src="@/assets/images/logo.png" alt="KellyChat" class="header-logo" />
          <div class="header-info">
            <span class="header-name">KellyChat</span>
            <span class="header-desc">和朋友一起探索社交新体验</span>
          </div>
        </div>
        <a class="download-btn" href="javascript:void(0)" @click="handleDownload">立即下载</a>
      </header>

      <div class="invite-card">
        <div class="card-avatar">
          <img v-if="inviterAvatar" :src="inviterAvatar" alt="" />
          <div v-else class="avatar-placeholder"></div>
        </div>
        <div class="card-invite-text">
          <span class="inviter-name">{{ inviterName }}</span>
          <span>邀请你一起做</span>
        </div>
        <div class="card-activity">
          <span class="activity-icon">🎬</span>
          <span class="activity-name">{{ activityName }}</span>
        </div>
        <p class="card-desc">加入KellyChat，设置自己正在做的事情，找到同频的人...</p>
        <a class="join-btn" href="javascript:void(0)" @click="handleJoin">加入 KellyChat</a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const inviterName = ref((route.query.name as string) || 'XXXX')
const inviterAvatar = ref((route.query.avatar as string) || '')
const activityName = ref((route.query.activity as string) || '看电影')

function handleDownload() {
  window.location.href = 'https://onemayy.com/download'
}

function handleJoin() {
  window.location.href = 'https://onemayy.com/download'
}
</script>

<style scoped lang="scss">
.invite-page {
  position: relative;
  min-height: 100vh;
  min-height: 100dvh;
  overflow: hidden;
  background: #00C853;
  display: flex;
  flex-direction: column;
}

.invite-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
  overflow: hidden;

  .bg-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.invite-content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  padding: 0 16px;
  padding-top: env(safe-area-inset-top, 0);
  padding-bottom: calc(16px + env(safe-area-inset-bottom, 0));
  box-sizing: border-box;
}

.invite-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  flex-shrink: 0;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  margin: 16px 0 24px;

  .header-left {
    display: flex;
    align-items: center;
    gap: 10px;
    flex: 1;
    min-width: 0;
  }

  .header-logo {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    object-fit: contain;
    flex-shrink: 0;
  }

  .header-info {
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
  }

  .header-name {
    font-size: 17px;
    font-weight: 700;
    color: #222;
    line-height: 1.3;
  }

  .header-desc {
    font-size: 12px;
    color: #999;
    line-height: 1.3;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .download-btn {
    flex-shrink: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 8px 16px;
    background: #232323;
    color: #fff;
    font-size: 13px;
    font-weight: 600;
    border-radius: 8px;
    text-decoration: none;
    white-space: nowrap;
    transition: opacity 0.2s;

    &:active {
      opacity: 0.8;
    }
  }
}

.invite-card {
  margin-top: auto;
  background: #fff;
  border-radius: 20px;
  padding: 64px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  margin-bottom: 40px;

  .card-avatar {
    width: 72px;
    height: 72px;
    border-radius: 50%;
    overflow: hidden;
    border: 3px solid #E8F5E9;
    flex-shrink: 0;
    margin-bottom: 40px;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .avatar-placeholder {
      width: 100%;
      height: 100%;
      background: linear-gradient(135deg, #A5D6A7, #66BB6A);
    }
  }

  .card-invite-text {
    font-size: 16px;
    color: #333;
    margin-bottom: 12px;
    line-height: 1.5;

    .inviter-name {
      font-weight: 700;
      color: #00C853;
    }
  }

  .card-activity {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 56px;

    .activity-icon {
      font-size: 28px;
    }

    .activity-name {
      font-size: 28px;
      font-weight: 800;
      color: #222;
    }
  }

  .card-desc {
    width: 270px;
    font-size: 14px;
    color: #888;
    line-height: 1.6;
    margin-bottom: 32px;
  }

  .join-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    padding: 14px 0;
    background: linear-gradient(135deg, #00C853, #00E676);
    color: #fff;
    font-size: 17px;
    font-weight: 700;
    border-radius: 28px;
    text-decoration: none;
    box-shadow: 0 4px 16px rgba(0, 200, 83, 0.4);
    transition: opacity 0.2s, transform 0.2s;

    &:active {
      opacity: 0.9;
      transform: scale(0.98);
    }
  }
}
</style>

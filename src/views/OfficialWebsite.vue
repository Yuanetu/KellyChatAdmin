<template>
  <div class="official-site">
    <img src="https://file.onemayy.com/images/2.0.0/kellyChat-home.jpg" alt="KellyChat" />

    <footer class="site-footer">
      <div class="footer-content">
        <div class="footer-line">
          <span class="police-badge">
            <img src="https://file.onemayy.com/images/2.0.0/jh-icon.png" alt="警徽" />
          </span>
          <a href="https://beian.mps.gov.cn/#/query/webSearch?code=44030002006183"
            target="_blank">粤公网安备44030002006183号</a>
          <span class="separator">|</span>
          <a href="https://beian.miit.gov.cn/" target="_blank">粤ICP备2024344797号-1</a>
        </div>
        <div class="footer-line">
          <span>光跃潮汐 版权所有</span>
        </div>
        <div class="footer-line">
          <span>Copyright © 2024-2026 GYCX. All Rights Reserved.</span>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped lang="scss">
.official-site {
  position: relative;

  img {
    width: 100%;
    height: auto;
  }

  .site-footer {
    color: #666;
    margin-top: auto;
    position: absolute;
    bottom: 10px;
    left: 0;
    right: 0;

    a {
      color: #666;
      &:hover {
        color: #4361ee;
      }
    }

    .footer-content {
      max-width: 1200px;
      margin: 0 auto;
      text-align: center;
      font-size: 12px;
      line-height: 1.8;
    }

    .footer-line {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      margin-bottom: 8px;

      &:last-child {
        margin-bottom: 0;
      }
    }

    .police-badge {
      display: inline-flex;
      align-items: center;

      img {
        width: 16px;
        height: 16px;
        margin-right: 4px;
      }
    }

    .separator {
      color: #333;
    }
  }
}
</style>

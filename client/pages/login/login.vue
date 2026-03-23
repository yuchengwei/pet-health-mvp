<template>
  <view class="login-container">
    <view class="logo-area">
      <image class="logo" src="/static/images/logo.png" mode="aspectFit" />
      <text class="app-name">宠物健康管理</text>
      <text class="slogan">守护爱宠健康每一天</text>
    </view>

    <view class="form-area">
      <!-- 手机号登录 -->
      <view class="input-group">
        <input 
          class="input" 
          v-model="phone" 
          type="number" 
          maxlength="11" 
          placeholder="请输入手机号" 
        />
      </view>
      <view class="input-group">
        <input 
          class="input" 
          v-model="code" 
          type="number" 
          maxlength="6" 
          placeholder="请输入验证码" 
        />
        <button 
          class="code-btn" 
          :disabled="countdown > 0" 
          @click="sendCode"
        >
          {{ countdown > 0 ? `${countdown}s` : '获取验证码' }}
        </button>
      </view>
      <button class="login-btn" @click="handleLogin">登录</button>
    </view>

    <view class="divider">
      <view class="line"></view>
      <text class="divider-text">或</text>
      <view class="line"></view>
    </view>

    <button class="wx-login-btn" open-type="getPhoneNumber" @getphonenumber="handleWxLogin">
      <text class="wx-icon">微</text>
      <text>微信一键登录</text>
    </button>

    <view class="agreement">
      <text>登录即表示同意</text>
      <text class="link">《用户协议》</text>
      <text>和</text>
      <text class="link">《隐私政策》</text>
    </view>
  </view>
</template>

<script>
import { authAPI } from '../../utils/api.js'

export default {
  data() {
    return {
      phone: '',
      code: '',
      countdown: 0
    }
  },
  methods: {
    async sendCode() {
      if (!/^1[3-9]\d{9}$/.test(this.phone)) {
        uni.showToast({ title: '请输入正确的手机号', icon: 'none' })
        return
      }
      
      try {
        await authAPI.sendCode(this.phone)
        uni.showToast({ title: '验证码已发送', icon: 'success' })
        
        this.countdown = 60
        const timer = setInterval(() => {
          this.countdown--
          if (this.countdown <= 0) clearInterval(timer)
        }, 1000)
      } catch (e) {
        uni.showToast({ title: e.message || '发送失败', icon: 'none' })
      }
    },
    
    async handleLogin() {
      if (!/^1[3-9]\d{9}$/.test(this.phone)) {
        uni.showToast({ title: '请输入手机号', icon: 'none' })
        return
      }
      if (!/^\d{6}$/.test(this.code)) {
        uni.showToast({ title: '请输入6位验证码', icon: 'none' })
        return
      }
      
      uni.showLoading({ title: '登录中...' })
      try {
        const res = await authAPI.login(this.phone, this.code)
        uni.setStorageSync('token', res.token)
        uni.setStorageSync('userInfo', res.user)
        uni.showToast({ title: '登录成功', icon: 'success' })
        setTimeout(() => {
          uni.switchTab({ url: '/pages/index/index' })
        }, 1000)
      } catch (e) {
        uni.showToast({ title: e.message || '登录失败', icon: 'none' })
      } finally {
        uni.hideLoading()
      }
    },
    
    async handleWxLogin(e) {
      if (e.detail.errMsg !== 'getPhoneNumber:ok') return
      
      uni.showLoading({ title: '登录中...' })
      try {
        // 获取code用于换取openid
        const loginRes = await new Promise((resolve, reject) => {
          uni.login({
            success: res => resolve(res),
            fail: reject
          })
        })
        
        const res = await authAPI.wxLogin(loginRes.code, e.detail.userInfo)
        uni.setStorageSync('token', res.token)
        uni.setStorageSync('userInfo', res.user)
        uni.showToast({ title: '登录成功', icon: 'success' })
        setTimeout(() => {
          uni.switchTab({ url: '/pages/index/index' })
        }, 1000)
      } catch (e) {
        uni.showToast({ title: e.message || '登录失败', icon: 'none' })
      } finally {
        uni.hideLoading()
      }
    }
  }
}
</script>

<style>
.login-container {
  padding: 40px 24px;
  min-height: 100vh;
  background: #fff;
}

.logo-area {
  text-align: center;
  margin-bottom: 60px;
}

.logo {
  width: 120px;
  height: 120px;
  margin-bottom: 16px;
}

.app-name {
  display: block;
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 8px;
}

.slogan {
  font-size: 14px;
  color: #999;
}

.form-area {
  margin-bottom: 30px;
}

.input-group {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  border: 1px solid #E5E5E5;
  border-radius: 8px;
  overflow: hidden;
}

.input {
  flex: 1;
  height: 48px;
  padding: 0 16px;
  font-size: 16px;
}

.code-btn {
  width: 120px;
  height: 48px;
  line-height: 48px;
  background: #4A90D9;
  color: #fff;
  font-size: 14px;
  border-radius: 0;
}

.code-btn[disabled] {
  background: #ccc;
}

.login-btn {
  width: 100%;
  height: 48px;
  line-height: 48px;
  background: #4A90D9;
  color: #fff;
  font-size: 16px;
  border-radius: 8px;
  margin-top: 8px;
}

.divider {
  display: flex;
  align-items: center;
  margin: 30px 0;
}

.line {
  flex: 1;
  height: 1px;
  background: #E5E5E5;
}

.divider-text {
  padding: 0 16px;
  color: #999;
  font-size: 14px;
}

.wx-login-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 48px;
  background: #07C160;
  color: #fff;
  font-size: 16px;
  border-radius: 8px;
}

.wx-icon {
  margin-right: 8px;
  font-weight: bold;
}

.agreement {
  text-align: center;
  margin-top: 30px;
  font-size: 12px;
  color: #999;
}

.link {
  color: #4A90D9;
}
</style>
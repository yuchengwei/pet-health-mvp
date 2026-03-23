<template>
  <view class="container">
    <!-- 用户信息 -->
    <view class="user-section" @click="goToProfile">
      <image 
        class="avatar" 
        :src="userInfo?.avatar || '/static/images/default-avatar.png'" 
        mode="aspectFill" 
      />
      <view class="user-info">
        <text class="nickname">{{ userInfo?.nickname || '点击登录' }}</text>
        <text class="intro" v-if="userInfo">{{ userInfo.region || '设置地区' }} · {{ userInfo.pet_experience || 0 }}年养宠经验</text>
      </view>
      <text class="arrow">></text>
    </view>

    <!-- 统计数据 -->
    <view class="stats-section">
      <view class="stat-item" @click="goToMyPosts">
        <text class="stat-num">{{ stats.posts }}</text>
        <text class="stat-label">发布</text>
      </view>
      <view class="stat-item" @click="goToMyLikes">
        <text class="stat-num">{{ stats.likes }}</text>
        <text class="stat-label">点赞</text>
      </view>
      <view class="stat-item" @click="goToMyFavorites">
        <text class="stat-num">{{ stats.favorites }}</text>
        <text class="stat-label">收藏</text>
      </view>
      <view class="stat-item" @click="goToMyPets">
        <text class="stat-num">{{ stats.pets }}</text>
        <text class="stat-label">宠物</text>
      </view>
    </view>

    <!-- 功能菜单 -->
    <view class="menu-section">
      <view class="menu-group">
        <view class="menu-item" @click="goToMyPets">
          <text class="menu-icon">🐾</text>
          <text class="menu-text">我的宠物</text>
          <text class="arrow">></text>
        </view>
        <view class="menu-item" @click="goToHospitalFavorites">
          <text class="menu-icon">🏥</text>
          <text class="menu-text">收藏的医院</text>
          <text class="arrow">></text>
        </view>
        <view class="menu-item" @click="goToReminders">
          <text class="menu-icon">⏰</text>
          <text class="menu-text">健康提醒</text>
          <text class="arrow">></text>
        </view>
      </view>

      <view class="menu-group">
        <view class="menu-item" @click="goToConsultation">
          <text class="menu-icon">💬</text>
          <text class="menu-text">问诊记录</text>
          <text class="arrow">></text>
        </view>
        <view class="menu-item" @click="goToNotifications">
          <text class="menu-icon">🔔</text>
          <text class="menu-text">消息通知</text>
          <view class="badge" v-if="unreadCount > 0">{{ unreadCount }}</view>
          <text class="arrow">></text>
        </view>
      </view>

      <view class="menu-group">
        <view class="menu-item" @click="goToSettings">
          <text class="menu-icon">⚙️</text>
          <text class="menu-text">设置</text>
          <text class="arrow">></text>
        </view>
        <view class="menu-item" @click="goToAbout">
          <text class="menu-icon">ℹ️</text>
          <text class="menu-text">关于我们</text>
          <text class="arrow">></text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { notificationAPI, petAPI, postAPI } from '../../utils/api.js'

export default {
  data() {
    return {
      userInfo: null,
      stats: {
        posts: 0,
        likes: 0,
        favorites: 0,
        pets: 0
      },
      unreadCount: 0
    }
  },
  onShow() {
    this.loadUserInfo()
    this.loadStats()
    this.loadUnreadCount()
  },
  methods: {
    async loadUserInfo() {
      const userInfo = uni.getStorageSync('userInfo')
      if (userInfo) {
        this.userInfo = userInfo
      }
    },
    
    async loadStats() {
      try {
        const [petRes, postRes] = await Promise.all([
          petAPI.getPets(),
          postAPI.getUserPosts()
        ])
        
        this.stats.pets = (petRes.pets || []).length
        this.stats.posts = (postRes.posts || []).length
      } catch (e) {
        console.error('加载统计数据失败', e)
      }
    },
    
    async loadUnreadCount() {
      try {
        const res = await notificationAPI.getUnreadCount()
        this.unreadCount = res.count || 0
      } catch (e) {
        console.error('加载未读数失败', e)
      }
    },
    
    goToProfile() {
      if (!this.userInfo) {
        uni.navigateTo({ url: '/pages/login/login' })
      } else {
        uni.navigateTo({ url: '/pages/mine/profile' })
      }
    },
    
    goToMyPets() {
      uni.navigateTo({ url: '/pages/pet/pet-list' })
    },
    
    goToMyPosts() {
      uni.navigateTo({ url: '/pages/mine/my-posts' })
    },
    
    goToMyLikes() {
      uni.navigateTo({ url: '/pages/mine/my-likes' })
    },
    
    goToMyFavorites() {
      uni.navigateTo({ url: '/pages/mine/my-favorites' })
    },
    
    goToHospitalFavorites() {
      uni.navigateTo({ url: '/pages/mine/hospital-favorites' })
    },
    
    goToReminders() {
      uni.navigateTo({ url: '/pages/mine/reminders' })
    },
    
    goToConsultation() {
      uni.navigateTo({ url: '/pages/mine/consultation' })
    },
    
    goToNotifications() {
      uni.navigateTo({ url: '/pages/mine/notifications' })
    },
    
    goToSettings() {
      uni.navigateTo({ url: '/pages/mine/settings' })
    },
    
    goToAbout() {
      uni.navigateTo({ url: '/pages/mine/about' })
    }
  }
}
</script>

<style>
.container {
  min-height: 100vh;
  background: #F8F9FA;
}

.user-section {
  display: flex;
  align-items: center;
  padding: 24px 16px;
  background: #fff;
}

.avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: #eee;
}

.user-info {
  flex: 1;
  margin-left: 16px;
}

.nickname {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  display: block;
}

.intro {
  font-size: 12px;
  color: #999;
  margin-top: 4px;
}

.arrow {
  color: #ccc;
  font-size: 16px;
}

.stats-section {
  display: flex;
  background: #fff;
  padding: 20px 0;
  margin-bottom: 12px;
}

.stat-item {
  flex: 1;
  text-align: center;
}

.stat-num {
  font-size: 20px;
  font-weight: bold;
  color: #333;
  display: block;
}

.stat-label {
  font-size: 12px;
  color: #999;
}

.menu-section {
  padding: 0 16px;
}

.menu-group {
  background: #fff;
  border-radius: 12px;
  margin-bottom: 12px;
  overflow: hidden;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.menu-item:last-child {
  border-bottom: none;
}

.menu-icon {
  font-size: 20px;
  margin-right: 12px;
}

.menu-text {
  flex: 1;
  font-size: 16px;
  color: #333;
}

.badge {
  padding: 2px 8px;
  background: #D0021B;
  color: #fff;
  font-size: 12px;
  border-radius: 10px;
  margin-right: 8px;
}
</style>
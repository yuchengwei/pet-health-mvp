<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { mockUser, mockPets, mockReminders } from '../../utils/mockData'

// 用户信息
const userInfo = ref<any>(null)

// 宠物列表
const pets = ref<any[]>([])
const reminderCount = ref(0)

// 我的收藏/发布等统计
const stats = ref({
  posts: 12,
  likes: 45,
  collections: 23
})

// 加载数据
const loadData = async () => {
  userInfo.value = mockUser
  pets.value = mockPets
  reminderCount.value = mockReminders.filter(r => !r.isCompleted).length
}

// 跳转页面
const navigateTo = (url: string) => {
  uni.navigateTo({
    url
  })
}

// 退出登录
const logout = () => {
  uni.showModal({
    title: '提示',
    content: '确定要退出登录吗？',
    success: (res) => {
      if (res.confirm) {
        uni.showToast({
          title: '已退出',
          icon: 'success'
        })
      }
    }
  })
}

// 拨打电话
const callService = () => {
  uni.makePhoneCall({
    phoneNumber: '400-123-4567'
  })
}

onMounted(() => {
  loadData()
})
</script>

<template>
  <view class="page">
    <!-- 头部信息 -->
    <view class="header">
      <view class="user-info" v-if="userInfo">
        <image class="avatar" :src="userInfo.avatar" mode="aspectFill" />
        <view class="info">
          <text class="nickname">{{ userInfo.nickname }}</text>
          <text class="experience">{{ userInfo.experience }}</text>
          <text class="city">📍 {{ userInfo.city }}</text>
        </view>
        <view class="edit-btn" @click="navigateTo('/pages/profile/edit')">
          <text>编辑资料</text>
        </view>
      </view>
      
      <!-- 未登录状态 -->
      <view class="user-info" v-else>
        <image class="avatar" src="https://picsum.photos/100/100?random=99" mode="aspectFill" />
        <view class="info">
          <text class="nickname">点击登录</text>
        </view>
      </view>
    </view>

    <!-- 我的宠物 -->
    <view class="section">
      <view class="section-header">
        <text class="section-title">我的宠物</text>
        <view class="add-pet-btn" @click="navigateTo('/pages/pet/add')">
          <text>+ 添加</text>
        </view>
      </view>
      <view class="pet-list">
        <view 
          v-for="pet in pets" 
          :key="pet.id" 
          class="pet-card"
          @click="navigateTo(`/pages/pet/detail?id=${pet.id}`)"
        >
          <image class="pet-avatar" :src="pet.avatar" mode="aspectFill" />
          <view class="pet-info">
            <text class="pet-name">{{ pet.name }}</text>
            <text class="pet-breed">{{ pet.breed }}</text>
          </view>
          <text class="pet-gender">{{ pet.gender === 'male' ? '♂️' : '♀️' }}</text>
        </view>
      </view>
    </view>

    <!-- 健康提醒 -->
    <view class="section" @click="navigateTo('/pages/reminder/list')">
      <view class="menu-item">
        <view class="menu-left">
          <text class="menu-icon">🔔</text>
          <text class="menu-text">健康提醒</text>
        </view>
        <view class="menu-right">
          <text v-if="reminderCount > 0" class="badge">{{ reminderCount }}条待处理</text>
          <text class="arrow">›</text>
        </view>
      </view>
    </view>

    <!-- 我的数据 -->
    <view class="section">
      <view class="section-title" style="padding: 0 0 16rpx 0;">我的数据</view>
      <view class="stats-row">
        <view class="stat-item" @click="navigateTo('/pages/profile/posts')">
          <text class="stat-num">{{ stats.posts }}</text>
          <text class="stat-label">发布</text>
        </view>
        <view class="stat-item">
          <text class="stat-num">{{ stats.likes }}</text>
          <text class="stat-label">获赞</text>
        </view>
        <view class="stat-item" @click="navigateTo('/pages/profile/collections')">
          <text class="stat-num">{{ stats.collections }}</text>
          <text class="stat-label">收藏</text>
        </view>
      </view>
    </view>

    <!-- 功能菜单 -->
    <view class="section">
      <view class="menu-item" @click="navigateTo('/pages/profile/favorites')">
        <view class="menu-left">
          <text class="menu-icon">❤️</text>
          <text class="menu-text">我的收藏</text>
        </view>
        <text class="arrow">›</text>
      </view>
      <view class="menu-item">
        <view class="menu-left">
          <text class="menu-icon">📝</text>
          <text class="menu-text">我的问答</text>
        </view>
        <text class="arrow">›</text>
      </view>
      <view class="menu-item">
        <view class="menu-left">
          <text class="menu-icon">🏥</text>
          <text class="menu-text">常去的医院</text>
        </view>
        <text class="arrow">›</text>
      </view>
    </view>

    <!-- 设置 -->
    <view class="section">
      <view class="menu-item">
        <view class="menu-left">
          <text class="menu-icon">⚙️</text>
          <text class="menu-text">设置</text>
        </view>
        <text class="arrow">›</text>
      </view>
      <view class="menu-item" @click="callService">
        <view class="menu-left">
          <text class="menu-icon">📞</text>
          <text class="menu-text">联系客服</text>
        </view>
        <text class="arrow">›</text>
      </view>
      <view class="menu-item">
        <view class="menu-left">
          <text class="menu-icon">ℹ️</text>
          <text class="menu-text">关于我们</text>
        </view>
        <text class="arrow">›</text>
      </view>
    </view>

    <!-- 退出按钮 -->
    <view class="logout-btn" @click="logout">
      <text>退出登录</text>
    </view>

    <!-- 底部占位 -->
    <view class="bottom-space"></view>
  </view>
</template>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  background-color: #F5F5F5;
  padding-bottom: 140rpx;
}

.header {
  background: linear-gradient(135deg, #4A90E2 0%, #67B8DE 100%);
  padding: 48rpx 32rpx;
}

.user-info {
  display: flex;
  align-items: center;
}

.avatar {
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
  border: 4rpx solid rgba(255, 255, 255, 0.5);
  margin-right: 24rpx;
}

.info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.nickname {
  font-size: 36rpx;
  font-weight: bold;
  color: #FFFFFF;
  margin-bottom: 8rpx;
}

.experience {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 4rpx;
}

.city {
  font-size: 22rpx;
  color: rgba(255, 255, 255, 0.7);
}

.edit-btn {
  padding: 12rpx 24rpx;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 24rpx;
  color: #FFFFFF;
  font-size: 24rpx;
}

.section {
  background-color: #FFFFFF;
  margin: 24rpx;
  border-radius: 16rpx;
  padding: 24rpx;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16rpx;
}

.section-title {
  font-size: 30rpx;
  font-weight: bold;
  color: #333333;
}

.add-pet-btn {
  color: #4A90E2;
  font-size: 26rpx;
}

.pet-list {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.pet-card {
  display: flex;
  align-items: center;
  padding: 16rpx;
  background-color: #F8F9FA;
  border-radius: 12rpx;
}

.pet-avatar {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  margin-right: 16rpx;
}

.pet-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.pet-name {
  font-size: 28rpx;
  font-weight: bold;
  color: #333333;
}

.pet-breed {
  font-size: 24rpx;
  color: #666666;
}

.pet-gender {
  font-size: 32rpx;
  color: #999999;
}

.menu-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24rpx 0;
  border-bottom: 1rpx solid #F0F0F0;
  
  &:last-child {
    border-bottom: none;
  }
}

.menu-left {
  display: flex;
  align-items: center;
}

.menu-icon {
  font-size: 32rpx;
  margin-right: 16rpx;
}

.menu-text {
  font-size: 28rpx;
  color: #333333;
}

.menu-right {
  display: flex;
  align-items: center;
}

.badge {
  padding: 4rpx 12rpx;
  background-color: #FF4D4F;
  color: #FFFFFF;
  border-radius: 12rpx;
  font-size: 20rpx;
  margin-right: 8rpx;
}

.arrow {
  font-size: 32rpx;
  color: #CCCCCC;
}

.stats-row {
  display: flex;
  justify-content: space-around;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-num {
  font-size: 36rpx;
  font-weight: bold;
  color: #333333;
  margin-bottom: 8rpx;
}

.stat-label {
  font-size: 24rpx;
  color: #666666;
}

.logout-btn {
  margin: 32rpx 24rpx;
  height: 88rpx;
  background-color: #FFFFFF;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #FF4D4F;
  font-size: 30rpx;
}

.bottom-space {
  height: 40rpx;
}
</style>
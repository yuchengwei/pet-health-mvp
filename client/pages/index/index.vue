<template>
  <view class="container">
    <!-- 顶部欢迎区 -->
    <view class="header">
      <view class="welcome-text">您好，{{ userInfo ? userInfo.nickname : '游客' }}</view>
      <view class="sub-text">守护宠物健康，从每一天开始</view>
    </view>

    <!-- 健康提醒卡片 -->
    <view class="reminder-card" v-if="reminders.length > 0">
      <view class="card-header">
        <text class="card-title">健康提醒</text>
        <text class="more" @click="goToReminders">更多</text>
      </view>
      <view class="reminder-list">
        <view class="reminder-item" v-for="item in reminders" :key="item.id" @click="handleReminder(item)">
          <view class="reminder-icon">
            <text>{{ item.type === 'vaccine' ? '💉' : item.type === 'deworm' ? '🪱' : '🏥' }}</text>
          </view>
          <view class="reminder-content">
            <text class="reminder-title">{{ item.title }}</text>
            <text class="reminder-date">{{ item.remind_date }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 宠物快捷入口 -->
    <view class="section">
      <view class="section-header">
        <text class="section-title">我的宠物</text>
        <text class="add-btn" @click="goToPetAdd">+ 添加</text>
      </view>
      <scroll-view class="pet-scroll" scroll-x>
        <view class="pet-card" v-for="pet in pets" :key="pet.id" @click="goToPetDetail(pet.id)">
          <image class="pet-avatar" :src="pet.avatar || '/static/images/default-pet.png'" mode="aspectFill" />
          <text class="pet-name">{{ pet.name }}</text>
          <text class="pet-breed">{{ pet.breed }}</text>
        </view>
        <view class="pet-card add" @click="goToPetAdd" v-if="pets.length < 5">
          <text class="add-icon">+</text>
          <text class="add-text">添加宠物</text>
        </view>
      </scroll-view>
    </view>

    <!-- 快捷功能 -->
    <view class="section">
      <view class="section-title">快捷功能</view>
      <view class="quick-actions">
        <view class="action-item" @click="goToHospital">
          <text class="action-icon">🏥</text>
          <text class="action-text">找医院</text>
        </view>
        <view class="action-item" @click="goToCommunity">
          <text class="action-icon">📝</text>
          <text class="action-text">社区</text>
        </view>
        <view class="action-item" @click="goToConsultation">
          <text class="action-icon">💬</text>
          <text class="action-text">问诊</text>
        </view>
        <view class="action-item" @click="goToReminders">
          <text class="action-icon">⏰</text>
          <text class="action-text">提醒</text>
        </view>
      </view>
    </view>

    <!-- 热门医院 -->
    <view class="section" v-if="hotHospitals.length > 0">
      <view class="section-header">
        <text class="section-title">热门医院</text>
        <text class="more" @click="goToHospitalList">更多</text>
      </view>
      <view class="hospital-list">
        <view class="hospital-item" v-for="hospital in hotHospitals" :key="hospital.id" @click="goToHospitalDetail(hospital.id)">
          <view class="hospital-info">
            <text class="hospital-name">{{ hospital.name }}</text>
            <text class="hospital-address">{{ hospital.address }}</text>
          </view>
          <view class="hospital-rating">
            <text class="rating-score">{{ hospital.rating }}</text>
            <text class="rating-count">评价{{ hospital.reviews_count }}条</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { petAPI, hospitalAPI, reminderAPI } from '../../utils/api.js'

export default {
  data() {
    return {
      userInfo: null,
      pets: [],
      reminders: [],
      hotHospitals: []
    }
  },
  onLoad() {
    this.loadData()
  },
  onShow() {
    this.loadData()
  },
  methods: {
    async loadData() {
      try {
        // 获取宠物列表
        const petRes = await petAPI.getPets()
        this.pets = petRes.pets || []
        
        // 获取提醒
        const reminderRes = await reminderAPI.getReminders()
        this.reminders = (reminderRes.reminders || []).slice(0, 3)
        
        // 获取热门医院
        const hospitalRes = await hospitalAPI.getHospitals({ limit: 5 })
        this.hotHospitals = hospitalRes.hospitals || []
        
        // 获取用户信息
        const userInfo = uni.getStorageSync('userInfo')
        if (userInfo) {
          this.userInfo = userInfo
        }
      } catch (e) {
        console.error('加载数据失败', e)
      }
    },
    goToPetAdd() {
      uni.navigateTo({ url: '/pages/pet/pet-add' })
    },
    goToPetDetail(id) {
      uni.navigateTo({ url: `/pages/pet/pet-detail?id=${id}` })
    },
    goToReminders() {
      uni.navigateTo({ url: '/pages/mine/reminders' })
    },
    goToHospital() {
      uni.switchTab({ url: '/pages/hospital/hospital-list' })
    },
    goToHospitalList() {
      uni.switchTab({ url: '/pages/hospital/hospital-list' })
    },
    goToHospitalDetail(id) {
      uni.navigateTo({ url: `/pages/hospital/hospital-detail?id=${id}` })
    },
    goToCommunity() {
      uni.switchTab({ url: '/pages/community/community-index' })
    },
    goToConsultation() {
      uni.navigateTo({ url: '/pages/mine/consultation' })
    },
    handleReminder(item) {
      // 标记已处理
      reminderAPI.updateReminder(item.id)
      this.reminders = this.reminders.filter(r => r.id !== item.id)
    }
  }
}
</script>

<style>
.container {
  padding: 16px;
}

.header {
  padding: 20px 0;
}

.welcome-text {
  font-size: 24px;
  font-weight: bold;
  color: #333;
}

.sub-text {
  font-size: 14px;
  color: #666;
  margin-top: 4px;
}

.reminder-card {
  background: #fff;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}

.card-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
}

.card-title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.more {
  font-size: 14px;
  color: #4A90D9;
}

.reminder-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.reminder-item {
  display: flex;
  align-items: center;
  padding: 12px;
  background: #F8F9FA;
  border-radius: 8px;
}

.reminder-icon {
  font-size: 24px;
  margin-right: 12px;
}

.reminder-content {
  flex: 1;
}

.reminder-title {
  font-size: 14px;
  color: #333;
  display: block;
}

.reminder-date {
  font-size: 12px;
  color: #999;
}

.section {
  margin-bottom: 20px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.section-title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

.add-btn {
  font-size: 14px;
  color: #4A90D9;
}

.pet-scroll {
  white-space: nowrap;
  width: 100%;
}

.pet-card {
  display: inline-block;
  width: 100px;
  text-align: center;
  margin-right: 12px;
  padding: 16px 0;
  background: #fff;
  border-radius: 12px;
}

.pet-card.add {
  border: 1px dashed #ddd;
}

.pet-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: #eee;
}

.pet-name {
  display: block;
  font-size: 14px;
  color: #333;
  margin-top: 8px;
}

.pet-breed {
  font-size: 12px;
  color: #999;
}

.add-icon {
  font-size: 32px;
  color: #ddd;
}

.add-text {
  display: block;
  font-size: 12px;
  color: #999;
  margin-top: 4px;
}

.quick-actions {
  display: flex;
  justify-content: space-around;
  background: #fff;
  border-radius: 12px;
  padding: 20px;
}

.action-item {
  text-align: center;
}

.action-icon {
  font-size: 28px;
}

.action-text {
  display: block;
  font-size: 12px;
  color: #666;
  margin-top: 4px;
}

.hospital-list {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
}

.hospital-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.hospital-info {
  flex: 1;
}

.hospital-name {
  font-size: 16px;
  color: #333;
  display: block;
}

.hospital-address {
  font-size: 12px;
  color: #999;
}

.hospital-rating {
  text-align: right;
}

.rating-score {
  font-size: 18px;
  color: #F5A623;
  font-weight: bold;
}

.rating-count {
  font-size: 12px;
  color: #999;
  display: block;
}
</style>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { mockPets, mockReminders, mockHospitals } from '../../utils/mockData'

// 宠物列表
const pets = ref<any[]>([])
const currentPet = ref<any>(null)

// 健康提醒
const reminders = ref<any[]>([])
const upcomingReminders = ref<any[]>([])

// 推荐医院
const recommendedHospitals = ref<any[]>([])

// 加载数据
const loadData = async () => {
  // 模拟数据
  pets.value = mockPets
  if (pets.value.length > 0) {
    currentPet.value = pets.value[0]
  }
  
  reminders.value = mockReminders
  upcomingReminders.value = mockReminders.filter(r => !r.isCompleted).slice(0, 3)
  
  recommendedHospitals.value = mockHospitals.slice(0, 2)
}

// 切换宠物
const switchPet = (pet: any) => {
  currentPet.value = pet
}

// 去添加宠物
const goToAddPet = () => {
  uni.navigateTo({
    url: '/pages/pet/add'
  })
}

// 去宠物详情
const goToPetDetail = (petId: number) => {
  uni.navigateTo({
    url: `/pages/pet/detail?id=${petId}`
  })
}

// 去医院列表
const goToHospital = () => {
  uni.switchTab({
    url: '/pages/hospital/hospital'
  })
}

// 去问答
const goToQA = () => {
  uni.switchTab({
    url: '/pages/qa/qa'
  })
}

// 去社区
const goToCommunity = () => {
  uni.switchTab({
    url: '/pages/community/community'
  })
}

// 格式化日期
const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  return `${date.getMonth() + 1}-${date.getDate()}`
}

// 获取提醒类型图标
const getReminderIcon = (type: string) => {
  const icons: any = {
    vaccination: '💉',
    deworming: '💊',
    checkup: '🏥'
  }
  return icons[type] || '📋'
}

onMounted(() => {
  loadData()
})
</script>

<template>
  <view class="page">
    <!-- 用户信息栏 -->
    <view class="header">
      <view class="user-info">
        <image class="avatar" :src="pets[0]?.avatar || 'https://picsum.photos/100/100?random=1'" mode="aspectFill" />
        <view class="info">
          <text class="nickname">{{ pets[0]?.name || '添加宠物' }}</text>
          <text class="breed">{{ pets[0]?.breed || '点击添加您的宠物' }}</text>
        </view>
      </view>
      <view class="pet-tabs" v-if="pets.length > 1">
        <view 
          v-for="pet in pets" 
          :key="pet.id"
          class="pet-tab"
          :class="{ active: currentPet?.id === pet.id }"
          @click="switchPet(pet)"
        >
          {{ pet.name }}
        </view>
      </view>
      <view class="add-pet-btn" @click="goToAddPet">
        <text>+</text>
      </view>
    </view>

    <!-- 健康提醒 -->
    <view class="section">
      <view class="section-header">
        <text class="section-title">健康提醒</text>
        <text class="section-more">全部提醒</text>
      </view>
      <view class="reminder-list">
        <view 
          v-for="reminder in upcomingReminders" 
          :key="reminder.id" 
          class="reminder-item"
        >
          <text class="reminder-icon">{{ getReminderIcon(reminder.type) }}</text>
          <view class="reminder-content">
            <text class="reminder-title">{{ reminder.title }}</text>
            <text class="reminder-date">到期: {{ formatDate(reminder.dueDate) }}</text>
          </view>
          <view class="reminder-tag" :class="reminder.type">
            <text>{{ reminder.petName }}</text>
          </view>
        </view>
        <view v-if="upcomingReminders.length === 0" class="empty-tip">
          <text>暂无提醒，继续保持!</text>
        </view>
      </view>
    </view>

    <!-- 快捷入口 -->
    <view class="section">
      <view class="section-header">
        <text class="section-title">快捷服务</text>
      </view>
      <view class="quick-actions">
        <view class="action-item" @click="goToPetDetail(currentPet?.id)">
          <view class="action-icon">📋</view>
          <text class="action-text">宠物档案</text>
        </view>
        <view class="action-item" @click="goToHospital">
          <view class="action-icon">🏥</view>
          <text class="action-text">找医院</text>
        </view>
        <view class="action-item" @click="goToQA">
          <view class="action-icon">❓</view>
          <text class="action-text">健康问答</text>
        </view>
        <view class="action-item" @click="goToCommunity">
          <view class="action-icon">📝</view>
          <text class="action-text">社区</text>
        </view>
      </view>
    </view>

    <!-- 推荐医院 -->
    <view class="section">
      <view class="section-header">
        <text class="section-title">推荐医院</text>
        <text class="section-more" @click="goToHospital">更多</text>
      </view>
      <view class="hospital-list">
        <view 
          v-for="hospital in recommendedHospitals" 
          :key="hospital.id"
          class="hospital-item"
          @click="uni.navigateTo({ url: `/pages/hospital/detail?id=${hospital.id}` })"
        >
          <image class="hospital-img" :src="hospital.image" mode="aspectFill" />
          <view class="hospital-info">
            <text class="hospital-name">{{ hospital.name }}</text>
            <view class="hospital-rating">
              <text class="star">⭐</text>
              <text class="score">{{ hospital.rating }}</text>
              <text class="review-count">({{ hospital.reviewCount }}条评价)</text>
            </view>
            <view class="hospital-tags">
              <text v-for="tag in hospital.tags" :key="tag" class="tag">{{ tag }}</text>
            </view>
            <text class="hospital-address">{{ hospital.address }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 底部占位 -->
    <view class="bottom-space"></view>
  </view>
</template>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  background-color: #F5F5F5;
  padding-bottom: 120rpx;
}

.header {
  background: linear-gradient(135deg, #4A90E2 0%, #67B8DE 100%);
  padding: 40rpx 32rpx;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}

.user-info {
  display: flex;
  align-items: center;
  flex: 1;
}

.avatar {
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
  border: 4rpx solid rgba(255, 255, 255, 0.5);
  margin-right: 24rpx;
}

.info {
  display: flex;
  flex-direction: column;
}

.nickname {
  font-size: 36rpx;
  font-weight: bold;
  color: #FFFFFF;
  margin-bottom: 8rpx;
}

.breed {
  font-size: 26rpx;
  color: rgba(255, 255, 255, 0.8);
}

.pet-tabs {
  display: flex;
  gap: 16rpx;
  margin-top: 24rpx;
  width: 100%;
}

.pet-tab {
  padding: 12rpx 24rpx;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 30rpx;
  color: #FFFFFF;
  font-size: 26rpx;
  
  &.active {
    background-color: #FFFFFF;
    color: #4A90E2;
  }
}

.add-pet-btn {
  width: 60rpx;
  height: 60rpx;
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #FFFFFF;
  font-size: 40rpx;
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
  margin-bottom: 24rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333333;
}

.section-more {
  font-size: 26rpx;
  color: #999999;
}

.reminder-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.reminder-item {
  display: flex;
  align-items: center;
  padding: 20rpx;
  background-color: #F8F9FA;
  border-radius: 12rpx;
}

.reminder-icon {
  font-size: 40rpx;
  margin-right: 16rpx;
}

.reminder-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.reminder-title {
  font-size: 28rpx;
  color: #333333;
  margin-bottom: 4rpx;
}

.reminder-date {
  font-size: 24rpx;
  color: #999999;
}

.reminder-tag {
  padding: 6rpx 16rpx;
  border-radius: 20rpx;
  font-size: 22rpx;
  
  &.vaccination {
    background-color: #E6F7FF;
    color: #1890FF;
  }
  
  &.deworming {
    background-color: #F6FFED;
    color: #52C41A;
  }
  
  &.checkup {
    background-color: #FFF7E6;
    color: #FA8C16;
  }
}

.empty-tip {
  text-align: center;
  padding: 40rpx;
  color: #999999;
  font-size: 26rpx;
}

.quick-actions {
  display: flex;
  justify-content: space-around;
}

.action-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.action-icon {
  width: 100rpx;
  height: 100rpx;
  background-color: #F0F5FF;
  border-radius: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48rpx;
  margin-bottom: 12rpx;
}

.action-text {
  font-size: 24rpx;
  color: #666666;
}

.hospital-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.hospital-item {
  display: flex;
  background-color: #F8F9FA;
  border-radius: 12rpx;
  overflow: hidden;
}

.hospital-img {
  width: 180rpx;
  height: 180rpx;
  flex-shrink: 0;
}

.hospital-info {
  flex: 1;
  padding: 16rpx;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.hospital-name {
  font-size: 30rpx;
  font-weight: bold;
  color: #333333;
}

.hospital-rating {
  display: flex;
  align-items: center;
}

.star {
  font-size: 24rpx;
  margin-right: 4rpx;
}

.score {
  font-size: 26rpx;
  color: #FF9F00;
  margin-right: 8rpx;
}

.review-count {
  font-size: 22rpx;
  color: #999999;
}

.hospital-tags {
  display: flex;
  gap: 8rpx;
  flex-wrap: wrap;
}

.tag {
  padding: 4rpx 12rpx;
  background-color: #E6F7FF;
  color: #1890FF;
  border-radius: 8rpx;
  font-size: 20rpx;
}

.hospital-address {
  font-size: 22rpx;
  color: #999999;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.bottom-space {
  height: 40rpx;
}
</style>
<script setup lang="ts">
import { ref, onMounted } from 'vue'

// 获取页面参数
const pages = getCurrentPages()
const currentPage = pages[pages.length - 1]
const petId = ref((currentPage?.options?.id as any) || 1)

// 宠物详情
const pet = ref<any>(null)
const currentTab = ref('info')

// 加载数据
const loadData = async () => {
  // 模拟数据
  const mockPet = {
    id: petId.value,
    name: '豆豆',
    species: 'dog',
    breed: '金毛',
    gender: 'male',
    birthDate: '2020-03-15',
    age: '4岁',
    weight: 30,
    avatar: 'https://picsum.photos/200/200?random=10',
    color: '金色',
    chipNo: '123456789012345',
    vaccinations: [
      { id: 1, name: '狂犬疫苗', date: '2024-03-15', nextDate: '2025-03-15', hospital: '爱宠医院', isExpired: false },
      { id: 2, name: '犬瘟热疫苗', date: '2024-03-15', nextDate: '2025-03-15', hospital: '爱宠医院', isExpired: false }
    ],
    dewormings: [
      { id: 1, name: '体内驱虫', date: '2024-01-15', nextDate: '2024-04-15', medicine: '拜耳', isExpired: false },
      { id: 2, name: '体外驱虫', date: '2024-02-20', nextDate: '2024-05-20', medicine: '福来恩', isExpired: false }
    ],
    checkups: [
      { id: 1, date: '2024-02-01', hospital: '爱宠医院', result: '健康', doctor: '张医生', remark: '各项指标正常' }
    ],
    medicalRecords: [
      { id: 1, date: '2023-08-20', hospital: '爱宠医院', diagnosis: '皮肤病', treatment: '药物治疗', doctor: '李医生', cost: 500 }
    ],
    photos: [
      'https://picsum.photos/200/200?random=70',
      'https://picsum.photos/200/200?random=71',
      'https://picsum.photos/200/200?random=72'
    ]
  }
  
  pet.value = mockPet
}

// 切换标签
const switchTab = (tab: string) => {
  currentTab.value = tab
}

// 编辑宠物
const editPet = () => {
  uni.showToast({
    title: '编辑功能开发中',
    icon: 'none'
  })
}

// 添加记录
const addRecord = (type: string) => {
  uni.showToast({
    title: '添加功能开发中',
    icon: 'none'
  })
}

// 格式化日期
const formatDate = (dateStr: string) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

// 判断是否即将到期
const isExpiringSoon = (dateStr: string) => {
  if (!dateStr) return false
  const date = new Date(dateStr)
  const now = new Date()
  const diffDays = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  return diffDays <= 30 && diffDays > 0
}

onMounted(() => {
  loadData()
})
</script>

<template>
  <view class="page" v-if="pet">
    <!-- 宠物头部 -->
    <view class="pet-header">
      <image class="pet-avatar" :src="pet.avatar" mode="aspectFill" />
      <view class="pet-basic">
        <view class="name-row">
          <text class="pet-name">{{ pet.name }}</text>
          <text class="pet-gender">{{ pet.gender === 'male' ? '♂️' : '♀️' }}</text>
        </view>
        <text class="pet-breed">{{ pet.breed }} · {{ pet.age }}</text>
        <text class="pet-weight">体重: {{ pet.weight }}kg</text>
      </view>
      <view class="edit-btn" @click="editPet">
        <text>编辑</text>
      </view>
    </view>

    <!-- 标签栏 -->
    <view class="tabs">
      <view 
        class="tab" 
        :class="{ active: currentTab === 'info' }"
        @click="switchTab('info')"
      >
        基本信息
      </view>
      <view 
        class="tab" 
        :class="{ active: currentTab === 'health' }"
        @click="switchTab('health')"
      >
        健康档案
      </view>
      <view 
        class="tab" 
        :class="{ active: currentTab === 'photos' }"
        @click="switchTab('photos')"
      >
        照片库
      </view>
    </view>

    <!-- 基本信息 -->
    <view class="tab-content" v-if="currentTab === 'info'">
      <view class="info-card">
        <view class="info-item">
          <text class="info-label">品种</text>
          <text class="info-value">{{ pet.breed }}</text>
        </view>
        <view class="info-item">
          <text class="info-label">性别</text>
          <text class="info-value">{{ pet.gender === 'male' ? '弟弟' : '妹妹' }}</text>
        </view>
        <view class="info-item">
          <text class="info-label">出生日期</text>
          <text class="info-value">{{ pet.birthDate }}</text>
        </view>
        <view class="info-item">
          <text class="info-label">体重</text>
          <text class="info-value">{{ pet.weight }}kg</text>
        </view>
        <view class="info-item">
          <text class="info-label">毛色</text>
          <text class="info-value">{{ pet.color || '未填写' }}</text>
        </view>
        <view class="info-item">
          <text class="info-label">芯片号</text>
          <text class="info-value">{{ pet.chipNo || '未绑定' }}</text>
        </view>
      </view>
    </view>

    <!-- 健康档案 -->
    <view class="tab-content" v-if="currentTab === 'health'">
      <!-- 疫苗记录 -->
      <view class="record-section">
        <view class="record-header">
          <text class="record-title">💉 疫苗记录</text>
          <text class="add-btn" @click="addRecord('vaccination')">+ 添加</text>
        </view>
        <view 
          v-for="item in pet.vaccinations" 
          :key="item.id"
          class="record-item"
          :class="{ warning: isExpiringSoon(item.nextDate) }"
        >
          <view class="record-info">
            <text class="record-name">{{ item.name }}</text>
            <text class="record-date">接种: {{ item.date }}</text>
            <text class="record-hospital">医院: {{ item.hospital }}</text>
          </view>
          <view class="record-status" :class="{ warning: isExpiringSoon(item.nextDate) }">
            <text v-if="isExpiringSoon(item.nextDate)">即将到期</text>
            <text v-else>下次: {{ item.nextDate }}</text>
          </view>
        </view>
      </view>

      <!-- 驱虫记录 -->
      <view class="record-section">
        <view class="record-header">
          <text class="record-title">💊 驱虫记录</text>
          <text class="add-btn" @click="addRecord('deworming')">+ 添加</text>
        </view>
        <view 
          v-for="item in pet.dewormings" 
          :key="item.id"
          class="record-item"
          :class="{ warning: isExpiringSoon(item.nextDate) }"
        >
          <view class="record-info">
            <text class="record-name">{{ item.name }}</text>
            <text class="record-date">用药: {{ item.medicine }}</text>
            <text class="record-date">时间: {{ item.date }}</text>
          </view>
          <view class="record-status" :class="{ warning: isExpiringSoon(item.nextDate) }">
            <text v-if="isExpiringSoon(item.nextDate)">即将到期</text>
            <text v-else>下次: {{ item.nextDate }}</text>
          </view>
        </view>
      </view>

      <!-- 体检记录 -->
      <view class="record-section">
        <view class="record-header">
          <text class="record-title">🏥 体检记录</text>
          <text class="add-btn" @click="addRecord('checkup')">+ 添加</text>
        </view>
        <view v-for="item in pet.checkups" :key="item.id" class="record-item">
          <view class="record-info">
            <text class="record-name">年度体检</text>
            <text class="record-date">时间: {{ item.date }}</text>
            <text class="record-hospital">医院: {{ item.hospital }}</text>
            <text class="record-result">结果: {{ item.result }}</text>
          </view>
          <view class="record-status success">
            <text>健康</text>
          </view>
        </view>
      </view>

      <!-- 就医记录 -->
      <view class="record-section">
        <view class="record-header">
          <text class="record-title">🩹 就医记录</text>
          <text class="add-btn" @click="addRecord('medical')">+ 添加</text>
        </view>
        <view v-for="item in pet.medicalRecords" :key="item.id" class="record-item">
          <view class="record-info">
            <text class="record-name">{{ item.diagnosis }}</text>
            <text class="record-date">时间: {{ item.date }}</text>
            <text class="record-hospital">医院: {{ item.hospital }}</text>
            <text class="record-result">治疗: {{ item.treatment }}</text>
          </view>
          <view class="record-status">
            <text>已康复</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 照片库 -->
    <view class="tab-content" v-if="currentTab === 'photos'">
      <view class="photo-grid">
        <view 
          v-for="(photo, idx) in pet.photos" 
          :key="idx"
          class="photo-item"
        >
          <image :src="photo" mode="aspectFill" />
        </view>
        <view class="photo-add">
          <text class="add-icon">+</text>
          <text class="add-text">添加照片</text>
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  background-color: #F5F5F5;
}

.pet-header {
  display: flex;
  align-items: center;
  padding: 32rpx;
  background: linear-gradient(135deg, #4A90E2 0%, #67B8DE 100%);
}

.pet-avatar {
  width: 140rpx;
  height: 140rpx;
  border-radius: 50%;
  border: 4rpx solid rgba(255, 255, 255, 0.5);
  margin-right: 24rpx;
}

.pet-basic {
  flex: 1;
}

.name-row {
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.pet-name {
  font-size: 36rpx;
  font-weight: bold;
  color: #FFFFFF;
}

.pet-gender {
  font-size: 32rpx;
}

.pet-breed {
  font-size: 26rpx;
  color: rgba(255, 255, 255, 0.8);
  display: block;
  margin-top: 8rpx;
}

.pet-weight {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.7);
  display: block;
  margin-top: 4rpx;
}

.edit-btn {
  padding: 12rpx 24rpx;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 24rpx;
  color: #FFFFFF;
  font-size: 24rpx;
}

.tabs {
  display: flex;
  background-color: #FFFFFF;
}

.tab {
  flex: 1;
  text-align: center;
  padding: 24rpx;
  font-size: 28rpx;
  color: #666666;
  position: relative;
  
  &.active {
    color: #4A90E2;
    font-weight: bold;
    
    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 60rpx;
      height: 4rpx;
      background-color: #4A90E2;
      border-radius: 2rpx;
    }
  }
}

.tab-content {
  padding: 16rpx;
}

.info-card {
  background-color: #FFFFFF;
  border-radius: 16rpx;
  padding: 8rpx 0;
}

.info-item {
  display: flex;
  justify-content: space-between;
  padding: 24rpx 32rpx;
  border-bottom: 1rpx solid #F0F0F0;
  
  &:last-child {
    border-bottom: none;
  }
}

.info-label {
  font-size: 28rpx;
  color: #999999;
}

.info-value {
  font-size: 28rpx;
  color: #333333;
}

.record-section {
  background-color: #FFFFFF;
  border-radius: 16rpx;
  padding: 24rpx;
  margin-bottom: 16rpx;
}

.record-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16rpx;
}

.record-title {
  font-size: 30rpx;
  font-weight: bold;
  color: #333333;
}

.add-btn {
  color: #4A90E2;
  font-size: 26rpx;
}

.record-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16rpx;
  background-color: #F8F9FA;
  border-radius: 12rpx;
  margin-bottom: 12rpx;
  
  &.warning {
    background-color: #FFF7E6;
  }
  
  &:last-child {
    margin-bottom: 0;
  }
}

.record-info {
  display: flex;
  flex-direction: column;
}

.record-name {
  font-size: 28rpx;
  font-weight: bold;
  color: #333333;
}

.record-date, .record-hospital, .record-result {
  font-size: 22rpx;
  color: #666666;
  margin-top: 4rpx;
}

.record-status {
  padding: 8rpx 16rpx;
  background-color: #F6FFED;
  color: #52C41A;
  border-radius: 8rpx;
  font-size: 22rpx;
  
  &.warning {
    background-color: #FF4D4F;
    color: #FFFFFF;
  }
  
  &.success {
    background-color: #F6FFED;
    color: #52C41A;
  }
}

.photo-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
}

.photo-item {
  width: calc(33.33% - 8rpx);
  height: 220rpx;
  border-radius: 12rpx;
  overflow: hidden;
  
  image {
    width: 100%;
    height: 100%;
  }
}

.photo-add {
  width: calc(33.33% - 8rpx);
  height: 220rpx;
  border-radius: 12rpx;
  background-color: #F5F5F5;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.add-icon {
  font-size: 56rpx;
  color: #999999;
}

.add-text {
  font-size: 22rpx;
  color: #999999;
  margin-top: 8rpx;
}
</style>
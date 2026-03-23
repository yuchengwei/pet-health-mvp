<script setup lang="ts">
import { ref, onMounted } from 'vue'

// 获取页面参数
const pages = getCurrentPages()
const currentPage = pages[pages.length - 1]
const hospitalId = ref((currentPage?.options?.id as any) || 1)

// 医院详情
const hospital = ref<any>(null)
const reviews = ref<any[]>([])
const currentTab = ref('intro')

// 加载数据
const loadData = async () => {
  // 模拟数据
  const mockHospital = {
    id: hospitalId.value,
    name: '爱宠宠物医院',
    address: '上海市浦东新区世纪大道100号',
    phone: '021-12345678',
    rating: 4.8,
    reviewCount: 256,
    image: 'https://picsum.photos/400/300?random=20',
    tags: ['24小时', '专科', '美容', '手术', 'ICU'],
    distance: '1.2km',
    priceLevel: '中',
    introduction: '爱宠宠物医院是一家专业的宠物医疗机构，拥有一流的医疗设备和经验丰富的医疗团队。我们提供宠物诊疗、疫苗注射、手术、住院护理等全方位服务。',
    businessHours: '24小时营业',
    license: '沪宠医证字第123456号'
  }
  
  const mockReviews = [
    {
      id: 1,
      user: { id: 1, nickname: '小明', avatar: 'https://picsum.photos/50/50?random=30' },
      rating: 5,
      content: '医生非常专业，豆豆在这里做了手术，恢复得很好！环境也很不错，护士都很细心。',
      images: ['https://picsum.photos/200/200?random=40'],
      date: '2024-03-10',
      likes: 25,
      petName: '豆豆'
    },
    {
      id: 2,
      user: { id: 2, nickname: '小红', avatar: 'https://picsum.photos/50/50?random=31' },
      rating: 4,
      content: '环境很好，护士也很细心，就是价格稍贵。不过服务确实没话说，下次还会来。',
      images: [],
      date: '2024-03-08',
      likes: 12,
      petName: '咪咪'
    },
    {
      id: 3,
      user: { id: 3, nickname: '大伟', avatar: 'https://picsum.photos/50/50?random=32' },
      rating: 5,
      content: '我家狗狗突然生病，半夜来的急诊，医生很快确诊并治疗，非常专业！',
      images: ['https://picsum.photos/200/200?random=41', 'https://picsum.photos/200/200?random=42'],
      date: '2024-03-05',
      likes: 18,
      petName: '旺财'
    }
  ]
  
  hospital.value = mockHospital
  reviews.value = mockReviews
}

// 切换标签
const switchTab = (tab: string) => {
  currentTab.value = tab
}

// 拨打电话
const callPhone = () => {
  if (hospital.value?.phone) {
    uni.makePhoneCall({
      phoneNumber: hospital.value.phone
    })
  }
}

// 去地图
const openMap = () => {
  uni.showToast({
    title: '地图功能开发中',
    icon: 'none'
  })
}

// 写评价
const writeReview = () => {
  uni.showToast({
    title: '评价功能开发中',
    icon: 'none'
  })
}

onMounted(() => {
  loadData()
})
</script>

<template>
  <view class="page" v-if="hospital">
    <!-- 医院图片 -->
    <view class="header-image">
      <image :src="hospital.image" mode="aspectFill" />
    </view>

    <!-- 医院基本信息 -->
    <view class="hospital-header">
      <view class="title-row">
        <text class="hospital-name">{{ hospital.name }}</text>
        <view class="rating">
          <text class="star">⭐</text>
          <text class="score">{{ hospital.rating }}</text>
        </view>
      </view>
      
      <view class="tags">
        <text v-for="tag in hospital.tags" :key="tag" class="tag">{{ tag }}</text>
        <text class="price-tag">{{ hospital.priceLevel }}价</text>
      </view>

      <view class="info-row">
        <text class="label">📍</text>
        <text class="value">{{ hospital.address }}</text>
        <text class="distance">{{ hospital.distance }}</text>
      </view>

      <view class="info-row">
        <text class="label">⏰</text>
        <text class="value">{{ hospital.businessHours }}</text>
      </view>

      <view class="info-row">
        <text class="label">📞</text>
        <text class="value">{{ hospital.phone }}</text>
      </view>

      <view class="action-btns">
        <view class="btn-call" @click="callPhone">
          <text>📞 联系医院</text>
        </view>
        <view class="btn-map" @click="openMap">
          <text>🗺️ 查看地图</text>
        </view>
      </view>
    </view>

    <!-- 标签切换 -->
    <view class="tabs">
      <view 
        class="tab" 
        :class="{ active: currentTab === 'intro' }"
        @click="switchTab('intro')"
      >
        医院介绍
      </view>
      <view 
        class="tab" 
        :class="{ active: currentTab === 'reviews' }"
        @click="switchTab('reviews')"
      >
        用户评价
      </view>
    </view>

    <!-- 医院介绍 -->
    <view class="tab-content" v-if="currentTab === 'intro'">
      <view class="intro-card">
        <text class="intro-text">{{ hospital.introduction }}</text>
      </view>
      <view class="info-card">
        <view class="info-item">
          <text class="info-label">医疗许可证</text>
          <text class="info-value">{{ hospital.license }}</text>
        </view>
        <view class="info-item">
          <text class="info-label">总评价数</text>
          <text class="info-value">{{ hospital.reviewCount }}条</text>
        </view>
      </view>
    </view>

    <!-- 用户评价 -->
    <view class="tab-content" v-if="currentTab === 'reviews'">
      <view class="review-header">
        <view class="rating-summary">
          <text class="big-score">{{ hospital.rating }}</text>
          <view class="stars">
            <text v-for="i in 5" :key="i" class="star">⭐</text>
          </view>
          <text class="review-count">{{ hospital.reviewCount }}条评价</text>
        </view>
        <view class="write-btn" @click="writeReview">
          <text>写评价</text>
        </view>
      </view>

      <view 
        v-for="review in reviews" 
        :key="review.id" 
        class="review-card"
      >
        <view class="review-header-row">
          <image class="reviewer-avatar" :src="review.user.avatar" mode="aspectFill" />
          <view class="reviewer-info">
            <text class="reviewer-name">{{ review.user.nickname }}</text>
            <view class="review-rating">
              <text v-for="i in review.rating" :key="i" class="star">⭐</text>
            </view>
          </view>
          <text class="review-date">{{ review.date }}</text>
        </view>
        
        <view class="review-pet">
          <text>🐾 {{ review.petName }}</text>
        </view>
        
        <view class="review-content">
          <text>{{ review.content }}</text>
        </view>
        
        <view class="review-images" v-if="review.images && review.images.length > 0">
          <image 
            v-for="(img, idx) in review.images" 
            :key="idx" 
            :src="img" 
            mode="aspectFill"
          />
        </view>
        
        <view class="review-actions">
          <view class="action">
            <text>👍 {{ review.likes }}</text>
          </view>
          <view class="action">
            <text>💬 回复</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  background-color: #F5F5F5;
  padding-bottom: 120rpx;
}

.header-image {
  width: 100%;
  height: 400rpx;
  
  image {
    width: 100%;
    height: 100%;
  }
}

.hospital-header {
  background-color: #FFFFFF;
  padding: 32rpx;
  margin-bottom: 16rpx;
}

.title-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16rpx;
}

.hospital-name {
  font-size: 36rpx;
  font-weight: bold;
  color: #333333;
}

.rating {
  display: flex;
  align-items: center;
}

.star {
  font-size: 24rpx;
}

.score {
  font-size: 32rpx;
  color: #FF9F00;
  font-weight: bold;
  margin-left: 4rpx;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8rpx;
  margin-bottom: 20rpx;
}

.tag {
  padding: 6rpx 16rpx;
  background-color: #E6F7FF;
  color: #1890FF;
  border-radius: 8rpx;
  font-size: 22rpx;
}

.price-tag {
  padding: 6rpx 16rpx;
  background-color: #FFF7E6;
  color: #FA8C16;
  border-radius: 8rpx;
  font-size: 22rpx;
}

.info-row {
  display: flex;
  align-items: center;
  margin-bottom: 12rpx;
}

.label {
  font-size: 28rpx;
  margin-right: 8rpx;
}

.value {
  flex: 1;
  font-size: 26rpx;
  color: #666666;
}

.distance {
  font-size: 24rpx;
  color: #4A90E2;
}

.action-btns {
  display: flex;
  gap: 16rpx;
  margin-top: 24rpx;
}

.btn-call, .btn-map {
  flex: 1;
  height: 80rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 40rpx;
  font-size: 28rpx;
}

.btn-call {
  background-color: #4A90E2;
  color: #FFFFFF;
}

.btn-map {
  background-color: #F0F5FF;
  color: #4A90E2;
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

.intro-card, .info-card {
  background-color: #FFFFFF;
  border-radius: 16rpx;
  padding: 24rpx;
  margin-bottom: 16rpx;
}

.intro-text {
  font-size: 28rpx;
  color: #666666;
  line-height: 1.8;
}

.info-item {
  display: flex;
  justify-content: space-between;
  padding: 16rpx 0;
  border-bottom: 1rpx solid #F0F0F0;
  
  &:last-child {
    border-bottom: none;
  }
}

.info-label {
  font-size: 26rpx;
  color: #999999;
}

.info-value {
  font-size: 26rpx;
  color: #333333;
}

.review-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #FFFFFF;
  border-radius: 16rpx;
  padding: 24rpx;
  margin-bottom: 16rpx;
}

.rating-summary {
  display: flex;
  flex-direction: column;
}

.big-score {
  font-size: 56rpx;
  font-weight: bold;
  color: #FF9F00;
}

.stars {
  display: flex;
}

.review-count {
  font-size: 24rpx;
  color: #999999;
  margin-top: 8rpx;
}

.write-btn {
  padding: 16rpx 32rpx;
  background-color: #4A90E2;
  border-radius: 32rpx;
  color: #FFFFFF;
  font-size: 26rpx;
}

.review-card {
  background-color: #FFFFFF;
  border-radius: 16rpx;
  padding: 24rpx;
  margin-bottom: 16rpx;
}

.review-header-row {
  display: flex;
  align-items: center;
  margin-bottom: 16rpx;
}

.reviewer-avatar {
  width: 72rpx;
  height: 72rpx;
  border-radius: 50%;
  margin-right: 16rpx;
}

.reviewer-info {
  flex: 1;
}

.reviewer-name {
  font-size: 28rpx;
  font-weight: bold;
  color: #333333;
}

.review-rating {
  display: flex;
}

.review-date {
  font-size: 22rpx;
  color: #999999;
}

.review-pet {
  font-size: 22rpx;
  color: #4A90E2;
  margin-bottom: 12rpx;
}

.review-content {
  font-size: 28rpx;
  color: #333333;
  line-height: 1.6;
  margin-bottom: 16rpx;
}

.review-images {
  display: flex;
  gap: 8rpx;
  margin-bottom: 16rpx;
  
  image {
    width: 160rpx;
    height: 160rpx;
    border-radius: 8rpx;
  }
}

.review-actions {
  display: flex;
  gap: 32rpx;
}

.action {
  font-size: 24rpx;
  color: #999999;
}
</style>
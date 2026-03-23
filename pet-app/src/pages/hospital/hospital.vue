<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { mockHospitals } from '../../utils/mockData'

// 医院列表
const hospitals = ref<any[]>([])
const searchKeyword = ref('')
const currentTag = ref('')

// 标签选项
const tags = ['全部', '24小时', '专科', '手术', '疫苗', '美容', '猫专科']

// 加载医院列表
const loadHospitals = async () => {
  let list = [...mockHospitals]
  
  if (searchKeyword.value) {
    list = list.filter(h => h.name.includes(searchKeyword.value) || h.address.includes(searchKeyword.value))
  }
  
  if (currentTag.value && currentTag.value !== '全部') {
    list = list.filter(h => h.tags.includes(currentTag.value))
  }
  
  hospitals.value = list
}

// 搜索
const handleSearch = () => {
  loadHospitals()
}

// 选择标签
const selectTag = (tag: string) => {
  currentTag.value = tag === '全部' ? '' : tag
  loadHospitals()
}

// 跳转医院详情
const goToDetail = (hospitalId: number) => {
  uni.navigateTo({
    url: `/pages/hospital/detail?id=${hospitalId}`
  })
}

// 模拟拨打电话
const callPhone = (phone: string) => {
  uni.makePhoneCall({
    phoneNumber: phone
  })
}

onMounted(() => {
  loadHospitals()
})
</script>

<template>
  <view class="page">
    <!-- 搜索栏 -->
    <view class="search-bar">
      <view class="search-input-wrap">
        <text class="search-icon">🔍</text>
        <input 
          class="search-input" 
          placeholder="搜索医院名称/地址" 
          v-model="searchKeyword"
          @confirm="handleSearch"
        />
      </view>
    </view>

    <!-- 标签筛选 -->
    <view class="tag-list">
      <view 
        v-for="tag in tags" 
        :key="tag"
        class="tag-item"
        :class="{ active: (currentTag === '' && tag === '全部') || currentTag === tag }"
        @click="selectTag(tag)"
      >
        {{ tag }}
      </view>
    </view>

    <!-- 医院列表 -->
    <scroll-view scroll-y class="hospital-list">
      <view 
        v-for="hospital in hospitals" 
        :key="hospital.id"
        class="hospital-card"
        @click="goToDetail(hospital.id)"
      >
        <image class="hospital-image" :src="hospital.image" mode="aspectFill" />
        <view class="hospital-content">
          <view class="hospital-header">
            <text class="hospital-name">{{ hospital.name }}</text>
            <view class="rating">
              <text class="star">⭐</text>
              <text class="score">{{ hospital.rating }}</text>
            </view>
          </view>
          
          <view class="hospital-tags">
            <text v-for="tag in hospital.tags" :key="tag" class="tag">{{ tag }}</text>
            <text class="price-tag">{{ hospital.priceLevel }}</text>
          </view>
          
          <view class="hospital-info">
            <text class="address">{{ hospital.address }}</text>
            <text class="distance">{{ hospital.distance }}</text>
          </view>
          
          <view class="hospital-stats">
            <text class="reviews">{{ hospital.reviewCount }}条评价</text>
            <view class="actions">
              <view class="action-btn" @click.stop="callPhone(hospital.phone)">
                <text>📞 联系</text>
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- 空状态 -->
      <view v-if="hospitals.length === 0" class="empty">
        <text class="empty-text">暂无找到相关医院</text>
      </view>
    </scroll-view>
  </view>
</template>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  background-color: #F5F5F5;
  padding-bottom: 120rpx;
}

.search-bar {
  background-color: #FFFFFF;
  padding: 24rpx 32rpx;
}

.search-input-wrap {
  display: flex;
  align-items: center;
  background-color: #F5F5F5;
  border-radius: 32rpx;
  padding: 16rpx 24rpx;
}

.search-icon {
  font-size: 32rpx;
  margin-right: 16rpx;
}

.search-input {
  flex: 1;
  font-size: 28rpx;
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
  padding: 24rpx 32rpx;
  background-color: #FFFFFF;
  border-bottom: 1rpx solid #E5E5E5;
}

.tag-item {
  padding: 12rpx 24rpx;
  background-color: #F5F5F5;
  border-radius: 24rpx;
  font-size: 24rpx;
  color: #666666;
  
  &.active {
    background-color: #4A90E2;
    color: #FFFFFF;
  }
}

.hospital-list {
  padding: 16rpx;
}

.hospital-card {
  background-color: #FFFFFF;
  border-radius: 16rpx;
  overflow: hidden;
  margin-bottom: 16rpx;
}

.hospital-image {
  width: 100%;
  height: 240rpx;
}

.hospital-content {
  padding: 24rpx;
}

.hospital-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12rpx;
}

.hospital-name {
  font-size: 32rpx;
  font-weight: bold;
  color: #333333;
}

.rating {
  display: flex;
  align-items: center;
}

.star {
  font-size: 24rpx;
  margin-right: 4rpx;
}

.score {
  font-size: 28rpx;
  color: #FF9F00;
  font-weight: bold;
}

.hospital-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8rpx;
  margin-bottom: 12rpx;
}

.tag {
  padding: 4rpx 12rpx;
  background-color: #E6F7FF;
  color: #1890FF;
  border-radius: 8rpx;
  font-size: 20rpx;
}

.price-tag {
  padding: 4rpx 12rpx;
  background-color: #FFF7E6;
  color: #FA8C16;
  border-radius: 8rpx;
  font-size: 20rpx;
}

.hospital-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12rpx;
}

.address {
  flex: 1;
  font-size: 24rpx;
  color: #666666;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.distance {
  font-size: 24rpx;
  color: #4A90E2;
  margin-left: 16rpx;
}

.hospital-stats {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.reviews {
  font-size: 24rpx;
  color: #999999;
}

.action-btn {
  padding: 12rpx 24rpx;
  background-color: #4A90E2;
  border-radius: 24rpx;
  font-size: 24rpx;
  color: #FFFFFF;
}

.empty {
  display: flex;
  justify-content: center;
  padding: 100rpx 0;
}

.empty-text {
  color: #999999;
  font-size: 28rpx;
}
</style>
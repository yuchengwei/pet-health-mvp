<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { mockQuestions } from '../../utils/mockData'

// 问题列表
const questions = ref<any[]>([])
const searchKeyword = ref('')
const currentCategory = ref('')

// 分类
const categories = ['全部', '健康咨询', '护理咨询', '疫苗咨询', '行为训练', '营养饮食']

// 加载数据
const loadQuestions = async () => {
  let list = [...mockQuestions]
  
  if (searchKeyword.value) {
    list = list.filter(q => q.title.includes(searchKeyword.value) || q.content.includes(searchKeyword.value))
  }
  
  if (currentCategory.value && currentCategory.value !== '全部') {
    list = list.filter(q => q.category === currentCategory.value)
  }
  
  questions.value = list
}

// 搜索
const handleSearch = () => {
  loadQuestions()
}

// 选择分类
const selectCategory = (category: string) => {
  currentCategory.value = category === '全部' ? '' : category
  loadQuestions()
}

// 跳转问题详情
const goToDetail = (questionId: number) => {
  uni.navigateTo({
    url: `/pages/qa/detail?id=${questionId}`
  })
}

// 提问
const askQuestion = () => {
  uni.showToast({
    title: '提问功能开发中',
    icon: 'none'
  })
}

onMounted(() => {
  loadQuestions()
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
          placeholder="搜索问题" 
          v-model="searchKeyword"
          @confirm="handleSearch"
        />
      </view>
    </view>

    <!-- 分类 -->
    <scroll-view scroll-x class="category-scroll">
      <view class="category-list">
        <view 
          v-for="category in categories" 
          :key="category"
          class="category-item"
          :class="{ active: (currentCategory === '' && category === '全部') || currentCategory === category }"
          @click="selectCategory(category)"
        >
          {{ category }}
        </view>
      </view>
    </scroll-view>

    <!-- 问题列表 -->
    <scroll-view scroll-y class="question-list">
      <view 
        v-for="question in questions" 
        :key="question.id"
        class="question-card"
        @click="goToDetail(question.id)"
      >
        <view class="question-header">
          <view class="question-tags">
            <text class="category-tag">{{ question.category }}</text>
            <text v-if="question.isResolved" class="resolved-tag">✅ 已解决</text>
          </view>
        </view>
        
        <view class="question-title">
          <text>{{ question.title }}</text>
        </view>
        
        <view class="question-content">
          <text>{{ question.content }}</text>
        </view>
        
        <view class="question-footer">
          <view class="user-info">
            <image class="user-avatar" :src="question.user.avatar" mode="aspectFill" />
            <text class="user-name">{{ question.user.nickname }}</text>
          </view>
          
          <view class="question-stats">
            <text class="stat">👁️ {{ question.viewCount }}</text>
            <text class="stat">💬 {{ question.answerCount }}</text>
            <text class="stat">{{ question.createTime.split(' ')[0] }}</text>
          </view>
        </view>
        
        <view class="question-tags-row" v-if="question.tags && question.tags.length > 0">
          <text v-for="tag in question.tags" :key="tag" class="tag">#{{ tag }}</text>
        </view>
      </view>

      <!-- 空状态 -->
      <view v-if="questions.length === 0" class="empty">
        <text class="empty-text">暂无问题，快来提问吧~</text>
      </view>
    </scroll-view>

    <!-- 提问按钮 -->
    <view class="fab" @click="askQuestion">
      <text class="fab-icon">?</text>
    </view>
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

.category-scroll {
  background-color: #FFFFFF;
  white-space: nowrap;
}

.category-list {
  display: flex;
  padding: 16rpx 32rpx;
  gap: 16rpx;
}

.category-item {
  display: inline-block;
  padding: 12rpx 24rpx;
  background-color: #F5F5F5;
  border-radius: 24rpx;
  font-size: 24rpx;
  color: #666666;
  white-space: nowrap;
  
  &.active {
    background-color: #4A90E2;
    color: #FFFFFF;
  }
}

.question-list {
  padding: 16rpx;
}

.question-card {
  background-color: #FFFFFF;
  border-radius: 16rpx;
  padding: 24rpx;
  margin-bottom: 16rpx;
}

.question-header {
  margin-bottom: 12rpx;
}

.question-tags {
  display: flex;
  gap: 8rpx;
}

.category-tag {
  padding: 4rpx 12rpx;
  background-color: #E6F7FF;
  color: #1890FF;
  border-radius: 8rpx;
  font-size: 20rpx;
}

.resolved-tag {
  padding: 4rpx 12rpx;
  background-color: #F6FFED;
  color: #52C41A;
  border-radius: 8rpx;
  font-size: 20rpx;
}

.question-title {
  font-size: 30rpx;
  font-weight: bold;
  color: #333333;
  margin-bottom: 12rpx;
  line-height: 1.4;
}

.question-content {
  font-size: 26rpx;
  color: #666666;
  line-height: 1.5;
  margin-bottom: 16rpx;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.question-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
}

.user-avatar {
  width: 48rpx;
  height: 48rpx;
  border-radius: 50%;
  margin-right: 8rpx;
}

.user-name {
  font-size: 24rpx;
  color: #666666;
}

.question-stats {
  display: flex;
  gap: 16rpx;
}

.stat {
  font-size: 22rpx;
  color: #999999;
}

.question-tags-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8rpx;
  margin-top: 12rpx;
  padding-top: 12rpx;
  border-top: 1rpx solid #F0F0F0;
}

.tag {
  font-size: 22rpx;
  color: #4A90E2;
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

.fab {
  position: fixed;
  right: 32rpx;
  bottom: 200rpx;
  width: 100rpx;
  height: 100rpx;
  background-color: #52C41A;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8rpx 24rpx rgba(82, 196, 26, 0.4);
}

.fab-icon {
  font-size: 56rpx;
  color: #FFFFFF;
  font-weight: bold;
}
</style>
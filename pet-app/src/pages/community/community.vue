<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { mockPosts } from '../../utils/mockData'

// 动态列表
const posts = ref<any[]>([])
const currentTab = ref('all')

// 加载数据
const loadPosts = async () => {
  posts.value = mockPosts
}

// 切换标签
const switchTab = (tab: string) => {
  currentTab.value = tab
  loadPosts()
}

// 点赞
const handleLike = (post: any) => {
  post.isLiked = !post.isLiked
  post.likes += post.isLiked ? 1 : -1
}

// 收藏
const handleCollect = (post: any) => {
  post.isCollected = !post.isCollected
}

// 跳转详情
const goToDetail = (postId: number) => {
  uni.showToast({
    title: '功能开发中',
    icon: 'none'
  })
}

// 发布新动态
const createPost = () => {
  uni.showToast({
    title: '功能开发中',
    icon: 'none'
  })
}

// 格式化时间
const formatTime = (timeStr: string) => {
  const date = new Date(timeStr)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const hours = Math.floor(diff / (1000 * 60 * 60))
  
  if (hours < 1) return '刚刚'
  if (hours < 24) return `${hours}小时前`
  if (hours < 48) return '昨天'
  return timeStr.split(' ')[0]
}

onMounted(() => {
  loadPosts()
})
</script>

<template>
  <view class="page">
    <!-- 标签栏 -->
    <view class="tabs">
      <view 
        class="tab" 
        :class="{ active: currentTab === 'all' }"
        @click="switchTab('all')"
      >
        全部
      </view>
      <view 
        class="tab" 
        :class="{ active: currentTab === 'following' }"
        @click="switchTab('following')"
      >
        关注
      </view>
      <view 
        class="tab" 
        :class="{ active: currentTab === 'nearby' }"
        @click="switchTab('nearby')"
      >
        附近
      </view>
    </view>

    <!-- 动态列表 -->
    <scroll-view scroll-y class="post-list">
      <view 
        v-for="post in posts" 
        :key="post.id" 
        class="post-card"
        @click="goToDetail(post.id)"
      >
        <!-- 用户信息 -->
        <view class="post-header">
          <image class="user-avatar" :src="post.user.avatar" mode="aspectFill" />
          <view class="user-info">
            <text class="user-name">{{ post.user.nickname }}</text>
            <text class="post-time">{{ formatTime(post.createTime) }}</text>
          </view>
        </view>

        <!-- 内容 -->
        <view class="post-content">
          <text>{{ post.content }}</text>
        </view>

        <!-- 图片 -->
        <view class="post-images" v-if="post.images && post.images.length > 0">
          <image 
            v-for="(img, idx) in post.images" 
            :key="idx" 
            :src="img" 
            mode="aspectFill"
            class="post-image"
            :class="{ 'single-image': post.images.length === 1 }"
          />
        </view>

        <!-- 标签 -->
        <view class="post-tags" v-if="post.tags && post.tags.length > 0">
          <text v-for="tag in post.tags" :key="tag" class="tag">#{{ tag }}</text>
        </view>

        <!-- 互动栏 -->
        <view class="post-actions">
          <view class="action-item" @click.stop="handleLike(post)">
            <text class="action-icon">{{ post.isLiked ? '❤️' : '🤍' }}</text>
            <text class="action-count">{{ post.likes }}</text>
          </view>
          <view class="action-item">
            <text class="action-icon">💬</text>
            <text class="action-count">{{ post.comments }}</text>
          </view>
          <view class="action-item" @click.stop="handleCollect(post)">
            <text class="action-icon">{{ post.isCollected ? '⭐' : '☆' }}</text>
            <text class="action-count">{{ post.isCollected ? '已收藏' : '收藏' }}</text>
          </view>
          <view class="action-item">
            <text class="action-icon">📤</text>
            <text class="action-count">分享</text>
          </view>
        </view>
      </view>

      <!-- 空状态 -->
      <view v-if="posts.length === 0" class="empty">
        <text class="empty-text">暂无动态，快来发布第一条吧~</text>
      </view>
    </scroll-view>

    <!-- 发布按钮 -->
    <view class="fab" @click="createPost">
      <text class="fab-icon">+</text>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  background-color: #F5F5F5;
  padding-bottom: 120rpx;
}

.tabs {
  display: flex;
  background-color: #FFFFFF;
  padding: 0 32rpx;
  border-bottom: 1rpx solid #E5E5E5;
  position: sticky;
  top: 0;
  z-index: 10;
}

.tab {
  padding: 24rpx 32rpx;
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
      width: 48rpx;
      height: 4rpx;
      background-color: #4A90E2;
      border-radius: 2rpx;
    }
  }
}

.post-list {
  padding: 16rpx;
}

.post-card {
  background-color: #FFFFFF;
  border-radius: 16rpx;
  padding: 24rpx;
  margin-bottom: 16rpx;
}

.post-header {
  display: flex;
  align-items: center;
  margin-bottom: 16rpx;
}

.user-avatar {
  width: 72rpx;
  height: 72rpx;
  border-radius: 50%;
  margin-right: 16rpx;
}

.user-info {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-size: 28rpx;
  font-weight: bold;
  color: #333333;
}

.post-time {
  font-size: 22rpx;
  color: #999999;
}

.post-content {
  font-size: 28rpx;
  color: #333333;
  line-height: 1.6;
  margin-bottom: 16rpx;
}

.post-images {
  display: flex;
  flex-wrap: wrap;
  gap: 8rpx;
  margin-bottom: 16rpx;
}

.post-image {
  width: calc(33.33% - 6rpx);
  height: 200rpx;
  border-radius: 8rpx;
  
  &.single-image {
    width: 100%;
    height: 400rpx;
  }
}

.post-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
  margin-bottom: 16rpx;
}

.tag {
  font-size: 24rpx;
  color: #4A90E2;
}

.post-actions {
  display: flex;
  justify-content: space-around;
  padding-top: 16rpx;
  border-top: 1rpx solid #F0F0F0;
}

.action-item {
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.action-icon {
  font-size: 32rpx;
}

.action-count {
  font-size: 24rpx;
  color: #666666;
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
  background-color: #4A90E2;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8rpx 24rpx rgba(74, 144, 226, 0.4);
}

.fab-icon {
  font-size: 56rpx;
  color: #FFFFFF;
  font-weight: bold;
}
</style>
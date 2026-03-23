<script setup lang="ts">
import { ref, onMounted } from 'vue'

// 获取页面参数
const pages = getCurrentPages()
const currentPage = pages[pages.length - 1]
const questionId = ref((currentPage?.options?.id as any) || 1)

// 问题详情
const question = ref<any>(null)
const answers = ref<any[]>([])
const myAnswer = ref('')

// 加载数据
const loadData = async () => {
  // 模拟数据
  const mockQuestion = {
    id: questionId.value,
    title: '狗狗最近食欲不振怎么办？',
    content: '我家金毛最近两天不想吃东西，精神还行，需要去医院吗？',
    user: { id: 1, nickname: '宠物达人', avatar: 'https://picsum.photos/50/50?random=1' },
    category: '健康咨询',
    viewCount: 156,
    answerCount: 3,
    createTime: '2024-03-15 10:30',
    isResolved: false,
    tags: ['食欲不振', '狗狗']
  }
  
  const mockAnswers = [
    {
      id: 1,
      questionId: questionId.value,
      user: { id: 4, nickname: '张医生', avatar: 'https://picsum.photos/50/50?random=50', isExpert: true },
      content: '食欲不振可能是多种原因导致的：\n1. 消化不良 - 可以喂些益生菌\n2. 口腔问题 - 检查是否有牙龈红肿\n3. 情绪问题 - 是否换了新环境或有压力\n\n建议先观察24小时，如果持续不进食或伴有呕吐、腹泻等症状，建议及时就医。可以先试试给它吃些平时喜欢的食物。',
      likes: 15,
      isAdopted: false,
      createTime: '2024-03-15 11:00'
    },
    {
      id: 2,
      questionId: questionId.value,
      user: { id: 5, nickname: '资深铲屎官', avatar: 'https://picsum.photos/50/50?random=51' },
      content: '可以先试试换换口味，比如湿粮或者加些肉汤。如果精神状态良好可以再观察一下。我们家狗狗之前也有类似情况，后来发现是狗粮吃腻了。',
      likes: 8,
      isAdopted: false,
      createTime: '2024-03-15 12:30'
    },
    {
      id: 3,
      questionId: questionId.value,
      user: { id: 6, nickname: '宠物营养师', avatar: 'https://picsum.photos/50/50?random=52', isExpert: true },
      content: '建议给狗狗测量一下体温，如果体温正常可以先在家调理。可以在食物里添加一些助消化的营养剂。',
      likes: 5,
      isAdopted: false,
      createTime: '2024-03-15 14:00'
    }
  ]
  
  question.value = mockQuestion
  answers.value = mockAnswers
}

// 点赞回答
const handleLike = (answer: any) => {
  answer.likes++
}

// 采纳回答
const adoptAnswer = (answerId: number) => {
  uni.showToast({
    title: '已采纳回答',
    icon: 'success'
  })
}

// 提交回答
const submitAnswer = () => {
  if (!myAnswer.value.trim()) {
    uni.showToast({
      title: '请输入回答内容',
      icon: 'none'
    })
    return
  }
  
  uni.showToast({
    title: '回答成功',
    icon: 'success'
  })
  myAnswer.value = ''
}

onMounted(() => {
  loadData()
})
</script>

<template>
  <view class="page" v-if="question">
    <!-- 问题详情 -->
    <view class="question-card">
      <view class="question-header">
        <view class="tags">
          <text class="category-tag">{{ question.category }}</text>
          <text v-if="question.isResolved" class="resolved-tag">✅ 已解决</text>
        </view>
        <text class="view-count">👁️ {{ question.viewCount }} 次浏览</text>
      </view>
      
      <view class="question-title">
        <text>{{ question.title }}</text>
      </view>
      
      <view class="question-content">
        <text>{{ question.content }}</text>
      </view>
      
      <view class="question-tags" v-if="question.tags && question.tags.length > 0">
        <text v-for="tag in question.tags" :key="tag" class="tag">#{{ tag }}</text>
      </view>
      
      <view class="question-footer">
        <view class="user-info">
          <image class="user-avatar" :src="question.user.avatar" mode="aspectFill" />
          <text class="user-name">{{ question.user.nickname }}</text>
        </view>
        <text class="time">{{ question.createTime }}</text>
      </view>
    </view>

    <!-- 回答列表 -->
    <view class="answer-section">
      <view class="answer-header">
        <text class="answer-count">{{ answers.length }} 个回答</text>
      </view>
      
      <view 
        v-for="answer in answers" 
        :key="answer.id" 
        class="answer-card"
        :class="{ adopted: answer.isAdopted }"
      >
        <view v-if="answer.isAdopted" class="adopted-badge">
          <text>✓ 已采纳</text>
        </view>
        
        <view class="answer-header-row">
          <image class="answerer-avatar" :src="answer.user.avatar" mode="aspectFill" />
          <view class="answerer-info">
            <view class="name-row">
              <text class="answerer-name">{{ answer.user.nickname }}</text>
              <text v-if="answer.user.isExpert" class="expert-badge">认证专家</text>
            </view>
            <text class="answer-time">{{ answer.createTime }}</text>
          </view>
        </view>
        
        <view class="answer-content">
          <text>{{ answer.content }}</text>
        </view>
        
        <view class="answer-actions">
          <view class="action-btn" @click="handleLike(answer)">
            <text>👍 {{ answer.likes }}</text>
          </view>
          <view class="action-btn" @click="adoptAnswer(answer.id)">
            <text>✓ 采纳</text>
          </view>
          <view class="action-btn">
            <text>💬 回复</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 回答输入框 -->
    <view class="answer-input">
      <textarea 
        class="textarea" 
        placeholder="写下你的回答..." 
        v-model="myAnswer"
      />
      <view class="submit-btn" @click="submitAnswer">
        <text>提交回答</text>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  background-color: #F5F5F5;
  padding: 16rpx;
  padding-bottom: 200rpx;
}

.question-card {
  background-color: #FFFFFF;
  border-radius: 16rpx;
  padding: 24rpx;
  margin-bottom: 16rpx;
}

.question-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16rpx;
}

.tags {
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

.view-count {
  font-size: 22rpx;
  color: #999999;
}

.question-title {
  font-size: 34rpx;
  font-weight: bold;
  color: #333333;
  margin-bottom: 16rpx;
  line-height: 1.4;
}

.question-content {
  font-size: 28rpx;
  color: #666666;
  line-height: 1.6;
  margin-bottom: 16rpx;
}

.question-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8rpx;
  margin-bottom: 16rpx;
}

.tag {
  font-size: 24rpx;
  color: #4A90E2;
}

.question-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 16rpx;
  border-top: 1rpx solid #F0F0F0;
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

.time {
  font-size: 22rpx;
  color: #999999;
}

.answer-section {
  margin-bottom: 16rpx;
}

.answer-header {
  padding: 16rpx 0;
}

.answer-count {
  font-size: 28rpx;
  font-weight: bold;
  color: #333333;
}

.answer-card {
  background-color: #FFFFFF;
  border-radius: 16rpx;
  padding: 24rpx;
  margin-bottom: 16rpx;
  position: relative;
  
  &.adopted {
    border: 2rpx solid #52C41A;
  }
}

.adopted-badge {
  position: absolute;
  top: 16rpx;
  right: 16rpx;
  padding: 4rpx 12rpx;
  background-color: #52C41A;
  color: #FFFFFF;
  border-radius: 8rpx;
  font-size: 20rpx;
}

.answer-header-row {
  display: flex;
  align-items: center;
  margin-bottom: 16rpx;
}

.answerer-avatar {
  width: 64rpx;
  height: 64rpx;
  border-radius: 50%;
  margin-right: 12rpx;
}

.answerer-info {
  flex: 1;
}

.name-row {
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.answerer-name {
  font-size: 28rpx;
  font-weight: bold;
  color: #333333;
}

.expert-badge {
  padding: 2rpx 8rpx;
  background-color: #FFD700;
  color: #333333;
  border-radius: 4rpx;
  font-size: 18rpx;
}

.answer-time {
  font-size: 22rpx;
  color: #999999;
}

.answer-content {
  font-size: 28rpx;
  color: #333333;
  line-height: 1.6;
  margin-bottom: 16rpx;
  white-space: pre-wrap;
}

.answer-actions {
  display: flex;
  gap: 24rpx;
}

.action-btn {
  padding: 8rpx 16rpx;
  background-color: #F5F5F5;
  border-radius: 8rpx;
  font-size: 24rpx;
  color: #666666;
}

.answer-input {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #FFFFFF;
  padding: 16rpx;
  box-shadow: 0 -4rpx 16rpx rgba(0, 0, 0, 0.05);
}

.textarea {
  width: 100%;
  height: 120rpx;
  background-color: #F5F5F5;
  border-radius: 12rpx;
  padding: 16rpx;
  font-size: 28rpx;
  box-sizing: border-box;
  margin-bottom: 12rpx;
}

.submit-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 72rpx;
  background-color: #4A90E2;
  border-radius: 36rpx;
  color: #FFFFFF;
  font-size: 28rpx;
}
</style>
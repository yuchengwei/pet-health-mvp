<template>
  <view class="container">
    <view class="tab-bar">
      <view 
        class="tab" 
        :class="{ active: activeTab === 'story' }"
        @click="switchTab('story')"
      >
        宠物故事
      </view>
      <view 
        class="tab" 
        :class="{ active: activeTab === 'question' }"
        @click="switchTab('question')"
      >
        健康问答
      </view>
    </view>

    <!-- 宠物故事 -->
    <scroll-view 
      v-if="activeTab === 'story'" 
      class="content" 
      scroll-y 
      @scrolltolower="loadMore"
    >
      <view 
        class="post-card" 
        v-for="post in posts" 
        :key="post.id"
        @click="goToDetail(post.id)"
      >
        <view class="post-header">
          <image class="user-avatar" :src="post.avatar || '/static/images/default-avatar.png'" />
          <view class="user-info">
            <text class="user-name">{{ post.nickname }}</text>
            <text class="post-time">{{ formatTime(post.created_at) }}</text>
          </view>
          <view class="category-tag">{{ post.category }}</view>
        </view>
        
        <view class="post-content">
          <text class="post-title">{{ post.title }}</text>
          <text class="post-text">{{ post.content }}</text>
        </view>
        
        <view class="post-images" v-if="post.images && post.images.length > 0">
          <image 
            v-for="(img, idx) in post.images.slice(0, 3)" 
            :key="idx" 
            :src="img" 
            mode="aspectFill"
            class="post-img"
          />
        </view>
        
        <view class="post-footer">
          <view class="footer-item" @click.stop="toggleLike(post)">
            <text class="icon">{{ post.liked ? '❤️' : '🤍' }}</text>
            <text>{{ post.likes_count }}</text>
          </view>
          <view class="footer-item">
            <text class="icon">💬</text>
            <text>{{ post.comments_count }}</text>
          </view>
          <view class="footer-item" @click.stop="toggleFavorite(post)">
            <text class="icon">{{ post.favorited ? '⭐' : '☆' }}</text>
            <text>收藏</text>
          </view>
        </view>
      </view>
      
      <view class="loading" v-if="loading"><text>加载中...</text></view>
      <view class="no-more" v-if="noMore && posts.length > 0"><text>没有更多了</text></view>
      
      <!-- 发布按钮 -->
      <view class="publish-btn" @click="goToPublish">
        <text>+</text>
      </view>
    </scroll-view>

    <!-- 健康问答 -->
    <scroll-view 
      v-else 
      class="content" 
      scroll-y 
      @scrolltolower="loadMoreQuestion"
    >
      <view 
        class="question-card" 
        v-for="question in questions" 
        :key="question.id"
        @click="goToQuestionDetail(question.id)"
      >
        <view class="question-header">
          <view class="category-tag">{{ question.category }}</view>
          <text class="question-title">{{ question.title }}</text>
        </view>
        <text class="question-content">{{ question.content }}</text>
        <view class="question-footer">
          <text class="user-name">{{ question.nickname }}</text>
          <text class="answer-count">{{ question.answers_count }} 回答</text>
        </view>
      </view>
      
      <view class="loading" v-if="loadingQuestion"><text>加载中...</text></view>
      <view class="no-more" v-if="noMoreQuestion && questions.length > 0"><text>没有更多了</text></view>
      
      <view class="publish-btn" @click="goToQuestionPublish">
        <text>?</text>
      </view>
    </scroll-view>
  </view>
</template>

<script>
import { postAPI, questionAPI } from '../../utils/api.js'

export default {
  data() {
    return {
      activeTab: 'story',
      posts: [],
      questions: [],
      page: 1,
      pageQuestion: 1,
      limit: 20,
      loading: false,
      loadingQuestion: false,
      noMore: false,
      noMoreQuestion: false
    }
  },
  onLoad() {
    this.loadPosts()
  },
  methods: {
    switchTab(tab) {
      this.activeTab = tab
      if (tab === 'story' && this.posts.length === 0) {
        this.loadPosts()
      } else if (tab === 'question' && this.questions.length === 0) {
        this.loadQuestions()
      }
    },
    
    async loadPosts(loadMore = false) {
      if (this.loading) return
      this.loading = true
      
      try {
        const res = await postAPI.getPosts({ page: this.page, limit: this.limit })
        if (loadMore) {
          this.posts = [...this.posts, ...res.posts]
        } else {
          this.posts = res.posts || []
        }
        this.noMore = res.posts.length < this.limit
      } catch (e) {
        uni.showToast({ title: '加载失败', icon: 'none' })
      } finally {
        this.loading = false
      }
    },
    
    async loadQuestions(loadMore = false) {
      if (this.loadingQuestion) return
      this.loadingQuestion = true
      
      try {
        const res = await questionAPI.getQuestions({ page: this.pageQuestion, limit: this.limit })
        if (loadMore) {
          this.questions = [...this.questions, ...res.questions]
        } else {
          this.questions = res.questions || []
        }
        this.noMoreQuestion = res.questions.length < this.limit
      } catch (e) {
        uni.showToast({ title: '加载失败', icon: 'none' })
      } finally {
        this.loadingQuestion = false
      }
    },
    
    loadMore() {
      if (!this.noMore) {
        this.page++
        this.loadPosts(true)
      }
    },
    
    loadMoreQuestion() {
      if (!this.noMoreQuestion) {
        this.pageQuestion++
        this.loadQuestions(true)
      }
    },
    
    goToDetail(id) {
      uni.navigateTo({ url: `/pages/community/post-detail?id=${id}` })
    },
    
    goToQuestionDetail(id) {
      uni.navigateTo({ url: `/pages/community/question-detail?id=${id}` })
    },
    
    goToPublish() {
      uni.navigateTo({ url: '/pages/community/post-publish' })
    },
    
    goToQuestionPublish() {
      uni.navigateTo({ url: '/pages/community/question-publish' })
    },
    
    async toggleLike(post) {
      try {
        if (post.liked) {
          await postAPI.unlikePost(post.id)
          post.likes_count--
        } else {
          await postAPI.likePost(post.id)
          post.likes_count++
        }
        post.liked = !post.liked
      } catch (e) {
        uni.showToast({ title: '操作失败', icon: 'none' })
      }
    },
    
    async toggleFavorite(post) {
      try {
        if (post.favorited) {
          await postAPI.unfavoritePost(post.id)
        } else {
          await postAPI.favoritePost(post.id)
        }
        post.favorited = !post.favorited
      } catch (e) {
        uni.showToast({ title: '操作失败', icon: 'none' })
      }
    },
    
    formatTime(time) {
      if (!time) return ''
      const date = new Date(time)
      const now = new Date()
      const diff = now - date
      
      if (diff < 60000) return '刚刚'
      if (diff < 3600000) return `${Math.floor(diff / 60000)}分钟前`
      if (diff < 86400000) return `${Math.floor(diff / 3600000)}小时前`
      return `${Math.floor(diff / 86400000)}天前`
    }
  }
}
</script>

<style>
.container {
  min-height: 100vh;
  background: #F8F9FA;
}

.tab-bar {
  display: flex;
  background: #fff;
  padding: 0 16px;
}

.tab {
  flex: 1;
  text-align: center;
  padding: 16px 0;
  font-size: 16px;
  color: #666;
  border-bottom: 2px solid transparent;
}

.tab.active {
  color: #4A90D9;
  border-bottom-color: #4A90D9;
}

.content {
  padding: 16px;
  height: calc(100vh - 60px);
}

.post-card {
  background: #fff;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
}

.post-header {
  display: flex;
  align-items: center;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #eee;
}

.user-info {
  flex: 1;
  margin-left: 12px;
}

.user-name {
  font-size: 14px;
  color: #333;
  display: block;
}

.post-time {
  font-size: 12px;
  color: #999;
}

.category-tag {
  padding: 4px 8px;
  background: #E8F4FF;
  color: #4A90D9;
  font-size: 12px;
  border-radius: 4px;
}

.post-content {
  margin-top: 12px;
}

.post-title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.post-text {
  font-size: 14px;
  color: #666;
  margin-top: 8px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.post-images {
  display: flex;
  gap: 8px;
  margin-top: 12px;
}

.post-img {
  width: 100px;
  height: 100px;
  border-radius: 8px;
}

.post-footer {
  display: flex;
  justify-content: space-around;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
}

.footer-item {
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #999;
}

.icon {
  margin-right: 4px;
}

.question-card {
  background: #fff;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
}

.question-header {
  margin-bottom: 8px;
}

.question-title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  display: block;
  margin-top: 8px;
}

.question-content {
  font-size: 14px;
  color: #666;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.question-footer {
  display: flex;
  justify-content: space-between;
  margin-top: 12px;
  font-size: 12px;
  color: #999;
}

.publish-btn {
  position: fixed;
  right: 20px;
  bottom: 40px;
  width: 56px;
  height: 56px;
  background: #4A90D9;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  color: #fff;
  box-shadow: 0 4px 12px rgba(74, 144, 217, 0.4);
}

.loading, .no-more {
  text-align: center;
  padding: 20px;
  color: #999;
  font-size: 14px;
}
</style>
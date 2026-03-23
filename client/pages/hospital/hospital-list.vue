<template>
  <view class="container">
    <view class="header">
      <text class="title">医院列表</text>
      <view class="search-bar" @click="goToSearch">
        <text class="search-icon">🔍</text>
        <text class="search-placeholder">搜索医院</text>
      </view>
    </view>

    <view class="filter-bar">
      <view 
        class="filter-item" 
        :class="{ active: filterRegion }"
        @click="showRegionFilter"
      >
        <text>{{ filterRegion || '地区' }}</text>
        <text class="arrow">▼</text>
      </view>
      <view 
        class="filter-item" 
        :class="{ active: filterRating }"
        @click="showRatingFilter"
      >
        <text>{{ filterRating ? `${filterRating}星+` : '评分' }}</text>
        <text class="arrow">▼</text>
      </view>
      <view 
        class="filter-item" 
        :class="{ active: sortType }"
        @click="showSortFilter"
      >
        <text>{{ sortText }}</text>
        <text class="arrow">▼</text>
      </view>
    </view>

    <scroll-view class="hospital-list" scroll-y @scrolltolower="loadMore">
      <view 
        class="hospital-card" 
        v-for="hospital in hospitals" 
        :key="hospital.id"
        @click="goToDetail(hospital.id)"
      >
        <image 
          class="hospital-img" 
          :src="hospital.images?.[0] || '/static/images/default-hospital.png'" 
          mode="aspectFill" 
        />
        <view class="hospital-content">
          <text class="hospital-name">{{ hospital.name }}</text>
          <text class="hospital-address">{{ hospital.address }}</text>
          <view class="hospital-meta">
            <view class="rating">
              <text class="star">⭐</text>
              <text class="score">{{ hospital.rating }}</text>
            </view>
            <text class="reviews">{{ hospital.reviews_count }}条评价</text>
          </view>
        </view>
      </view>
      
      <view class="loading" v-if="loading">
        <text>加载中...</text>
      </view>
      <view class="no-more" v-if="noMore">
        <text>没有更多了</text>
      </view>
    </scroll-view>
  </view>
</template>

<script>
import { hospitalAPI } from '../../utils/api.js'

export default {
  data() {
    return {
      hospitals: [],
      page: 1,
      limit: 20,
      loading: false,
      noMore: false,
      filterRegion: '',
      filterRating: '',
      sortType: '',
      sortText: '排序'
    }
  },
  onLoad() {
    this.loadHospitals()
  },
  methods: {
    async loadHospitals(loadMore = false) {
      if (this.loading) return
      this.loading = true
      
      try {
        const params = {
          page: this.page,
          limit: this.limit,
          region: this.filterRegion,
          rating: this.filterRating,
          sort: this.sortType
        }
        
        const res = await hospitalAPI.getHospitals(params)
        
        if (loadMore) {
          this.hospitals = [...this.hospitals, ...res.hospitals]
        } else {
          this.hospitals = res.hospitals || []
        }
        
        this.noMore = res.hospitals.length < this.limit
      } catch (e) {
        uni.showToast({ title: '加载失败', icon: 'none' })
      } finally {
        this.loading = false
      }
    },
    
    loadMore() {
      if (!this.noMore) {
        this.page++
        this.loadHospitals(true)
      }
    },
    
    goToSearch() {
      uni.navigateTo({ url: '/pages/hospital/hospital-search' })
    },
    
    goToDetail(id) {
      uni.navigateTo({ url: `/pages/hospital/hospital-detail?id=${id}` })
    },
    
    showRegionFilter() {
      uni.showActionSheet({
        itemList: ['全部', '朝阳区', '海淀区', '东城区', '西城区', '丰台区'],
        success: (res) => {
          this.filterRegion = res.tapIndex === 0 ? '' : ['朝阳区', '海淀区', '东城区', '西城区', '丰台区'][res.tapIndex - 1]
          this.page = 1
          this.loadHospitals()
        }
      })
    },
    
    showRatingFilter() {
      uni.showActionSheet({
        itemList: ['全部', '4.5星+', '4星+', '3星+'],
        success: (res) => {
          this.filterRating = ['', 4.5, 4, 3][res.tapIndex]
          this.page = 1
          this.loadHospitals()
        }
      })
    },
    
    showSortFilter() {
      uni.showActionSheet({
        itemList: ['默认', '距离最近', '评分最高', '评价最多'],
        success: (res) => {
          this.sortType = ['', 'distance', 'rating', 'reviews'][res.tapIndex]
          this.sortText = ['排序', '距离最近', '评分最高', '评价最多'][res.tapIndex]
          this.page = 1
          this.loadHospitals()
        }
      })
    }
  }
}
</script>

<style>
.container {
  min-height: 100vh;
  background: #F8F9FA;
}

.header {
  padding: 16px;
  background: #fff;
}

.title {
  font-size: 20px;
  font-weight: bold;
  color: #333;
}

.search-bar {
  display: flex;
  align-items: center;
  margin-top: 12px;
  padding: 10px 16px;
  background: #F8F9FA;
  border-radius: 8px;
}

.search-icon {
  margin-right: 8px;
}

.search-placeholder {
  color: #999;
  font-size: 14px;
}

.filter-bar {
  display: flex;
  background: #fff;
  padding: 12px 16px;
  border-bottom: 1px solid #f0f0f0;
}

.filter-item {
  flex: 1;
  text-align: center;
  font-size: 14px;
  color: #666;
}

.filter-item.active {
  color: #4A90D9;
}

.arrow {
  font-size: 10px;
  margin-left: 4px;
}

.hospital-list {
  padding: 16px;
  height: calc(100vh - 180px);
}

.hospital-card {
  display: flex;
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}

.hospital-img {
  width: 100px;
  height: 100px;
  background: #eee;
}

.hospital-content {
  flex: 1;
  padding: 12px;
}

.hospital-name {
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.hospital-address {
  font-size: 12px;
  color: #999;
  margin-top: 4px;
  display: block;
}

.hospital-meta {
  display: flex;
  align-items: center;
  margin-top: 8px;
}

.rating {
  display: flex;
  align-items: center;
  margin-right: 12px;
}

.star {
  font-size: 12px;
}

.score {
  font-size: 14px;
  color: #F5A623;
  font-weight: bold;
  margin-left: 2px;
}

.reviews {
  font-size: 12px;
  color: #999;
}

.loading, .no-more {
  text-align: center;
  padding: 20px;
  color: #999;
  font-size: 14px;
}
</style>
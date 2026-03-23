<script setup lang="ts">
import { ref } from 'vue'

// 表单数据
const petForm = ref({
  name: '',
  species: 'dog',
  breed: '',
  gender: 'male',
  birthDate: '',
  weight: '',
  color: '',
  chipNo: ''
})

// 物种选项
const speciesOptions = [
  { label: '狗狗', value: 'dog' },
  { label: '猫咪', value: 'cat' },
  { label: '其他', value: 'other' }
]

// 性别选项
const genderOptions = [
  { label: '♂️ 弟弟', value: 'male' },
  { label: '♀️ 妹妹', value: 'female' }
]

// 选择出生日期
const pickDate = () => {
  uni.showDatePicker({
    success: (res) => {
      petForm.value.birthDate = res.dateStr
    }
  })
}

// 保存宠物
const savePet = () => {
  if (!petForm.value.name) {
    uni.showToast({
      title: '请输入宠物名字',
      icon: 'none'
    })
    return
  }
  
  if (!petForm.value.breed) {
    uni.showToast({
      title: '请输入品种',
      icon: 'none'
    })
    return
  }
  
  uni.showLoading({
    title: '保存中...'
  })
  
  setTimeout(() => {
    uni.hideLoading()
    uni.showToast({
      title: '添加成功',
      icon: 'success'
    })
    setTimeout(() => {
      uni.navigateBack()
    }, 1500)
  }, 1000)
}

// 选择头像
const chooseAvatar = () => {
  uni.chooseImage({
    count: 1,
    sizeType: ['compressed'],
    sourceType: ['album', 'camera'],
    success: (res) => {
      uni.showToast({
        title: '头像已选择',
        icon: 'none'
      })
    }
  })
}
</script>

<template>
  <view class="page">
    <!-- 头像选择 -->
    <view class="avatar-section" @click="chooseAvatar">
      <image class="avatar" src="https://picsum.photos/200/200?random=100" mode="aspectFill" />
      <text class="avatar-tip">点击更换头像</text>
    </view>

    <!-- 表单 -->
    <view class="form-section">
      <view class="form-item">
        <text class="form-label">名字 *</text>
        <input class="form-input" placeholder="请输入宠物名字" v-model="petForm.name" />
      </view>

      <view class="form-item">
        <text class="form-label">物种 *</text>
        <view class="radio-group">
          <view 
            v-for="item in speciesOptions" 
            :key="item.value"
            class="radio-item"
            :class="{ active: petForm.species === item.value }"
            @click="petForm.species = item.value"
          >
            {{ item.label }}
          </view>
        </view>
      </view>

      <view class="form-item">
        <text class="form-label">品种 *</text>
        <input class="form-input" placeholder="如：金毛、英短" v-model="petForm.breed" />
      </view>

      <view class="form-item">
        <text class="form-label">性别</text>
        <view class="radio-group">
          <view 
            v-for="item in genderOptions" 
            :key="item.value"
            class="radio-item"
            :class="{ active: petForm.gender === item.value }"
            @click="petForm.gender = item.value"
          >
            {{ item.label }}
          </view>
        </view>
      </view>

      <view class="form-item">
        <text class="form-label">出生日期</text>
        <view class="date-picker" @click="pickDate">
          <text v-if="petForm.birthDate">{{ petForm.birthDate }}</text>
          <text v-else class="placeholder">请选择出生日期</text>
        </view>
      </view>

      <view class="form-item">
        <text class="form-label">体重 (kg)</text>
        <input class="form-input" type="digit" placeholder="如：10.5" v-model="petForm.weight" />
      </view>

      <view class="form-item">
        <text class="form-label">毛色</text>
        <input class="form-input" placeholder="如：金色、蓝色" v-model="petForm.color" />
      </view>

      <view class="form-item">
        <text class="form-label">芯片号</text>
        <input class="form-input" placeholder="如有芯片请填写" v-model="petForm.chipNo" />
      </view>
    </view>

    <!-- 保存按钮 -->
    <view class="save-btn" @click="savePet">
      <text>保存</text>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  background-color: #F5F5F5;
}

.avatar-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 48rpx 0;
  background-color: #FFFFFF;
}

.avatar {
  width: 180rpx;
  height: 180rpx;
  border-radius: 50%;
  border: 4rpx solid #E5E5E5;
  margin-bottom: 16rpx;
}

.avatar-tip {
  font-size: 24rpx;
  color: #999999;
}

.form-section {
  background-color: #FFFFFF;
  margin-top: 16rpx;
}

.form-item {
  display: flex;
  align-items: center;
  padding: 24rpx 32rpx;
  border-bottom: 1rpx solid #F0F0F0;
}

.form-label {
  width: 180rpx;
  font-size: 28rpx;
  color: #333333;
}

.form-input {
  flex: 1;
  font-size: 28rpx;
  color: #333333;
}

.placeholder {
  color: #999999;
}

.radio-group {
  flex: 1;
  display: flex;
  gap: 24rpx;
}

.radio-item {
  padding: 12rpx 24rpx;
  background-color: #F5F5F5;
  border-radius: 8rpx;
  font-size: 26rpx;
  color: #666666;
  
  &.active {
    background-color: #E6F7FF;
    color: #1890FF;
  }
}

.date-picker {
  flex: 1;
  font-size: 28rpx;
  color: #333333;
}

.save-btn {
  margin: 48rpx 32rpx;
  height: 88rpx;
  background-color: #4A90E2;
  border-radius: 44rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #FFFFFF;
  font-size: 32rpx;
  font-weight: bold;
}
</style>
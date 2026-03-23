<script>
export default {
  onLaunch: function() {
    console.log('App Launch')
    // 检查登录状态
    const token = uni.getStorageSync('token')
    if (!token) {
      // 未登录，跳转登录页
      // uni.reLaunch({ url: '/pages/login/login' })
    }
  },
  onShow: function() {
    console.log('App Show')
  },
  onHide: function() {
    console.log('App Hide')
  },
  globalData: {
    userInfo: null,
    baseUrl: 'http://localhost:3000/api'
  }
}
</script>

<style>
@import url('./static/styles/common.css');

page {
  background-color: #F8F9FA;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}
</style>
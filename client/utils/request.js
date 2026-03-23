// 统一请求方法
const baseUrl = 'http://localhost:3000/api'

export function apiRequest(url, method = 'GET', data = {}) {
  return new Promise((resolve, reject) => {
    const token = uni.getStorageSync('token')
    
    uni.request({
      url: baseUrl + url,
      method,
      data,
      header: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
      },
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(res.data)
        } else if (res.statusCode === 401) {
          // 未登录，跳转登录
          uni.removeStorageSync('token')
          uni.showToast({
            title: '请先登录',
            icon: 'none'
          })
          // uni.reLaunch({ url: '/pages/login/login' })
          reject(new Error('未登录'))
        } else {
          uni.showToast({
            title: res.data.error || '请求失败',
            icon: 'none'
          })
          reject(new Error(res.data.error))
        }
      },
      fail: (err) => {
        uni.showToast({
          title: '网络请求失败',
          icon: 'none'
        })
        reject(err)
      }
    })
  })
}

// 格式化日期
export function formatDate(date, format = 'YYYY-MM-DD') {
  if (!date) return ''
  const d = new Date(date)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  
  return format.replace('YYYY', year).replace('MM', month).replace('DD', day)
}

// 计算年龄
export function calculateAge(birthDate) {
  if (!birthDate) return ''
  const today = new Date()
  const birth = new Date(birthDate)
  let age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--
  }
  
  return age > 0 ? `${age}岁` : '幼年'
}

// 性别格式化
export function formatGender(gender) {
  const map = { 'male': '公', 'female': '母', 'unknown': '未知' }
  return map[gender] || '未知'
}
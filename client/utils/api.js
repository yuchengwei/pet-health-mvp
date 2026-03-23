import { apiRequest } from '../utils/request.js'

// 用户相关API
export const authAPI = {
  sendCode(phone) {
    return apiRequest('/auth/send-code', 'POST', { phone })
  },
  login(phone, code) {
    return apiRequest('/auth/login', 'POST', { phone, code })
  },
  wxLogin(code, userInfo) {
    return apiRequest('/auth/wx-login', 'POST', { code, userInfo })
  }
}

export const userAPI = {
  getProfile() {
    return apiRequest('/user/profile', 'GET')
  },
  updateProfile(data) {
    return apiRequest('/user/profile', 'PUT', data)
  }
}

export const petAPI = {
  getPets() {
    return apiRequest('/pets', 'GET')
  },
  getPet(id) {
    return apiRequest(`/pets/${id}`, 'GET')
  },
  createPet(data) {
    return apiRequest('/pets', 'POST', data)
  },
  updatePet(id, data) {
    return apiRequest(`/pets/${id}`, 'PUT', data)
  },
  deletePet(id) {
    return apiRequest(`/pets/${id}`, 'DELETE')
  },
  getVaccineRecords(petId) {
    return apiRequest(`/pets/${petId}/vaccines`, 'GET')
  },
  addVaccineRecord(petId, data) {
    return apiRequest(`/pets/${petId}/vaccines`, 'POST', data)
  },
  getDewormRecords(petId) {
    return apiRequest(`/pets/${petId}/deworm`, 'GET')
  },
  addDewormRecord(petId, data) {
    return apiRequest(`/pets/${petId}/deworm`, 'POST', data)
  },
  getExamRecords(petId) {
    return apiRequest(`/pets/${petId}/exam`, 'GET')
  },
  addExamRecord(petId, data) {
    return apiRequest(`/pets/${petId}/exam`, 'POST', data)
  },
  getMedicalRecords(petId) {
    return apiRequest(`/pets/${petId}/medical`, 'GET')
  },
  addMedicalRecord(petId, data) {
    return apiRequest(`/pets/${petId}/medical`, 'POST', data)
  }
}

export const hospitalAPI = {
  getHospitals(params) {
    return apiRequest('/hospitals', 'GET', params)
  },
  getHospital(id) {
    return apiRequest(`/hospitals/${id}`, 'GET')
  },
  searchHospitals(keyword) {
    return apiRequest('/hospitals/search', 'GET', { keyword })
  },
  getNearbyHospitals(lat, lng) {
    return apiRequest('/hospitals/nearby', 'GET', { lat, lng })
  },
  getReviews(hospitalId) {
    return apiRequest(`/hospitals/${hospitalId}/reviews`, 'GET')
  },
  addReview(hospitalId, data) {
    return apiRequest(`/hospitals/${hospitalId}/reviews`, 'POST', data)
  },
  toggleFavorite(hospitalId) {
    return apiRequest(`/hospitals/${hospitalId}/favorite`, 'POST')
  }
}

export const postAPI = {
  getPosts(params) {
    return apiRequest('/posts', 'GET', params)
  },
  getPost(id) {
    return apiRequest(`/posts/${id}`, 'GET')
  },
  createPost(data) {
    return apiRequest('/posts', 'POST', data)
  },
  deletePost(id) {
    return apiRequest(`/posts/${id}`, 'DELETE')
  },
  likePost(id) {
    return apiRequest(`/posts/${id}/like`, 'POST')
  },
  unlikePost(id) {
    return apiRequest(`/posts/${id}/like`, 'DELETE')
  },
  commentPost(id, content) {
    return apiRequest(`/posts/${id}/comments`, 'POST', { content })
  },
  getComments(postId) {
    return apiRequest(`/posts/${postId}/comments`, 'GET')
  },
  favoritePost(id) {
    return apiRequest(`/posts/${id}/favorite`, 'POST')
  },
  unfavoritePost(id) {
    return apiRequest(`/posts/${id}/favorite`, 'DELETE')
  }
}

export const questionAPI = {
  getQuestions(params) {
    return apiRequest('/questions', 'GET', params)
  },
  getQuestion(id) {
    return apiRequest(`/questions/${id}`, 'GET')
  },
  createQuestion(data) {
    return apiRequest('/questions', 'POST', data)
  },
  deleteQuestion(id) {
    return apiRequest(`/questions/${id}`, 'DELETE')
  },
  createAnswer(questionId, content) {
    return apiRequest(`/questions/${questionId}/answers`, 'POST', { content })
  },
  getAnswers(questionId) {
    return apiRequest(`/questions/${questionId}/answers`, 'GET')
  },
  acceptAnswer(answerId) {
    return apiRequest(`/questions/answers/${answerId}/accept`, 'POST')
  },
  likeAnswer(answerId) {
    return apiRequest(`/questions/answers/${answerId}/like`, 'POST')
  }
}

export const reminderAPI = {
  getReminders() {
    return apiRequest('/reminders', 'GET')
  },
  updateReminder(id) {
    return apiRequest(`/reminders/${id}`, 'PUT', { is_handled: true })
  },
  updateSettings(data) {
    return apiRequest('/reminders/settings', 'PUT', data)
  }
}

export const notificationAPI = {
  getNotifications() {
    return apiRequest('/notifications', 'GET')
  },
  getUnreadCount() {
    return apiRequest('/notifications/unread', 'GET')
  },
  markRead(id) {
    return apiRequest(`/notifications/${id}/read`, 'PUT')
  },
  markAllRead() {
    return apiRequest('/notifications/read-all', 'PUT')
  }
}

export const consultationAPI = {
  startConsultation(data) {
    return apiRequest('/consultation/start', 'POST', data)
  },
  replyConsultation(id, content) {
    return apiRequest(`/consultation/${id}/reply`, 'POST', { content })
  },
  getConsultationHistory() {
    return apiRequest('/consultation/history', 'GET')
  },
  getConsultationDetail(id) {
    return apiRequest(`/consultation/${id}`, 'GET')
  }
}
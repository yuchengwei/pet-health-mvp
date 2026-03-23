// API 工具类 - MVP阶段使用模拟数据

import { 
  mockUser, 
  mockPets, 
  mockHospitals, 
  mockHospitalReviews,
  mockQuestions,
  mockAnswers,
  mockPosts,
  mockReminders 
} from './mockData'

// 延迟函数，模拟网络请求
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// 用户相关API
export const userApi = {
  // 获取当前用户信息
  getUserInfo: async () => {
    await delay(300)
    return { code: 0, data: mockUser }
  },
  
  // 更新用户信息
  updateUserInfo: async (data: any) => {
    await delay(300)
    return { code: 0, data: { ...mockUser, ...data } }
  }
}

// 宠物相关API
export const petApi = {
  // 获取宠物列表
  getPetList: async () => {
    await delay(300)
    return { code: 0, data: mockPets }
  },
  
  // 获取宠物详情
  getPetDetail: async (id: number) => {
    await delay(300)
    const pet = mockPets.find(p => p.id === id)
    return { code: 0, data: pet }
  },
  
  // 添加宠物
  addPet: async (data: any) => {
    await delay(300)
    const newPet = { id: Date.now(), ...data }
    return { code: 0, data: newPet }
  },
  
  // 更新宠物信息
  updatePet: async (id: number, data: any) => {
    await delay(300)
    return { code: 0, data: { id, ...data } }
  },
  
  // 添加疫苗记录
  addVaccination: async (petId: number, data: any) => {
    await delay(300)
    return { code: 0, data: { id: Date.now(), ...data } }
  },
  
  // 添加驱虫记录
  addDeworming: async (petId: number, data: any) => {
    await delay(300)
    return { code: 0, data: { id: Date.now(), ...data } }
  },
  
  // 添加体检记录
  addCheckup: async (petId: number, data: any) => {
    await delay(300)
    return { code: 0, data: { id: Date.now(), ...data } }
  },
  
  // 添加就医记录
  addMedicalRecord: async (petId: number, data: any) => {
    await delay(300)
    return { code: 0, data: { id: Date.now(), ...data } }
  }
}

// 医院相关API
export const hospitalApi = {
  // 获取医院列表
  getHospitalList: async (params?: { keyword?: string, tag?: string }) => {
    await delay(300)
    let list = [...mockHospitals]
    if (params?.keyword) {
      list = list.filter(h => h.name.includes(params.keyword!))
    }
    if (params?.tag) {
      list = list.filter(h => h.tags.includes(params.tag!))
    }
    return { code: 0, data: list }
  },
  
  // 获取医院详情
  getHospitalDetail: async (id: number) => {
    await delay(300)
    const hospital = mockHospitals.find(h => h.id === id)
    return { code: 0, data: hospital }
  },
  
  // 获取医院评论
  getHospitalReviews: async (hospitalId: number) => {
    await delay(300)
    const reviews = mockHospitalReviews.filter(r => r.hospitalId === hospitalId)
    return { code: 0, data: reviews }
  },
  
  // 提交评论
  addReview: async (data: any) => {
    await delay(300)
    return { code: 0, data: { id: Date.now(), ...data } }
  }
}

// 问答相关API
export const qaApi = {
  // 获取问题列表
  getQuestionList: async (params?: { category?: string, keyword?: string }) => {
    await delay(300)
    let list = [...mockQuestions]
    if (params?.category) {
      list = list.filter(q => q.category === params.category)
    }
    if (params?.keyword) {
      list = list.filter(q => q.title.includes(params.keyword!) || q.content.includes(params.keyword!))
    }
    return { code: 0, data: list }
  },
  
  // 获取问题详情
  getQuestionDetail: async (id: number) => {
    await delay(300)
    const question = mockQuestions.find(q => q.id === id)
    const answers = mockAnswers.filter(a => a.questionId === id)
    return { code: 0, data: { ...question, answers } }
  },
  
  // 提问
  askQuestion: async (data: any) => {
    await delay(300)
    return { code: 0, data: { id: Date.now(), ...data, createTime: new Date().toISOString() } }
  },
  
  // 回答
  answerQuestion: async (questionId: number, data: any) => {
    await delay(300)
    return { code: 0, data: { id: Date.now(), questionId, ...data } }
  },
  
  // 采纳回答
  adoptAnswer: async (answerId: number) => {
    await delay(300)
    return { code: 0, data: { success: true } }
  }
}

// 社区相关API
export const communityApi = {
  // 获取动态列表
  getPostList: async (params?: { type?: string }) => {
    await delay(300)
    return { code: 0, data: mockPosts }
  },
  
  // 发布动态
  createPost: async (data: any) => {
    await delay(300)
    return { code: 0, data: { id: Date.now(), ...data, createTime: new Date().toISOString() } }
  },
  
  // 点赞
  likePost: async (postId: number) => {
    await delay(200)
    return { code: 0, data: { success: true } }
  },
  
  // 收藏
  collectPost: async (postId: number) => {
    await delay(200)
    return { code: 0, data: { success: true } }
  },
  
  // 评论
  commentPost: async (postId: number, content: string) => {
    await delay(200)
    return { code: 0, data: { id: Date.now(), content, createTime: new Date().toISOString() } }
  }
}

// 健康提醒API
export const reminderApi = {
  // 获取提醒列表
  getReminderList: async () => {
    await delay(300)
    return { code: 0, data: mockReminders }
  },
  
  // 标记已完成
  markCompleted: async (id: number) => {
    await delay(200)
    return { code: 0, data: { success: true } }
  }
}

export default {
  userApi,
  petApi,
  hospitalApi,
  qaApi,
  communityApi,
  reminderApi
}
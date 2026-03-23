// 模拟数据 - MVP阶段使用

// 用户信息
export const mockUser = {
  id: 1,
  nickname: '宠物达人',
  avatar: 'https://picsum.photos/100/100?random=1',
  phone: '138****8888',
  petCount: 2,
  experience: '3年养宠经验',
  city: '上海'
}

// 宠物列表
export const mockPets = [
  {
    id: 1,
    name: '豆豆',
    species: 'dog',
    breed: '金毛',
    gender: 'male',
    birthDate: '2020-03-15',
    weight: 30,
    avatar: 'https://picsum.photos/200/200?random=10',
    color: '金色',
    chipNo: '123456789012345',
    vaccinations: [
      { id: 1, name: '狂犬疫苗', date: '2024-03-15', nextDate: '2025-03-15', hospital: '爱宠医院' },
      { id: 2, name: '犬瘟热疫苗', date: '2024-03-15', nextDate: '2025-03-15', hospital: '爱宠医院' }
    ],
    dewormings: [
      { id: 1, name: '体内驱虫', date: '2024-01-15', nextDate: '2024-04-15', medicine: '拜耳' }
    ],
    checkups: [
      { id: 1, date: '2024-02-01', hospital: '爱宠医院', result: '健康', doctor: '张医生' }
    ],
    medicalRecords: [
      { id: 1, date: '2023-08-20', hospital: '爱宠医院', diagnosis: '皮肤病', treatment: '药物治疗', doctor: '李医生' }
    ]
  },
  {
    id: 2,
    name: '咪咪',
    species: 'cat',
    breed: '英短',
    gender: 'female',
    birthDate: '2021-06-20',
    weight: 4.5,
    avatar: 'https://picsum.photos/200/200?random=11',
    color: '蓝灰色',
    chipNo: '123456789012346',
    vaccinations: [
      { id: 1, name: '狂犬疫苗', date: '2024-06-20', nextDate: '2025-06-20', hospital: '宠物之家' }
    ],
    dewormings: [],
    checkups: [],
    medicalRecords: []
  }
]

// 医院列表
export const mockHospitals = [
  {
    id: 1,
    name: '爱宠宠物医院',
    address: '上海市浦东新区世纪大道100号',
    phone: '021-12345678',
    rating: 4.8,
    reviewCount: 256,
    image: 'https://picsum.photos/400/300?random=20',
    tags: ['24小时', '专科', '美容'],
    distance: '1.2km',
    priceLevel: '中'
  },
  {
    id: 2,
    name: '宠物之家诊所',
    address: '上海市静安区南京西路200号',
    phone: '021-87654321',
    rating: 4.5,
    reviewCount: 189,
    image: 'https://picsum.photos/400/300?random=21',
    tags: ['猫专科', '疫苗'],
    distance: '2.5km',
    priceLevel: '低'
  },
  {
    id: 3,
    name: '萌宠宠物医院',
    address: '上海市徐汇区漕溪北路88号',
    phone: '021-11223344',
    rating: 4.9,
    reviewCount: 312,
    image: 'https://picsum.photos/400/300?random=22',
    tags: ['24小时', '手术', 'ICU'],
    distance: '3.8km',
    priceLevel: '高'
  }
]

// 医院评论
export const mockHospitalReviews = [
  {
    id: 1,
    hospitalId: 1,
    user: { id: 1, nickname: '小明', avatar: 'https://picsum.photos/50/50?random=30' },
    rating: 5,
    content: '医生非常专业，豆豆在这里做了手术，恢复得很好！',
    images: ['https://picsum.photos/200/200?random=40'],
    date: '2024-03-10',
    likes: 25,
    petName: '豆豆'
  },
  {
    id: 2,
    hospitalId: 1,
    user: { id: 2, nickname: '小红', avatar: 'https://picsum.photos/50/50?random=31' },
    rating: 4,
    content: '环境很好，护士也很细心，就是价格稍贵',
    images: [],
    date: '2024-03-08',
    likes: 12,
    petName: '咪咪'
  }
]

// 问答列表
export const mockQuestions = [
  {
    id: 1,
    title: '狗狗最近食欲不振怎么办？',
    content: '我家金毛最近两天不想吃东西，精神还行，需要去医院吗？',
    user: { id: 1, nickname: '宠物达人', avatar: 'https://picsum.photos/50/50?random=1' },
    category: '健康咨询',
    viewCount: 156,
    answerCount: 3,
    createTime: '2024-03-15 10:30',
    isResolved: false,
    tags: ['食欲不振', '狗狗']
  },
  {
    id: 2,
    title: '猫咪掉毛严重是正常的吗？',
    content: '英短掉毛季掉得很厉害，有什么办法缓解？',
    user: { id: 2, nickname: '喵星人', avatar: 'https://picsum.photos/50/50?random=2' },
    category: '护理咨询',
    viewCount: 234,
    answerCount: 5,
    createTime: '2024-03-14 15:20',
    isResolved: true,
    tags: ['掉毛', '猫咪']
  },
  {
    id: 3,
    title: '狗狗疫苗需要每年打吗？',
    content: '每年都需要打哪些疫苗？狂犬必须打吗？',
    user: { id: 3, nickname: '新手铲屎官', avatar: 'https://picsum.photos/50/50?random=3' },
    category: '疫苗咨询',
    viewCount: 189,
    answerCount: 4,
    createTime: '2024-03-13 09:15',
    isResolved: true,
    tags: ['疫苗', '狗狗']
  }
]

// 问答回答
export const mockAnswers = [
  {
    id: 1,
    questionId: 1,
    user: { id: 4, nickname: '张医生', avatar: 'https://picsum.photos/50/50?random=50', isExpert: true },
    content: '食欲不振可能是多种原因导致的，建议先观察24小时，如果持续不进食或伴有呕吐、腹泻等症状，建议及时就医。可以先试试给它吃些平时喜欢的食物。',
    likes: 15,
    isAdopted: false,
    createTime: '2024-03-15 11:00'
  },
  {
    id: 2,
    questionId: 1,
    user: { id: 5, nickname: '资深铲屎官', avatar: 'https://picsum.photos/50/50?random=51' },
    content: '可以先试试换换口味，比如湿粮或者加些肉汤。如果精神状态良好可以再观察一下。',
    likes: 8,
    isAdopted: false,
    createTime: '2024-03-15 12:30'
  }
]

// 社区动态
export const mockPosts = [
  {
    id: 1,
    user: { id: 1, nickname: '宠物达人', avatar: 'https://picsum.photos/50/50?random=1' },
    content: '豆豆今天去体检啦，各项指标都正常，医生说继续保持！',
    images: ['https://picsum.photos/300/300?random=60'],
    likes: 45,
    comments: 12,
    createTime: '2024-03-15 14:30',
    isLiked: false,
    isCollected: false,
    tags: ['体检', '金毛']
  },
  {
    id: 2,
    user: { id: 2, nickname: '喵星人', avatar: 'https://picsum.photos/50/50?random=2' },
    content: '咪咪第一次尝试吃生骨肉，兴奋得不行！',
    images: ['https://picsum.photos/300/300?random=61', 'https://picsum.photos/300/300?random=62'],
    likes: 78,
    comments: 23,
    createTime: '2024-03-14 18:20',
    isLiked: true,
    isCollected: false,
    tags: ['英短', '生骨肉']
  },
  {
    id: 3,
    user: { id: 3, nickname: '新手铲屎官', avatar: 'https://picsum.photos/50/50?random=3' },
    content: '求助！狗狗皮肤病有什么好的治疗方法吗？',
    images: [],
    likes: 15,
    comments: 8,
    createTime: '2024-03-13 10:00',
    isLiked: false,
    isCollected: true,
    tags: ['皮肤病', '求助']
  }
]

// 健康提醒
export const mockReminders = [
  {
    id: 1,
    petId: 1,
    petName: '豆豆',
    type: 'vaccination',
    title: '疫苗接种提醒',
    content: '狂犬疫苗将于2025-03-15到期，请提前预约',
    dueDate: '2025-03-15',
    isCompleted: false
  },
  {
    id: 2,
    petId: 1,
    petName: '豆豆',
    type: 'deworming',
    title: '驱虫提醒',
    content: '体内驱虫将于2024-04-15到期',
    dueDate: '2024-04-15',
    isCompleted: false
  },
  {
    id: 3,
    petId: 1,
    petName: '豆豆',
    type: 'checkup',
    title: '体检提醒',
    content: '建议进行年度体检',
    dueDate: '2024-06-01',
    isCompleted: false
  }
]
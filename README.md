# 宠物健康管理+社区 MVP

微信小程序项目 - 12周敏捷开发

## 项目概述

为宠物主人提供宠物档案管理、健康提醒、医院评价社区、健康问答、AI问诊等功能的综合平台。

## 项目结构

```
pet-health-mvp/
├── docs/                    # 项目文档
│   ├── 开发计划.md          # 详细开发计划
│   ├── prd/                 # PRD文档
│   │   ├── PRD-用户系统.md
│   │   ├── PRD-宠物档案.md
│   │   ├── PRD-健康提醒引擎.md
│   │   ├── PRD-医院评价社区.md
│   │   ├── PRD-社区互动.md
│   │   ├── PRD-健康问答.md
│   │   ├── PRD-医院地图.md
│   │   ├── PRD-消息通知.md
│   │   ├── PRD-内容审核.md
│   │   └── PRD-基础问诊.md
│   ├── ui/                  # UI设计规范
│   └── test/                # 测试文档
├── server/                  # 后端服务
│   ├── src/
│   │   ├── index.js         # 入口文件
│   │   ├── routes/          # 路由
│   │   ├── controllers/     # 控制器
│   │   ├── middleware/      # 中间件
│   │   └── services/        # 服务
│   └── database/
│       └── schema.sql       # 数据库Schema
├── pet-app/                 # 微信小程序前端 (uni-app)
│   ├── src/
│   │   ├── pages/           # 页面
│   │   │   ├── index/       # 首页
│   │   │   ├── community/   # 社区
│   │   │   ├── hospital/    # 医院
│   │   │   ├── qa/          # 问答
│   │   │   ├── profile/     # 个人中心
│   │   │   └── pet/         # 宠物模块
│   │   ├── static/          # 静态资源
│   │   ├── utils/           # 工具函数
│   │   └── styles/          # 样式
│   └── package.json
└── README.md
```

## 技术栈

- **前端**: uni-app (Vue 3 + TypeScript + SCSS)
- **后端**: Node.js + Express
- **数据库**: PostgreSQL + Redis
- **地图**: 腾讯地图SDK
- **部署**: GitHub Pages

## 功能模块

### 第一阶段 (W3-W5) - 基础功能
- ✅ 用户系统（手机号登录、微信登录）
- ✅ 宠物档案（CRUD、照片管理）
- ✅ 疫苗/驱虫记录
- ✅ 健康提醒引擎

### 第二阶段 (W6-W8) - 社区功能
- ✅ 医院评价社区
- ✅ 医院搜索/筛选
- ✅ 体检/就医记录
- ✅ 社区互动（点赞、评论、收藏）

### 第三阶段 (W9-W11) - 高级功能
- ✅ 健康问答
- ✅ 医院地图
- ✅ 消息通知
- ✅ 内容审核
- ✅ AI基础问诊

### 第四阶段 (W12) - 测试优化
- ⏳ 全量测试
- ⏳ 性能优化
- ⏳ 部署上线

## 开发团队

| 角色 | 职责 |
|------|------|
| 项目经理 | 整体协调、进度把控 |
| 产品经理 | 需求分析、PRD输出 |
| UI设计师 | 界面设计、交互设计 |
| 开发工程师 | 前后端开发 |
| 测试工程师 | 测试用例、缺陷跟踪 |

## 里程碑

| 周数 | 里程碑 |
|------|--------|
| W3 | 用户系统+宠物档案MVP完成 |
| W5 | 健康提醒功能上线 |
| W8 | 社区核心功能上线 |
| W11 | 全部功能开发完成 |
| W12 | 正式发布 |

## 快速启动

### 前端开发
```bash
cd pet-app
npm install
npm run dev:mp-weixin
```

### 后端开发
```bash
npm install
npm run dev
```

### 数据库
```bash
# 执行 schema.sql 创建数据库表
psql -U postgres -d pet_health -f server/database/schema.sql
```

## API接口概览

| 模块 | 路径 | 方法 | 说明 |
|------|------|------|------|
| 认证 | /api/auth/send-code | POST | 发送验证码 |
| 认证 | /api/auth/login | POST | 验证码登录 |
| 用户 | /api/user/profile | GET/PUT | 用户信息 |
| 宠物 | /api/pets | CRUD | 宠物管理 |
| 医院 | /api/hospitals | GET | 医院列表 |
| 医院 | /api/hospitals/:id/reviews | POST | 评价 |
| 社区 | /api/posts | CRUD | 故事 |
| 问答 | /api/questions | CRUD | 问答 |
| 提醒 | /api/reminders | CRUD | 健康提醒 |
| 问诊 | /api/consultation | POST | 问诊 |

## 设计规范

- 主色: #4A90D9 (信任蓝)
- 辅色: #7ED321 (健康绿)
- 强调色: #F5A623 (温暖橙)
- 背景: #F8F9FA (浅灰白)

## 许可证

MIT License
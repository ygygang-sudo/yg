# YG项目综合文档

## 项目概述

YG项目是一个基于Vue3 + FastAPI的前后端分离应用，提供完整的用户认证和管理功能。

### 项目特性

- 🚀 **现代化技术栈**: Vue3 + TypeScript + FastAPI
- 🔐 **完整认证系统**: JWT令牌认证，权限管理
- 📱 **响应式设计**: 适配桌面和移动端
- 🛠️ **模块化架构**: 前后端分离，功能模块化
- 📊 **状态管理**: Vuex/Pinia状态管理
- 🔧 **开发工具**: Vite构建，热重载开发

### 技术栈

#### 前端技术
- **框架**: Vue 3 + TypeScript
- **UI组件**: Arco Design Vue
- **路由**: Vue Router 4
- **状态管理**: Pinia
- **构建工具**: Vite
- **HTTP客户端**: Axios

#### 后端技术
- **框架**: FastAPI
- **数据库**: SQLite (开发) / PostgreSQL (生产)
- **ORM**: SQLAlchemy
- **认证**: JWT令牌
- **密码安全**: bcrypt

## 项目结构

### 整体项目结构

```
yg/
├── backend/                 # 后端服务
│   ├── config/             # 配置管理
│   ├── core/               # 核心功能模块
│   ├── crud/               # 数据库操作层
│   ├── database/           # 数据库配置
│   ├── middleware/         # 中间件
│   ├── models/             # 数据模型
│   ├── routers/            # API路由
│   ├── schemas/            # Pydantic模型
│   └── main.py             # 应用入口
├── frontend/               # 前端应用
│   ├── src/
│   │   ├── api/            # API接口
│   │   ├── components/     # 通用组件
│   │   ├── hooks/          # 自定义Hook
│   │   ├── mock/           # Mock数据
│   │   ├── router/         # 路由配置
│   │   ├── store/          # 状态管理
│   │   ├── utils/          # 工具函数
│   │   └── views/          # 页面组件
│   └── config/             # 构建配置
└── docs/                   # 项目文档
```

### 后端模块化结构

#### 1. 配置管理 (config/)
- **settings.py**: 应用配置管理
- **database.py**: 数据库配置

#### 2. 核心功能 (core/)
- **auth.py**: 认证相关功能
- **security.py**: 安全相关功能
- **response.py**: 统一响应格式

#### 3. 数据库操作 (crud/)
- **user.py**: 用户相关数据库操作
- **base.py**: 基础CRUD操作

#### 4. 数据模型 (models/)
- **user.py**: 用户数据模型
- **base.py**: 基础模型

#### 5. API路由 (routers/)
- **user.py**: 用户认证相关路由
- **users.py**: 用户管理相关路由

#### 6. 数据验证 (schemas/)
- **user.py**: 用户相关数据验证

### 前端模块化结构

#### 1. API接口层 (src/api/)
- **user.ts**: 用户相关API接口
- **interceptor.ts**: 请求拦截器

#### 2. 状态管理 (src/store/)
- **modules/user/**: 用户状态管理
- **index.ts**: 状态管理入口

#### 3. 路由配置 (src/router/)
- **index.ts**: 路由配置
- **guard/**: 路由守卫

#### 4. 工具函数 (src/utils/)
- **request.ts**: 统一请求工具

## 快速开始

### 环境要求
- Node.js 16+
- Python 3.8+
- SQLite 3

### 安装与运行

#### 1. 克隆项目
```bash
git clone <repository-url>
cd yg
```

#### 2. 后端设置
```bash
cd backend

# 创建虚拟环境
python -m venv venv
source venv/bin/activate  # Linux/Mac
# 或 venv\Scripts\activate  # Windows

# 安装依赖
pip install -r requirements.txt

# 启动后端服务
python main.py
```
后端服务将在 http://localhost:8000 启动

#### 3. 前端设置
```bash
cd frontend

# 安装依赖
npm install

# 启动前端开发服务器
npm run dev
```
前端服务将在 http://localhost:5173 启动

### 默认账户
- 用户名: `admin` 密码: `admin123` (管理员)
- 用户名: `demo` 密码: `demo123` (普通用户)
- 用户名: `test` 密码: `test123` (测试用户)
- 用户名: `root` 密码: `root123` (超级管理员)

## API接口文档

### 用户认证模块

#### 1. 用户登录
- **接口地址**: `POST /api/user/login`
- **请求格式**: `application/x-www-form-urlencoded`
- **请求参数**:
  ```
  username: string  // 用户名
  password: string  // 密码
  ```
- **响应格式**:
  ```json
  {
    "code": 20000,
    "msg": "登录成功",
    "data": {
      "token": "JWT令牌",
      "userInfo": {
        "name": "用户名",
        "avatar": "头像URL",
        "job": "职位",
        "organization": "组织",
        "location": "位置",
        "email": "用户邮箱",
        "introduction": "个人介绍",
        "personalWebsite": "个人网站",
        "jobName": "职位名称",
        "organizationName": "组织名称",
        "locationName": "位置名称",
        "phone": "电话号码",
        "registrationDate": "注册日期",
        "accountId": 1,
        "certification": 0,
        "role": "user"
      }
    }
  }
  ```

#### 2. 获取用户信息
- **接口地址**: `POST /api/user/info`
- **认证方式**: Bearer Token
- **响应格式**:
  ```json
  {
    "code": 20000,
    "msg": "获取成功",
    "data": {
      "name": "用户名",
      "avatar": "头像URL",
      "job": "职位",
      "organization": "组织",
      "location": "位置",
      "email": "用户邮箱",
      "introduction": "个人介绍",
      "personalWebsite": "个人网站",
      "jobName": "职位名称",
      "organizationName": "组织名称",
      "locationName": "位置名称",
      "phone": "电话号码",
      "registrationDate": "注册日期",
      "accountId": 1,
      "certification": 0,
      "role": "user"
    }
  }
  ```

#### 3. 用户登出
- **接口地址**: `POST /api/user/logout`
- **响应格式**:
  ```json
  {
    "message": "登出成功"
  }
  ```

#### 4. 用户注册
- **接口地址**: `POST /api/user/register`
- **请求格式**: `application/json`
- **请求参数**:
  ```json
  {
    "username": "用户名",
    "email": "邮箱",
    "password": "密码",
    "full_name": "全名"
  }
  ```

#### 5. 获取当前用户信息
- **接口地址**: `GET /api/user/me`
- **认证方式**: Bearer Token

#### 6. 更新用户个人信息
- **接口地址**: `PUT /api/user/profile`
- **认证方式**: Bearer Token
- **请求格式**: `application/json`
- **请求参数**: UserState 对象
- **响应格式**:
  ```json
  {
    "code": 20000,
    "msg": "更新成功",
    "data": {
      "name": "用户名",
      "avatar": "头像URL",
      "job": "职位",
      "organization": "组织",
      "location": "位置",
      "email": "用户邮箱",
      "introduction": "个人介绍",
      "personalWebsite": "个人网站",
      "jobName": "职位名称",
      "organizationName": "组织名称",
      "locationName": "位置名称",
      "phone": "电话号码",
      "registrationDate": "注册日期",
      "accountId": 1,
      "certification": 0,
      "role": "user"
    }
  }
  ```

### 用户管理模块

#### 1. 获取用户列表
- **接口地址**: `GET /api/users/`
- **认证方式**: Bearer Token

#### 2. 创建用户
- **接口地址**: `POST /api/users/`
- **认证方式**: Bearer Token

#### 3. 获取单个用户
- **接口地址**: `GET /api/users/{user_id}`
- **认证方式**: Bearer Token

## 前端API接口

### 接口配置

#### 基础配置
- **API基础路径**: `/api`
- **请求超时**: 30秒
- **请求拦截器**: `src/api/interceptor.ts`
- **响应拦截器**: `src/api/interceptor.ts`

### 前端API结构分析

#### 基础响应结构
所有API请求都使用统一的响应格式，定义在 `interceptor.ts` 中：

```typescript
export interface HttpResponse<T = unknown> {
  status: number;    // HTTP状态码
  msg: string;       // 响应消息
  code: number;      // 业务状态码（20000表示成功）
  data: T;           // 响应数据
}
```

**业务状态码说明**：
- `20000`: 成功
- `50008`: 非法token
- `50012`: 其他客户端登录
- `50014`: Token过期

### API接口分类汇总

#### 用户相关接口 (user.ts)

| 接口路径 | 请求方法 | 描述 | 请求参数 | 响应数据 |
|----------|----------|------|----------|----------|
| `/api/user/login` | POST | 用户登录 | `LoginData` | `LoginRes` |
| `/api/user/logout` | POST | 用户登出 | - | - |
| `/api/user/info` | POST | 获取用户信息 | - | `UserState` |

#### 仪表板接口 (dashboard.ts)

| 接口路径 | 请求方法 | 描述 | 请求参数 | 响应数据 |
|----------|----------|------|----------|----------|
| `/api/content-data` | GET | 查询内容数据 | - | `ContentDataRecord[]` |
| `/api/popular/list` | GET | 查询热门列表 | `{ type: string }` | `TableData[]` |

#### 表单接口 (form.ts)

| 接口路径 | 请求方法 | 描述 | 请求参数 | 响应数据 |
|----------|----------|------|----------|----------|
| `/api/channel-form/submit` | POST | 提交渠道表单 | `UnitChannelModel` | - |

#### 列表接口 (list.ts)

| 接口路径 | 请求方法 | 描述 | 请求参数 | 响应数据 |
|----------|----------|------|----------|----------|
| `/api/list/policy` | GET | 查询策略列表 | `PolicyParams` | `PolicyListRes` |
| `/api/list/quality-inspection` | GET | 查询质检列表 | - | - |
| `/api/list/the-service` | GET | 查询服务列表 | - | - |
| `/api/list/rules-preset` | GET | 查询规则预设列表 | - | - |

#### 消息接口 (message.ts)

| 接口路径 | 请求方法 | 描述 | 请求参数 | 响应数据 |
|----------|----------|------|----------|----------|
| `/api/message/list` | POST | 查询消息列表 | - | `MessageRecord[]` |
| `/api/message/read` | POST | 设置消息已读 | `MessageStatus` | `MessageRecord[]` |
| `/api/chat/list` | POST | 查询聊天记录 | - | `ChatRecord[]` |

#### 个人资料接口 (profile.ts)

| 接口路径 | 请求方法 | 描述 | 请求参数 | 响应数据 |
|----------|----------|------|----------|----------|
| `/api/profile/basic` | GET | 查询基础资料 | - | `ProfileBasicRes` |
| `/api/operation/log` | GET | 查询操作日志 | - | `operationLogRes` |

### 详细数据结构

#### 1. 仪表板相关数据结构

```typescript
// 内容数据记录
interface ContentDataRecord {
  x: string;  // 时间或分类
  y: number;  // 数值
}

// 热门记录
interface PopularRecord {
  key: number;
  clickNumber: string;
  title: string;
  increases: number;
}
```

#### 2. 表单相关数据结构

```typescript
// 渠道表单模型
interface UnitChannelModel {
  // 基础信息
  activityName: string;
  channelType: string;
  promotionTime: string[];
  promoteLink: string;
  
  // 渠道信息
  advertisingSource: string;
  advertisingMedia: string;
  keyword: string[];
  pushNotify: boolean;
  advertisingContent: string;
}
```

#### 3. 列表相关数据结构

```typescript
// 策略记录
interface PolicyRecord {
  id: string;
  number: number;
  name: string;
  contentType: 'img' | 'horizontalVideo' | 'verticalVideo';
  filterType: 'artificial' | 'rules';
  count: number;
  status: 'online' | 'offline';
  createdTime: string;
}

// 策略列表响应
interface PolicyListRes {
  list: PolicyRecord[];
  total: number;
}

// 策略查询参数
interface PolicyParams extends Partial<PolicyRecord> {
  current: number;    // 当前页码
  pageSize: number;   // 每页大小
}
```

#### 4. 消息相关数据结构

```typescript
// 消息记录
interface MessageRecord {
  id: number;
  type: string;
  title: string;
  subTitle: string;
  avatar?: string;
  content: string;
  time: string;
  status: 0 | 1;        // 0-未读, 1-已读
  messageType?: number;
}

// 聊天记录
interface ChatRecord {
  id: number;
  username: string;
  content: string;
  time: string;
  isCollect: boolean;
}

// 消息状态设置
interface MessageStatus {
  ids: number[];        // 消息ID列表
}
```

#### 5. 个人资料相关数据结构

```typescript
// 基础资料响应
interface ProfileBasicRes {
  status: number;
  video: {
    mode: string;
    acquisition: {
      resolution: string;
      frameRate: number;
    };
    encoding: {
      resolution: string;
      rate: {
        min: number;
        max: number;
        default: number;
      };
      frameRate: number;
      profile: string;
    };
  };
  audio: {
    mode: string;
    acquisition: {
      channels: number;
    };
    encoding: {
      channels: number;
      rate: number;
      profile: string;
    };
  };
}

// 操作日志响应
type operationLogRes = Array<{
  key: string;
  contentNumber: string;
  updateContent: string;
  status: number;
  updateTime: string;
}>;
```

### 接口调用示例

#### 用户登录
```typescript
import { login } from '@/api/user';

const loginData = {
  username: 'admin',
  password: 'password123'
};

const result = await login(loginData);
console.log(result.data.token); // 获取token
```

#### 查询策略列表
```typescript
import { queryPolicyList } from '@/api/list';

const params = {
  current: 1,
  pageSize: 10,
  status: 'online'
};

const result = await queryPolicyList(params);
console.log(result.data.list); // 策略列表
console.log(result.data.total); // 总记录数
```

#### 设置消息已读
```typescript
import { setMessageStatus } from '@/api/message';

const messageIds = [1, 2, 3];
await setMessageStatus({ ids: messageIds });
```

### 技术特点

1. **TypeScript支持**: 所有接口都有完整的类型定义
2. **统一响应格式**: 使用 `HttpResponse<T>` 包装所有响应
3. **模块化组织**: 按功能模块组织API文件
4. **错误处理**: 统一的错误拦截和用户提示
5. **认证管理**: 自动处理Token认证和过期

### 文件结构

```
src/api/
├── interceptor.ts     # 请求拦截器和基础响应类型
├── user.ts           # 用户相关接口
├── dashboard.ts      # 仪表板接口
├── form.ts          # 表单接口
├── list.ts          # 列表接口
├── message.ts       # 消息接口
├── profile.ts       # 个人资料接口
├── user-center.ts   # 用户中心接口
└── visualization.ts # 可视化接口
```

### 错误处理

所有API调用都通过统一的拦截器处理错误：
- 业务错误（code !== 20000）会显示错误消息
- Token过期会自动跳转到登录页面
- 网络错误会显示请求错误提示

### 认证机制

- 使用JWT Bearer Token认证
- Token通过Authorization头传递
- 自动处理Token过期和重新登录

## 用户数据结构

### 前端用户状态 (UserState)

```typescript
interface UserState {
  name?: string;              // 姓名 (优先显示全名，无全名则显示用户名)
  avatar?: string;            // 头像URL
  job?: string;               // 职位
  organization?: string;      // 组织
  location?: string;          // 位置
  email?: string;             // 邮箱
  introduction?: string;      // 个人介绍
  personalWebsite?: string;   // 个人网站
  jobName?: string;           // 职位名称
  organizationName?: string;  // 组织名称
  locationName?: string;      // 位置名称
  phone?: string;             // 电话号码
  registrationDate?: string;  // 注册日期 (ISO格式)
  accountId?: string;         // 账户ID
  certification?: number;     // 认证状态 (0-未认证, 1-已认证)
  role: RoleType;             // 角色类型
}

type RoleType = 'root' | 'admin' | 'user' | 'company';
```

### 后端用户模型 (User)

```python
class User(Base):
    __tablename__ = "users"
    
    # 基础字段
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(100), nullable=True)
    is_active = Column(Boolean, default=True)
    role = Column(String(20), default="user")
    
    # 扩展用户信息字段
    avatar = Column(String(500), nullable=True)  # 头像URL
    job = Column(String(100), nullable=True)  # 职位
    organization = Column(String(100), nullable=True)  # 组织
    location = Column(String(100), nullable=True)  # 位置
    introduction = Column(String(500), nullable=True)  # 个人介绍
    personal_website = Column(String(200), nullable=True)  # 个人网站
    job_name = Column(String(100), nullable=True)  # 职位名称
    organization_name = Column(String(100), nullable=True)  # 组织名称
    location_name = Column(String(100), nullable=True)  # 位置名称
    phone = Column(String(20), nullable=True)  # 电话号码
    certification = Column(Integer, default=0)  # 认证状态
    
    # 时间戳字段
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
```

### 后端Pydantic模式 (UserBase)

```python
class UserBase(BaseModel):
    username: str
    email: str
    full_name: Optional[str] = None
    is_active: bool = True
    role: str = "user"
    
    # 扩展字段
    avatar: Optional[str] = None
    job: Optional[str] = None
    organization: Optional[str] = None
    location: Optional[str] = None
    introduction: Optional[str] = None
    personal_website: Optional[str] = None
    job_name: Optional[str] = None
    organization_name: Optional[str] = None
    location_name: Optional[str] = None
    phone: Optional[str] = None
    certification: int = 0
```

## 前后端字段映射关系

| 前端字段 | 后端字段 | 数据类型 | 转换规则 |
|---------|---------|---------|---------|
| `name` | `full_name` 或 `username` | string | 优先使用 `full_name`，为空则使用 `username` |
| `avatar` | `avatar` | string | 直接映射 |
| `job` | `job` | string | 直接映射 |
| `organization` | `organization` | string | 直接映射 |
| `location` | `location` | string | 直接映射 |
| `email` | `email` | string | 直接映射 |
| `introduction` | `introduction` | string | 直接映射 |
| `personalWebsite` | `personal_website` | string | 直接映射 |
| `jobName` | `job_name` | string | 直接映射 |
| `organizationName` | `organization_name` | string | 直接映射 |
| `locationName` | `location_name` | string | 直接映射 |
| `phone` | `phone` | string | 直接映射 |
| `registrationDate` | `created_at` | string | ISO格式转换 |
| `accountId` | `id` | string/integer | 类型转换 |
| `certification` | `certification` | number/integer | 直接映射 |
| `role` | `role` | string | 直接映射 |

## 开发指南

### 后端开发

#### 添加新的API路由
1. 在 `routers/` 目录创建新的路由文件
2. 使用统一的响应格式 `core.response`
3. 在 `main.py` 中注册路由

#### 数据库操作
1. 在 `models/` 中定义数据模型
2. 在 `crud/` 中实现数据库操作
3. 在 `schemas/` 中定义数据验证

### 前端开发

#### 添加新的页面
1. 在 `src/views/` 创建页面组件
2. 在 `src/router/index.ts` 中添加路由
3. 使用统一的API请求工具 `src/utils/request.ts`

#### 状态管理
1. 在 `src/store/modules/` 中创建状态模块
2. 使用组合式API进行状态管理

## 部署

### 生产环境部署

#### 后端部署
```bash
# 使用Docker部署
cd backend
docker build -t yg-backend .
docker run -p 8000:8000 yg-backend
```

#### 前端部署
```bash
cd frontend
npm run build
# 将dist目录部署到静态服务器
```

### 环境变量配置

#### 后端环境变量
```bash
DATABASE_URL=postgresql://user:pass@localhost/yg
SECRET_KEY=your-secret-key
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

#### 前端环境变量
```bash
VITE_API_BASE_URL=https://api.yourdomain.com
VITE_APP_TITLE=YG应用
```

## 认证机制

### JWT令牌认证
- 使用Bearer Token认证方式
- 令牌通过Authorization头传递
- 令牌过期时间可配置

### 前端认证处理
- 自动在请求头中添加Authorization
- 令牌过期自动跳转到登录页
- 支持记住密码功能

## 错误处理

### 后端错误码
- `400`: 请求参数错误
- `401`: 未授权
- `404`: 资源不存在
- `500`: 服务器内部错误

### 前端错误处理
- 统一拦截器处理HTTP错误
- 业务错误通过Message组件提示
- 认证错误自动跳转登录页

## 数据库设计

### 用户表 (users)
```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username VARCHAR UNIQUE NOT NULL,
    email VARCHAR UNIQUE NOT NULL,
    hashed_password VARCHAR NOT NULL,
    full_name VARCHAR,
    is_active BOOLEAN DEFAULT TRUE,
    role VARCHAR DEFAULT 'user',
    avatar VARCHAR,
    job VARCHAR,
    organization VARCHAR,
    location VARCHAR,
    introduction VARCHAR,
    personal_website VARCHAR,
    job_name VARCHAR,
    organization_name VARCHAR,
    location_name VARCHAR,
    phone VARCHAR,
    certification INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME
);
```

## 开发环境配置

### 后端环境
- **端口**: 8000
- **数据库**: SQLite (app.db)
- **启动命令**: `cd backend && python main.py`

### 前端环境
- **端口**: 5173
- **启动命令**: `cd frontend && npm run dev`

## 代码规范

### 后端代码规范
- 使用PEP8代码风格
- 类型注解
- 模块化设计
- 错误处理统一

### 前端代码规范
- TypeScript严格模式
- Vue3组合式API
- 组件化开发
- 状态管理规范

## 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 联系方式

- 项目主页: [GitHub Repository]
- 问题反馈: [Issues]
- 邮箱: your-email@example.com

## 更新日志

### v1.0.0 (2024-01-01)
- 初始版本发布
- 用户认证系统
- 前后端分离架构
- 响应式UI设计

### v1.1.0 (当前版本)
- 完善用户数据结构
- 添加用户信息更新功能
- 优化前后端数据映射
- 数据库初始化脚本

---

**文档版本**: v1.1.0  
**最后更新**: 2024-01-01  
**维护者**: YG项目团队
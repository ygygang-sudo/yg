# 前端API接口文档

## 接口配置

### 基础配置
- **API基础路径**: `/api`
- **请求超时**: 30秒
- **请求拦截器**: `src/api/interceptor.ts`
- **响应拦截器**: `src/api/interceptor.ts`

## 用户认证模块

### 登录接口
- **接口文件**: `src/api/user.ts`
- **方法**: `login(data: LoginData)`
- **请求方式**: `POST`
- **请求路径**: `/api/user/login`
- **请求格式**: `application/x-www-form-urlencoded`

**请求参数**:
```typescript
interface LoginData {
  username: string;    // 用户名
  password: string;    // 密码
}
```

**响应格式**:
```typescript
interface LoginRes {
  token: string;       // JWT令牌
  userInfo: UserState; // 用户信息
}

interface UserState {
  name: string;
  avatar?: string;
  job?: string;
  organization?: string;
  location?: string;
  email: string;
  introduction?: string;
  personalWebsite?: string;
  jobName?: string;
  organizationName?: string;
  locationName?: string;
  phone?: string;
  registrationDate?: string;
  accountId: number;
  certification?: number;
  role: string;
}
```

### 登出接口
- **方法**: `logout()`
- **请求方式**: `POST`
- **请求路径**: `/api/user/logout`

### 获取用户信息接口
- **方法**: `getUserInfo()`
- **请求方式**: `POST`
- **请求路径**: `/api/user/info`
- **响应类型**: `UserState`

### 获取菜单列表接口
- **方法**: `getMenuList()`
- **请求方式**: `GET`
- **请求路径**: `/api/user/menu`

## 状态管理模块

### 用户状态管理
- **文件**: `src/store/modules/user/index.ts`
- **状态结构**:
```typescript
interface UserState {
  // 用户信息
  userInfo: Partial<UserInfo>;
  // 用户令牌
  token?: string;
  // 登录后的回调地址
  loginRedirect?: string;
  // 用户菜单权限
  roleInfo?: RoleInfo[];
  // 用户菜单列表
  menuList: Menu[];
}
```

### 主要方法
- `login(data: LoginData)`: 用户登录
- `logout()`: 用户登出
- `getUserInfo()`: 获取用户信息
- `resetToken()`: 重置令牌

## 路由配置

### 路由守卫
- **文件**: `src/router/guard/userLoginInfo.ts`
- **功能**: 检查用户登录状态，未登录时跳转到登录页

### 路由配置
- **文件**: `src/router/index.ts`
- **基础路由**:
  - `/`: 重定向到登录页
  - `/login`: 登录页
  - `/dashboard`: 仪表板
  - `/workplace`: 工作台

## 请求拦截器

### 请求拦截器配置
- **文件**: `src/api/interceptor.ts`
- **功能**:
  - 自动添加Authorization头
  - 处理请求超时
  - 统一错误处理

### 响应拦截器配置
- **功能**:
  - 统一响应格式处理
  - 错误状态码处理
  - 令牌过期自动跳转

**响应格式要求**:
```typescript
interface HttpResponse<T = unknown> {
  status: number;    // HTTP状态码
  msg: string;       // 消息
  code: number;      // 业务状态码
  data: T;           // 实际数据
}
```

**业务状态码处理**:
- `20000`: 成功
- `50008`: 非法令牌 → 跳转登录页
- `50012`: 其他客户端登录 → 跳转登录页
- `50014`: 令牌过期 → 跳转登录页

## 组件接口

### 登录组件
- **文件**: `src/views/login/components/login-form.vue`
- **方法**: `handleSubmit()`
- **功能**: 处理登录表单提交，调用用户状态管理的login方法

### 登录成功处理
```typescript
// 登录成功后跳转逻辑
const handleLoginSuccess = () => {
  const { redirect } = router.currentRoute.value.query;
  router.push((redirect as string) || '/workplace');
};
```

## Mock数据配置

### Mock配置位置
- **文件**: `src/mock/user.ts`
- **状态**: 已禁用（使用真实后端API）

### 原Mock接口
- `/api/user/login`: 模拟登录
- `/api/user/info`: 模拟用户信息
- `/api/user/logout`: 模拟登出
- `/api/user/menu`: 模拟菜单数据

## 开发环境配置

### 开发服务器
- **端口**: 5173
- **代理配置**: 通过Vite代理到后端API

### API代理配置
```javascript
// vite.config.ts
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:8000',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api/, '')
    }
  }
}
```

## 错误处理机制

### 网络错误处理
- 统一通过Message组件显示错误信息
- 自动重试机制（可配置）

### 业务错误处理
- 根据业务状态码进行相应处理
- 认证错误自动跳转登录页

### 全局错误捕获
- Vue全局错误处理
- 网络请求错误处理
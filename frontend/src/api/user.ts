import { post, get, put, del, patch } from '@/utils/request';
import type { RouteRecordNormalized } from 'vue-router';
import type { UserState } from '@/store/modules/user/types';
import type {
  UserInfo,
  UserStatus,
  LoginFormData,
  RegisterFormData,
  ChangePasswordFormData,
  UpdateProfileFormData,
  UserQueryParams,
  UserStats,
} from '@/types/user';
import type { ApiResponse, PaginationResponse } from '@/types/api';

/**
 * 登录响应数据
 */
export interface LoginResponse {
  token: string;
  userInfo: UserState;
  expiresAt: number;
}

/**
 * 用户登录接口
 *
 * 该函数负责处理用户登录请求，将用户凭据发送到后端API进行认证，
 * 并返回包含JWT令牌和用户信息的登录响应。
 *
 * @param data - 登录表单数据，包含用户名和密码
 * @param data.username - 用户名（必填）
 * @param data.password - 密码（必填）
 * @param data.rememberMe - 是否记住密码（可选）
 * @param data.captcha - 验证码（可选）
 *
 * @returns Promise<LoginResponse> - 登录响应数据，包含：
 *   - token: JWT访问令牌，用于后续API请求的认证
 *   - userInfo: 用户信息对象，包含用户的基本信息和角色
 *   - expiresAt: 令牌过期时间戳
 *
 * @example
 * ```typescript
 * // 使用示例
 * const loginData = {
 *   username: 'admin',
 *   password: 'admin123'
 * };
 *
 * try {
 *   const result = await login(loginData);
 *   console.log('登录成功:', result.token);
 * } catch (error) {
 *   console.error('登录失败:', error);
 * }
 * ```
 *
 * @throws {Error} 当登录失败时抛出错误，可能的原因包括：
 *   - 用户名或密码错误
 *   - 用户账户被禁用
 *   - 网络连接问题
 *   - 服务器内部错误
 *
 * @see LoginFormData - 登录表单数据类型定义
 * @see LoginResponse - 登录响应数据类型定义
 * @see UserState - 用户状态数据类型定义
 */
export function login(data: LoginFormData): Promise<LoginResponse> {
  // 创建URLSearchParams对象，用于构建x-www-form-urlencoded格式的请求体
  const formData = new URLSearchParams();

  // 添加用户名和密码到请求参数中
  formData.append('username', data.username);
  formData.append('password', data.password);

  // 发送POST请求到登录接口
  return post<LoginResponse>('/user/login', formData.toString(), {
    headers: {
      // 设置请求头为表单格式，后端API期望接收x-www-form-urlencoded格式的数据
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
}

/**
 * 用户登出
 */
export function logout(): Promise<void> {
  return post<void>('/user/logout').then(() => {
    // 登出后清除本地存储的token
    localStorage.removeItem('token');
  });
}

/**
 * 获取用户信息
 */
export function getUserInfo(): Promise<UserState> {
  return post<UserState>('/user/info');
}

/**
 * 获取菜单列表
 */
export function getMenuList(): Promise<RouteRecordNormalized[]> {
  return get<RouteRecordNormalized[]>('/user/menu');
}

/**
 * 获取用户列表
 */
export function getUserList(
  params?: UserQueryParams
): Promise<PaginationResponse<UserInfo>> {
  return get<PaginationResponse<UserInfo>>('/users', {
    params,
  });
}

/**
 * 用户注册
 */
export function register(data: RegisterFormData): Promise<void> {
  return post<void>('/user/register', data);
}

/**
 * 修改密码
 */
export function changePassword(data: ChangePasswordFormData): Promise<void> {
  return post<void>('/user/change-password', data);
}

/**
 * 更新用户信息
 */
export function updateProfile(data: UpdateProfileFormData): Promise<UserInfo> {
  return post<UserInfo>('/user/profile', data);
}

/**
 * 获取用户统计信息
 */
export function getUserStats(): Promise<UserStats> {
  return get<UserStats>('/user/stats');
}

/**
 * 创建用户
 */
export function createUser(
  data: Omit<UserInfo, 'id' | 'createdAt' | 'updatedAt'>
): Promise<UserInfo> {
  return post<UserInfo>('/users', data);
}

/**
 * 更新用户
 */
export function updateUser(
  id: number,
  data: Partial<UserInfo>
): Promise<UserInfo> {
  return put<UserInfo>(`/users/${id}`, data);
}

/**
 * 删除用户
 */
export function deleteUser(id: number): Promise<void> {
  return del<void>(`/users/${id}`);
}

/**
 * 重置用户密码
 */
export function resetUserPassword(id: number): Promise<void> {
  return post<void>(`/users/${id}/reset-password`);
}

/**
 * 切换用户状态
 */
export function toggleUserStatus(
  id: number,
  status: UserStatus
): Promise<void> {
  return patch<void>(`/users/${id}/status`, { status });
}
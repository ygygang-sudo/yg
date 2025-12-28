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
 * 用户登录
 */
export function login(data: LoginFormData): Promise<LoginResponse> {
  const formData = new URLSearchParams();
  formData.append('username', data.username);
  formData.append('password', data.password);

  return post<ApiResponse<LoginResponse>>('/user/login', formData.toString(), {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  }).then((res) => res.data);
}

/**
 * 用户登出
 */
export function logout(): Promise<void> {
  return post<ApiResponse<void>>('/user/logout').then(() => {
    // 登出后清除本地存储的token
    localStorage.removeItem('token');
  });
}

/**
 * 获取用户信息
 */
export function getUserInfo(): Promise<UserState> {
  return post<ApiResponse<UserState>>('/user/info').then((res) => res.data);
}

/**
 * 获取菜单列表
 */
export function getMenuList(): Promise<RouteRecordNormalized[]> {
  return get<ApiResponse<RouteRecordNormalized[]>>('/user/menu').then(
    (res) => res.data
  );
}

/**
 * 获取用户列表
 */
export function getUserList(
  params?: UserQueryParams
): Promise<PaginationResponse<UserInfo>> {
  return get<ApiResponse<PaginationResponse<UserInfo>>>('/users', {
    params,
  }).then((res) => res.data);
}

/**
 * 用户注册
 */
export function register(data: RegisterFormData): Promise<void> {
  return post<ApiResponse<void>>('/user/register', data).then(
    (res) => res.data
  );
}

/**
 * 修改密码
 */
export function changePassword(data: ChangePasswordFormData): Promise<void> {
  return post<ApiResponse<void>>('/user/change-password', data).then(
    (res) => res.data
  );
}

/**
 * 更新用户信息
 */
export function updateProfile(data: UpdateProfileFormData): Promise<UserInfo> {
  return post<ApiResponse<UserInfo>>('/user/profile', data).then(
    (res) => res.data
  );
}

/**
 * 获取用户统计信息
 */
export function getUserStats(): Promise<UserStats> {
  return get<ApiResponse<UserStats>>('/user/stats').then((res) => res.data);
}

/**
 * 创建用户
 */
export function createUser(
  data: Omit<UserInfo, 'id' | 'createdAt' | 'updatedAt'>
): Promise<UserInfo> {
  return post<ApiResponse<UserInfo>>('/users', data).then((res) => res.data);
}

/**
 * 更新用户
 */
export function updateUser(
  id: number,
  data: Partial<UserInfo>
): Promise<UserInfo> {
  return put<ApiResponse<UserInfo>>(`/users/${id}`, data).then(
    (res) => res.data
  );
}

/**
 * 删除用户
 */
export function deleteUser(id: number): Promise<void> {
  return del<ApiResponse<void>>(`/users/${id}`).then((res) => res.data);
}

/**
 * 重置用户密码
 */
export function resetUserPassword(id: number): Promise<void> {
  return post<ApiResponse<void>>(`/users/${id}/reset-password`).then(
    (res) => res.data
  );
}

/**
 * 切换用户状态
 */
export function toggleUserStatus(
  id: number,
  status: UserStatus
): Promise<void> {
  return patch<ApiResponse<void>>(`/users/${id}/status`, { status }).then(
    (res) => res.data
  );
}

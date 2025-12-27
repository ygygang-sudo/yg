import { post, get } from '@/utils/request';
import type { RouteRecordNormalized } from 'vue-router';
import { UserState } from '@/store/modules/user/types';

/**
 * 登录请求参数
 */
export interface LoginData {
  username: string;
  password: string;
}

/**
 * 登录响应数据
 */
export interface LoginRes {
  token: string;
  userInfo: UserState;
}

/**
 * 用户登录
 */
export function login(data: LoginData): Promise<LoginRes> {
  const formData = new URLSearchParams();
  formData.append('username', data.username);
  formData.append('password', data.password);

  return post<LoginRes>('/user/login', formData.toString(), {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
}

/**
 * 用户登出
 */
export function logout(): Promise<void> {
  return post<void>('/user/logout');
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
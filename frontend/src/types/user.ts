/**
 * 用户相关类型定义
 */

// 用户角色类型
export type UserRole = 'root' | 'admin' | 'user' | 'company';

// 用户状态类型
export type UserStatus = 'active' | 'inactive' | 'banned';

// 用户基本信息接口
export interface UserInfo {
  /** 用户ID */
  id: number;
  /** 用户名 */
  username: string;
  /** 邮箱 */
  email: string;
  /** 角色 */
  role: UserRole;
  /** 是否激活 */
  isActive: boolean;
  /** 创建时间 */
  createdAt: string;
  /** 更新时间 */
  updatedAt: string;
  /** 手机号 */
  phone?: string;
  /** 头像 */
  avatar?: string;
  /** 昵称 */
  nickname?: string;
  /** 状态 */
  status?: UserStatus;
  /** 最后登录时间 */
  lastLoginAt?: string;
  /** 最后登录IP */
  lastLoginIp?: string;
}

// 用户登录表单数据类型
export interface LoginFormData {
  username: string;
  password: string;
  rememberMe?: boolean;
  captcha?: string;
}

// 用户注册表单数据类型
export interface RegisterFormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone?: string;
  captcha?: string;
}

// 用户修改密码表单数据类型
export interface ChangePasswordFormData {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// 用户个人信息更新表单数据类型
export interface UpdateProfileFormData {
  nickname?: string;
  email?: string;
  phone?: string;
  avatar?: string;
}

// 用户查询参数接口
export interface UserQueryParams {
  page?: number;
  pageSize?: number;
  keyword?: string;
  role?: UserRole;
  status?: UserStatus;
  startDate?: string;
  endDate?: string;
}

// 用户统计信息接口
export interface UserStats {
  total: number;
  active: number;
  inactive: number;
  banned: number;
  todayLogin: number;
  weekLogin: number;
  monthLogin: number;
}

// 用户会话信息接口
export interface UserSession {
  id: number;
  username: string;
  role: UserRole;
  permissions: string[];
  token: string;
  expiresAt: number;
}
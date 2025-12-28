import { defineStore } from 'pinia';
import {
  login as userLogin,
  logout as userLogout,
  getUserInfo,
} from '@/api/user';
import type { LoginFormData } from '@/types/user';
import { setToken, clearToken } from '@/utils/auth';
import { removeRouteListener } from '@/utils/route-listener';
import type { UserState } from './types';
import useAppStore from '../app';

const useUserStore = defineStore('user', {
  state: (): UserState => ({
    name: undefined,
    avatar: undefined,
    job: undefined,
    organization: undefined,
    location: undefined,
    email: undefined,
    introduction: undefined,
    personalWebsite: undefined,
    jobName: undefined,
    organizationName: undefined,
    locationName: undefined,
    phone: undefined,
    registrationDate: undefined,
    accountId: undefined,
    certification: undefined,
    role: 'user',
  }),

  getters: {
    /**
     * 获取用户信息的副本
     * 使用展开运算符返回state的浅拷贝，避免直接修改原始状态
     * @param state - 当前用户状态
     * @returns 用户信息的浅拷贝对象
     */
    userInfo(state: UserState): UserState {
      return { ...state };
    },
  },

  actions: {
    /**
     * 切换用户角色
     * 在'user'和'admin'之间切换角色，主要用于演示权限控制功能
     * @returns Promise对象，解析为切换后的角色
     */
    switchRoles() {
      return new Promise((resolve) => {
        this.role = this.role === 'user' ? 'admin' : 'user';
        resolve(this.role);
      });
    },
    // Set user's information
    setInfo(partial: Partial<UserState>) {
      console.log('设置用户信息前:', this.$state);
      console.log('要设置的用户信息:', partial);
      // 确保角色字段被正确设置
      if (partial.role) {
        this.role = partial.role;
      }
      // 使用$patch更新其他字段
      const { role, ...otherFields } = partial;
      this.$patch(otherFields);
      console.log('设置用户信息后:', this.$state);
    },

    // Reset user's information
    resetInfo() {
      this.$reset();
    },

    // Get user's information
    async info() {
      const res = await getUserInfo();

      this.setInfo(res);
    },

    // Login
    async login(loginForm: LoginFormData) {
      try {
        const res = await userLogin(loginForm);
        console.log('登录API响应:', res);
        console.log('登录API响应中的用户信息:', res.userInfo);
        console.log('登录API响应中的用户角色:', res.userInfo?.role);
        setToken(res.token);
        console.log('设置token后，当前用户角色:', this.role);
        this.setInfo(res.userInfo);
        console.log('设置用户信息后，当前用户角色:', this.role);
        console.log('设置用户信息后，完整的用户状态:', this.$state);
        // 登录响应已经包含完整的用户信息，无需再次调用info()
      } catch (err) {
        console.error('登录过程中出错:', err);
        clearToken();
        // 重新抛出错误，确保登录表单能够捕获并显示错误信息
        throw err;
      }
    },
    logoutCallBack() {
      const appStore = useAppStore();
      this.resetInfo();
      clearToken();
      removeRouteListener();
      appStore.clearServerMenu();
    },
    // Logout
    async logout() {
      try {
        await userLogout();
      } finally {
        this.logoutCallBack();
      }
    },
  },
});

export default useUserStore;
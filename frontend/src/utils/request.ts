/**
 * 统一请求工具模块
 * 提供标准化的API请求方法，简化接口调用
 */

import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { Message } from '@arco-design/web-vue';

// 创建axios实例
const request = axios.create({
  baseURL: '/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    // 添加认证token
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
request.interceptors.response.use(
  (response: AxiosResponse) => {
    const { data } = response;
    
    // 检查业务状态码
    if (data.code === 20000) {
      return data.data;
    }
    
    // 处理错误状态码
    switch (data.code) {
      case 50008:
      case 50012:
      case 50014:
        // 令牌相关错误，跳转到登录页
        Message.error(data.msg || '登录状态已失效，请重新登录');
        localStorage.removeItem('token');
        window.location.href = '/login';
        break;
      default:
        Message.error(data.msg || '请求失败');
    }
    
    return Promise.reject(new Error(data.msg || '请求失败'));
  },
  (error) => {
    // 网络错误处理
    if (error.response) {
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          Message.error('未授权访问，请重新登录');
          localStorage.removeItem('token');
          window.location.href = '/login';
          break;
        case 403:
          Message.error('权限不足');
          break;
        case 404:
          Message.error('请求的资源不存在');
          break;
        case 500:
          Message.error('服务器内部错误');
          break;
        default:
          Message.error(data?.message || '请求失败');
      }
    } else if (error.request) {
      Message.error('网络连接失败，请检查网络设置');
    } else {
      Message.error('请求配置错误');
    }
    
    return Promise.reject(error);
  }
);

/**
 * GET请求
 */
export const get = <T = any>(url: string, config?: AxiosRequestConfig): Promise<T> => {
  return request.get(url, config);
};

/**
 * POST请求
 */
export const post = <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
  return request.post(url, data, config);
};

/**
 * PUT请求
 */
export const put = <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
  return request.put(url, data, config);
};

/**
 * DELETE请求
 */
export const del = <T = any>(url: string, config?: AxiosRequestConfig): Promise<T> => {
  return request.delete(url, config);
};

/**
 * PATCH请求
 */
export const patch = <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
  return request.patch(url, data, config);
};

export default request;
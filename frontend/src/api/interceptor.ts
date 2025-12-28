import axios from 'axios';
import type { AxiosRequestConfig, AxiosResponse } from 'axios';
import { Message, Modal } from '@arco-design/web-vue';
import { useUserStore } from '@/store';
import { getToken, clearToken } from '@/utils/auth';

export interface HttpResponse<T = unknown> {
  status: number;
  msg: string;
  code: number;
  data: T;
}

if (import.meta.env.VITE_API_BASE_URL) {
  axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;
}

axios.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    // let each request carry token
    // this example using the JWT token
    // Authorization is a custom headers key
    // please modify it according to the actual situation
    const token = getToken();
    if (token) {
      if (!config.headers) {
        config.headers = {};
      }
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // do something
    return Promise.reject(error);
  }
);
// add response interceptors
axios.interceptors.response.use(
  (response: AxiosResponse) => {
    const res = response.data;

    // 检查响应数据格式是否正确
    if (!res || typeof res !== 'object') {
      Message.error({
        content: '服务器返回数据格式错误',
        duration: 5 * 1000,
      });
      return Promise.reject(new Error('服务器返回数据格式错误'));
    }

    // 如果响应数据包含code字段，按业务状态码处理
    if (res.code !== undefined) {
      // if the custom code is not 20000, it is judged as an error.
      if (res.code !== 20000) {
        Message.error({
          content: res.msg || 'Error',
          duration: 5 * 1000,
        });
        // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
        if (
          [50008, 50012, 50014].includes(res.code) &&
          response.config.url !== '/api/user/info'
        ) {
          Modal.error({
            title: 'Confirm logout',
            content:
              'You have been logged out, you can cancel to stay on this page, or log in again',
            okText: 'Re-Login',
            async onOk() {
              const userStore = useUserStore();

              await userStore.logout();
              window.location.reload();
            },
          });
        }
        return Promise.reject(new Error(res.msg || 'Error'));
      }
      return res.data || res;
    }

    // 如果响应数据不包含code字段，直接返回数据
    return res;
  },
  (error) => {
    // 网络错误处理
    if (error.response) {
      const { status, data } = error.response;

      switch (status) {
        case 401:
          Message.error('未授权访问，请重新登录');
          clearToken();
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
/// <reference types="vite/client" />

// Vue组件声明
declare module '*.vue' {
  import { DefineComponent } from 'vue';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

// CSS模块声明
declare module '*.css' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare module '*.less' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare module '*.scss' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

// 图片资源声明
declare module '*.png' {
  const src: string;
  export default src;
}

declare module '*.jpg' {
  const src: string;
  export default src;
}

declare module '*.jpeg' {
  const src: string;
  export default src;
}

declare module '*.gif' {
  const src: string;
  export default src;
}

declare module '*.svg' {
  const src: string;
  export default src;
}

// JSON模块声明
declare module '*.json' {
  const value: any;
  export default value;
}

// 环境变量接口
interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_APP_TITLE: string;
  readonly VITE_APP_VERSION: string;
  readonly VITE_APP_MODE: 'development' | 'production' | 'test';
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// 全局类型声明
declare global {
  // 全局工具类型
  type Nullable<T> = T | null;
  type Recordable<T = any> = Record<string, T>;
  type Indexable<T = any> = {
    [key: string]: T;
  };
  type DeepPartial<T> = {
    [P in keyof T]?: DeepPartial<T[P]>;
  };
  
  // 通用响应类型
  interface ApiResponse<T = any> {
    code: number;
    msg: string;
    data: T;
  }
  
  // 分页响应类型
  interface PaginationResponse<T = any> {
    list: T[];
    total: number;
    page: number;
    pageSize: number;
  }
}
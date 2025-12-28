/**
 * API响应类型定义
 */

// 基础响应接口
export interface ApiResponse<T = any> {
  code: number;
  msg: string;
  data: T;
}

// 分页响应接口
export interface PaginationResponse<T = any> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

// 列表响应接口
export interface ListResponse<T = any> {
  list: T[];
  total: number;
}

// 业务状态码枚举
export enum ResponseCode {
  SUCCESS = 200,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
  SERVICE_UNAVAILABLE = 503,
}

// 通用查询参数接口
export interface QueryParams {
  page?: number;
  pageSize?: number;
  sortField?: string;
  sortOrder?: 'asc' | 'desc';
  keyword?: string;
  [key: string]: any;
}

// 文件上传响应接口
export interface UploadResponse {
  url: string;
  name: string;
  size: number;
  type: string;
}

// 通用操作结果接口
export interface OperationResult {
  success: boolean;
  message: string;
  data?: any;
}

// 错误响应接口
export interface ErrorResponse {
  code: number;
  message: string;
  details?: any;
  timestamp?: string;
}
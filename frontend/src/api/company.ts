import { get, post, put, del } from '@/utils/request';
import {
  CompanyState,
  CompanyStateCreateRequest,
  CompanyStateUpdateRequest,
  CompanyStateResponse,
  CompanyStateListResponse,
  CompanyStateQueryParams,
} from '@/types/company';

// 获取公司状态列表
export function getCompanyList(params?: CompanyStateQueryParams) {
  return get<CompanyStateListResponse>('/api/company/', { params });
}

// 获取所有公司状态
export const getCompanyStates = (params?: {
  skip?: number;
  limit?: number;
}) => {
  return get<CompanyStateListResponse>('/api/company/', { params });
};

// 根据ID获取公司状态
export const getCompanyStateById = (companyStateId: number) => {
  return get<CompanyStateResponse>(`/api/company/info/${companyStateId}`);
};

// 根据公司名称获取公司状态
export const getCompanyStateByName = (companyName: string) => {
  return get<CompanyStateResponse>(`/api/company/name/${companyName}`);
};

// 根据用户ID获取公司状态列表
export const getCompanyStatesByUserId = (userId: number) => {
  return get<CompanyStateResponse>(`/api/company/user-info/${userId}`);
};

// 创建公司状态
export const createCompanyState = (data: CompanyStateCreateRequest) => {
  return post<CompanyStateResponse>('/api/company/create', data);
};

// 更新公司状态
export const updateCompanyState = (
  companyStateId: number,
  data: CompanyStateUpdateRequest
) => {
  return put<CompanyStateResponse>(
    `/api/company/update/${companyStateId}`,
    data
  );
};

// 删除公司状态
export const deleteCompanyState = (companyStateId: number) => {
  return del(`/api/company/${companyStateId}`);
};

// 快速创建公司状态（简化版）
export const quickCreateCompanyState = (
  companyName: string,
  userId: number
) => {
  return createCompanyState({
    companyName,
    userId,
  });
};

// 更新公司物料信息
export const updateCompanyMaterialInfo = (
  companyStateId: number,
  materialInfo: any
) => {
  return updateCompanyState(companyStateId, { materialInfo });
};

// 更新公司银行信息
export const updateCompanyBankInfo = (
  companyStateId: number,
  bankInfo: { bankName?: string; bankAccount?: string }
) => {
  return updateCompanyState(companyStateId, bankInfo);
};

// 更新公司EPS账户信息
export const updateCompanyEPSInfo = (
  companyStateId: number,
  epsInfo: { epsAccount?: string; epsPassword?: string }
) => {
  return updateCompanyState(companyStateId, epsInfo);
};

// 获取用户关联的公司状态（包含用户信息）
export const getUserWithCompanyState = (userId: number) => {
  return get<CompanyStateResponse>(`/api/company/user-info/${userId}`);
};
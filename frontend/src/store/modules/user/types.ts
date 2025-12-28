export type RoleType = 'root' | 'admin' | 'user' | 'company';

// 物料信息接口
export interface MaterialInfo {
  materialName?: string; // 物料名称
  materialCode?: string; // 物料编码
  specification?: string; // 规格型号
  unit?: string; // 单位
  price?: number; // 价格
  supplier?: string; // 供应商
}

// 公司状态接口
export interface CompanyState {
  id?: number; // 公司状态ID
  companyName: string; // 公司名称
  companyCode?: string; // 公司编码
  materialInfo?: MaterialInfo; // 物料信息
  companyPhone?: string; // 公司电话
  warrantyYear?: number; // 质保年
  epsAccount?: string; // 企业用户账号
  epsPassword?: string; // 企业用户密码
  bankName?: string; // 开户银行
  bankAccount?: string; // 银行账号
  frameworkContractExpire?: string; // 框架合同到期时间 (ISO格式)
  userId?: number; // 关联用户ID
  createdAt?: string; // 创建时间
  updatedAt?: string; // 更新时间
}

export interface UserState {
  name?: string;
  avatar?: string;
  job?: string;
  organization?: string;
  location?: string;
  email?: string;
  introduction?: string;
  personalWebsite?: string;
  jobName?: string;
  organizationName?: string;
  locationName?: string;
  phone?: string;
  registrationDate?: string;
  accountId?: string;
  certification?: number;
  role: RoleType;
  companyState?: CompanyState; // 关联的公司状态
}

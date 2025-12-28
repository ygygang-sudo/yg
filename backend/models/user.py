from sqlalchemy import Column, Integer, String, DateTime, Boolean, ForeignKey, JSON
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from database.database import Base
from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class User(Base):
    """用户模型"""
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(100), nullable=True)
    is_active = Column(Boolean, default=True)
    role = Column(String(20), default="user")  # user, admin, root
    
    # 前端用户信息字段
    avatar = Column(String(500), nullable=True)  # 头像URL
    job = Column(String(100), nullable=True)  # 职位
    organization = Column(String(100), nullable=True)  # 组织
    location = Column(String(100), nullable=True)  # 位置
    introduction = Column(String(500), nullable=True)  # 个人介绍
    personal_website = Column(String(200), nullable=True)  # 个人网站
    job_name = Column(String(100), nullable=True)  # 职位名称
    organization_name = Column(String(100), nullable=True)  # 组织名称
    location_name = Column(String(100), nullable=True)  # 位置名称
    phone = Column(String(20), nullable=True)  # 电话号码
    certification = Column(Integer, default=0)  # 认证状态
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


# Pydantic模型
class UserBase(BaseModel):
    username: str
    email: str
    full_name: Optional[str] = None
    is_active: bool = True
    role: str = "user"


class UserCreate(UserBase):
    password: str


class UserUpdate(BaseModel):
    email: Optional[str] = None
    full_name: Optional[str] = None
    is_active: Optional[bool] = None
    role: Optional[str] = None


class UserResponse(UserBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True


class UserInDB(UserResponse):
    hashed_password: str


# 公司状态模型
class CompanyState(Base):
    """公司状态模型"""
    __tablename__ = "company_states"
    
    id = Column(Integer, primary_key=True, index=True)
    company_name = Column(String(100), unique=True, index=True, nullable=False)  # 公司名称
    company_code = Column(String(50), nullable=True)  # 公司编码
    company_phone = Column(String(20), nullable=True)  # 公司电话
    warranty_year = Column(Integer, nullable=True)  # 质保年
    eps_account = Column(String(100), nullable=True)  # 企业用户账号
    eps_password = Column(String(255), nullable=True)  # 企业用户密码
    bank_name = Column(String(100), nullable=True)  # 开户银行
    bank_account = Column(String(50), nullable=True)  # 银行账号
    framework_contract_expire = Column(DateTime, nullable=True)  # 框架合同到期时间
    material_info = Column(JSON, nullable=True)  # 物料信息
    
    # 与用户关联
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    user = relationship("User", back_populates="company_states")
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


# 在User模型中添加公司状态关联
User.company_states = relationship("CompanyState", back_populates="user", cascade="all, delete-orphan")


# 公司状态模型定义已移动到 schemas/company.py 文件中
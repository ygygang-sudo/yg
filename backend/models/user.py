from sqlalchemy import Column, Integer, String, DateTime, Boolean
from sqlalchemy.sql import func
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
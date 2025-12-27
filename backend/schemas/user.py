from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class UserBase(BaseModel):
    username: str
    email: str
    full_name: Optional[str] = None
    is_active: bool = True
    role: str = "user"
    
    # 前端用户信息字段
    avatar: Optional[str] = None
    job: Optional[str] = None
    organization: Optional[str] = None
    location: Optional[str] = None
    introduction: Optional[str] = None
    personal_website: Optional[str] = None
    job_name: Optional[str] = None
    organization_name: Optional[str] = None
    location_name: Optional[str] = None
    phone: Optional[str] = None
    certification: int = 0


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


class Token(BaseModel):
    access_token: str
    token_type: str


class LoginRequest(BaseModel):
    username: str
    password: str


class TokenData(BaseModel):
    username: Optional[str] = None
from fastapi import APIRouter, Depends, HTTPException, status, Response, Form
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from datetime import timedelta
from typing import Any

from database.database import get_db
from crud.user import authenticate_user, create_user, get_user_by_username, get_user_by_email
from schemas.user import UserCreate, UserResponse, Token, LoginRequest
from core.security import create_access_token, verify_token
from config.settings import settings

router = APIRouter(tags=["用户认证"])

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="user/login")


def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    """获取当前用户"""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="无效的认证凭据",
        headers={"WWW-Authenticate": "Bearer"},
    )
    payload = verify_token(token)
    if payload is None:
        raise credentials_exception
    username: str = payload.get("sub")
    if username is None:
        raise credentials_exception
    user = get_user_by_username(db, username=username)
    if user is None:
        raise credentials_exception
    return user


@router.post("/login")
def login_for_access_token(
    username: str = Form(...),
    password: str = Form(...),
    db: Session = Depends(get_db)
):
    """用户登录"""
    user = authenticate_user(db, username, password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="用户名或密码错误",
        )
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="用户已被禁用"
        )
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    
    # 创建响应数据，符合前端期望的格式
    response_data = {
        "token": access_token,
        "userInfo": {
            "name": user.full_name or user.username,
            "avatar": user.avatar,
            "job": user.job,
            "organization": user.organization,
            "location": user.location,
            "email": user.email,
            "introduction": user.introduction,
            "personalWebsite": user.personal_website,
            "jobName": user.job_name,
            "organizationName": user.organization_name,
            "locationName": user.location_name,
            "phone": user.phone,
            "registrationDate": user.created_at.isoformat() if user.created_at else None,
            "accountId": user.id,
            "certification": user.certification,
            "role": user.role
        }
    }
    
    # 包装成前端期望的格式
    frontend_response = {
        "code": 20000,  # 前端期望的成功代码
        "msg": "登录成功",
        "data": response_data
    }
    
    # 使用JSONResponse确保正确的JSON格式
    from fastapi.responses import JSONResponse
    return JSONResponse(content=frontend_response)


@router.post("/register", response_model=UserResponse)
def register(user: UserCreate, db: Session = Depends(get_db)):
    """用户注册"""
    # 检查用户名是否已存在
    db_user = get_user_by_username(db, username=user.username)
    if db_user:
        raise HTTPException(
            status_code=400,
            detail="用户名已存在"
        )
    # 检查邮箱是否已存在
    db_user = get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(
            status_code=400,
            detail="邮箱已存在"
        )
    return create_user(db=db, user=user)


@router.get("/me", response_model=UserResponse)
def read_users_me(current_user: UserResponse = Depends(get_current_user)):
    """获取当前用户信息"""
    return current_user


@router.post("/logout")
def logout(response: Response):
    """用户登出"""
    # 在实际应用中，这里可能需要处理令牌黑名单等逻辑
    # 目前简单返回成功消息
    return {"message": "登出成功"}


@router.post("/info")
def get_user_info(current_user: UserResponse = Depends(get_current_user)):
    """获取用户信息"""
    # 返回与前端期望格式匹配的用户信息
    response_data = {
        "name": current_user.full_name or current_user.username,
        "avatar": current_user.avatar,
        "job": current_user.job,
        "organization": current_user.organization,
        "location": current_user.location,
        "email": current_user.email,
        "introduction": current_user.introduction,
        "personalWebsite": current_user.personal_website,
        "jobName": current_user.job_name,
        "organizationName": current_user.organization_name,
        "locationName": current_user.location_name,
        "phone": current_user.phone,
        "registrationDate": current_user.created_at.isoformat() if current_user.created_at else None,
        "accountId": current_user.id,
        "certification": current_user.certification,
        "role": current_user.role
    }
    
    # 包装成前端期望的格式
    frontend_response = {
        "code": 20000,  # 前端期望的成功代码
        "msg": "获取成功",
        "data": response_data
    }
    
    # 使用JSONResponse确保正确的JSON格式
    from fastapi.responses import JSONResponse
    return JSONResponse(content=frontend_response)


@router.put("/profile")
def update_user_profile(
    profile_data: dict,
    current_user: UserResponse = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """更新用户个人信息"""
    from crud.user import update_user
    
    # 构建更新数据
    update_data = {}
    
    # 映射前端字段到后端字段
    field_mapping = {
        "name": "full_name",
        "avatar": "avatar",
        "job": "job",
        "organization": "organization",
        "location": "location",
        "introduction": "introduction",
        "personalWebsite": "personal_website",
        "jobName": "job_name",
        "organizationName": "organization_name",
        "locationName": "location_name",
        "phone": "phone",
        "certification": "certification"
    }
    
    for frontend_field, backend_field in field_mapping.items():
        if frontend_field in profile_data:
            update_data[backend_field] = profile_data[frontend_field]
    
    # 更新用户信息
    updated_user = update_user(db, current_user.id, update_data)
    
    if not updated_user:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="更新用户信息失败"
        )
    
    # 返回更新后的用户信息
    response_data = {
        "name": updated_user.full_name or updated_user.username,
        "avatar": updated_user.avatar,
        "job": updated_user.job,
        "organization": updated_user.organization,
        "location": updated_user.location,
        "email": updated_user.email,
        "introduction": updated_user.introduction,
        "personalWebsite": updated_user.personal_website,
        "jobName": updated_user.job_name,
        "organizationName": updated_user.organization_name,
        "locationName": updated_user.location_name,
        "phone": updated_user.phone,
        "registrationDate": updated_user.created_at.isoformat() if updated_user.created_at else None,
        "accountId": updated_user.id,
        "certification": updated_user.certification,
        "role": updated_user.role
    }
    
    frontend_response = {
        "code": 20000,
        "msg": "更新成功",
        "data": response_data
    }
    
    return JSONResponse(content=frontend_response)
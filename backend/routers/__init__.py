"""
API v1 路由注册
"""

from fastapi import APIRouter

from . import user, users, company


api_router = APIRouter()

# 注册用户认证路由
api_router.include_router(user.router, prefix="/user", tags=["用户认证"])

# 注册用户管理路由
api_router.include_router(users.router, prefix="/users", tags=["用户管理"])

# 注册公司状态路由
api_router.include_router(company.router, prefix="/company", tags=["公司状态"])
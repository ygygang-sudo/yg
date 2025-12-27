from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
from config.settings import settings


def add_cors_middleware(app: FastAPI):
    """添加CORS中间件"""
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.ALLOWED_ORIGINS,
        allow_credentials=True,
        allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
        allow_headers=["*"],
        expose_headers=["*"],
    )
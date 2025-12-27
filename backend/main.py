from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager

from database.database import create_tables
from routers import api_router
from middleware.cors import add_cors_middleware
from config.settings import settings


@asynccontextmanager
async def lifespan(app: FastAPI):
    """应用生命周期管理"""
    # 启动时创建数据库表
    create_tables()
    print("数据库表创建完成")
    yield
    # 关闭时清理资源
    print("应用正在关闭...")


# 创建FastAPI应用
app = FastAPI(
    title="YG Backend API",
    description="YG项目后端API接口",
    version="1.0.0",
    lifespan=lifespan
)

# 添加CORS中间件
add_cors_middleware(app)

# 注册API路由
app.include_router(api_router, prefix="/api")


@app.get("/")
def read_root():
    """根路径"""
    return {
        "message": "YG Backend API",
        "version": "1.0.0",
        "docs": "/docs"
    }


@app.get("/health")
def health_check():
    """健康检查"""
    return {"status": "healthy"}


# 全局异常处理
@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail}
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.DEBUG
    )
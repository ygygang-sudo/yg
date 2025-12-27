# YG Backend API

基于FastAPI的后端API服务，使用SQLite数据库和Python 3.13。

## 项目结构

```
backend/
├── config/                 # 配置管理
│   ├── __init__.py
│   └── settings.py        # 应用配置
├── core/                  # 核心功能
│   ├── __init__.py
│   └── security.py        # 安全认证
├── crud/                  # CRUD操作
│   ├── __init__.py
│   └── user.py           # 用户CRUD
├── database/              # 数据库管理
│   ├── __init__.py
│   └── database.py       # 数据库连接
├── middleware/            # 中间件
│   ├── __init__.py
│   └── cors.py           # CORS中间件
├── models/               # 数据模型
│   ├── __init__.py
│   └── user.py          # 用户模型
├── routers/              # 路由管理
│   ├── __init__.py
│   ├── auth.py          # 认证路由
│   └── users.py         # 用户管理路由
├── schemas/              # Pydantic模式
│   ├── __init__.py
│   └── user.py          # 用户模式
├── .env                  # 环境变量
├── requirements.txt      # 依赖包
├── main.py              # 主应用
├── run.py               # 启动脚本
└── README.md            # 项目说明
```

## 功能特性

- ✅ 路由管理（模块化路由组织）
- ✅ 数据库管理（SQLAlchemy + SQLite）
- ✅ 配置管理（Pydantic Settings + .env）
- ✅ 数据模型（SQLAlchemy ORM）
- ✅ CRUD操作（完整的增删改查）
- ✅ 中间件（CORS支持）
- ✅ JWT认证（用户登录/注册）
- ✅ 权限控制（基于角色的访问控制）
- ✅ 自动API文档（Swagger UI）

## 安装依赖

```bash
pip install -r requirements.txt
```

## 启动应用

### 方式一：使用uvicorn直接启动
```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

### 方式二：使用启动脚本
```bash
python run.py
```

## API文档

启动后访问以下地址查看API文档：
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## 主要API接口

### 认证接口
- `POST /auth/login` - 用户登录
- `POST /auth/register` - 用户注册
- `GET /auth/me` - 获取当前用户信息

### 用户管理接口
- `GET /users/` - 获取用户列表（需要管理员权限）
- `POST /users/` - 创建新用户（需要管理员权限）
- `GET /users/{user_id}` - 获取用户详情
- `PUT /users/{user_id}` - 更新用户信息
- `DELETE /users/{user_id}` - 删除用户（需要管理员权限）

## 数据库

项目使用SQLite数据库，数据库文件位于项目根目录下的`app.db`。

首次启动时会自动创建所有必要的表结构。

## 配置说明

### 环境变量 (.env)

```env
# 数据库配置
DATABASE_URL=sqlite:///./app.db

# JWT配置
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# 应用配置
DEBUG=True
ALLOWED_HOSTS=["http://localhost:3000", "http://127.0.0.1:3000"]
```

### 开发说明

1. **添加新模型**：在`models/`目录下创建新的模型文件
2. **添加CRUD操作**：在`crud/`目录下创建对应的CRUD文件
3. **添加路由**：在`routers/`目录下创建新的路由文件
4. **添加模式**：在`schemas/`目录下创建对应的Pydantic模式

## 技术栈

- **框架**: FastAPI
- **数据库**: SQLite + SQLAlchemy
- **认证**: JWT + OAuth2
- **密码加密**: bcrypt
- **配置管理**: Pydantic Settings
- **API文档**: Swagger UI / ReDoc

## 开发环境

- Python 3.13+
- FastAPI 0.104+
- SQLAlchemy 2.0+
- 其他依赖详见requirements.txt
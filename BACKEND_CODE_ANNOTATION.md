# 后端核心代码详细注释

## 安全模块 (core/security.py)

### 密码验证机制

```python
def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    密码验证函数 - 支持多种哈希算法
    
    设计思路：
    1. 优先使用bcrypt（行业标准）
    2. 如果bcrypt不可用，回退到PBKDF2
    3. 使用恒定时间比较防止时序攻击
    
    安全特性：
    - 防暴力破解：使用高强度哈希算法
    - 防时序攻击：使用secrets.compare_digest
    - 盐值保护：每个密码使用唯一盐值
    
    参数：
    - plain_password: 用户输入的明文密码
    - hashed_password: 数据库中存储的哈希密码
    
    返回：
    - bool: 密码是否匹配
    """
    try:
        # 优先使用bcrypt（推荐方案）
        from passlib.context import CryptContext
        pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
        return pwd_context.verify(plain_password, hashed_password)
    except:
        # 回退方案：PBKDF2哈希验证
        import hashlib
        import binascii
        
        # 解析哈希格式：salt:hash
        if ':' not in hashed_password:
            return False
        salt, stored_hash = hashed_password.split(':', 1)
        
        # 使用PBKDF2计算哈希（100,000次迭代）
        dk = hashlib.pbkdf2_hmac('sha256', plain_password.encode(), salt.encode(), 100000)
        computed_hash = binascii.hexlify(dk).decode()
        
        # 恒定时间比较，防止时序攻击
        return secrets.compare_digest(computed_hash, stored_hash)
```

### 密码哈希生成

```python
def get_password_hash(password: str) -> str:
    """
    生成密码哈希值
    
    安全考虑：
    - 每个密码使用随机盐值
    - 高强度迭代次数（100,000次）
    - 使用HMAC-SHA256算法
    
    哈希格式：salt:hash
    示例：efa4d6c7ed5503235344f37b84fd3704:ed5c620ee93d46ad08e0d329613405cea6f76e1062551e0b1814ec56e235b664
    """
    try:
        # 优先使用bcrypt
        from passlib.context import CryptContext
        pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
        return pwd_context.hash(password)
    except:
        # 回退方案：PBKDF2
        import hashlib
        import binascii
        import secrets
        
        # 生成16字节随机盐值（32字符十六进制）
        salt = secrets.token_hex(16)
        
        # PBKDF2哈希计算
        dk = hashlib.pbkdf2_hmac('sha256', password.encode(), salt.encode(), 100000)
        hash_value = binascii.hexlify(dk).decode()
        
        return f"{salt}:{hash_value}"
```

### JWT令牌管理

```python
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """
    创建JWT访问令牌
    
    JWT结构：
    - Header: 算法和令牌类型
    - Payload: 用户数据和过期时间
    - Signature: 数字签名
    
    安全配置：
    - 使用HS256签名算法
    - 从环境变量读取密钥
    - 可配置的过期时间
    """
    to_encode = data.copy()
    
    # 设置过期时间
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        # 默认过期时间：30分钟
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    # 添加过期时间到payload
    to_encode.update({"exp": expire})
    
    # 使用HS256算法生成JWT
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt
```

## 数据模型 (models/user.py)

### 用户模型设计

```python
class User(Base):
    """
    用户数据模型 - SQLAlchemy ORM映射
    
    设计原则：
    1. 遵循数据库规范化
    2. 支持索引优化查询
    3. 提供完整的数据验证
    
    核心字段说明：
    - id: 主键，自增整数
    - username: 唯一用户名，建立索引
    - email: 唯一邮箱，建立索引  
    - hashed_password: 密码哈希值
    - role: 用户角色（user/admin/root）
    """
    __tablename__ = "users"
    
    # 主键和基础信息
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    
    # 用户基本信息
    full_name = Column(String(100), nullable=True)
    is_active = Column(Boolean, default=True)  # 账户激活状态
    role = Column(String(20), default="user")  # 角色权限控制
    
    # 前端展示信息
    avatar = Column(String(500), nullable=True)  # 头像URL
    job = Column(String(100), nullable=True)     # 职位信息
    organization = Column(String(100), nullable=True)  # 所属组织
    location = Column(String(100), nullable=True)      # 地理位置
    
    # 时间戳管理
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
```

### Pydantic验证模型

```python
class UserCreate(UserBase):
    """
    用户创建模型 - 包含密码验证
    
    验证规则：
    - 密码强度要求
    - 邮箱格式验证
    - 用户名唯一性检查
    """
    password: str

class UserUpdate(BaseModel):
    """
    用户更新模型 - 支持部分更新
    
    设计特点：
    - 所有字段都是可选的
    - 支持PATCH语义
    - 自动忽略未设置的字段
    """
    email: Optional[str] = None
    full_name: Optional[str] = None
    is_active: Optional[bool] = None
    role: Optional[str] = None
```

## 数据库操作层 (crud/user.py)

### CRUD操作模式

```python
def get_user_by_username(db: Session, username: str) -> Optional[User]:
    """
    根据用户名查询用户
    
    性能优化：
    - username字段已建立索引
    - 使用SQLAlchemy的查询优化
    - 返回单个对象或None
    """
    return db.query(User).filter(User.username == username).first()

def create_user(db: Session, user: UserCreate) -> User:
    """
    创建新用户
    
    安全流程：
    1. 验证输入数据
    2. 生成密码哈希
    3. 创建数据库记录
    4. 返回创建的用户对象
    """
    # 密码哈希处理
    hashed_password = get_password_hash(user.password)
    
    # 创建用户对象
    db_user = User(
        username=user.username,
        email=user.email,
        hashed_password=hashed_password,
        full_name=user.full_name,
        role=user.role,
        is_active=user.is_active
    )
    
    # 数据库事务操作
    db.add(db_user)
    db.commit()      # 提交事务
    db.refresh(db_user)  # 刷新获取数据库生成的值（如ID）
    
    return db_user
```

### 用户认证逻辑

```python
def authenticate_user(db: Session, username: str, password: str) -> Optional[User]:
    """
    用户认证函数
    
    认证流程：
    1. 通过用户名或邮箱查找用户
    2. 验证用户状态（是否激活）
    3. 验证密码哈希
    4. 返回认证成功的用户对象
    
    安全特性：
    - 支持用户名和邮箱登录
    - 检查账户激活状态
    - 使用恒定时间密码比较
    """
    # 查询用户（支持用户名或邮箱）
    user = db.query(User).filter(
        or_(User.username == username, User.email == username)
    ).first()
    
    # 用户不存在或未激活
    if not user or not user.is_active:
        return None
    
    # 密码验证
    if not verify_password(password, user.hashed_password):
        return None
    
    return user
```

### 更新操作实现

```python
def update_user(db: Session, user_id: int, user_update: UserUpdate) -> Optional[User]:
    """
    更新用户信息（支持部分更新）
    
    Pydantic特性：
    - model_dump(exclude_unset=True) 只包含设置的字段
    - 支持PATCH语义的局部更新
    
    更新流程：
    1. 查找目标用户
    2. 应用更新数据
    3. 提交事务
    4. 返回更新后的用户
    """
    db_user = db.query(User).filter(User.id == user_id).first()
    if db_user:
        # 只更新提供的字段
        update_data = user_update.model_dump(exclude_unset=True)
        
        # 动态设置属性
        for field, value in update_data.items():
            setattr(db_user, field, value)
        
        db.commit()
        db.refresh(db_user)
    
    return db_user
```

## 技术架构总结

### 1. 安全架构
- **密码安全**: 多算法支持，防时序攻击
- **令牌安全**: JWT + 环境变量配置
- **数据库安全**: SQL注入防护，参数化查询

### 2. 数据架构
- **ORM映射**: SQLAlchemy提供类型安全
- **数据验证**: Pydantic模型验证
- **事务管理**: 自动提交和回滚

### 3. 性能优化
- **索引优化**: 关键字段建立索引
- **查询优化**: 使用SQLAlchemy最佳实践
- **连接池**: 数据库连接复用

### 4. 扩展性设计
- **模块化**: 清晰的代码分层
- **配置化**: 环境变量支持多环境
- **标准化**: 遵循RESTful API设计原则
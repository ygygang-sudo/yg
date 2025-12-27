from datetime import datetime, timedelta
from typing import Optional
import jwt
import hashlib
import secrets
from config.settings import settings


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """验证密码"""
    # 使用更安全的密码验证方式
    try:
        # 尝试使用bcrypt（如果可用）
        from passlib.context import CryptContext
        pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
        return pwd_context.verify(plain_password, hashed_password)
    except:
        # 如果bcrypt不可用，使用安全的替代方案
        # 使用PBKDF2进行密码哈希验证
        import hashlib
        import binascii
        
        # 解析哈希值（格式：salt:hash）
        if ':' not in hashed_password:
            return False
        salt, stored_hash = hashed_password.split(':', 1)
        
        # 计算PBKDF2哈希
        dk = hashlib.pbkdf2_hmac('sha256', plain_password.encode(), salt.encode(), 100000)
        computed_hash = binascii.hexlify(dk).decode()
        
        return secrets.compare_digest(computed_hash, stored_hash)


def get_password_hash(password: str) -> str:
    """获取密码哈希值"""
    # 使用更安全的密码哈希方式
    try:
        # 尝试使用bcrypt（如果可用）
        from passlib.context import CryptContext
        pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
        return pwd_context.hash(password)
    except:
        # 如果bcrypt不可用，使用安全的替代方案
        # 使用PBKDF2进行密码哈希
        import hashlib
        import binascii
        import secrets
        
        # 生成随机盐值
        salt = secrets.token_hex(16)
        
        # 计算PBKDF2哈希
        dk = hashlib.pbkdf2_hmac('sha256', password.encode(), salt.encode(), 100000)
        hash_value = binascii.hexlify(dk).decode()
        
        # 返回格式：salt:hash
        return f"{salt}:{hash_value}"


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """创建访问令牌"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt


def verify_token(token: str) -> Optional[dict]:
    """验证令牌"""
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        return payload
    except jwt.InvalidTokenError:
        return None
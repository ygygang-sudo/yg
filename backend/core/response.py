"""
统一响应格式模块
提供标准化的API响应格式，确保前后端数据格式一致
"""

from typing import Any, Dict, Optional
from fastapi.responses import Response
import json


class ResponseModel:
    """响应数据模型"""
    
    def __init__(self, code: int = 20000, msg: str = "成功", data: Any = None):
        self.code = code
        self.msg = msg
        self.data = data
    
    def to_dict(self) -> Dict[str, Any]:
        """转换为字典格式"""
        return {
            "code": self.code,
            "msg": self.msg,
            "data": self.data
        }
    
    def to_json_response(self) -> Response:
        """转换为JSON响应"""
        json_str = json.dumps(
            self.to_dict(), 
            ensure_ascii=False, 
            separators=(',', ':')
        )
        return Response(content=json_str, media_type="application/json")


def success_response(data: Any = None, msg: str = "成功") -> Response:
    """成功响应"""
    return ResponseModel(code=20000, msg=msg, data=data).to_json_response()


def error_response(code: int, msg: str, data: Any = None) -> Response:
    """错误响应"""
    return ResponseModel(code=code, msg=msg, data=data).to_json_response()


def validation_error_response(msg: str = "参数验证失败") -> Response:
    """参数验证错误响应"""
    return error_response(code=40000, msg=msg)


def unauthorized_error_response(msg: str = "未授权访问") -> Response:
    """未授权错误响应"""
    return error_response(code=50008, msg=msg)


def token_expired_error_response(msg: str = "令牌已过期") -> Response:
    """令牌过期错误响应"""
    return error_response(code=50014, msg=msg)


# 常用错误码定义
ERROR_CODES = {
    "SUCCESS": 20000,
    "VALIDATION_ERROR": 40000,
    "UNAUTHORIZED": 50008,
    "TOKEN_EXPIRED": 50014,
    "OTHER_CLIENT_LOGIN": 50012,
}
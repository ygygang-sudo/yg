from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from database.database import get_db
from crud.company import (
    get_company_state_by_id,
    get_company_state_by_name,
    get_company_states_by_user_id,
    create_company_state,
    update_company_state,
    delete_company_state
)
from schemas.company import CompanyStateCreate, CompanyStateUpdate, CompanyStateResponse
from core.response import success_response, error_response

router = APIRouter(prefix="/api/company", tags=["company"])


@router.get("/", response_model=List[CompanyStateResponse])
def get_company_states(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """获取所有公司状态"""
    company_states = db.query(CompanyState).offset(skip).limit(limit).all()
    return company_states


@router.get("/{company_state_id}", response_model=CompanyStateResponse)
def get_company_state(company_state_id: int, db: Session = Depends(get_db)):
    """根据ID获取公司状态"""
    company_state = get_company_state_by_id(db, company_state_id)
    if not company_state:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="公司状态不存在"
        )
    return company_state


@router.get("/name/{company_name}", response_model=CompanyStateResponse)
def get_company_state_by_company_name(company_name: str, db: Session = Depends(get_db)):
    """根据公司名称获取公司状态"""
    company_state = get_company_state_by_name(db, company_name)
    if not company_state:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="公司状态不存在"
        )
    return company_state


@router.get("/user/{user_id}", response_model=List[CompanyStateResponse])
def get_company_states_by_user(user_id: int, db: Session = Depends(get_db)):
    """根据用户ID获取公司状态列表"""
    company_states = get_company_states_by_user_id(db, user_id)
    return company_states


@router.post("/", response_model=CompanyStateResponse)
def create_new_company_state(
    company_state: CompanyStateCreate,
    db: Session = Depends(get_db)
):
    """创建公司状态"""
    # 检查公司名称是否已存在
    existing_company = get_company_state_by_name(db, company_state.company_name)
    if existing_company:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="公司名称已存在"
        )
    
    return create_company_state(db, company_state)


@router.put("/{company_state_id}", response_model=CompanyStateResponse)
def update_existing_company_state(
    company_state_id: int,
    company_state_update: CompanyStateUpdate,
    db: Session = Depends(get_db)
):
    """更新公司状态"""
    company_state = update_company_state(db, company_state_id, company_state_update)
    if not company_state:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="公司状态不存在"
        )
    return company_state


@router.delete("/{company_state_id}")
def delete_existing_company_state(company_state_id: int, db: Session = Depends(get_db)):
    """删除公司状态"""
    if not delete_company_state(db, company_state_id):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="公司状态不存在"
        )
    return {"message": "公司状态删除成功"}


# 统一响应格式的API端点
@router.post("/create", response_model=dict)
def create_company_state_with_response(
    company_state: CompanyStateCreate,
    db: Session = Depends(get_db)
):
    """创建公司状态（统一响应格式）"""
    try:
        # 检查公司名称是否已存在
        existing_company = get_company_state_by_name(db, company_state.company_name)
        if existing_company:
            return error_response(40001, "公司名称已存在")
        
        new_company_state = create_company_state(db, company_state)
        return success_response(new_company_state, "公司状态创建成功")
    except Exception as e:
        return error_response(50000, f"创建公司状态失败: {str(e)}")


@router.put("/update/{company_state_id}", response_model=dict)
def update_company_state_with_response(
    company_state_id: int,
    company_state_update: CompanyStateUpdate,
    db: Session = Depends(get_db)
):
    """更新公司状态（统一响应格式）"""
    try:
        company_state = update_company_state(db, company_state_id, company_state_update)
        if not company_state:
            return error_response(40400, "公司状态不存在")
        
        return success_response(company_state, "公司状态更新成功")
    except Exception as e:
        return error_response(50000, f"更新公司状态失败: {str(e)}")


@router.get("/info/{company_state_id}", response_model=dict)
def get_company_state_info(company_state_id: int, db: Session = Depends(get_db)):
    """获取公司状态信息（统一响应格式）"""
    try:
        company_state = get_company_state_by_id(db, company_state_id)
        if not company_state:
            return error_response(40400, "公司状态不存在")
        
        return success_response(company_state, "获取公司状态成功")
    except Exception as e:
        return error_response(50000, f"获取公司状态失败: {str(e)}")


@router.get("/user-info/{user_id}", response_model=dict)
def get_user_company_states(user_id: int, db: Session = Depends(get_db)):
    """获取用户关联的公司状态列表（统一响应格式）"""
    try:
        company_states = get_company_states_by_user_id(db, user_id)
        return success_response(company_states, "获取用户公司状态成功")
    except Exception as e:
        return error_response(50000, f"获取用户公司状态失败: {str(e)}")
from sqlalchemy.orm import Session
from models.user import CompanyState
from schemas.company import CompanyStateCreate, CompanyStateUpdate
from typing import List, Optional


def get_company_state_by_id(db: Session, company_state_id: int) -> Optional[CompanyState]:
    """根据ID获取公司状态"""
    return db.query(CompanyState).filter(CompanyState.id == company_state_id).first()


def get_company_state_by_name(db: Session, company_name: str) -> Optional[CompanyState]:
    """根据公司名称获取公司状态"""
    return db.query(CompanyState).filter(CompanyState.company_name == company_name).first()


def get_company_states_by_user_id(db: Session, user_id: int) -> List[CompanyState]:
    """根据用户ID获取公司状态列表"""
    return db.query(CompanyState).filter(CompanyState.user_id == user_id).all()


def create_company_state(db: Session, company_state: CompanyStateCreate) -> CompanyState:
    """创建公司状态"""
    db_company_state = CompanyState(
        company_name=company_state.company_name,
        company_code=company_state.company_code,
        company_phone=company_state.company_phone,
        warranty_year=company_state.warranty_year,
        eps_account=company_state.eps_account,
        eps_password=company_state.eps_password,
        bank_name=company_state.bank_name,
        bank_account=company_state.bank_account,
        framework_contract_expire=company_state.framework_contract_expire,
        material_info=company_state.material_info,
        user_id=company_state.user_id
    )
    db.add(db_company_state)
    db.commit()
    db.refresh(db_company_state)
    return db_company_state


def update_company_state(db: Session, company_state_id: int, company_state_update: CompanyStateUpdate) -> Optional[CompanyState]:
    """更新公司状态"""
    db_company_state = get_company_state_by_id(db, company_state_id)
    if db_company_state:
        update_data = company_state_update.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_company_state, field, value)
        db.commit()
        db.refresh(db_company_state)
    return db_company_state


def delete_company_state(db: Session, company_state_id: int) -> bool:
    """删除公司状态"""
    db_company_state = get_company_state_by_id(db, company_state_id)
    if db_company_state:
        db.delete(db_company_state)
        db.commit()
        return True
    return False
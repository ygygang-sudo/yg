from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class CompanyStateBase(BaseModel):
    company_name: str
    company_code: Optional[str] = None
    company_phone: Optional[str] = None
    warranty_year: Optional[int] = None
    eps_account: Optional[str] = None
    eps_password: Optional[str] = None
    bank_name: Optional[str] = None
    bank_account: Optional[str] = None
    framework_contract_expire: Optional[datetime] = None
    material_info: Optional[dict] = None


class CompanyStateCreate(CompanyStateBase):
    user_id: int


class CompanyStateUpdate(BaseModel):
    company_code: Optional[str] = None
    company_phone: Optional[str] = None
    warranty_year: Optional[int] = None
    eps_account: Optional[str] = None
    eps_password: Optional[str] = None
    bank_name: Optional[str] = None
    bank_account: Optional[str] = None
    framework_contract_expire: Optional[datetime] = None
    material_info: Optional[dict] = None


class CompanyStateResponse(CompanyStateBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True
from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime

class UserCreate(BaseModel):
    username: str = Field(..., min_length=3)
    email: EmailStr
    password: str = Field(..., min_length=6)

class UserLogin(BaseModel):
    username: str
    password: str

class ProjectCreate(BaseModel):
    name: str
    description: Optional[str] = None
    created_at: Optional[datetime] = None

class TaskCreate(BaseModel):
    title: str
    description: Optional[str] = None
    priority: int = 1
    project_id: int = None

class ResetPasswdRequest(BaseModel):
    email: EmailStr

class ResetPasswdConfirm(BaseModel):
    token: str
    new_passwd: str = Field(..., min_length=6)
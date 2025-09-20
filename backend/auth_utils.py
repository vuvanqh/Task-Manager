from passlib.context import CryptContext
from datetime import datetime, timedelta
from jose import jwt
import os

passwd_ctx = CryptContext(schemes=["bcrypt"], deprecated="auto")
SECRET_KEY = os.getenv("JWT_SECRET","wrong secret")
ALGO = "HS256"
ACCESS_EXPIRE_MINUTES = 60

def hash_passwd(passwd: str):
    return passwd_ctx.hash(passwd)

def verify_passwd(plain_passwd: str, hashed: str): #whats plain
    return passwd_ctx.verify(plain_passwd, hashed)

def create_access_token(subject: str, role: str, expires_minutes: int = ACCESS_EXPIRE_MINUTES) -> str:
    to_encode = {
        "sub": subject,
        "role": role,
        "exp": datetime.now() + timedelta(minutes = expires_minutes)
    }
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGO)

def decode_token(token: str) -> str:
    return jwt.decode(token, SECRET_KEY, algorithms=ALGO)

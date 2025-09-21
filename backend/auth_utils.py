from passlib.context import CryptContext
from datetime import datetime, timedelta, timezone
from jose import jwt, JWTError
import os

passwd_ctx = CryptContext(schemes=["bcrypt"], deprecated="auto")
SECRET_KEY = os.getenv("JWT_SECRET")
if not SECRET_KEY:
    raise RuntimeError("No JWT_SECRET env var set")
ALGO = "HS256"
ACCESS_EXPIRE_MINUTES = 60

def hash_passwd(passwd: str) -> str:
    return passwd_ctx.hash(passwd)

def verify_passwd(plain_passwd: str, hashed: str) -> bool:
    return passwd_ctx.verify(plain_passwd, hashed)

def create_access_token(subject: str, role: str, expires_minutes: int = ACCESS_EXPIRE_MINUTES) -> str:
    expire = datetime.now(timezone.utc) + timedelta(minutes=expires_minutes)
    to_encode = {
        "sub": subject,
        "role": role,
        "exp": int(expire.timestamp())
    }
    return jwt.encode(to_encode, SECRET_KEY, algorithm=[ALGO])

def decode_token(token: str) -> str:
    return jwt.decode(token, SECRET_KEY, algorithms=[ALGO])

import uuid, hashlib, crud_users, crud_tasks, auth_utils
from fastapi import FastAPI, Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError
from models import *
from datetime import datetime, timedelta
from db import get_con

app = FastAPI()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/token")

#helpers
def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = auth_utils.decode_token(token)
        username = payload.get("sub")
        role = payload.get("role")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid Token")
    
    user=crud_users.get_user_by_username(username)
    if not user: 
        raise HTTPException(status_code=401, detail="User not found")
    return user

def require_roles(*allowed): #is the nested funciton necessary here
    def role_dep(user = Depends(get_current_user)):
        if user["role"] not in allowed and user["role"]!="admin":
            raise HTTPException(status_code=403, detail="Unauthorized access")
        return user
    return role_dep


#auth
@app.post("/auth/token")
def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = crud_users.get_user_by_username(form_data.username)
    if not user or not auth_utils.verify_passwd(form_data.password, user["password_hash"]):
        raise HTTPException(status_code=400, detail="Invalid Credentials")
    token = auth_utils.create_access_token(subject=user["username"], role = user["role"])
    return {
        "access_token": token,
        "token_type": "bearer"
    }
@app.post("/auth/register")
def register(payload: UserCreate):
    crud_users.create_user(payload.username,payload.email,payload.password)
    return {"status": "ok"}

#proj + tasks
@app.post("/projects")
def create_project(payload: ProjectCreate, manager = Depends(require_roles("manager"))):
    crud_tasks.create_project(payload.name, manager["id"], payload.description)
    return {"status": "ok"}

@app.post("/tasks")
def create_task(payload: TaskCreate, manager = Depends(require_roles("manager"))):
    crud_tasks.create_task(payload.title, payload.project_id, payload.description)
    return {"status": "ok"}

@app.post("/tasks/{task_id}/assign")
def assign_task(task_id: int, user=Depends(get_current_user)):
    crud_tasks.assign_user_to_task(task_id, user["id"], state="requested")
    return {"status": "requested"}

@app.post("/tasks/{task_id}/complete")
def mark_complete(task_id: int, user=Depends(get_current_user,"manager")):
    task = crud_tasks.get_task(task_id)
    if not task: 
        raise HTTPException(status_code=404, detail="Task not found")
    if task["assigned_to"]!=user["id"]:
        raise HTTPException(status_code=403, detail="Task not yours")
    if task["status"] in ["completed","failed"]:
        raise HTTPException(status_code=400, detail=f"Task already {task['status']}")

    crud_tasks.update_task_status(task_id, "completed")
    return {"status": "completed"}

#passwd
@app.post("/auth/reset/request")
def reset_request(payload: ResetPasswdRequest):
    user = crud_users.get_user_by_email(payload.email)
    if not user: return {"status": "ok"}
    token = str(uuid.uuid4()) #what is this
    token_hash = hashlib.sha256(token.encode()).hexdigest()
    expires_at = datetime.now() + timedelta(hours = 1)
    con = get_con(); cur = con.cursor()
    cur.execute("insert into PasswordResets (user_id, token_hash, expires_at) values (?, ?, ?)",
                (user["id"], token_hash, expires_at))
    con.commit(); cur.close(); con.close()

@app.post("/auth/reset/confirm")
def reset_confirm(payload: ResetPasswdConfirm):
    token_hash = hashlib.sha256(payload.token.encode()).hexdigest()
    con = get_con(); cur = con.cursor()
    cur.execute("select user_id, expires_at from PasswordResets where token_hash=?",(token_hash,))
    row = cur.fetchone()
    if not row or row[1] < datetime.now():
        raise HTTPException(status_code=400, detail="Invaild or expired token")
    new_hash =  auth_utils.hash_passwd(payload.new_passwd)
    cur.execute("update Users set password_hash=? where id=?", (new_hash,row[0]))
    cur.execute("delete from PasswordResets where token_hash=?", (token_hash))
    con.commit(); cur.close(); con.close()
    return {"status": "password updated"}

#admin
@app.post("/admin/users/{user_id}/promote")
def promote_user(user_id: int, admin = Depends(require_roles("admin"))):
    user = crud_users.get_user_by_id(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if user["role"] in ["manager","admin"]:
        raise HTTPException(status_code=400, detail="User already manager or admin")
    crud_users.set_manager(user_id)
    return {"status": "ok"}
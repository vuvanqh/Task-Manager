import uuid, hashlib, crud_users, crud_tasks, auth_utils
from fastapi import FastAPI, Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError
from models import *
from datetime import datetime, timedelta, timezone
from db import get_con
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://51.21.202.23:5173"],
    allow_credentials=True, 
    allow_methods=["*"],
    allow_headers=["*"]
)
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/token")

#helpers
def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = auth_utils.decode_token(token)
        username = payload.get("sub")
        role = payload.get("role")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid Token")
    
    if not username:    
        raise HTTPException(status_code=401, detail="Invalid Token payload")
    user=crud_users.get_user_by_username(username)
    if not user: 
        raise HTTPException(status_code=401, detail="User not found")
    return user

def require_roles(*allowed): 
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
    if crud_users.get_user_by_username(payload.username) or crud_users.get_user_by_email(payload.email):
        raise HTTPException(status_code=400, detail="Username or email already registered")
    crud_users.create_user(payload.username,payload.email,payload.password)
    return {"status": "ok"}

#proj + tasks
@app.post("/projects")
def create_project(payload: ProjectCreate, manager = Depends(require_roles("manager"))):
    crud_tasks.create_project(payload.name, manager["id"], payload.description)
    return {"status": "ok"}

@app.put("/projects/{project_id}")
def edit_project(project_id: int, payload: ProjectCreate, manager = Depends(require_roles("manager"))):
    crud_tasks.edit_project(project_id, payload.name, payload.description)
    return {"status": "ok"}

@app.delete("/projects/{project_id}")
def delete_project(project_id: int, manager = Depends(require_roles("manager"))):
    crud_tasks.delete_project(project_id)
    return {"status": "ok"}

@app.post("/tasks")
def create_task(payload: TaskCreate, manager = Depends(require_roles("manager"))):
    crud_tasks.create_task(payload.title, payload.project_id, description = payload.description, priority=payload.priority)
    return {"status": "ok"}

@app.put("/tasks/{task_id}")
def edit_task(task_id: int, payload: TaskCreate, manager = Depends(require_roles("manager"))):
    crud_tasks.edit_task(task_id, title=payload.title, description=payload.description, priority=payload.priority, assigned_to=payload.assigned_to)
    return {"status": "ok"}

@app.delete("/tasks/{task_id}")
def delete_task(task_id: int, manager = Depends(require_roles("manager"))):
    crud_tasks.delete_task(task_id)
    return {"status": "ok"}

@app.post("/tasks/{task_id}/assign")
def assign_task(task_id: int, payload: TaskCreate):
    task = crud_tasks.get_task(task_id)
    if task["status"] in ["completed", "failed"]:
        raise HTTPException(status_code=400, detail=f"Task already {task["status"]}")
    
    crud_tasks.assign_to_task(task_id, payload.user_id, status="assigned")
    return {"status": "assigned"}

@app.post("/tasks/{task_id}/complete")
def mark_complete(task_id: int, user=Depends(get_current_user)):
    task = crud_tasks.get_task(task_id)
    if not task: 
        raise HTTPException(status_code=404, detail="Task not found")
    if task["assigned_to"]!=user["id"]:
        raise HTTPException(status_code=403, detail="Task not yours")
    if task["status"] in ["completed","failed"]:
        raise HTTPException(status_code=400, detail=f"Task already {task['status']}")

    crud_tasks.update_task_status(task_id, "completed")
    return {"status": "completed"}

import smtplib, dotenv, os
dotenv.load_dotenv()
#passwd
@app.post("/auth/reset/request")
def reset_request(payload: ResetPasswdRequest):
    sender = "q.vuvan05@gmail.com"
    user = crud_users.get_user_by_email(payload.email)
    if not user: return {"status": "ok"}
    token = str(uuid.uuid4()) 
    token_hash = hashlib.sha256(token.encode()).hexdigest()
    expires_at = datetime.now(timezone.utc) + timedelta(hours = 1)
    con = get_con(); cur = con.cursor()
    cur.execute("insert into PasswordResets (user_id, token_hash, expires_at) values (?, ?, ?)",
                (user["id"], token_hash, expires_at))
    con.commit(); cur.close(); con.close()
    message = f"""Subject: Password Reset Request\n\n
        Use the following token to reset your password. It is valid for 1 hour.
        Token: {token}
    """
    server = smtplib.SMTP("smtp.gmail.com",587)
    server.starttls()
    server.login(sender, os.getenv("MY_PASSWD"))
    server.sendmail(from_addr=sender, to_addrs=payload.email, msg=message)
    server.quit()
    return {"status": "ok"}

@app.post("/auth/reset/confirm")
def reset_confirm(payload: ResetPasswdConfirm):
    token_hash = hashlib.sha256(payload.token.encode()).hexdigest()
    con = get_con(); cur = con.cursor()
    cur.execute("select user_id, expires_at from PasswordResets where token_hash=?",(token_hash,))
    row = cur.fetchone()
    # if not row or row[1] < datetime.now(timezone.utc):
    #     raise HTTPException(status_code=400, detail="Invaild or expired token")
    new_hash =  auth_utils.hash_passwd(payload.new_passwd)
    cur.execute("update Users set password_hash=? where id=?", (new_hash,row[0]))
    cur.execute("delete from PasswordResets where token_hash=?", (token_hash,))
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


#listing
@app.get("/projects")
def list_projects(user=Depends(get_current_user)):
    con = get_con(); cur = con.cursor()
    cur.execute("select id, name, description, created_at, created_by from Projects")
    rows = cur.fetchall()
    cur.close(); con.close()
    return {"projects": [{
        "id": row[0],
        "name": row[1],
        "description": row[2],
        "created_at": row[3],
        "created_by": row[4]
    } for row in rows] } 

@app.get("/projects/{project_id}/tasks")
def list_tasks(project_id: int, user=Depends(get_current_user)):
    con = get_con(); cur = con.cursor()
    cur.execute("select id, title, status, assigned_to, priority from Tasks where project_id=?", (project_id,))
    rows = cur.fetchall()
    cur.close(); con.close()
    return {"tasks": [{
        "id": row[0],
        "title": row[1],
        "status": row[2],
        "assigned_to": row[3],
        "priority": row[4]
    } for row in rows] }

@app.get("/projects/{project_id}/tasks/{task_id}")
def get_task(task_id: int):
    task = crud_tasks.get_task(task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task

@app.get("/projects/{project_id}")
def get_project(project_id: int, user=Depends(get_current_user)):
    con = get_con(); cur = con.cursor()
    cur.execute("select id, name, description, created_at, created_by from Projects where id=?",(project_id,))
    row = cur.fetchone()
    cur.close(); con.close()
    return {
        "id": row[0],
        "name": row[1],
        "description": row[2],
        "created_at": row[3],
        "created_by": row[4]
    } 

@app.get("/admin/users")
def get_users():
    con = get_con(); cur = con.cursor()
    cur.execute("select id, username, email, role from Users")
    rows = cur.fetchall()
    cur.close(); con.close()
    return {"users": [
        {
            "id": row[0],
            "username": row[1],
            "email": row[2],
            "role": row[3]
        } for row in rows]}
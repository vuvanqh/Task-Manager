from db import get_con
from typing import Optional
from datetime import datetime

def create_project(name: str, owner_id: int, description: Optional[str] = None): 
    con = get_con(); cur = con.cursor()
    cur.execute("insert into Projects (name, description, created_by, created_at) values (?,?,?,CURRENT_TIMESTAMP)",
                (name,description,owner_id))
    con.commit(); cur.close(); con.close()

def delete_project(project_id: int):
    con = get_con(); cur = con.cursor()
    cur.execute("delete from Projects where id=?", (project_id,))
    con.commit(); cur.close(); con.close()

def edit_project(project_id: int, name: str, description: Optional[str]):
    con = get_con(); cur = con.cursor()
    cur.execute("update Projects set name=?, description=? where id=?",
                (name, description, project_id))
    con.commit(); cur.close(); con.close()

def create_task(title: str, project_id: int, assigned_to: Optional[int] = None, description: Optional[str] = None, status = "to-do", priority: int = 1):
    con = get_con(); cur = con.cursor()
    cur.execute("insert into Tasks (title, description, project_id, assigned_to, status, priority, created_at) values (?,?,?,?,?,?,CURRENT_TIMESTAMP)",
                (title, description, project_id, assigned_to, status, priority))
    con.commit(); cur.close(); con.close()

def delete_task(task_id: int):
    con = get_con(); cur = con.cursor()
    cur.execute("delete from Tasks where id=?", (task_id,))
    con.commit(); cur.close(); con.close()

def edit_task(task_id: int, title: str, description: str, priority: int = 1):
    con = get_con(); cur = con.cursor()
    cur.execute("update Tasks set title=?, description=?, priority=? where id=?",
                (title, description, priority, task_id))
    con.commit(); cur.close(); con.close()

def assign_to_task(task_id: int, user_id: int, status: str = "assigned"):
    con = get_con(); cur = con.cursor()
    cur.execute("update Tasks set assigned_to=?, status=? where id=?",
                (user_id, status, task_id))
    con.commit(); cur.close(); con.close()

def get_task(task_id: int):
    con = get_con(); cur = con.cursor()
    cur.execute("select id, title, status, assigned_to, priority from Tasks where id=?", (task_id,))
    row = cur.fetchone()
    if not row: return None
    return {
        "id": row[0],
        "title": row[1],
        "status": row[2],
        "assigned_to": row[3],
        "priority": row[4]
    }

def update_task_status(task_id: int, status: str):
    con = get_con(); cur = con.cursor()
    cur.execute("update Tasks set status=? where id=?", (status,task_id))
    con.commit(); cur.close(); con.close()
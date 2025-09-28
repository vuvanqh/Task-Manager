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
    cur.execute("delete from Tasks where project_id=?", (project_id,))
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

def edit_task(task_id: int, title: str, assigned_to: Optional[int] = None, description: Optional[str] = None, priority: int = 1):
    con = get_con(); cur = con.cursor()
    updates = ['title=?','description=?','priority=?']
    params = [title, description, priority]
    if assigned_to is not None:
        updates.append("assigned_to=?")
        priority.append(assigned_to)

    params.append(task_id)
    cur.execute(f"update Tasks set {', '.join(updates)} where id=?",
                tuple(params))
    con.commit(); cur.close(); con.close()

def assign_to_task(task_id: int, user_id: int, status: str = "assigned"):
    con = get_con(); cur = con.cursor()
    cur.execute("update Tasks set assigned_to=?, status=? where id=?",
                (user_id, status, task_id))
    con.commit(); cur.close(); con.close()

def update_task_status(task_id: int, status: str):
    con = get_con(); cur = con.cursor()
    cur.execute("update Tasks set status=? where id=?", (status,task_id))
    con.commit(); cur.close(); con.close()

def get_task(task_id: int):
    con = get_con(); cur = con.cursor()
    cur.execute("select id, project_id, title, status, description, priority, assigned_to from Tasks where id=?", (task_id,))
    row = cur.fetchone()
    cur.close(); con.close()
    return {
        "id": row[0],
        "project_id": row[1],
        "title": row[2],
        "status": row[3],
        "description": row[4],
        "priority": row[5],
        "assigned_to": row[6]
    }
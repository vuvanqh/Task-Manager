from db import get_con

def create_project(name, owner_id: int, description = None, deadline = None): #why ios owner_id none if its not null
    con = get_con(); cur = con.cursor()
    cur.execute("insert into Projects (name, description, created_by, created_at) values (?,?,?,CURRENT_TIMESTAMP)",
                (name,description,owner_id))
    con.commit(); cur.close(); con.close()

def create_task(title, project_id: int, assigned_to: int, description = None, status = "to-do"): #again same problem
    con = get_con(); cur = con.cursor()
    cur.execute("insert into Tasks (title, description, project_id, assigned_to, status, created_at) values (?,?,?,?,?,CURRENT_TIMESTAMP)",
                (title, description, project_id, assigned_to, status))
    con.commit(); cur.close(); con.close()

def assign_to_task(task_id, user_id, status = "assigned"):
    con = get_con(); cur = con.cursor()
    cur.execute("update Tasks set assigned_to=?, status=? where id=?",
                (user_id, status, task_id))
    con.commit(); cur.close(); con.close()

def get_task(task_id: int):
    con = get_con(); cur = con.cursor()
    cur.execute("select id, title, status, assigned_to, deadline from Tasks where id=?", (task_id,))
    row = cur.fetchone()
    if not row: return None
    return {
        "id": row[0],
        "title": row[1],
        "status": row[2],
        "assigned_to": row[3],
        "deadline": row[4]
    }

def update_task_status(task_id: int, status: str):
    con = get_con(); cur = con.cursor()
    cur.execute("update Tasks set status=? where id=?", (status,task_id))
    con.commit(); cur.close(); con.close()
import auth_utils
from db import get_con

def create_user(username: str, email: str, password: str, role: str = "user"):
    con = get_con(); cur = con.cursor()
    hashed = auth_utils.hash_passwd(password)
    cur.execute("insert into Users (username, email, password_hash, role) values (?,?,?,?)",
                (username, email, hashed, role))
    con.commit(); cur.close(); con.close()

def get_user_by_username(username: str):
    con = get_con(); cur = con.cursor()
    cur.execute("select id, username, email, password_hash, role from Users where username=?", (username,))
    row = cur.fetchone()
    cur.close(); con.close()

    if not row: return None
    return {
        "id": row[0],
        "username": row[1],
        "email": row[2],
        "password_hash": row[3],
        "role": row[4]
    }

def get_user_by_email(email: str):
    con = get_con(); cur = con.cursor()
    cur.execute("select id, username, email, password_hash, role from Users where email=?", (email,))
    row = cur.fetchone()
    cur.close(); con.close()

    if not row: return None
    return {
        "id": row[0],
        "username": row[1],
        "email": row[2],
        "password_hash": row[3],
        "role": row[4]
    }

def get_user_by_id(user_id: int):
    con = get_con(); cur = con.cursor()
    cur.execute("select id, username, email, password_hash, role from Users where id=?", (user_id,))
    row = cur.fetchone()
    cur.close(); con.close()

    if not row: return None
    return {
        "id": row[0],
        "username": row[1],
        "email": row[2],
        "password_hash": row[3],
        "role": row[4]
    }

def set_manager(user_id: int):
    con = get_con(); cur = con.cursor()
    cur.execute("update Users set role='manager' where id=?", (user_id,))
    con.commit(); cur.close(); con.close()

def set_admin(user_id: int):
    con = get_con(); cur = con.cursor()
    cur.execute("update Users set role='admin' where id=?", (user_id,))
    con.commit(); cur.close(); con.close()
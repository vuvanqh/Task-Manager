import pyodbc, os
ODBC_DRIVER = "ODBC Driver 17 for SQL Server"
SERVER = os.getenv("MSSQL_SERVER")
USER = os.getenv("MSSQL_USER")
PWD = os.getenv("MSSQL_PWD")
DB_NAME = "TaskManagerDB"

def get_con(db = DB_NAME):
    connection = (f"DRIVER={{{ODBC_DRIVER}}};"
                  f"SERVER={SERVER};DATABASE={db};UID={USER};PWD={PWD};Encrypt=yes;TrustServerCertificate=yes;")
    return pyodbc.connect(connection, autocommit = True)

def check_existance():
    con = get_con("master"); cur = con.cursor()
    cur.execute(f"if not exists (select * from sys.databases where name='{DB_NAME}') create database {DB_NAME};")
    cur.close(); con.close()
    print(f"Database {DB_NAME} checked/created")

def init_tables():
    con = get_con(); cur = con.cursor()

    #users
    cur.execute("""
        if not exists (select * from sysobjects where name='Users' and xtype='U')
        create table Users (
                id int identity primary key,
                username nvarchar(100) unique not null,
                email nvarchar(200) unique not null,
                password_hash nvarchar(255) not null,
                role nvarchar(20) not null check (role in ('user','manager','admin')),
                created_at datetime2 default sysutcdatetime());
                """)
    
    #passwd resets
    cur.execute("""
        if not exists (select * from sysobjects where name='PasswordResets' and xtype='U')
        create table PasswordResets (
                id int identity primary key,
                user_id int not null references Users(id),
                token_hash nvarchar(255) not null,
                expires_at datetime2 not null);
                """)
    
    #projects
    cur.execute("""
        if not exists (select* from sysobjects where name='Projects' and xtype='U')
        create table Projects (
                id int identity primary key,
                name nvarchar(200) not null,
                description nvarchar(max),
                created_by int not null references Users(id),
                created_at datetime2 default sysutcdatetime());
                """)
    
    #tasks
    cur.execute("""
        if not exists (select * from sysobjects where name='Tasks' and xtype='U')
        create table Tasks (
                id int identity primary key,
                project_id int not null references Projects(id),
                title nvarchar(200) not null,
                status nvarchar(50) not null,
                description nvarchar(max),
                priority int not null default 1,
                assigned_to int references Users(id),
                created_at datetime2 default sysutcdatetime());
                """)
    cur.close(); con.close()
    print(f"Tables checked/created in {DB_NAME} database")

if __name__ == "__main__":
    check_existance()
    init_tables()
    print("Database initialization complete")
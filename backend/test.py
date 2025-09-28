import pyodbc, os

ODBC_DRIVER = "ODBC Driver 17 for SQL Server"
SERVER = os.getenv("MSSQL_SERVER")
USER = os.getenv("MSSQL_USER")
PWD = os.getenv("MSSQL_PWD")
DB_NAME = "TaskManagerDB"

conn_str = (f"DRIVER={{{ODBC_DRIVER}}};"
                  f"SERVER={SERVER};DATABASE={DB_NAME};UID={USER};PWD={PWD};Encrypt=yes;TrustServerCertificate=yes;")

try:
    conn = pyodbc.connect(conn_str, timeout=5)
    print("Connection succeeded!")
    conn.close()
except Exception as e:
    print("Connection failed:", e)
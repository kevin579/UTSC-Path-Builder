import mysql
from db_connection import get_db_connection

def create_user(user_name: str, password: str) -> int:
    user_name = user_name.replace("@", "+").replace(".", "_")
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        # First check if user already exists
        cursor.execute(
            "SELECT username FROM users WHERE username = %s",
            (user_name,)
        )
        if cursor.fetchone() is not None:
            return 0  # User already exists
        
        # If user doesn't exist, create new user
        cursor.execute(
            "INSERT INTO users (username, password, courses) VALUES (%s, %s, %s)",
            (user_name, password, "")
        )
        conn.commit()
        return 1  # User created successfully
        
    except mysql.connector.Error as err:
        print(f"Database error: {err}")
        if err.errno == 1062:  # MySQL duplicate entry error code
            return 0  # User already exists
        return -1  # Other database error
        
    finally:
        cursor.close()
        conn.close()


def get_user_course(user_name: str):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute("SELECT courses FROM users WHERE username = %s", (user_name,))
        result = cursor.fetchone()
        if not result:
            raise ValueError(f"User {user_name} does not exist.")
        courses = result['courses']
        return courses.split(",") if courses else []
    finally:
        cursor.close()
        conn.close()

def update_user_course(user_name: str, course_code: str) -> None:
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute("SELECT courses FROM users WHERE username = %s", (user_name,))
        result = cursor.fetchone()
        if not result:
            raise ValueError(f"User {user_name} does not exist.")
        
        courses = result['courses'].split(",") if result['courses'] else []
        if course_code in courses:
            courses.remove(course_code)
        else:
            courses.append(course_code)
        
        updated_courses = ",".join(courses)
        cursor.execute(
            "UPDATE users SET courses = %s WHERE username = %s",
            (updated_courses, user_name)
        )
        conn.commit()
    finally:
        cursor.close()
        conn.close()

def user_login(user_name: str, password: str) -> int:
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        user_name = user_name.replace("@", "+").replace(".", "_")
        cursor.execute("SELECT username, password FROM users WHERE username = %s", (user_name,))
        result = cursor.fetchone()
        
        if not result:
            return 1  # User not found
        elif result['password'] != password:
            return 2  # Incorrect password
        else:
            return 3  # Login successful
    finally:
        cursor.close()
        conn.close()


def execute(query: str)-> None:
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(query)
    conn.commit()
    cursor.close()

def read(query: str)->tuple:
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(query)
    result = cursor.fetchall()
    return result if result else tuple()

#print(read("select * from users where username = 'huixiang_li+mail_utoronto_ca'"))
# execute("create table course_prereq (name varchar(100) ,req varchar(100) )")
# print(read())
# execute("create table users (username varchar(100) ,password varchar(100), courses LONGTEXT )")
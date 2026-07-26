from flask import Flask, request, jsonify, render_template, session
from flask_cors import CORS
import sys
import os
import json

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'backend')))

from db_connection import get_db_connection
from db_functions import *

app = Flask(__name__)
app.secret_key = os.environ.get('SECRET_KEY', os.urandom(24))
CORS(app)  

user_email = ""

get_db_connection()
@app.route('/', methods = ['GET', 'POST'])
def index():
    return render_template("index.html")


@app.route('/login', methods = ['GET', 'POST'])
def login():
    global user_email
    if request.method == 'GET':
        return render_template('login.html')
    if request.method == 'POST':
        email = request.form.get("email", "non")
        password = request.form.get("password", 0)
        # print(f"email: {email}, Password: {password}")
        status = user_login(email, password)
        
        if status == 3:
            user_email = email
            session['username'] = email.replace("@", "+").replace(".", "_")
            return jsonify({"success": True})
        else:
            return jsonify({"success": False})
        
@app.route('/signup', methods = ['GET', 'POST'])
def signup():
    if request.method == 'GET':
        return render_template('signup.html')
    if request.method =='POST':
        email = request.form.get("email","non")
       
        password = request.form.get("password",123)
        password2 = request.form.get("password2",123)
        #Password not match
        print(f"email: {email}, Password: {password}")
        if password != password2:
            print("wrong")
            return jsonify({"status":1})
        else:
            status = create_user(email,password)
            if status == 1: #user created
                return jsonify({"status": 2})
            else:
                return jsonify({"status": 3})
            
@app.route('/rating', methods = ['GET', 'POST'])
def rating():
    courses = []
    if 'username' in session:
        username = session.get('username')
        courses = get_user_course(username)  # Get the user's courses

    return render_template("course_rating.html", courses=courses)


#This is used to load json file for course rating
@app.route('/api/course_data')
def get_course_data():
    return jsonify(load_course_data())

#This is used to write into json file for course rating
def load_course_data():
    with open('flask/static/json/course_rating.json', 'r') as file:
        return json.load(file)
    
def save_course_data(data):
    with open('flask/static/json/course_rating.json', 'w') as file:
        json.dump(data, file, indent=4)

@app.route('/api/update_course', methods=['POST'])
def update_course():
    try:
        # Get data from request
        update_data = request.json
        course_code = update_data.get("course_code")
        new_values = update_data.get("new_values")

        # Load current data
        course_data = load_course_data()

        if course_code not in course_data:
            return jsonify({"error": "Course not found"}), 404

        # Update the JSON data
        for i in range(1, 6):  # Only update subjective ratings (index 1-5)
            course_data[course_code][i] = (
                (course_data[course_code][i] * course_data[course_code][6] + new_values[i])
                / (course_data[course_code][6] + 1)
            )

        # Increment the rating count
        course_data[course_code][6] += 1

        # Save updated data back to file
        save_course_data(course_data)

        return jsonify({"message": "Course updated successfully", "updated_data": course_data[course_code]})
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/course_preq', methods = ['GET', 'POST'])
def course_preq():
    # return render_template('course_prerequisite.html')
    courses = []
    if 'username' in session:
        username = session.get('username')
        courses = get_user_course(username)  # Get the user's courses

    return render_template("course_prerequisite.html", courses=courses)

@app.route('/program', methods = ['GET', 'POST'])
def program():
    return render_template('program_webpage.html')
        
@app.route('/course_recommend', methods = ['GET', 'POST'])
def course_recommend():
    return render_template('course_recommend.html')

@app.route('/course_feedback', methods = ['GET', 'POST'])
def course_feedback():
    return render_template('course_feedback.html')


@app.route('/portfolio', methods=['GET', 'POST'])
def portfolio():
    if 'username' not in session:
        return render_template('login.html')

    username = session.get('username')
    if request.method == 'POST':
        course_code = request.form.get('course_code', '').strip()
        if course_code:
            current_courses = get_user_course(username)
            if 'add' in request.form:
                if course_code not in current_courses:
                    update_user_course(username, course_code)
            elif 'remove' in request.form:
                if course_code in current_courses:
                    update_user_course(username, course_code)

    courses = get_user_course(username)
    return render_template("portfolio.html", courses=courses)




if __name__ == '__main__':
    app.run(debug=True, port=5000)
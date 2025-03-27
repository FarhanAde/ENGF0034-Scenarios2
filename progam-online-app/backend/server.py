from flask import Flask, jsonify, request
from flask_cors import CORS
import json
import os

app = Flask(__name__)
CORS(app)

@app.route('/getLeaderboard')
def get_leaderboard():
    current_dir = os.path.dirname(os.path.abspath(__file__))
    file_path = os.path.join(current_dir, 'data', 'leaderboard.json')
    
    try:
        with open(file_path, 'r') as file:
            data = json.load(file)
        return jsonify(data)
    except Exception as e:
        print(f"Error loading leaderboard data: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/getLessons')
def get_lessons():
    current_dir = os.path.dirname(os.path.abspath(__file__))
    file_path = os.path.join(current_dir, 'data', 'lessons.json')
    
    try:
        with open(file_path, 'r') as file:
            data = json.load(file)
        return jsonify(data)
    except Exception as e:
        print(f"Error loading lessons data: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/getLessonDetails/<lessonId>')
def get_lesson_details(lessonId):
    current_dir = os.path.dirname(os.path.abspath(__file__))
    file_path = os.path.join(current_dir, 'data', 'lessondetails.json')
    
    try:
        with open(file_path, 'r') as file:
            lessons_details = json.load(file)
        
        lesson_detail = next((ld for ld in lessons_details if ld["id"] == lessonId), None)
        
        if lesson_detail:
            return jsonify(lesson_detail)
        else:
            return jsonify({"error": "Lesson details not found"}), 404
    except Exception as e:
        print(f"Error loading lesson details: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/getHomework')
def get_homework():
    current_dir = os.path.dirname(os.path.abspath(__file__))
    file_path = os.path.join(current_dir, 'data', 'homework.json')
    
    try:
        with open(file_path, 'r') as file:
            data = json.load(file)
        return jsonify(data)
    except Exception as e:
        print(f"Error loading homework data: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/getHomeworkDetails/<homeworkId>')
def get_homework_details(homeworkId):
    print("req")
    current_dir = os.path.dirname(os.path.abspath(__file__))
    file_path = os.path.join(current_dir, 'data', 'homeworkdetails.json')
    
    try:
        with open(file_path, 'r') as file:
            homework_details = json.load(file)
        
        homework_detail = next((hd for hd in homework_details if hd["id"] == homeworkId), None)
        
        if homework_detail:
            return jsonify(homework_detail)
        else:
            return jsonify({"error": "Homework details not found"}), 404
    except Exception as e:
        print(f"Error loading homework details: {str(e)}")
        return jsonify({"error": str(e)}), 500
    
@app.route('/runCode', methods=['POST'])
def run_code():
    data = request.json
    print(data)
    return "success"
    
if __name__ == '__main__':
    app.run(debug=True, port=5000)
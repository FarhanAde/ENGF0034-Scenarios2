from flask import Flask, jsonify, request
from flask_cors import CORS
import json
import os
import datetime
import sys
import io
from contextlib import redirect_stdout

app = Flask(__name__)
CORS(app)

current_dir = os.path.dirname(os.path.abspath(__file__))
leaderboard_path = os.path.join(current_dir, 'data', 'leaderboard.json')
forum_path = os.path.join(current_dir, 'data', 'forum.json')
lessons_path = os.path.join(current_dir, 'data', 'lessons.json')
lesson_details_path = os.path.join(current_dir, 'data', 'lessondetails.json')
homework_path = os.path.join(current_dir, 'data', 'homework.json')
homework_details_path = os.path.join(current_dir, 'data', 'homeworkdetails.json')
mini_python_src_path = os.path.join(current_dir, 'mini_python', 'src')

sys.path.append(mini_python_src_path)

from program import MiniPythonInterpreter
MPI = MiniPythonInterpreter()

# Ensure data directory exists
os.makedirs(os.path.dirname(forum_path), exist_ok=True)

# Initialize forum.json if it doesn't exist
if not os.path.exists(forum_path):
    with open(forum_path, 'w') as file:
        json.dump([], file)

# Helper function for timestamps
def get_timestamp():
    return datetime.datetime.now().strftime("%d/%m/%Y %H:%M")

@app.route('/getLeaderboard')
def get_leaderboard():
    try:
        with open(leaderboard_path, 'r') as file:
            leaderboard_data = json.load(file)
        return jsonify(leaderboard_data)
    except Exception as e:
        print(f"Error loading leaderboard data: {str(e)}")
        return jsonify({"error": str(e)}), 500

# Keep the original endpoint for backward compatibility
@app.route('/getForumMessages', methods=['GET'])
def get_forum_messages():
    try:
        with open(forum_path, 'r') as file:
            forum_data = json.load(file)
        return jsonify(forum_data)
    except Exception as e:
        print(f"Error loading forum data: {str(e)}")
        return jsonify({"error": str(e)}), 500

# Add the new endpoint name that matches frontend expectations
@app.route('/getForumThreads', methods=['GET'])
def get_forum_threads():
    try:
        with open(forum_path, 'r') as file:
            forum_data = json.load(file)
        return jsonify(forum_data)
    except Exception as e:
        print(f"Error loading forum data: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/postForumMessage', methods=['POST'])
def post_forum_message():
    try:
        new_message = request.json
        
        # Make sure timestamp is added if not present
        if 'timestamp' not in new_message:
            new_message['timestamp'] = get_timestamp()
            
        # Initialize replies array if not present
        if 'replies' not in new_message:
            new_message['replies'] = []
            
        with open(forum_path, 'r+') as file:
            forum_data = json.load(file)
            
            # Use max ID + 1 instead of len() for more robustness
            new_message['id'] = max([thread.get('id', 0) for thread in forum_data] + [0]) + 1
            
            forum_data.append(new_message)
            file.seek(0)
            file.truncate()
            json.dump(forum_data, file, indent=2)
        return jsonify(new_message), 201
    except Exception as e:
        print(f"Error posting forum message: {str(e)}")
        return jsonify({"error": str(e)}), 500

# Add endpoint for posting replies
@app.route('/postForumReply', methods=['POST'])
def post_forum_reply():
    try:
        data = request.json
        thread_id = data.get('threadId')
        reply_content = data.get('reply')
        user = data.get('user', 'Anonymous')
        
        if not thread_id or not reply_content:
            return jsonify({"error": "Missing threadId or reply content"}), 400
        
        with open(forum_path, 'r+') as file:
            forum_data = json.load(file)
            found = False
            
            for thread in forum_data:
                if thread['id'] == thread_id:
                    new_reply = {
                        "reply": reply_content,
                        "replyUser": user,
                        "replyTimestamp": get_timestamp(),
                        "isTeacherReply": False
                    }
                    
                    # Initialize replies array if it doesn't exist
                    if 'replies' not in thread:
                        thread['replies'] = []
                        
                    thread['replies'].append(new_reply)
                    found = True
                    break
            
            if not found:
                return jsonify({"error": "Thread not found"}), 404
            
            file.seek(0)
            file.truncate()
            json.dump(forum_data, file, indent=2)
            
        return jsonify(new_reply), 201
    except Exception as e:
        print(f"Error posting forum reply: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/getLessons')
def get_lessons():
    # current_dir = os.path.dirname(os.path.abspath(__file__))
    # file_path = os.path.join(current_dir, 'data', 'lessons.json')
    
    try:
        with open(lessons_path, 'r') as file:
            data = json.load(file)
        return jsonify(data)
    except Exception as e:
        print(f"Error loading lessons data: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/getLessonDetails/<lessonId>')
def get_lesson_details(lessonId):
    # current_dir = os.path.dirname(os.path.abspath(__file__))
    # file_path = os.path.join(current_dir, 'data', 'lessondetails.json')
    
    try:
        with open(lesson_details_path, 'r') as file:
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
    # current_dir = os.path.dirname(os.path.abspath(__file__))
    # file_path = os.path.join(current_dir, 'data', 'homework.json')
    
    try:
        with open(homework_path, 'r') as file:
            data = json.load(file)
        return jsonify(data)
    except Exception as e:
        print(f"Error loading homework data: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/getHomeworkDetails/<homeworkId>')
def get_homework_details(homeworkId):
    print("req")
    # current_dir = os.path.dirname(os.path.abspath(__file__))
    # file_path = os.path.join(current_dir, 'data', 'homeworkdetails.json')
    
    try:
        with open(homework_details_path, 'r') as file:
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
    code = data['code']
    
    f = io.StringIO()
    with redirect_stdout(f):
        try:
            #result = MPI.run_code(code)
            #output = f.getvalue()
            exec(code)
            output = f.getvalue()
        except Exception as e:
            return jsonify({"error": str(e)}), 500
    
    return jsonify({"output": output})
            
if __name__ == '__main__':
    app.run(debug=True, port=5000)
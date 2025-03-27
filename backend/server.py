from flask import Flask, jsonify, request
from flask_cors import CORS
import json
import os
import datetime
import sys
import io
from contextlib import redirect_stdout
import time

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

def execute_code(code):
    # ideally we would have tests here...
    # but for now we will just run the code
    # and return the output
    f = io.StringIO()
    with redirect_stdout(f):
        try:
            t1 = time.time()
            exec(code)
            t2 = time.time()
            output = f.getvalue()
        except Exception as e:
            return {"ok": False, "output": str(e), "time": 0}
    return {"ok": True, "output": output, "time": t2 - t1}

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
    
    result = execute_code(code)
    
    return jsonify({"result": result['output'], "time": round(result['time'], 5)})

@app.route('/getProblems')
def get_problems():
    current_dir = os.path.dirname(os.path.abspath(__file__))
    file_path = os.path.join(current_dir, 'data', 'problems.json')
    
    try:
        with open(file_path, 'r') as file:
            data = json.load(file)
        return jsonify(data)
    except Exception as e:
        print(f"Error loading problems data: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/submitHomework', methods=['POST'])
def submit_homework():
    try:
        data = request.json
        homework_id = data.get('homeworkId')
        code = data.get('code')
        user_id = data.get('userId', 1)  # Default to user 1 if not provided
        submission_date = data.get('submissionDate')
        
        print(f"Processing submission for homework {homework_id} from user {user_id}")
        
        # Path to the submissions file
        submissions_path = os.path.join(current_dir, 'data', 'submissions.json')
        
        # Load existing submissions
        with open(submissions_path, 'r') as file:
            submissions = json.load(file)
        
        # Count previous submissions for this user and homework to determine submission number
        prev_submissions = [s for s in submissions if s.get('userId') == user_id and s.get('homeworkId') == homework_id]
        submission_number = len(prev_submissions) + 1
        
        # Run the code to check results (you could add more sophisticated testing here)
        result = execute_code(code)
        
        # Create new submission object
        new_submission = {
            'userId': user_id,
            'homeworkId': homework_id,
            'code': code,
            'submissionDate': submission_date,
            'submissionNumber': submission_number,
            'result': result['output'],
            'time': round(result['time'], 5),
            'success': result['ok']
        }
        
        # Add to submissions array
        submissions.append(new_submission)
        
        # Save updated submissions back to file
        with open(submissions_path, 'w') as file:
            json.dump(submissions, file, indent=2)
        
        # Return success response
        return jsonify({
            'success': True,
            'message': f"Homework submitted successfully! This is submission #{submission_number}.",
            'submissionNumber': submission_number,
            'time': round(result['time'], 5),
            'result': result['output']
        })
    
    except Exception as e:
        print(f"Error submitting homework: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e),
            'message': f"Error submitting homework: {str(e)}"
        }), 500

@app.route('/getProfile/<userId>')
def get_profile(userId):
    current_dir = os.path.dirname(os.path.abspath(__file__))
    file_path = os.path.join(current_dir, 'data', 'profiles.json')
    
    try:
        with open(file_path, 'r') as file:
            profiles = json.load(file)
        
        profile = next((p for p in profiles if str(p["id"]) == userId), None)
        
        if profile:
            return jsonify(profile)
        else:
            return jsonify({"error": "Profile not found"}), 404
    except Exception as e:
        print(f"Error loading profile: {str(e)}")
        return jsonify({"error": str(e)}), 500
            
if __name__ == '__main__':
    app.run(debug=True, port=5000)
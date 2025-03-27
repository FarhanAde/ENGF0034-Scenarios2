from flask import Flask, jsonify, request
from flask_cors import CORS
import json
import os

app = Flask(__name__)
CORS(app)

current_dir = os.path.dirname(os.path.abspath(__file__))
leaderboard_path = os.path.join(current_dir, 'data', 'leaderboard.json')
forum_path = os.path.join(current_dir, 'data', 'forum.json')

@app.route('/getLeaderboard')
def get_leaderboard():
    print(leaderboard_path)
    with open(leaderboard_path, 'r') as file:
        leaderboard_data = json.load(file)
    return jsonify(leaderboard_data)

@app.route('/getForumMessages', methods=['GET'])
def get_forum_messages():
    with open(forum_path, 'r') as file:
        forum_data = json.load(file)
    return jsonify(forum_data)

@app.route('/postForumMessage', methods=['POST'])
def post_forum_message():
    new_message = request.json
    with open(forum_path, 'r+') as file:
        forum_data = json.load(file)
        new_message['id'] = len(forum_data) + 1  # Assign a new ID
        forum_data.append(new_message)
        file.seek(0)
        json.dump(forum_data, file)
    return jsonify(new_message), 201

if __name__ == '__main__':
    app.run(debug=True, port=5000)
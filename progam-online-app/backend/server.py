from flask import Flask, jsonify
from flask_cors import CORS
import json
import os

app = Flask(__name__)
CORS(app)

dir_path = os.path.join('data', 'leaderboard.json')

@app.route('/getLeaderboard')
def get_leaderboard():
    print(dir_path)
    with open(dir_path, 'r') as file:
        leaderboard_data = json.load(file)
    return jsonify(leaderboard_data)

if __name__ == '__main__':
    app.run(debug=True, port=5000)
from flask import Flask, render_template, request, jsonify, session
import json
import os
from datetime import datetime
import uuid

app = Flask(__name__)
app.secret_key = 'physics_playground_secret_key_2024'

# Load physics concepts and formulas
with open('data/concepts.json') as f:
    concepts = json.load(f)

with open('data/formulas.json') as f:
    formulas = json.load(f)

# In-memory storage for user data and scores
user_data = {}
leaderboard = []

@app.route('/')
def index():
    # Generate unique session ID if not exists
    if 'user_id' not in session:
        session['user_id'] = str(uuid.uuid4())
    
    return render_template('index.html')

@app.route('/save_user', methods=['POST'])
def save_user():
    data = request.json
    user_id = session['user_id']
    
    user_data[user_id] = {
        'name': data['name'],
        'grade': data['grade'],
        'join_date': datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        'progress': {
            'motion': {'completed': 0, 'total': 6, 'score': 0},
            'energy': {'completed': 0, 'total': 5, 'score': 0},
            'electricity': {'completed': 0, 'total': 5, 'score': 0},
            'matter': {'completed': 0, 'total': 7, 'score': 0},
            'waves': {'completed': 0, 'total': 5, 'score': 0}
        },
        'total_score': 0,
        'badges': []
    }
    
    return jsonify({"status": "success", "user_id": user_id})

@app.route('/update_progress', methods=['POST'])
def update_progress():
    data = request.json
    user_id = session['user_id']
    
    if user_id in user_data:
        topic = data['topic']
        concept = data['concept']
        score = data.get('score', 10)
        
        # Update progress
        user_data[user_id]['progress'][topic]['completed'] += 1
        user_data[user_id]['progress'][topic]['score'] += score
        user_data[user_id]['total_score'] += score
        
        # Check for badges
        check_badges(user_id, topic)
        
        # Update leaderboard
        update_leaderboard(user_id, user_data[user_id]['name'], user_data[user_id]['total_score'])
    
    return jsonify({"status": "success"})

@app.route('/get_user_data')
def get_user_data():
    user_id = session['user_id']
    if user_id in user_data:
        return jsonify(user_data[user_id])
    return jsonify({"error": "User not found"})

@app.route('/get_leaderboard')
def get_leaderboard():
    return jsonify(leaderboard[:10])  # Return top 10

@app.route('/get_concepts/<topic>')
def get_concepts(topic):
    return jsonify(concepts.get(topic, {}))

def check_badges(user_id, topic):
    user = user_data[user_id]
    progress = user['progress'][topic]
    
    # Topic Master badge
    if progress['completed'] == progress['total'] and f"{topic}_master" not in user['badges']:
        user['badges'].append(f"{topic}_master")
    
    # Physics Pro badge
    total_completed = sum(user['progress'][t]['completed'] for t in user['progress'])
    if total_completed >= 20 and "physics_pro" not in user['badges']:
        user['badges'].append("physics_pro")
    
    # High Scorer badge
    if user['total_score'] >= 500 and "high_scorer" not in user['badges']:
        user['badges'].append("high_scorer")

def update_leaderboard(user_id, name, score):
    global leaderboard
    
    # Check if user already exists in leaderboard
    for entry in leaderboard:
        if entry['user_id'] == user_id:
            entry['score'] = score
            break
    else:
        # Add new entry
        leaderboard.append({
            'user_id': user_id,
            'name': name,
            'score': score,
            'date': datetime.now().strftime("%Y-%m-%d")
        })
    
    # Sort by score (descending)
    leaderboard.sort(key=lambda x: x['score'], reverse=True)

if __name__ == '__main__':
    app.run(debug=True)
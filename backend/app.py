from flask import Flask, jsonify, request, session
from flask_cors import CORS
from flask_session import Session
import random

app = Flask(__name__)
CORS(app)
app.config['SESSION_TYPE'] = 'filesystem'
Session(app)

@app.route('/start', methods=['GET'])
def start_game():
    session['current_number'] = random.randint(1, 100)
    session['attempts'] = 0
    return jsonify({'message': 'New game started!'})

@app.route('/guess', methods=['POST'])
def guess_number():
    try:
        data = request.get_json()
        user_guess = int(data['guess'])
        session['attempts'] = session.get('attempts', 0) + 1
        if user_guess == session['current_number']:
            score = max(100 - session['attempts'] * 10, 0)
            return jsonify({'result': 'correct', 'attempts': session['attempts'], 'score': score})
        elif user_guess < session['current_number']:
            return jsonify({'result': 'too_low', 'attempts': session['attempts']})
        else:
            return jsonify({'result': 'too_high', 'attempts': session['attempts']})
    except (KeyError, ValueError, TypeError):
        return jsonify({'error': 'Invalid guess'}), 400

if __name__ == '__main__':
    app.run(debug=True, port=5000)

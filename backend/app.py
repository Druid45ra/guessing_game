from flask import Flask, jsonify, request
from flask_cors import CORS
import random

app = Flask(__name__)
CORS(app)  # Allow requests from the front-end

current_number = random.randint(1, 100)
attempts = 0

@app.route('/')
def index():
    return "Welcome to the Guess the Number Game!"

@app.route('/start', methods=['GET'])
def start_game():
    global current_number, attempts
    current_number = random.randint(1, 100)
    attempts = 0
    return jsonify({'message': 'New game started!'})

@app.route('/guess', methods=['POST'])
def guess_number():
    global attempts
    data = request.get_json()
    user_guess = int(data['guess'])
    attempts += 1

    if user_guess == current_number:
        score = max(100 - attempts * 10, 0)  # Score decreases with each attempt
        return jsonify({'result': 'correct', 'attempts': attempts, 'score': score})
    elif user_guess < current_number:
        return jsonify({'result': 'too_low', 'attempts': attempts})
    else:
        return jsonify({'result': 'too_high', 'attempts': attempts})

if __name__ == '__main__':
    app.run(debug=True, port=5000)

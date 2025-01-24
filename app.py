from flask import Flask, render_template, session
from flask_socketio import SocketIO
from flask_session import Session

app = Flask(__name__)
app.config["SECRET_KEY"] = "hemmelig"
app.config['SESSION_TYPE'] = 'filesystem'

Session(app)
socket = SocketIO(app, manage_session=False)

@app.route('/')
def index():
    if not "game_state" in session:
        session['game_state'] = {
            "money": 0,
            "money_per_print": 1,
            "money_per_second": 0,
            "prices": [50, 100, 150, 250, 330, 520, 700 , 1000]
        }
    
    return render_template("index.html")

@socket.on("load-game")
def load_game():
    return session.get('game_state')

@socket.on("save-game")
def save_game(data):
    session["game_state"] = data.get("save-data")
    return "lagret"

if __name__ == '__main__':
    socket.run(app, debug=True)

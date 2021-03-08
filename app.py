import os
from json import dumps, loads
from flask import Flask, send_from_directory, json, session
from flask_socketio import SocketIO
from flask_cors import CORS
from dotenv import load_dotenv

from models import db, Player

load_dotenv(dotenv_path="sql.env")

app = Flask(__name__, static_folder="./build/static")

cors = CORS(app, resources={r"/*": {"origins": "*"}})

# Point SQLAlchemy to your Heroku database
app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL")
# Gets rid of a warning
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db.init_app(app)

socketio = SocketIO(app, cors_allowed_origins="*", json=json, manage_session=False)

players = list()
player_set = set()
moves = list()

lines = [
    set([0, 1, 2]),
    set([3, 4, 5]),
    set([6, 7, 8]),
    set([0, 3, 6]),
    set([1, 4, 7]),
    set([2, 5, 8]),
    set([0, 4, 8]),
    set([2, 4, 6]),
]


@app.route("/", defaults={"filename": "index.html"})
@app.route("/<path:filename>")
def index(filename):
    return send_from_directory("./build", filename)


@app.route("/leaderboard")
def leaderboard():
    plist = Player.query.order_by(Player.score.desc()).limit(5).all()
    return dumps(list(map(lambda x: loads(str(x)), plist)))


# When a client connects from this Socket connection, this function is run
@socketio.on("login")
def on_login(data):
    name = data["name"]

    if name not in player_set:
        players.append(name)
        player_set.add(name)

    if not Player.query.filter_by(username=name).first():
        p = Player(username=name, score=100)
        db.session.add(p)
        db.session.commit()

    socketio.emit(
        "connected",
        {"players": players, "moves": moves},
        broadcast=True,
        include_self=True,
    )


# When a client disconnects from this Socket connection, this function is run
@socketio.on("disconnect")
def on_disconnect():
    print("User disconnected!")


@socketio.on("move")
def on_move(data):  # data is whatever arg you pass in your emit call on client
    # This emits the 'chat' event from the server to all clients except for
    # the client that emmitted the event that triggered this function

    if data not in moves:
        moves.append(data)
        socketio.emit("move", data, broadcast=True, include_self=True)

    if check_win():
        winner = (len(moves) - 1) % 2

        w = Player.query.filter_by(username=players[winner]).first()
        w.score += 1

        l = Player.query.filter_by(username=players[0 if winner else 1]).first()
        l.score -= 1

        db.session.commit()

        clear_state()
        socketio.emit("win", winner, broadcast=True, include_self=True)
        return

    if len(moves) is 9:
        clear_state()
        socketio.emit("draw", {}, broadcast=True, include_self=True)


def clear_state():
    players.clear()
    player_set.clear()
    moves.clear()


def check_win():
    player_moves = set(moves[(0 if (len(moves) % 2) else 1) :][::2])
    print(player_moves)

    for line in lines:
        if len(player_moves.intersection(line)) == 3:
            return True

    return False


# Note that we don't call app.run anymore. We call socketio.run with app arg
socketio.run(
    app,
    host=os.getenv("IP", "0.0.0.0"),
    port=8081 if os.getenv("C9_PORT") else int(os.getenv("PORT", 8081)),
)

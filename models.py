"""
Module containing all database models.
"""
from json import dumps
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


class Player(db.Model):
    """
    Player database model.
    """

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    score = db.Column(db.Integer, nullable=False, unique=False)

    def __repr__(self):
        return str(dumps({"username": self.username, "score": self.score}))

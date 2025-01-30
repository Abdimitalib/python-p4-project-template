# backend/config.py
import os

class Config:
    SECRET_KEY = os.urandom(24)
    SQLALCHEMY_DATABASE_URI = 'sqlite:///hospital_management.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
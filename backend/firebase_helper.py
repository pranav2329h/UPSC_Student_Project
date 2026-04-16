import os
import json
import firebase_admin
from firebase_admin import credentials, firestore

_db = None

def get_db():
    global _db
    if _db is None:
        if not firebase_admin._apps:
            # If you have a service account JSON file, use it:
            # cred = credentials.Certificate("path/to/serviceAccountKey.json")
            # firebase_admin.initialize_app(cred)
            
            # Or load from environment variables:
            try:
                cred_dict = {
                    "type": os.environ.get("FIREBASE_TYPE", "service_account"),
                    "project_id": os.environ.get("FIREBASE_PROJECT_ID", ""),
                    "private_key_id": os.environ.get("FIREBASE_PRIVATE_KEY_ID", ""),
                    "private_key": os.environ.get("FIREBASE_PRIVATE_KEY", "").replace("\\n", "\n"),
                    "client_email": os.environ.get("FIREBASE_CLIENT_EMAIL", ""),
                    "client_id": os.environ.get("FIREBASE_CLIENT_ID", ""),
                    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                    "token_uri": "https://oauth2.googleapis.com/token",
                }
                cred = credentials.Certificate(cred_dict)
                firebase_admin.initialize_app(cred)
                _db = firestore.client()
            except Exception as e:
                print(f"Firebase initialization failed: {e}. Firestore will not be available.")
                return None
    else:
        _db = firestore.client()
    return _db

def save_analysis(article_id: str, analysis: dict):
    db = get_db()
    if db is None:
        return False
    try:
        db.collection("analysis").document(article_id).set(analysis)
        return True
    except Exception as e:
        print(f"Error saving analysis: {e}")
        return False

def get_analysis(article_id: str):
    db = get_db()
    if db is None:
        return None
    try:
        doc = db.collection("analysis").document(article_id).get()
        return doc.to_dict() if doc.exists else None
    except Exception as e:
        print(f"Error getting analysis: {e}")
        return None

def save_note(user_id: str, note: dict):
    db = get_db()
    if db is None:
        return False
    try:
        db.collection("saved_notes").add({**note, "user_id": user_id})
        return True
    except Exception as e:
        print(f"Error saving note: {e}")
        return False

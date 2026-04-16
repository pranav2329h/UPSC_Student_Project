import os
import json
import requests
from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
from dotenv import load_dotenv
from firebase_helper import save_analysis, get_analysis, save_note

load_dotenv()

app = Flask(__name__)
CORS(app)

# ── Gemini Setup ────────────────────────────────────────────────────────────
genai.configure(api_key=os.environ.get("GEMINI_API_KEY", ""))

generation_config = {
    "temperature": 0.2,
    "top_p": 0.95,
    "top_k": 64,
    "max_output_tokens": 8192,
    "response_mime_type": "application/json",
}

model = genai.GenerativeModel(
    model_name="gemini-1.5-pro",
    generation_config=generation_config,
)

UPSC_PROMPT = """You are an expert UPSC (Union Public Service Commission) mentor and an AI knowledge architect.
A student will provide you with a recent news article. Your task is to analyze it and return structured UPSC preparation content.

Return ONLY a valid JSON object matching this EXACT schema:

{
  "summary": "2-3 sentence summary focusing on administrative/national importance",
  "subjects": {
    "primary": "Main UPSC syllabus subject (e.g. Indian Polity, Economy, Environment, Science & Tech)",
    "secondary": ["Related UPSC topic 1", "Related UPSC topic 2"]
  },
  "static_concepts": [
    {
      "topic": "Name of static concept linked to news (e.g. Article 19, Monetary Policy)",
      "explanation": "2-3 sentence explanation for UPSC revision",
      "icon": "lucide icon name suggestion e.g. Scale, FileText, Landmark"
    }
  ],
  "keywords": ["Keyword1", "Keyword2", "Keyword3", "Keyword4", "Keyword5"],
  "questions": {
    "prelims": {
      "question": "Multiple-choice question based on static knowledge from this news",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correct_answer": "Exact string from options that is correct with brief reason"
    },
    "mains": {
      "question": "10-15 mark UPSC mains standard question analyzing the issue (250 words)"
    }
  },
  "knowledge_graph": {
    "nodes": [
      {"id": "news", "label": "News Topic", "type": "news"},
      {"id": "subj1", "label": "Subject Name", "type": "subject"},
      {"id": "topic1", "label": "Static Topic", "type": "topic"}
    ],
    "edges": [
      {"from": "news", "to": "subj1"},
      {"from": "subj1", "to": "topic1"}
    ]
  }
}

Analyze the following news article:
"""

# ── Routes ──────────────────────────────────────────────────────────────────

@app.route('/api/analyze', methods=['POST'])
def analyze_news():
    try:
        data = request.json
        if not data or 'text' not in data:
            return jsonify({"error": "No text provided"}), 400

        news_text = data['text']
        article_id = data.get('id', 'unknown')

        # Check Firebase cache first
        cached = get_analysis(article_id)
        if cached:
            return jsonify(cached)

        prompt = UPSC_PROMPT + "\n\n" + news_text
        response = model.generate_content(prompt)

        result = json.loads(response.text)

        # Save to Firebase
        save_analysis(article_id, result)

        return jsonify(result)

    except json.JSONDecodeError:
        return jsonify({"error": "AI returned invalid JSON. Please retry."}), 500
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({"error": f"Analysis failed: {str(e)}"}), 500


@app.route('/api/news', methods=['GET'])
def get_news():
    """Fetch news from GNews API."""
    api_key = os.environ.get("GNEWS_API_KEY", "")
    category = request.args.get("category", "general")
    country = request.args.get("country", "in")

    if not api_key:
        # Return mock news if no API key configured
        return jsonify({"articles": [], "status": "no_api_key"})

    try:
        url = f"https://gnews.io/api/v4/top-headlines?category={category}&country={country}&lang=en&max=10&token={api_key}"
        resp = requests.get(url, timeout=10)
        return jsonify(resp.json())
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/analysis/<article_id>', methods=['GET'])
def retrieve_analysis(article_id):
    """Retrieve a stored analysis from Firebase."""
    result = get_analysis(article_id)
    if result:
        return jsonify(result)
    return jsonify({"error": "Analysis not found"}), 404


@app.route('/api/notes', methods=['POST'])
def save_note_api():
    """Save a note to Firebase."""
    data = request.json
    if not data:
        return jsonify({"error": "No data provided"}), 400
    user_id = data.get("user_id", "anonymous")
    success = save_note(user_id, data)
    if success:
        return jsonify({"status": "saved"})
    return jsonify({"error": "Failed to save"}), 500


@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({"status": "ok", "service": "UPSC Linker AI Backend"})


if __name__ == '__main__':
    app.run(debug=True, port=5000)

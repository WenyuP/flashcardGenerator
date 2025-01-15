from flask import Flask, request, jsonify
import os
from dotenv import load_dotenv
from openai import OpenAI
from flask_cors import CORS

# Load environment variables
load_dotenv()

app = Flask(__name__)

# Allow specific origins (replace with your frontend URL)
CORS(app, resources={r"/generate": {"origins": [
    "https://flashcard-generator-pk9799f14-wenyups-projects.vercel.app",  # Deployed frontend
    "http://localhost:3000"  # Optional: Local development frontend
]}})

# Create OpenAI client with given API key
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

@app.before_request
def handle_preflight():
    """
    Handle preflight OPTIONS requests.
    """
    if request.method == "OPTIONS":
        response = app.make_response("")
        response.headers["Access-Control-Allow-Origin"] = request.headers.get("Origin")
        response.headers["Access-Control-Allow-Methods"] = "POST, GET, OPTIONS"
        response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
        return response


@app.route('/generate', methods=['POST'])
def generate_flashcards():
    """
    Generate flashcards for a given topic using OpenAI's ChatCompletion API.
    """
    data = request.get_json()
    topic = data.get('topic')

    if not topic:
        return jsonify({"error": "Topic is required"}), 400

    messages = [
        {"role": "system", "content": "You are a helpful assistant that generates educational flashcards."},
        {"role": "user", "content": f"Generate 5 flashcards about '{topic}'. Each flashcard should be structured as:\nQuestion: <question>\nAnswer: <answer>\nSeparate each flashcard with '---'."}
    ]

    try:
        chat_completion = client.chat.completions.create(
            messages=messages,
            model="gpt-4",
        )

        flashcards_text = chat_completion.choices[0].message.content.strip()

        flashcards = []
        for flashcard in flashcards_text.split("---"):
            parts = flashcard.strip().split("\n")
            if len(parts) == 2:
                flashcards.append({"question": parts[0], "answer": parts[1]})

        return jsonify({"flashcards": flashcards}), 200

    except Exception as e:
        return jsonify({"error": f"Failed to generate flashcards: {str(e)}"}), 500


if __name__ == '__main__':
    # Use host and port suitable for deployment
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 5000)), debug=False)

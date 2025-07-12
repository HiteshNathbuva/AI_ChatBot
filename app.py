# ✅ Flask backend for ChatGPT-style chatbot
from flask import Flask, render_template, request, jsonify
import openai
import os  # ✅ Needed to read env variable

# Initialize Flask app
app = Flask(__name__)

# Set your Groq (OpenAI-compatible) API key and base URL
openai.api_key = os.getenv("OPENAI_API_KEY")  
openai.api_base = "https://api.groq.com/openai/v1"

# Store message history in memory
messages = []

# ✅ Home route that serves the HTML UI
@app.route("/")
def index():
    return render_template("index.html")  # Looks inside 'templates' folder by default

# ✅ Chat route to handle user messages via AJAX
@app.route("/chat", methods=["POST"])
def chat():
    user_input = request.json.get("message")

    # ✅ Detect "act like" and insert a system role instruction
    if "act like" in user_input.lower():
        role = user_input.lower().split("act like")[-1].strip().capitalize()
        system_instruction = f"You are now acting like a {role}. Respond accordingly with that tone."
        
        # Add system message and a follow-up user message
        messages.append({"role": "system", "content": system_instruction})
        messages.append({"role": "user", "content": f"Hi {role}, how would you respond?"})
    else:
        messages.append({"role": "user", "content": user_input})

    try:
        response = openai.ChatCompletion.create(
            model="llama3-8b-8192",  # You can try "llama3-70b-8192" too
            messages=messages
        )
        reply = response["choices"][0]["message"]["content"]
        messages.append({"role": "assistant", "content": reply})
        return jsonify({"reply": reply})

    except Exception as e:
        return jsonify({"error": str(e)})

# ✅ Run the app
if __name__ == "__main__":
    app.run(debug=True)




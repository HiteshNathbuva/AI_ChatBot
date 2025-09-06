from flask import Flask, render_template, request, jsonify
import openai
import os
from dotenv import load_dotenv

# ✅ Load .env file
load_dotenv()

# ✅ Initialize Flask app
app = Flask(__name__)

# ✅ Set your Groq API key and base URL
openai.api_key = os.getenv("OPENAI_API_KEY")
openai.api_base = "https://api.groq.com/openai/v1"

# ✅ Store chat messages in memory
messages = []

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/chat", methods=["POST"])
def chat():
    user_input = request.json.get("message")

    if "act like" in user_input.lower():
        role = user_input.lower().split("act like")[-1].strip().capitalize()
        system_instruction = f"You are now acting like a {role}. Respond accordingly with that tone."
        messages.append({"role": "system", "content": system_instruction})
        messages.append({"role": "user", "content": f"Hi {role}, how would you respond?"})
    else:
        messages.append({"role": "user", "content": user_input})

    try:
        response = openai.ChatCompletion.create(
            model="gemma2-9b-it",
            messages=messages
        )
        reply = response["choices"][0]["message"]["content"]
        messages.append({"role": "assistant", "content": reply})
        return jsonify({"reply": reply})
    except Exception as e:
        return jsonify({"error": str(e)})

if __name__ == "__main__":
    app.run(debug=True)







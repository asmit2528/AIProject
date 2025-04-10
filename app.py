from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import ollama
import os

app = Flask(__name__, static_folder='.')
CORS(app) 

DEBATE_TOPICS = {
    "free_will": {
        "for": ["1. Humans experience genuine choice in decisions", 
                "2. Moral responsibility requires free will",
                "3. Consciousness suggests non-deterministic processes"],
        "against": ["1. Physical universe operates on deterministic laws",
                   "2. Brain processes are causally determined",
                   "3. Libet experiments show decisions precede conscious awareness"]
    },
    "ai_ethics": {
        "for": ["1. AI can reduce human bias in decision making",
               "2. AI can handle tasks too dangerous for humans",
               "3. Properly designed AI can improve quality of life"],
        "against": ["1. AI may perpetuate existing biases in data",
                   "2. Autonomous weapons could be dangerous",
                   "3. Job displacement could cause economic disruption"]
    }
}

def generate_ai_arguments(topic, stance):
    """Generate philosophical arguments using Phi-3-mini"""
    prompt = f"""Generate 3 concise numbered arguments {stance} {topic}.
    Each argument should:
    - Be 1-2 sentences
    - Reference relevant philosophers when possible
    - Avoid flowery language
    
    Example format:
    1. First argument...
    2. Second argument..."""
    
    try:
        response = ollama.generate(
            model='phi3:mini',
            prompt=prompt,
            options={'temperature': 0.7, 'num_threads': 4}  # Optimized for your PC
        )
        
        return [line.strip() for line in response['response'].split('\n') 
                if line.strip() and line[0].isdigit()][:3]
    except Exception as e:
        print(f"AI Error: {e}")
        return [
            f"1. [AI Unavailable] Sample argument {stance} {topic}",
            f"2. Please try again later",
            f"3. Check console for errors"
        ]

@app.route('/')
def serve_index():
    return send_from_directory('.', 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory('.', path)

@app.route('/get_arguments', methods=['POST'])
def get_arguments():
    data = request.get_json() 
    
    if not data:
        return jsonify({"error": "No data received"}), 400
    
    topic = data.get('topic')
    stance = data.get('stance')
    
    if not topic or not stance:
        return jsonify({"error": "Missing topic or stance"}), 400
    
    if topic in DEBATE_TOPICS:
        arguments = DEBATE_TOPICS[topic][stance]
    else:
        
        arguments = generate_ai_arguments(topic, stance)
    
    return jsonify({"arguments": arguments})

if __name__ == '__main__':
    app.run(debug=True, port=5000, host='0.0.0.0')
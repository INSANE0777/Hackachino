from flask import Flask, request, jsonify
from flask_cors import CORS
import json
from agent import process_topic, detect_fake_news, generate_summary, fact_check, AgentState

app = Flask(__name__)
CORS(app)

@app.route('/api/news', methods=['GET'])
def get_news():
    topic = request.args.get('topic', 'technology')
    if not topic:
        return jsonify({"error": "Topic parameter is required"}), 400
        
    try:
        result = process_topic(topic)
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/analyze', methods=['POST'])
def analyze_article():
    data = request.json
    if not data or 'articleTitle' not in data or 'articleText' not in data:
        return jsonify({"error": "Article title and text are required"}), 400
        
    try:
        # Create a state with a single article
        state = AgentState()
        state.topic = data.get('topic', 'news')
        state.articles = [{
            "title": data['articleTitle'],
            "content": data['articleText'],
            "url": data.get('articleUrl', ''),
            "description": data.get('articleDescription', ''),
            "source": {
                "name": data.get('sourceName', 'Unknown'),
                "url": data.get('sourceUrl', '')
            }
        }]
        
        # Run fact check on the article
        result_state = fact_check(state)
        
        if result_state.articles and result_state.articles[0].get('factCheck'):
            return jsonify(result_state.articles[0]['factCheck'])
        else:
            return jsonify({
                "error": "Failed to analyze article",
                "credibilityScore": 5,
                "reliabilityPoints": [
                    "Error analyzing article content",
                    "Consider cross-checking with other sources",
                    "Review the article critically before sharing",
                    "Consult established fact-checking organizations"
                ],
                "misinformationWarning": "Analysis error - please review content carefully",
                "sourceVerification": [
                    "Source verification failed due to technical error",
                    "Consider manual verification through fact-checking websites"
                ],
                "contentIssues": [],
                "suggestedSources": [
                    "Associated Press (AP)",
                    "Reuters",
                    "BBC"
                ]
            }), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/summary', methods=['POST'])
def generate_article_summary():
    data = request.json
    if not data or 'articleTitle' not in data or 'articleText' not in data:
        return jsonify({"error": "Article title and text are required"}), 400
        
    try:
        # Create a state with a single article
        state = AgentState()
        state.topic = data.get('topic', 'news')
        state.articles = [{
            "title": data['articleTitle'],
            "content": data['articleText'],
            "url": data.get('articleUrl', ''),
            "description": data.get('articleDescription', '')
        }]
        
        # Generate summary for the article
        result_state = generate_summary(state)
        
        if result_state.articles and result_state.articles[0].get('aiSummary'):
            return jsonify({"summaryPoints": result_state.articles[0]['aiSummary']})
        else:
            return jsonify({
                "error": "Failed to generate summary",
                "summaryPoints": [
                    f"Key insights about this {state.topic} story",
                    f"Important context regarding {state.topic} developments",
                    f"What this means for the future of {state.topic}"
                ]
            }), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/fake-news-detection', methods=['POST'])
def detect_fake_news_endpoint():
    data = request.json
    if not data or 'articleTitle' not in data or 'articleText' not in data:
        return jsonify({"error": "Article title and text are required"}), 400
        
    try:
        # Create a state with a single article
        state = AgentState()
        state.topic = data.get('topic', 'news')
        state.articles = [{
            "title": data['articleTitle'],
            "content": data['articleText'],
            "url": data.get('articleUrl', ''),
            "description": data.get('articleDescription', '')
        }]
        
        # Detect fake news for the article
        result_state = detect_fake_news(state)
        
        if result_state.articles:
            article = result_state.articles[0]
            return jsonify({
                "fakeNewsScore": article.get("fakeNewsScore", 0.5),
                "isFake": article.get("isFake", False),
                "explanation": article.get("fakeNewsExplanation", "No explanation provided")
            })
        else:
            return jsonify({
                "error": "Failed to detect fake news",
                "fakeNewsScore": 0.5,
                "isFake": False,
                "explanation": "Analysis failed"
            }), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=False, port=5000)
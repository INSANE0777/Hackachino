import os
from typing import List, Dict, Any, Optional
import requests
import json
from datetime import datetime
from langgraph.graph import StateGraph, END

# API Keys
GNEWS_API_KEY = "0df18457d9e427b44923da3997c56732"
GEMINI_API_KEY = "AIzaSyBo0_nEWdFfUgNWawGmGOHcm4Sm3Av0coQ"
GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent"

# State definition
class AgentState:
    def __init__(self):
        self.topic: str = ""
        self.articles: List[Dict[str, Any]] = []
        self.analyzed_articles: List[Dict[str, Any]] = []
        self.error: Optional[str] = None
        self.completed: bool = False

# Agent functions
def fetch_news(state: AgentState) -> AgentState:
    """Fetch news articles from GNews API based on the topic."""
    try:
        topic = state.topic
        url = f"https://gnews.io/api/v4/search?q={encodeURIComponent(topic)}&token={GNEWS_API_KEY}&lang=en"
        
        response = requests.get(url)
        if response.status_code != 200:
            state.error = f"Failed to fetch news: {response.status_code}"
            return state
            
        data = response.json()
        articles = data.get("articles", [])
        
        # Transform articles to our format
        transformed_articles = []
        for article in articles[:5]:  # Limit to 5 articles for efficiency
            transformed_article = {
                "title": article.get("title", ""),
                "description": article.get("description", ""),
                "content": article.get("content", ""),
                "url": article.get("url", ""),
                "image": article.get("image", f"https://source.unsplash.com/random/800x600/?{topic}"),
                "publishedAt": article.get("publishedAt", datetime.now().isoformat()),
                "source": {
                    "name": article.get("source", {}).get("name", "Unknown Source"),
                    "url": article.get("source", {}).get("url", "#"),
                },
                "aiSummary": [],
                "factCheck": None
            }
            transformed_articles.append(transformed_article)
            
        state.articles = transformed_articles
    except Exception as e:
        state.error = f"Error fetching news: {str(e)}"
    
    return state

def detect_fake_news(state: AgentState) -> AgentState:
    """Detect fake news using Gemini API."""
    if not state.articles:
        return state
        
    for article in state.articles:
        try:
            # Combine title and content for analysis
            text = f"{article['title']} {article['content']}"
            
            prompt = f"""
            You are an expert in detecting fake news and misinformation.
            
            Please analyze the following news article and determine if it contains fake news or misinformation:
            
            Title: {article['title']}
            Content: {text}
            
            Provide a score from 0 to 1 indicating the likelihood that this is fake news (0 = definitely real, 1 = definitely fake).
            Also provide a brief explanation of your reasoning.
            
            Format your response as a JSON object with these fields:
            - fakeNewsScore (number between 0 and 1)
            - explanation (string)
            - isFake (boolean, true if score > 0.5)
            """
            
            response = requests.post(
                f"{GEMINI_API_URL}?key={GEMINI_API_KEY}",
                headers={"Content-Type": "application/json"},
                json={
                    "contents": [{"parts": [{"text": prompt}]}],
                    "generationConfig": {
                        "temperature": 0.1,
                        "maxOutputTokens": 1024,
                    }
                }
            )
            
            if response.status_code != 200:
                raise Exception(f"Gemini API error: {response.status_code}")
                
            data = response.json()
            generated_text = data.get("candidates", [{}])[0].get("content", {}).get("parts", [{}])[0].get("text", "")
            
            # Extract JSON from response
            import re
            json_match = re.search(r'(\{.*\})', generated_text, re.DOTALL)
            if json_match:
                result = json.loads(json_match.group(1))
                article["fakeNewsScore"] = result.get("fakeNewsScore", 0.5)
                article["isFake"] = result.get("isFake", False)
                article["fakeNewsExplanation"] = result.get("explanation", "No explanation provided")
            else:
                # Fallback if JSON parsing fails
                article["fakeNewsScore"] = 0.3
                article["isFake"] = False
                article["fakeNewsExplanation"] = "Could not analyze with confidence"
                
        except Exception as e:
            article["fakeNewsScore"] = 0.5
            article["isFake"] = False
            article["fakeNewsExplanation"] = f"Error in fake news detection: {str(e)}"
    
    return state

def generate_summary(state: AgentState) -> AgentState:
    """Generate AI summaries for each article using Gemini API."""
    if not state.articles:
        return state
        
    for article in state.articles:
        try:
            # Skip if content is too short
            if len(article["content"]) < 50:
                article["aiSummary"] = [
                    f"Key insights about this {state.topic} story",
                    f"Important context regarding {state.topic} developments",
                    f"What this means for the future of {state.topic}"
                ]
                continue
                
            prompt = f"""
            You are a specialized AI that creates brief, insightful summaries of news articles.
            
            Here's an article about {state.topic}:
            Title: {article['title']}
            
            Content: {article['content']}
            
            Generate exactly 3 bullet points that summarize the key insights from this article.
            Each bullet point should be a single sentence and should highlight different aspects:
            1. The main news or development
            2. Important context or background information
            3. The potential impact or significance
            
            Format your response as a JSON array of strings, each string being one bullet point.
            """
            
            response = requests.post(
                f"{GEMINI_API_URL}?key={GEMINI_API_KEY}",
                headers={"Content-Type": "application/json"},
                json={
                    "contents": [{"parts": [{"text": prompt}]}],
                    "generationConfig": {
                        "temperature": 0.2,
                        "maxOutputTokens": 1024,
                    }
                }
            )
            
            if response.status_code != 200:
                raise Exception(f"Gemini API error: {response.status_code}")
                
            data = response.json()
            generated_text = data.get("candidates", [{}])[0].get("content", {}).get("parts", [{}])[0].get("text", "")
            
            # Try to parse as JSON
            try:
                if generated_text.strip().startswith('[') and generated_text.strip().endswith(']'):
                    summary_points = json.loads(generated_text.strip())
                    article["aiSummary"] = summary_points[:3]
                else:
                    # Extract bullet points by splitting text
                    summary_points = [line.strip() for line in generated_text.split('\n') if line.strip()]
                    article["aiSummary"] = summary_points[:3]
            except:
                # Fallback to splitting by newlines
                summary_points = [line.strip() for line in generated_text.split('\n') if line.strip()]
                article["aiSummary"] = summary_points[:3]
                
            # Ensure we have 3 points
            while len(article["aiSummary"]) < 3:
                article["aiSummary"].append(f"Additional insight about {state.topic}")
                
        except Exception as e:
            article["aiSummary"] = [
                f"Key insights about this {state.topic} story",
                f"Important context regarding {state.topic} developments",
                f"What this means for the future of {state.topic}"
            ]
            article["error"] = f"Error generating summary: {str(e)}"
    
    return state

def fact_check(state: AgentState) -> AgentState:
    """Perform fact checking on each article using Gemini API."""
    if not state.articles:
        return state
        
    for article in state.articles:
        try:
            # Only skip if content is extremely short (less than 20 chars)
            if len(article["content"]) < 20:
                article["factCheck"] = {
                    "credibilityScore": 5,
                    "reliabilityPoints": [
                        "Insufficient content for detailed analysis",
                        "Consider cross-checking with other sources",
                        "Review the article critically before sharing",
                        "Consult established fact-checking organizations"
                    ],
                    "misinformationWarning": "Limited content available for analysis",
                    "sourceVerification": [
                        "Source verification requires more content",
                        "Consider checking fact-checking websites"
                    ],
                    "contentIssues": [],
                    "suggestedSources": [
                        "Associated Press (AP)",
                        "Reuters",
                        "BBC"
                    ]
                }
                continue
                
            # Improved prompt for better fact-checking
            prompt = f"""
            You are a professional fact-checker with expertise in source verification and misinformation detection.
            
            Here's a news article or statement to analyze:
            Title: {article['title']}
            Content: {article['content']}
            Source: {article.get('url', 'Unknown')}
            
            Please perform a comprehensive analysis of this content:
            
            1. Credibility Assessment:
               - Evaluate the credibility on a scale of 1-10 (where 10 is highly credible)
               - Even with limited content, provide your best assessment
               - Consider factors like factual accuracy, logical consistency, and potential bias
            
            2. Source Verification:
               - If a source is provided, evaluate its reliability
               - If no source is provided, suggest what reliable sources might cover this topic
            
            3. Content Analysis:
               - Look for logical fallacies or misleading framing
               - Check for emotional manipulation or sensationalism
               - Identify potential partisan bias or agenda-driven content
            
            4. Reliability Points:
               - Provide 3-5 specific points about the reliability of this content
               - Include both strengths and potential weaknesses
            
            5. Misinformation Warning:
               - If applicable, provide a specific warning about potential misinformation
               - If not applicable, return null for this field
            
            Format your response as a JSON object with these fields:
            - credibilityScore (number between 1-10)
            - reliabilityPoints (array of strings)
            - misinformationWarning (string or null)
            - sourceVerification (array of strings)
            - contentIssues (array of strings)
            - suggestedSources (array of strings)
            """
            
            response = requests.post(
                f"{GEMINI_API_URL}?key={GEMINI_API_KEY}",
                headers={"Content-Type": "application/json"},
                json={
                    "contents": [{"parts": [{"text": prompt}]}],
                    "generationConfig": {
                        "temperature": 0.2,
                        "maxOutputTokens": 2048,
                    }
                }
            )
            
            if response.status_code != 200:
                print(f"Gemini API error: {response.status_code}")
                print(response.text)
                raise Exception(f"Gemini API error: {response.status_code}")
                
            data = response.json()
            generated_text = data.get("candidates", [{}])[0].get("content", {}).get("parts", [{}])[0].get("text", "")
            
            # Extract JSON from response
            import re
            json_match = re.search(r'(\{.*\})', generated_text, re.DOTALL)
            if json_match:
                result = json.loads(json_match.group(1))
                article["factCheck"] = {
                    "credibilityScore": result.get("credibilityScore", 5),
                    "reliabilityPoints": result.get("reliabilityPoints", []),
                    "misinformationWarning": result.get("misinformationWarning", None),
                    "sourceVerification": result.get("sourceVerification", []),
                    "contentIssues": result.get("contentIssues", []),
                    "suggestedSources": result.get("suggestedSources", [])
                }
                print(f"Successfully fact-checked article: {article['title'][:30]}...")
            else:
                print(f"Failed to parse JSON from Gemini response: {generated_text[:100]}...")
                # More informative fallback
                article["factCheck"] = {
                    "credibilityScore": 5,
                    "reliabilityPoints": [
                        "AI analysis encountered formatting issues",
                        "Consider cross-checking with other sources",
                        "Review the content critically before sharing"
                    ],
                    "misinformationWarning": "AI analysis was incomplete - exercise caution",
                    "sourceVerification": [
                        "Source verification was not completed",
                        "Consider checking fact-checking websites"
                    ],
                    "contentIssues": [],
                    "suggestedSources": [
                        "Associated Press (AP)",
                        "Reuters",
                        "BBC"
                    ]
                }
                
        except Exception as e:
            print(f"Error in fact_check: {str(e)}")
            # Provide a more informative error response
            article["factCheck"] = {
                "credibilityScore": 5,
                "reliabilityPoints": [
                    f"Error during analysis: {str(e)}",
                    "Consider cross-checking with other sources",
                    "Review the content critically before sharing"
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
            }
    
    return state

def finalize_results(state: AgentState) -> AgentState:
    """Finalize the results and mark the process as completed."""
    state.analyzed_articles = state.articles
    state.completed = True
    return state

# Build the graph
def build_agent_graph():
    workflow = StateGraph(AgentState)
    
    # Add nodes
    workflow.add_node("fetch_news", fetch_news)
    workflow.add_node("detect_fake_news", detect_fake_news)
    workflow.add_node("generate_summary", generate_summary)
    workflow.add_node("fact_check", fact_check)
    workflow.add_node("finalize_results", finalize_results)
    
    # Add edges
    workflow.add_edge("fetch_news", "detect_fake_news")
    workflow.add_edge("detect_fake_news", "generate_summary")
    workflow.add_edge("generate_summary", "fact_check")
    workflow.add_edge("fact_check", "finalize_results")
    workflow.add_edge("finalize_results", END)
    
    # Set the entry point
    workflow.set_entry_point("fetch_news")
    
    return workflow.compile()

# Create the agent
news_agent = build_agent_graph()

# Function to process a topic
def process_topic(topic: str) -> Dict[str, Any]:
    """Process a topic through the news agent workflow."""
    initial_state = AgentState()
    initial_state.topic = topic
    
    # Run the agent
    result = news_agent.invoke(initial_state)
    
    # Return the results
    return {
        "topic": result.topic,
        "articles": result.analyzed_articles,
        "error": result.error
    }

# Helper function to encode URI components
def encodeURIComponent(s):
    import urllib.parse
    return urllib.parse.quote(s, safe='')

# Example usage
if __name__ == "__main__":
    result = process_topic("artificial intelligence")
    print(f"Processed {len(result['articles'])} articles on {result['topic']}")
    if result["error"]:
        print(f"Error: {result['error']}")
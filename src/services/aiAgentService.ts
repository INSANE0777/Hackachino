import { NewsResponse, FactCheckResult } from "../types/types";

const AI_AGENT_API_URL = "http://localhost:5000/api";

export const fetchNewsFromAgent = async (topic: string): Promise<NewsResponse> => {
  try {
    console.log(`Fetching news from AI agent for topic: ${topic}`);
    
    const response = await fetch(
      `${AI_AGENT_API_URL}/news?topic=${encodeURIComponent(topic)}`
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch news from AI agent: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log(`Received ${data.articles?.length || 0} articles from AI agent for topic: ${topic}`);
    
    // Transform the AI agent response to match our app's NewsResponse structure
    const transformedData: NewsResponse = {
      totalArticles: data.articles?.length || 0,
      articles: data.articles || []
    };
    
    return transformedData;
  } catch (error) {
    console.error("Error fetching news from AI agent:", error);
    throw error;
  }
};

export const analyzeArticleWithAgent = async (
  articleTitle: string,
  articleText: string,
  articleUrl: string,
  topic: string = "news"
): Promise<FactCheckResult> => {
  try {
    console.log(`Analyzing article with AI agent: ${articleTitle}`);
    
    const response = await fetch(`${AI_AGENT_API_URL}/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        articleTitle,
        articleText,
        articleUrl,
        topic
      })
    });
    
    if (!response.ok) {
      throw new Error(`Failed to analyze article with AI agent: ${response.statusText}`);
    }
    
    return await response.json() as FactCheckResult;
  } catch (error) {
    console.error("Error in analyzeArticleWithAgent service:", error);
    throw error;
  }
};

export const generateSummaryWithAgent = async (
  articleTitle: string,
  articleText: string,
  topic: string = "news"
): Promise<string[]> => {
  try {
    console.log(`Generating summary with AI agent for: ${articleTitle}`);
    
    const response = await fetch(`${AI_AGENT_API_URL}/summary`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        articleTitle,
        articleText,
        topic
      })
    });
    
    if (!response.ok) {
      throw new Error(`Failed to generate summary with AI agent: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.summaryPoints || [];
  } catch (error) {
    console.error("Error in generateSummaryWithAgent service:", error);
    throw error;
  }
};

export interface FakeNewsDetectionResult {
  fakeNewsScore: number;
  isFake: boolean;
  explanation: string;
}

export const detectFakeNewsWithAgent = async (
  articleTitle: string,
  articleText: string,
  topic: string = "news"
): Promise<FakeNewsDetectionResult> => {
  try {
    console.log(`Detecting fake news with AI agent for: ${articleTitle}`);
    
    const response = await fetch(`${AI_AGENT_API_URL}/fake-news-detection`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        articleTitle,
        articleText,
        topic
      })
    });
    
    if (!response.ok) {
      throw new Error(`Failed to detect fake news with AI agent: ${response.statusText}`);
    }
    
    return await response.json() as FakeNewsDetectionResult;
  } catch (error) {
    console.error("Error in detectFakeNewsWithAgent service:", error);
    throw error;
  }
};
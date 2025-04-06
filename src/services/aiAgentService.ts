import { NewsResponse, FactCheckResult } from "../types/types";

const AI_AGENT_API_URL = "http://localhost:5000/api";

// Add this function to your aiAgentService.ts file

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
    
    // Transform and normalize the AI agent response
    const transformedArticles = (data.articles || []).map(article => {
      // Ensure we have proper default values for all fields
      return {
        ...article,
        // Use a fallback image if none provided or use Unsplash for random topic images
        image: article.image || `https://source.unsplash.com/random/800x600/?${encodeURIComponent(topic)}`,
        // Normalize factCheck data
        factCheck: article.factCheck ? {
          ...article.factCheck,
          // Ensure credibilityScore is within 0-10 range
          credibilityScore: article.factCheck.credibilityScore !== undefined 
            ? Math.min(10, Math.max(0, article.factCheck.credibilityScore)) 
            : 5,
          // Ensure we have arrays for these fields
          reliabilityPoints: article.factCheck.reliabilityPoints || [],
          sourceVerification: article.factCheck.sourceVerification || [],
          contentIssues: article.factCheck.contentIssues || [],
          suggestedSources: article.factCheck.suggestedSources || []
        } : null,
        // Normalize fake news detection fields
        fakeNewsScore: article.fakeNewsScore !== undefined 
          ? Math.min(1, Math.max(0, article.fakeNewsScore)) 
          : undefined,
        isFake: article.isFake !== undefined ? article.isFake : undefined
      };
    });
    
    const transformedData: NewsResponse = {
      totalArticles: transformedArticles.length,
      articles: transformedArticles
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
    
    // Add timeout to prevent hanging requests
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
    
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
      }),
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      const errorText = await response.text().catch(() => "Unknown error");
      console.error(`API error (${response.status}): ${errorText}`);
      throw new Error(`Failed to analyze article with AI agent: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log("Received fact check data:", data);
    
    // Validate the response structure
    if (!data || typeof data.credibilityScore !== 'number') {
      console.error("Invalid response format:", data);
      throw new Error("Invalid response format from AI agent");
    }
    
    // Normalize the response
    return {
      credibilityScore: Math.min(10, Math.max(0, data.credibilityScore)),
      reliabilityPoints: Array.isArray(data.reliabilityPoints) ? data.reliabilityPoints : [],
      misinformationWarning: data.misinformationWarning || null,
      sourceVerification: Array.isArray(data.sourceVerification) ? data.sourceVerification : [],
      contentIssues: Array.isArray(data.contentIssues) ? data.contentIssues : [],
      suggestedSources: Array.isArray(data.suggestedSources) ? data.suggestedSources : []
    };
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

// New dedicated fact-checking function
export const factCheckWithAgent = async (
  text: string,
  title: string = "User submitted content",
  source: string = "User input",
  topic: string = "fact check"
): Promise<FactCheckResult> => {
  try {
    console.log(`Fact-checking content with AI agent, length: ${text.length} characters`);
    
    // Add timeout to prevent hanging requests
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 second timeout
    
    const response = await fetch(`${AI_AGENT_API_URL}/fact-check`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        title,
        source,
        topic
      }),
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      const errorText = await response.text().catch(() => "Unknown error");
      console.error(`API error (${response.status}): ${errorText}`);
      throw new Error(`Failed to fact-check content with AI agent: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log("Received fact check data:", data);
    
    // Validate the response structure
    if (!data || typeof data.credibilityScore !== 'number') {
      console.error("Invalid response format:", data);
      throw new Error("Invalid response format from AI agent");
    }
    
    // Normalize the response
    return {
      credibilityScore: Math.min(10, Math.max(0, data.credibilityScore)),
      reliabilityPoints: Array.isArray(data.reliabilityPoints) ? data.reliabilityPoints : [],
      misinformationWarning: data.misinformationWarning || null,
      sourceVerification: Array.isArray(data.sourceVerification) ? data.sourceVerification : [],
      contentIssues: Array.isArray(data.contentIssues) ? data.contentIssues : [],
      suggestedSources: Array.isArray(data.suggestedSources) ? data.suggestedSources : []
    };
  } catch (error) {
    console.error("Error in factCheckWithAgent service:", error);
    throw error;
  }
};
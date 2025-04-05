import { NewsResponse } from "../types/types";

// GNews API configuration
const GNEWS_API_KEY = "1b7830682943b422b72314135bbf981e"; // Provided API key
const GNEWS_BASE_URL = "https://gnews.io/api/v4";

// Gemini API configuration (update with your real API key and endpoint)
const GEMINI_API_KEY = "AIzaSyBo0_nEWdFfUgNWawGmGOHcm4Sm3Av0coQ";
const GEMINI_BASE_URL = "https://gemini.example.com/api/verify"; // Replace with the actual Gemini endpoint

/**
 * Fetch news articles by topic from GNews API.
 */
export const fetchNewsByTopic = async (topic: string): Promise<NewsResponse> => {
  try {
    console.log(`Fetching news for topic: ${topic}`);
    const response = await fetch(
      `${GNEWS_BASE_URL}/search?q=${encodeURIComponent(topic)}&token=${GNEWS_API_KEY}&lang=en`
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch news: ${response.statusText}`);
    }
    const data = await response.json();
    console.log(`Received ${data.articles?.length || 0} articles for topic: ${topic}`);
    
    // Transform response to match our NewsResponse structure
    const transformedData: NewsResponse = {
      totalArticles: data.totalArticles || 0,
      articles: data.articles?.map((article: any) => ({
        title: article.title || "",
        description: article.description || "",
        content: article.content || "",
        url: article.url || "",
        image: article.image || `https://source.unsplash.com/random/800x600/?${topic}`,
        publishedAt: article.publishedAt || new Date().toISOString(),
        source: {
          name: article.source?.name || "Unknown Source",
          url: article.source?.url || "#",
        },
        // Retain mock AI summaries for now
        aiSummary: [
          `Key insights about this ${topic} story`,
          `Important context regarding ${topic} developments`,
          `What this means for the future of ${topic}`
        ]
      })) || []
    };
    
    return transformedData;
  } catch (error) {
    console.error("Error fetching news:", error);
    console.log("Falling back to mock data due to API error");
    return getMockNewsData(topic);
  }
};

/**
 * Fallback function that generates mock news data if API call fails.
 */
const getMockNewsData = (topic: string): NewsResponse => {
  const capitalizedTopic = topic.charAt(0).toUpperCase() + topic.slice(1);
  return {
    totalArticles: 10,
    articles: [
      {
        title: `Latest ${capitalizedTopic} Breakthrough Changes Everything`,
        description: `A groundbreaking development in ${topic} has experts rethinking the entire field.`,
        content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. In the world of ${topic}, this changes everything we thought we knew.`,
        url: "https://example.com/article1",
        image: `https://source.unsplash.com/random/800x600/?${topic}`,
        publishedAt: new Date(Date.now() - 3600000).toISOString(),
        source: {
          name: "Tech Today",
          url: "https://example.com"
        },
        aiSummary: [
          `Revolutionary ${topic} technology exceeds expectations`,
          `Industry experts predict market disruption within months`,
          `Early adoption shows 40% efficiency improvement`
        ]
      },
      {
        title: `"We Were Wrong About ${capitalizedTopic}," Say Leading Researchers`,
        description: `New research challenges conventional wisdom about ${topic} and opens new possibilities.`,
        content: `Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. The implications for ${topic} are far-reaching.`,
        url: "https://example.com/article2",
        image: `https://source.unsplash.com/random/800x600/?${topic},news`,
        publishedAt: new Date(Date.now() - 7200000).toISOString(),
        source: {
          name: "Science Daily",
          url: "https://example.com"
        },
        aiSummary: [
          `Previous ${topic} assumptions proven incorrect by new data`,
          `Alternative approach shows promising results in early trials`,
          `Collaboration between competing teams led to the discovery`
        ]
      },
      {
        title: `Five Ways ${capitalizedTopic} Will Impact Your Business`,
        description: `Industry analysis shows how ${topic} is transforming the business landscape and what you need to know.`,
        content: `Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. For businesses involved with ${topic}, preparation is key.`,
        url: "https://example.com/article3",
        image: `https://source.unsplash.com/random/800x600/?${topic},business`,
        publishedAt: new Date(Date.now() - 14400000).toISOString(),
        source: {
          name: "Business Insider",
          url: "https://example.com"
        },
        aiSummary: [
          `${capitalizedTopic} adoption predicted to grow 65% by next quarter`,
          `Small businesses seeing greatest benefit from implementation`,
          `Strategic partnerships emerging as key success factor`
        ]
      }
    ]
  };
};

/**
 * Extracts potential claims from article content.
 * Here we simply split by sentence and filter for ones containing indicative verbs.
 */
function extractClaims(articleContent: string): string[] {
  const sentences = articleContent
    .split('.')
    .map(sentence => sentence.trim())
    .filter(sentence => sentence.length > 0);
  // Filter sentences that include common claim indicators
  return sentences.filter(sentence =>
    sentence.includes(" is ") || sentence.includes(" has ") || sentence.includes(" are ")
  );
}

/**
 * Calls the Gemini API to verify a specific claim.
 */
async function verifyClaimWithGemini(claim: string): Promise<boolean> {
  const prompt = `Verify the following claim using reliable sources: "${claim}"`;
  try {
    const response = await fetch(GEMINI_BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${GEMINI_API_KEY}`
      },
      body: JSON.stringify({ prompt })
    });
    if (!response.ok) {
      throw new Error(`Gemini API call failed: ${response.statusText}`);
    }
    const result = await response.json();
    // Adjust this logic based on the actual response structure from Gemini.
    // For example, if the API returns a confidence score or a boolean field "isVerified":
    return result.isVerified || false;
  } catch (error) {
    console.error("Error verifying claim with Gemini:", error);
    return false;
  }
}

/**
 * Assesses an article's authenticity by verifying its extracted claims.
 */
export async function assessArticleAuthenticity(article: any): Promise<string> {
  const claims = extractClaims(article.content);
  if (claims.length === 0) {
    return "No verifiable claims found";
  }
  let verifiedCount = 0;
  for (const claim of claims) {
    if (await verifyClaimWithGemini(claim)) {
      verifiedCount++;
    }
  }
  const verificationRate = verifiedCount / claims.length;
  return verificationRate < 0.5 ? "Potentially Fake or Misleading" : "Likely Authentic";
}

/**
 * Example usage:
 * Fetch news on a given topic and then assess the authenticity of each article.
 */
export async function fetchAndVerifyNews(topic: string) {
  const newsData = await fetchNewsByTopic(topic);
  for (const article of newsData.articles) {
    const authenticity = await assessArticleAuthenticity(article);
    console.log(`Article: ${article.title}`);
    console.log(`Authenticity: ${authenticity}`);
  }
}

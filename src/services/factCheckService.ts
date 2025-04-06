
// Make sure the export is at the top level
import { supabase } from "@/integrations/supabase/client";
import { FactCheckResult } from "@/types/types";
import { analyzeArticleWithAgent } from "./aiAgentService";

// Export this function to be used in NewsCard component
export const analyzeArticleWithAIAgent = async (
  articleTitle: string,
  articleText: string,
  articleUrl: string,
  topic: string = "news"
): Promise<FactCheckResult> => {
  try {
    console.log(`Analyzing article with AI agent: ${articleTitle}`);
    
    // First try the AI agent
    try {
      const result = await analyzeArticleWithAgent(articleTitle, articleText, articleUrl, topic);
      
      // Validate the result to ensure it has the expected structure
      if (result && typeof result.credibilityScore === 'number') {
        console.log(`Successfully analyzed article with AI agent: ${articleTitle}`);
        return result;
      }
    } catch (aiError) {
      console.error("AI agent analysis failed, falling back to Supabase:", aiError);
    }
    
    // If AI agent fails, fall back to Supabase
    return await analyzeArticle(articleTitle, articleText, articleUrl);
  } catch (error) {
    console.error("All fact-checking methods failed:", error);
    // Return a more informative default result
    return createDefaultFactCheckResult(articleTitle, articleUrl);
  }
};

export const analyzeArticle = async (
  articleTitle: string,
  articleText: string,
  articleUrl: string
): Promise<FactCheckResult> => {
  try {
    console.log(`Analyzing article with Supabase: ${articleTitle}`);
    
    const response = await supabase.functions.invoke('analyze-article', {
      body: {
        articleTitle,
        articleText,
        articleUrl
      }
    });
    
    if (response.error) {
      console.error("Error analyzing article with Supabase:", response.error);
      throw new Error(response.error.message);
    }
    
    // Validate and normalize the response
    const result = response.data as FactCheckResult;
    if (!result || typeof result.credibilityScore !== 'number') {
      throw new Error("Invalid response format from Supabase function");
    }
    
    return result;
  } catch (error) {
    console.error("Error in analyzeArticle service:", error);
    return createDefaultFactCheckResult(articleTitle, articleUrl);
  }
};

// Helper function to create a default fact check result
function createDefaultFactCheckResult(title: string, url: string): FactCheckResult {
  // Extract domain from URL for source suggestions
  let domain = "";
  try {
    if (url) {
      const urlObj = new URL(url);
      domain = urlObj.hostname.replace('www.', '');
    }
  } catch (e) {
    console.error("Error parsing URL:", e);
  }
  
  return {
    credibilityScore: 5,
    reliabilityPoints: [
      "This article requires manual verification",
      "Consider cross-checking with other sources",
      "Look for corroborating evidence from established news outlets"
    ],
    misinformationWarning: null,
    sourceVerification: [
      domain ? `Source: ${domain} - Verification pending` : "Source verification pending",
      "Consider checking the publisher's reputation and track record"
    ],
    contentIssues: [],
    suggestedSources: [
      "Associated Press (AP)",
      "Reuters",
      "BBC",
      "The New York Times",
      "The Washington Post"
    ]
  };
}
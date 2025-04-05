
import { supabase } from "@/integrations/supabase/client";
import { FactCheckResult } from "@/types/types";
import { analyzeArticleWithAgent } from "./aiAgentService";

// Add a new function to use the AI agent
export const analyzeArticleWithAIAgent = async (
  articleTitle: string,
  articleText: string,
  articleUrl: string,
  topic: string = "news"
): Promise<FactCheckResult> => {
  try {
    return await analyzeArticleWithAgent(articleTitle, articleText, articleUrl, topic);
  } catch (error) {
    console.error("Error analyzing article with AI agent:", error);
    // Fall back to the original method
    return analyzeArticle(articleTitle, articleText, articleUrl);
  }
};

export const analyzeArticle = async (
  articleTitle: string,
  articleText: string,
  articleUrl: string
): Promise<FactCheckResult> => {
  try {
    console.log(`Analyzing article: ${articleTitle}`);
    
    const response = await supabase.functions.invoke('analyze-article', {
      body: {
        articleTitle,
        articleText,
        articleUrl
      }
    });
    
    if (response.error) {
      console.error("Error analyzing article:", response.error);
      throw new Error(response.error.message);
    }
    
    return response.data as FactCheckResult;
  } catch (error) {
    console.error("Error in analyzeArticle service:", error);
    return {
      credibilityScore: 5,
      reliabilityPoints: [
        "Error analyzing article content",
        "Consider cross-checking with other sources",
        "Review the article critically before sharing",
        "Consult established fact-checking organizations"
      ],
      misinformationWarning: "Analysis error - please review content carefully",
      sourceVerification: [
        "Source verification failed due to technical error",
        "Consider manual verification through fact-checking websites"
      ],
      contentIssues: [],
      suggestedSources: [
        "Associated Press (AP)",
        "Reuters",
        "BBC"
      ]
    };
  }
};
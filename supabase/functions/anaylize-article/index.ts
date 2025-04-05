
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const GEMINI_API_KEY = "AIzaSyBo0_nEWdFfUgNWawGmGOHcm4Sm3Av0coQ";
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { articleTitle, articleText, articleUrl } = await req.json();
    
    if (!articleTitle && !articleText) {
      throw new Error("Article title or text is required");
    }
    
    console.log(`Analyzing article: ${articleTitle || 'Untitled'}`);
    
    const prompt = `
      You are a professional fact-checker with expertise in source verification and misinformation detection.
      
      Here's a news article to analyze:
      Title: ${articleTitle || 'Untitled'}
      Content: ${articleText || ''}
      Source URL: ${articleUrl || 'No URL provided'}
      
      Please perform a comprehensive analysis of this article:
      
      1. Credibility Assessment:
         - Evaluate the credibility on a scale of 1-10 (where 10 is highly credible)
         - Consider factors like source reputation, author expertise, citation quality, and evidence presented
      
      2. Source Verification:
         - Identify which authoritative sources would typically cover this topic
         - Note if information contradicts established reliable sources
         - Check if claims align with consensus among reputable outlets
      
      3. Content Analysis:
         - Look for logical fallacies or misleading framing
         - Check for emotional manipulation or sensationalism
         - Identify potential partisan bias or agenda-driven content
         - Note any information presented out of context
      
      4. Reliability Points:
         - Provide 4-5 specific, detailed points about the reliability of this article
         - Include both strengths and potential weaknesses in reporting
      
      5. Misinformation Warning:
         - If applicable, provide a specific warning about potential misinformation
         - Explain exactly what claims may be misleading and why
         - Suggest specific trusted sources where one could verify these claims
      
      Format your response as a JSON object with these fields:
      - credibilityScore (number between 1-10)
      - reliabilityPoints (array of 4-5 detailed strings)
      - misinformationWarning (detailed string or null if no issues detected)
      - sourceVerification (array of 2-3 strings with source verification details)
      - contentIssues (array of strings highlighting specific content issues, or empty array if none)
      - suggestedSources (array of strings naming 2-3 reliable sources that could verify this topic)
      
      Be objective, evidence-based and thorough in your analysis.
    `;

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: prompt }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.1,
          maxOutputTokens: 2048,
        }
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error("Gemini API error:", data);
      throw new Error(`Gemini API error: ${data.error?.message || 'Unknown error'}`);
    }
    
    let analysisResult = {};
    
    try {
      // Extract the text from the response
      const generatedText = data.candidates[0]?.content?.parts[0]?.text || "";
      
      console.log("Raw Gemini response:", generatedText);
      
      // Try to parse as JSON
      if (generatedText.includes("{") && generatedText.includes("}")) {
        // Extract JSON object from text (in case there's additional text around it)
        const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          analysisResult = JSON.parse(jsonMatch[0]);
        }
      }
      
      // If parsing fails, provide a default analysis
      if (!analysisResult || Object.keys(analysisResult).length === 0) {
        analysisResult = {
          credibilityScore: 5,
          reliabilityPoints: [
            "Automated analysis could not determine specific reliability factors",
            "Consider cross-checking with other sources",
            "Review article for potential bias or unverified claims",
            "Evaluate the source's track record for factual reporting"
          ],
          misinformationWarning: "Could not perform detailed analysis of this content",
          sourceVerification: [
            "Unable to verify sources automatically",
            "Consider checking fact-checking websites like Snopes or FactCheck.org"
          ],
          contentIssues: [],
          suggestedSources: [
            "Associated Press (AP)",
            "Reuters",
            "BBC"
          ]
        };
      }
    } catch (error) {
      console.error("Error parsing Gemini response:", error);
      analysisResult = {
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

    console.log("Analysis result:", analysisResult);
    
    return new Response(JSON.stringify(analysisResult), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("Error in analyze-article function:", error);
    return new Response(JSON.stringify({ 
      error: error.message,
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
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
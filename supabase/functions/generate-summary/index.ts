
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
    const { articleText, articleTitle, topic } = await req.json();
    
    if (!articleText || articleText.trim() === '') {
      throw new Error("Article text is required");
    }
    
    console.log(`Generating summary for article: ${articleTitle || 'Untitled'} on topic: ${topic || 'Unknown'}`);
    
    const prompt = `
      You are a specialized AI that creates brief, insightful summaries of news articles.
      
      Here's an article about ${topic || 'a news topic'}:
      Title: ${articleTitle || 'Untitled'}
      
      Content: ${articleText}
      
      Generate exactly 3 bullet points that summarize the key insights from this article.
      Each bullet point should be a single sentence and should highlight different aspects:
      1. The main news or development
      2. Important context or background information
      3. The potential impact or significance
      
      Format your response as a JSON array of strings, each string being one bullet point.
      Do not include any other text, explanations or formatting.
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
          temperature: 0.2,
          maxOutputTokens: 200,
        }
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error("Gemini API error:", data);
      throw new Error(`Gemini API error: ${data.error?.message || 'Unknown error'}`);
    }
    
    let summaryPoints = [];
    
    try {
      // Try to extract the text from the response
      const generatedText = data.candidates[0]?.content?.parts[0]?.text || "";
      
      // Try to parse as JSON if it looks like JSON
      if (generatedText.trim().startsWith('[') && generatedText.trim().endsWith(']')) {
        try {
          summaryPoints = JSON.parse(generatedText.trim());
        } catch (e) {
          // If parsing fails, use regex to extract points
          const pointsMatch = generatedText.match(/["'](.+?)["']/g);
          if (pointsMatch) {
            summaryPoints = pointsMatch.map(m => m.replace(/^["']|["']$/g, ''));
          } else {
            // Split by lines as last resort
            summaryPoints = generatedText.split(/\n/).map(line => 
              line.replace(/^["\'\d\.\s-]*|["\'\s]*$/g, '')
            ).filter(line => line.length > 10);
          }
        }
      } else {
        // If not JSON format, extract bullet points by splitting text
        summaryPoints = generatedText.split(/\n/).map(line => 
          line.replace(/^["\'\d\.\s-]*|["\'\s]*$/g, '')
        ).filter(line => line.length > 10);
      }
      
      // Limit to 3 points
      summaryPoints = summaryPoints.slice(0, 3);
      
      // If we still don't have 3 points, add generic ones
      while (summaryPoints.length < 3) {
        summaryPoints.push(`Key insight about ${topic || 'this'} topic`);
      }
      
    } catch (error) {
      console.error("Error parsing Gemini response:", error);
      summaryPoints = [
        `Major development in ${topic || 'this field'}`,
        `Important context regarding ${topic || 'the situation'}`,
        `Potential impact on ${topic || 'related areas'}`
      ];
    }

    console.log("Generated summary points:", summaryPoints);
    
    return new Response(JSON.stringify({ summaryPoints }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("Error in generate-summary function:", error);
    return new Response(JSON.stringify({ 
      error: error.message,
      summaryPoints: [
        "Error generating summary",
        "Please try again later",
        "Or check the article content"
      ] 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
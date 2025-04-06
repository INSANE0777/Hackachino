
import React, { useState } from 'react';
import { NewsArticle } from '@/types/types';
import { formatDistanceToNow } from 'date-fns';
import { analyzeArticle, analyzeArticleWithAIAgent, FactCheckResult } from '@/services/factCheckService';
import FactCheckBadge from './FactCheckBadge';
import FactCheckResultComponent from './FactCheckResult';
import { AlertTriangle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";

interface NewsCardProps {
  article: NewsArticle;
  color?: string;
  onReadMore?: () => void;
}

const NewsCard: React.FC<NewsCardProps> = ({ article, color = 'pop-blue', onReadMore }) => {
  const { title, description, url, image, publishedAt, source, aiSummary, content } = article;
  const [factCheckResult, setFactCheckResult] = useState<FactCheckResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showFactCheck, setShowFactCheck] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  // Format date to relative time
  const formattedDate = formatDistanceToNow(new Date(publishedAt), { addSuffix: true });
  
  // Use a random background color if none provided
  const cardColors = ['pop-blue', 'pop-red', 'pop-yellow', 'pop-green', 'pop-purple'];
  const bgColor = color || cardColors[Math.floor(Math.random() * cardColors.length)];
  
  const defaultImage = "/images/news-placeholder.jpg";
  
  // Handle image loading errors
  const handleImageError = () => {
    setImageError(true);
  };

  // Improved reliability classification logic
  let reliabilityClass = "bg-gray-400"; // Default neutral
  let reliabilityText = "Unverified";
  
  // Check if we have factCheck data from the AI agent
  if (article.factCheck) {
    const credibilityScore = article.factCheck.credibilityScore || 5;
    
    // More balanced credibility thresholds
    if (credibilityScore >= 8) {
      reliabilityClass = "bg-green-500";
      reliabilityText = "Highly Reliable";
    } else if (credibilityScore >= 6) {
      reliabilityClass = "bg-green-400";
      reliabilityText = "Reliable";
    } else if (credibilityScore >= 4) {
      reliabilityClass = "bg-yellow-500";
      reliabilityText = "Moderate";
    } else if (credibilityScore >= 2) {
      reliabilityClass = "bg-orange-500";
      reliabilityText = "Questionable";
    } else {
      reliabilityClass = "bg-red-500";
      reliabilityText = "Unreliable";
    }
  } 
  // Check if we have fake news detection data
  else if (article.isFake !== undefined) {
    // If we have fake news detection but no fact check
    if (article.isFake === true) {
      reliabilityClass = "bg-red-500";
      reliabilityText = "Unreliable";
    } else if (article.isFake === false) {
      reliabilityClass = "bg-green-500";
      reliabilityText = "Reliable";
    }
  }
  // Check if we have a fakeNewsScore
  else if (article.fakeNewsScore !== undefined) {
    const score = article.fakeNewsScore;
    if (score <= 0.2) {
      reliabilityClass = "bg-green-500";
      reliabilityText = "Reliable";
    } else if (score <= 0.4) {
      reliabilityClass = "bg-green-400";
      reliabilityText = "Mostly Reliable";
    } else if (score <= 0.6) {
      reliabilityClass = "bg-yellow-500";
      reliabilityText = "Moderate";
    } else if (score <= 0.8) {
      reliabilityClass = "bg-orange-500";
      reliabilityText = "Questionable";
    } else {
      reliabilityClass = "bg-red-500";
      reliabilityText = "Unreliable";
    }
  }
  // Check source reputation as a fallback
  else if (source && source.name) {
    // List of generally reliable news sources
    const reliableSources = [
      'reuters', 'ap', 'associated press', 'bbc', 'npr', 'pbs', 
      'the new york times', 'washington post', 'wall street journal', 
      'the guardian', 'the economist', 'bloomberg', 'financial times',
      'cnn', 'abc news', 'cbs news', 'nbc news', 'politico', 'axios'
    ];
    
    const sourceLower = source.name.toLowerCase();
    if (reliableSources.some(rs => sourceLower.includes(rs))) {
      reliabilityClass = "bg-green-500";
      reliabilityText = "Trusted Source";
    }
  }
  
  const handleFactCheck = async () => {
    if (factCheckResult) {
      // Toggle display if we already have results
      setShowFactCheck(!showFactCheck);
      return;
    }
    
    setIsAnalyzing(true);
    try {
      console.log("Starting fact check for article:", title);
      // Use the AI agent for fact-checking
      const result = await analyzeArticleWithAIAgent(
        title, 
        content || description || title, 
        url,
        // Pass the topic if available from the article
        article.topic || "news"
      );
      console.log("Fact check result:", result);
      setFactCheckResult(result);
      setShowFactCheck(true);
    } catch (error) {
      console.error("Error fact-checking article:", error);
      // Show a user-friendly error message
      toast({
        title: "Fact-checking failed",
        description: "We couldn't analyze this article. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  return (
    <div className={`card-brutal overflow-hidden mb-8 bg-white hover:-translate-y-1 transition-all`}>
      <div className={`border-b-4 border-pop-black bg-${bgColor} h-2`}></div>
      
      <div className="relative w-full h-48 overflow-hidden">
        <img 
          src={imageError ? defaultImage : (image || defaultImage)} 
          alt={title} 
          className="w-full h-full object-cover"
          onError={handleImageError}
        />
        <div className={`absolute top-0 right-0 ${reliabilityClass} text-white px-2 py-1 text-sm font-bold`}>
          {reliabilityText}
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="font-bold text-sm">{source.name}</span>
          <span className="text-xs text-gray-500">{formattedDate}</span>
        </div>
        
        <h2 className="text-2xl font-bebas mb-3 leading-tight">
          <a href={url} target="_blank" rel="noopener noreferrer" className="hover:text-pop-blue">
            {title}
          </a>
        </h2>
        
        <p className="text-gray-700 mb-4">{description}</p>
        
        {aiSummary && aiSummary.length > 0 && (
          <div className="mt-4 p-4 bg-gray-50 border-l-4 border-pop-purple">
            <h4 className="font-bebas text-lg mb-2">AI SUMMARY</h4>
            <ul className="list-disc pl-5 space-y-1">
              {aiSummary.map((point, index) => (
                <li key={index} className="text-sm">{point}</li>
              ))}
            </ul>
          </div>
        )}
        
        <div className="mt-4 flex flex-wrap gap-2">
          <a 
            href={url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-block px-4 py-2 bg-white border-2 border-pop-black text-sm font-bold hover:bg-gray-100 transition-colors"
          >
            Read Full Article →
          </a>
          
          <button
            onClick={handleFactCheck}
            disabled={isAnalyzing}
            className={`inline-flex items-center px-4 py-2 bg-white border-2 border-pop-black text-sm font-bold hover:bg-gray-100 transition-colors ${
              isAnalyzing ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isAnalyzing ? (
              <>
                <span className="animate-spin mr-2 h-4 w-4 border-t-2 border-b-2 border-pop-black rounded-full"></span>
                Analyzing...
              </>
            ) : factCheckResult ? (
              <>
                <FactCheckBadge score={factCheckResult.credibilityScore} size="sm" showTooltip={false} />
                <span className="ml-2">{showFactCheck ? 'Hide' : 'Show'} Fact Check</span>
              </>
            ) : (
              <>
                <AlertTriangle className="w-4 h-4 mr-2" />
                Fact Check
              </>
            )}
          </button>
        </div>
      </div>

      {/* Fact Check Dialog */}
      <Dialog open={showFactCheck} onOpenChange={setShowFactCheck}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle className="font-bebas text-xl">FACT CHECK: {title}</DialogTitle>
          </DialogHeader>
          {factCheckResult && (
            <FactCheckResultComponent result={factCheckResult} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NewsCard;
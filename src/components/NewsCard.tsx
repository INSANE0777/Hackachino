
import React, { useState } from 'react';
import { NewsArticle } from '@/types/types';
import { formatDistanceToNow } from 'date-fns';
import { analyzeArticle, FactCheckResult } from '@/services/factCheckService';
import FactCheckBadge from './FactCheckBadge';
import FactCheckResultComponent from './FactCheckResult';
import { AlertTriangle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface NewsCardProps {
  article: NewsArticle;
  color?: string;
}

const NewsCard: React.FC<NewsCardProps> = ({ article, color = 'pop-blue' }) => {
  const { title, description, url, image, publishedAt, source, aiSummary, content } = article;
  const [factCheckResult, setFactCheckResult] = useState<FactCheckResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showFactCheck, setShowFactCheck] = useState(false);
  
  // Format date to relative time
  const formattedDate = formatDistanceToNow(new Date(publishedAt), { addSuffix: true });
  
  // Use a random background color if none provided
  const cardColors = ['pop-blue', 'pop-red', 'pop-yellow', 'pop-green', 'pop-purple'];
  const bgColor = color || cardColors[Math.floor(Math.random() * cardColors.length)];
  
  const handleFactCheck = async () => {
    if (factCheckResult) {
      // Toggle display if we already have results
      setShowFactCheck(!showFactCheck);
      return;
    }
    
    setIsAnalyzing(true);
    try {
      const result = await analyzeArticle(
        title, 
        content || description || title, 
        url
      );
      setFactCheckResult(result);
      setShowFactCheck(true);
    } catch (error) {
      console.error("Error fact-checking article:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  return (
    <div className={`card-brutal overflow-hidden mb-8 bg-white hover:-translate-y-1 transition-all`}>
      <div className={`border-b-4 border-pop-black bg-${bgColor} h-2`}></div>
      
      {image && (
        <div className="relative w-full h-48 overflow-hidden">
          <img 
            src={image} 
            alt={title} 
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
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
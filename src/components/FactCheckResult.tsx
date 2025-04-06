import React from 'react';
import { FactCheckResult } from '@/types/types';
import FactCheckBadge from './FactCheckBadge';
import { ExternalLink, AlertTriangle, CheckCircle, Info } from 'lucide-react';

interface FactCheckResultProps {
  result: FactCheckResult;
  isLoading?: boolean;
}

const FactCheckResultComponent: React.FC<FactCheckResultProps> = ({ result, isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="mt-2 p-2 border border-gray-200 rounded-md bg-gray-50 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-full mb-1"></div>
        <div className="h-3 bg-gray-200 rounded w-5/6 mb-1"></div>
        <div className="h-3 bg-gray-200 rounded w-4/6"></div>
      </div>
    );
  }

  const getBorderColor = () => {
    if (result.credibilityScore >= 8) return 'border-green-500';
    if (result.credibilityScore >= 5) return 'border-yellow-500'; 
    return 'border-red-500';
  };

  const getIcon = () => {
    if (result.credibilityScore >= 8) return <CheckCircle className="w-3 h-3 text-green-600" />;
    if (result.credibilityScore >= 5) return <Info className="w-3 h-3 text-yellow-600" />;
    return <AlertTriangle className="w-3 h-3 text-red-600" />;
  };

  return (
    <div className={`p-2 bg-white border-l-2 rounded-md ${getBorderColor()} shadow-sm scale-95 transform origin-top-left`}>
      <div className="flex items-center justify-between mb-1">
        <h4 className="font-bebas text-xs flex items-center gap-1">
          {getIcon()} CREDIBILITY SCORE
        </h4>
        <FactCheckBadge score={result.credibilityScore} size="sm" showTooltip={true} />
      </div>
      
      {result.misinformationWarning && (
        <div className="mb-1 text-xs p-1.5 bg-red-50 text-red-700 border border-red-100 rounded">
          <div className="font-medium mb-0.5 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" /> Warning:
          </div>
          <p className="text-[10px]">{result.misinformationWarning}</p>
        </div>
      )}
      
      <div className="text-[10px] space-y-1.5">
        <div>
          <h5 className="font-medium mb-0.5">Credibility Analysis:</h5>
          <ul className="list-disc pl-3 space-y-0.5">
            {result.reliabilityPoints.map((point, index) => (
              <li key={index}>{point}</li>
            ))}
          </ul>
        </div>

        {result.sourceVerification && result.sourceVerification.length > 0 && (
          <div>
            <h5 className="font-medium mb-1">Source Verification:</h5>
            <ul className="list-disc pl-4 space-y-1">
              {result.sourceVerification.map((point, index) => (
                <li key={index}>{point}</li>
              ))}
            </ul>
          </div>
        )}
        
        {result.contentIssues && result.contentIssues.length > 0 && (
          <div>
            <h5 className="font-medium mb-1">Content Issues:</h5>
            <ul className="list-disc pl-4 space-y-1">
              {result.contentIssues.map((issue, index) => (
                <li key={index} className="text-red-600">{issue}</li>
              ))}
            </ul>
          </div>
        )}
        
        {result.suggestedSources && result.suggestedSources.length > 0 && (
          <div>
            <h5 className="font-medium mb-1">Suggested Sources:</h5>
            <div className="flex flex-wrap gap-1 mt-1">
              {result.suggestedSources.map((source, index) => (
                <span 
                  key={index} 
                  className="inline-flex items-center px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded border border-blue-200"
                >
                  <ExternalLink className="w-3 h-3 mr-1" /> {source}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FactCheckResultComponent;

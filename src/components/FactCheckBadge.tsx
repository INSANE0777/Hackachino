import React from 'react';
import { AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface FactCheckBadgeProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showTooltip?: boolean;
}

const FactCheckBadge: React.FC<FactCheckBadgeProps> = ({ 
  score, 
  size = 'md',
  showTooltip = true 
}) => {
  const getBadgeColor = () => {
    if (score >= 8) return 'bg-green-100 text-green-800 border-green-300';
    if (score >= 5) return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    return 'bg-red-100 text-red-800 border-red-300';
  };

  const getIconClasses = () => {
    switch (size) {
      case 'sm': return 'w-3 h-3 mr-1';
      case 'lg': return 'w-5 h-5 mr-2';
      default: return 'w-4 h-4 mr-1.5';
    }
  };

  const getIcon = () => {
    const iconClasses = getIconClasses();
    if (score >= 8) return <CheckCircle className={iconClasses} />;
    if (score >= 5) return <Info className={iconClasses} />;
    return <AlertTriangle className={iconClasses} />;
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm': return 'text-xs px-1 py-0.5';
      case 'lg': return 'text-base px-3 py-1.5';
      default: return 'text-sm px-2 py-1';
    }
  };

  const badge = (
    <div className={`inline-flex items-center border rounded ${getBadgeColor()} ${getSizeClasses()}`}>
      {getIcon()}
      <span>
        {score >= 8 ? 'Highly Credible' : 
         score >= 5 ? 'Moderately Credible' : 
         'Potentially Misleading'}
      </span>
    </div>
  );

  if (!showTooltip) return badge;
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {badge}
        </TooltipTrigger>
        <TooltipContent side="top">
          <p>Credibility Score: {score}/10</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default FactCheckBadge;

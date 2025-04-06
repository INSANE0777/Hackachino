import React, { useState } from 'react';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { AlertTriangle, CheckCircle, Search } from 'lucide-react';
import { analyzeArticleWithAIAgent } from '@/services/factCheckService';
import { FactCheckResult } from '@/types/types';
import FactCheckResultComponent from '@/components/FactCheckResult';

const FactCheckerPage = () => {
  const [statement, setStatement] = useState('');
  const [source, setSource] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [factCheckResult, setFactCheckResult] = useState<FactCheckResult | null>(null);

  const handleFactCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!statement.trim()) return;
    
    setIsAnalyzing(true);
    try {
      const result = await analyzeArticleWithAIAgent(
        'User submitted statement', 
        statement,
        source || 'User input',
        'fact check'
      );
      setFactCheckResult(result);
    } catch (error) {
      console.error("Error fact-checking statement:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          {/* Page Title */}
          <div className="bg-pop-yellow border-4 border-pop-black p-4 mb-8 shadow-brutal">
            <h2 className="text-3xl font-bebas text-pop-black flex items-center">
              <CheckCircle className="mr-2" /> FACT CHECKER
            </h2>
            <p className="text-pop-black mt-2">
              Enter any statement or claim to verify its credibility using our AI-powered fact checking system.
            </p>
          </div>
          
          {/* Input Form */}
          <form onSubmit={handleFactCheck} className="bg-white border-4 border-pop-black p-6 mb-8 shadow-brutal">
            <div className="mb-4">
              <label htmlFor="statement" className="block text-sm font-bebas mb-2 text-pop-black">
                STATEMENT TO VERIFY
              </label>
              <Textarea
                id="statement"
                value={statement}
                onChange={(e) => setStatement(e.target.value)}
                placeholder="Enter a claim or statement to fact check..."
                className="w-full border-2 border-pop-black p-3 focus:border-pop-blue focus:ring-1 focus:ring-pop-blue"
                rows={4}
                required
              />
            </div>
            
            <div className="mb-6">
              <label htmlFor="source" className="block text-sm font-bebas mb-2 text-pop-black">
                SOURCE (OPTIONAL)
              </label>
              <Input
                id="source"
                value={source}
                onChange={(e) => setSource(e.target.value)}
                placeholder="Enter the source of this statement (website, person, etc.)"
                className="w-full border-2 border-pop-black p-3 focus:border-pop-blue focus:ring-1 focus:ring-pop-blue"
              />
            </div>
            
            <Button 
              type="submit" 
              disabled={isAnalyzing || !statement.trim()}
              className="w-full bg-pop-blue hover:bg-blue-600 text-white border-2 border-pop-black py-3 font-bebas text-lg shadow-brutal hover:shadow-[2px_2px_0px_#000] hover:-translate-y-0.5 transition-all duration-150 flex items-center justify-center"
            >
              {isAnalyzing ? (
                <>
                  <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                  ANALYZING...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-5 w-5" />
                  VERIFY STATEMENT
                </>
              )}
            </Button>
          </form>
          
          {/* Results Section */}
          {isAnalyzing && (
            <div className="bg-white border-4 border-pop-black p-6 shadow-brutal">
              <div className="flex items-center justify-center space-x-2">
                <div className="animate-spin h-5 w-5 border-2 border-pop-blue border-t-transparent rounded-full"></div>
                <p className="font-bebas text-lg">ANALYZING YOUR STATEMENT...</p>
              </div>
              <p className="text-center text-sm mt-2 text-gray-500">
                Our AI is checking credibility, sources, and context. This may take a moment.
              </p>
            </div>
          )}
          
          {!isAnalyzing && factCheckResult && (
            <div className="bg-white border-4 border-pop-black p-6 shadow-brutal">
              <h3 className="text-xl font-bebas mb-4 text-pop-black">FACT CHECK RESULTS</h3>
              <FactCheckResultComponent result={factCheckResult} />
              
              <div className="mt-6 p-4 bg-gray-100 border-2 border-pop-black">
                <h4 className="font-bebas text-sm mb-2 flex items-center">
                  <AlertTriangle className="w-4 h-4 mr-1 text-pop-yellow" /> DISCLAIMER
                </h4>
                <p className="text-xs text-gray-600">
                  This AI-powered fact check provides an assessment based on available information. 
                  Always verify important information with multiple trusted sources.
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default FactCheckerPage;
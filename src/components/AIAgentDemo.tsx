import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, CheckCircle, AlertCircle, Search } from 'lucide-react';
import { detectFakeNewsWithAgent } from '@/services/aiAgentService';

const AIAgentDemo = () => {
  const [demoUrl, setDemoUrl] = useState('');
  const [demoTitle, setDemoTitle] = useState('');
  const [demoContent, setDemoContent] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1);

  const handleAnalyze = async () => {
    if (!demoTitle || !demoContent) {
      setError('Please provide both a title and content to analyze');
      return;
    }

    setIsAnalyzing(true);
    setError('');
    
    try {
      // Simulate workflow steps
      setStep(1); // Fetching
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setStep(2); // Analyzing
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      setStep(3); // Fact checking
      const response = await detectFakeNewsWithAgent(demoTitle, demoContent);
      
      setStep(4); // Complete
      setResult(response);
    } catch (err) {
      setError('Error analyzing content. Please try again.');
      console.error('Analysis error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setDemoTitle('');
    setDemoContent('');
    setResult(null);
    setError('');
    setStep(1);
  };

  // Sample news snippets for quick testing
  const sampleNews = [
    {
      title: "New Study Shows Coffee May Extend Lifespan",
      content: "Researchers at a leading university have found that drinking 2-3 cups of coffee daily may extend lifespan by up to 5 years. The study followed 10,000 participants over a decade and controlled for other lifestyle factors."
    },
    {
      title: "Scientists Discover Cure for All Types of Cancer",
      content: "A team of scientists claims to have discovered a miracle drug that can cure all types of cancer in just one week with no side effects. The treatment has not been published in any peer-reviewed journals."
    }
  ];

  const loadSample = (index) => {
    setDemoTitle(sampleNews[index].title);
    setDemoContent(sampleNews[index].content);
    setResult(null);
    setError('');
  };

  return (
    <div className="bg-white border-4 border-pop-black p-6 shadow-brutal max-w-3xl mx-auto">
      <h3 className="font-bebas text-2xl mb-4 tracking-wide text-center">
        TRY OUR AI NEWS ANALYZER
      </h3>
      
      {!result ? (
        <>
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-1">News Title</label>
            <Input
              value={demoTitle}
              onChange={(e) => setDemoTitle(e.target.value)}
              placeholder="Enter news headline"
              className="border-2 border-pop-black p-2 w-full"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-1">News Content</label>
            <textarea
              value={demoContent}
              onChange={(e) => setDemoContent(e.target.value)}
              placeholder="Paste news article content here"
              className="border-2 border-pop-black p-2 w-full h-32 resize-none"
            />
          </div>
          
          <div className="flex justify-between mb-4">
            <div className="space-x-2">
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={() => loadSample(0)}
                className="text-xs border-pop-black"
              >
                Load Sample 1
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={() => loadSample(1)}
                className="text-xs border-pop-black"
              >
                Load Sample 2
              </Button>
            </div>
            
            <Button
              onClick={handleAnalyze}
              disabled={isAnalyzing || !demoTitle || !demoContent}
              className="bg-pop-blue text-white hover:bg-blue-600 border-2 border-pop-black"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  Analyze
                </>
              )}
            </Button>
          </div>
          
          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
              <p className="text-sm">{error}</p>
            </div>
          )}
          
          {isAnalyzing && (
            <div className="border-2 border-pop-black p-4 bg-gray-50">
              <h4 className="font-semibold mb-3">AI Agent Workflow</h4>
              <div className="space-y-2">
                <div className="flex items-center">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 ${step >= 1 ? 'bg-pop-blue text-white' : 'bg-gray-200'}`}>
                    1
                  </div>
                  <span className={step >= 1 ? 'font-medium' : 'text-gray-500'}>
                    Initializing analysis
                  </span>
                  {step === 1 && <Loader2 className="ml-2 h-4 w-4 animate-spin text-pop-blue" />}
                  {step > 1 && <CheckCircle className="ml-2 h-4 w-4 text-green-500" />}
                </div>
                
                <div className="flex items-center">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 ${step >= 2 ? 'bg-pop-blue text-white' : 'bg-gray-200'}`}>
                    2
                  </div>
                  <span className={step >= 2 ? 'font-medium' : 'text-gray-500'}>
                    Processing content with Gemini AI
                  </span>
                  {step === 2 && <Loader2 className="ml-2 h-4 w-4 animate-spin text-pop-blue" />}
                  {step > 2 && <CheckCircle className="ml-2 h-4 w-4 text-green-500" />}
                </div>
                
                <div className="flex items-center">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 ${step >= 3 ? 'bg-pop-blue text-white' : 'bg-gray-200'}`}>
                    3
                  </div>
                  <span className={step >= 3 ? 'font-medium' : 'text-gray-500'}>
                    Performing fact-checking analysis
                  </span>
                  {step === 3 && <Loader2 className="ml-2 h-4 w-4 animate-spin text-pop-blue" />}
                  {step > 3 && <CheckCircle className="ml-2 h-4 w-4 text-green-500" />}
                </div>
                
                <div className="flex items-center">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 ${step >= 4 ? 'bg-pop-blue text-white' : 'bg-gray-200'}`}>
                    4
                  </div>
                  <span className={step >= 4 ? 'font-medium' : 'text-gray-500'}>
                    Generating results
                  </span>
                  {step === 4 && <Loader2 className="ml-2 h-4 w-4 animate-spin text-pop-blue" />}
                  {step > 4 && <CheckCircle className="ml-2 h-4 w-4 text-green-500" />}
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="border-2 border-pop-black p-4">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-semibold">Analysis Results</h4>
            <Button 
              onClick={handleReset} 
              variant="outline" 
              size="sm"
              className="border-pop-black"
            >
              Analyze Another
            </Button>
          </div>
          
          <div className="mb-4">
            <div className="flex items-center mb-2">
              <span className="font-medium mr-2">Fake News Score:</span>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div 
                  className={`h-4 rounded-full ${
                    result.fakeNewsScore < 0.3 ? 'bg-green-500' : 
                    result.fakeNewsScore < 0.7 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${result.fakeNewsScore * 100}%` }}
                ></div>
              </div>
              <span className="ml-2">{Math.round(result.fakeNewsScore * 100)}%</span>
            </div>
            
            <div className="flex items-center">
              <span className="font-medium mr-2">Assessment:</span>
              {result.isFake ? (
                <div className="flex items-center text-red-600">
                  <AlertCircle className="h-5 w-5 mr-1" />
                  <span className="font-semibold">Potentially Misleading</span>
                </div>
              ) : (
                <div className="flex items-center text-green-600">
                  <CheckCircle className="h-5 w-5 mr-1" />
                  <span className="font-semibold">Likely Reliable</span>
                </div>
              )}
            </div>
          </div>
          
          <div>
            <h5 className="font-medium mb-1">Explanation:</h5>
            <p className="text-sm bg-gray-50 p-3 border border-gray-200 rounded">
              {result.explanation}
            </p>
          </div>
        </div>
      )}
      
      <div className="mt-4 text-xs text-gray-500 text-center">
        This is a demonstration of our AI-powered news analysis. Results are for illustrative purposes.
      </div>
    </div>
  );
};

export default AIAgentDemo;
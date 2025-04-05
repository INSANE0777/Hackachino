
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import NewsFeed from '@/components/NewsFeed';
import { Toaster } from 'sonner';
import { Link } from 'react-router-dom';

const FeedPage = () => {
  const [topics, setTopics] = useState<string[]>([]);
  
  // Load saved topics from localStorage on mount
  useEffect(() => {
    const savedTopics = localStorage.getItem('popnews-topics');
    if (savedTopics) {
      try {
        const parsedTopics = JSON.parse(savedTopics);
        if (Array.isArray(parsedTopics)) {
          setTopics(parsedTopics);
        }
      } catch (error) {
        console.error("Failed to parse saved topics:", error);
      }
    }
  }, []);
  
  return (
    <div className="min-h-screen bg-gray-100">
      <Toaster position="top-center" />
      <Header />
      
      <main className="container mx-auto px-4 pb-16">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white border-2 border-pop-black p-6 mb-10 shadow-brutal">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <h2 className="text-2xl font-bebas mb-2 md:mb-0">YOUR PERSONALIZED NEWS FEED</h2>
              <Link to="/topics" className="btn-brutal bg-pop-yellow text-pop-black px-4 py-2">
                Manage Topics
              </Link>
            </div>
            
            {topics.length > 0 && (
              <div className="mt-4 mb-4">
                <p className="text-sm text-gray-600 mb-2">Current topics:</p>
                <div className="flex flex-wrap gap-2">
                  {topics.map(topic => (
                    <span key={topic} className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-sm">
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <NewsFeed topics={topics} />
        </div>
      </main>
    </div>
  );
};

export default FeedPage;


import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import TopicManager from '@/components/TopicManager';
import { Toaster } from 'sonner';

const TopicsPage = () => {
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
  
  // Save topics to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('popnews-topics', JSON.stringify(topics));
  }, [topics]);
  
  const handleAddTopic = (topic: string) => {
    setTopics(prev => [...prev, topic.toLowerCase()]);
  };
  
  const handleRemoveTopic = (topicToRemove: string) => {
    setTopics(prev => prev.filter(topic => topic !== topicToRemove));
  };
  
  return (
    <div className="min-h-screen bg-gray-100">
      <Toaster position="top-center" />
      <Header />
      
      <main className="container mx-auto px-4 pb-16">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white border-2 border-pop-black p-6 mb-10 shadow-brutal">
            <h2 className="text-2xl font-bebas mb-4">MANAGE YOUR NEWS TOPICS</h2>
            <p className="text-gray-600 mb-6">
              Add or remove topics you're interested in. Your news feed will be personalized based on these topics.
            </p>
            <TopicManager 
              topics={topics} 
              onAddTopic={handleAddTopic} 
              onRemoveTopic={handleRemoveTopic} 
            />
          </div>
          
          <div className="text-center mt-12 border-t-2 border-gray-300 pt-6">
            <p className="text-sm text-gray-500">
              Once you've set up your topics, head over to the <a href="/feed" className="text-pop-blue underline">News Feed</a> to see your personalized news.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TopicsPage;


import React, { useEffect, useState } from 'react';
import { fetchNewsByTopic } from '@/services/newsService';
import { NewsArticle } from '@/types/types';
import NewsCard from './NewsCard';
import { toast } from 'sonner';

interface NewsFeedProps {
  topics: string[];
}

const NewsFeed: React.FC<NewsFeedProps> = ({ topics }) => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchArticles = async () => {
      if (topics.length === 0) {
        setArticles([]);
        return;
      }
      
      setLoading(true);
      setError(null);
      
      try {
        const allArticles: NewsArticle[] = [];
        
        // Fetch articles for each topic
        for (const topic of topics) {
          try {
            const response = await fetchNewsByTopic(topic);
            
            if (response.articles && response.articles.length > 0) {
              // Add the first 3 articles from each topic
              allArticles.push(...response.articles.slice(0, 9));
            }
          } catch (error) {
            console.error(`Error fetching news for topic ${topic}:`, error);
          }
        }
        
        // Sort by published date (newest first)
        allArticles.sort((a, b) => 
          new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
        );
        
        setArticles(allArticles);
      } catch (error) {
        console.error("Error fetching news:", error);
        setError("Failed to fetch news. Please try again later.");
        toast.error("Failed to load news articles");
      } finally {
        setLoading(false);
      }
    };
    
    fetchArticles();
  }, [topics]);
  
  // Map topics to colors for consistent article styling
  const topicColors: Record<string, string> = {};
  const colors = ['pop-blue', 'pop-red', 'pop-yellow', 'pop-green', 'pop-purple'];
  
  topics.forEach((topic, index) => {
    topicColors[topic] = colors[index % colors.length];
  });
  
  if (topics.length === 0) {
    return (
      <div className="text-center py-12 bg-white border-2 border-pop-black shadow-brutal">
        <h2 className="text-2xl font-bebas mb-3">ADD SOME TOPICS TO GET STARTED</h2>
        <p className="text-gray-600">
          Use the topic manager above to add topics you're interested in.
        </p>
      </div>
    );
  }
  
  if (loading) {
    return (
      <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((n) => (
          <div key={n} className="card-brutal p-4 animate-pulse">
            <div className="h-48 bg-gray-200 mb-4"></div>
            <div className="h-6 bg-gray-200 mb-2 w-1/4"></div>
            <div className="h-8 bg-gray-200 mb-4"></div>
            <div className="h-4 bg-gray-200 mb-2"></div>
            <div className="h-4 bg-gray-200 mb-2"></div>
            <div className="h-4 bg-gray-200 mb-4 w-3/4"></div>
            <div className="h-10 bg-gray-200 w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="text-center py-12 bg-white border-2 border-pop-red shadow-brutal">
        <h2 className="text-2xl font-bebas mb-3 text-pop-red">OOPS! SOMETHING WENT WRONG</h2>
        <p className="text-gray-600">
          {error}
        </p>
        <button
          className="mt-4 btn-brutal bg-pop-blue text-white"
          onClick={() => window.location.reload()}
        >
          Try Again
        </button>
      </div>
    );
  }
  
  if (articles.length === 0) {
    return (
      <div className="text-center py-12 bg-white border-2 border-pop-black shadow-brutal">
        <h2 className="text-2xl font-bebas mb-3">NO NEWS FOUND</h2>
        <p className="text-gray-600">
          We couldn't find any news for your selected topics. Try adding different topics!
        </p>
      </div>
    );
  }
  
  return (
    <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {articles.map((article, index) => {
        // Determine which topic this article belongs to (simplified approach)
        let articleTopic = '';
        for (const topic of topics) {
          if (
            article.title.toLowerCase().includes(topic.toLowerCase()) ||
            article.description.toLowerCase().includes(topic.toLowerCase())
          ) {
            articleTopic = topic;
            break;
          }
        }
        
        return (
          <NewsCard 
            key={`${article.title}-${index}`} 
            article={article}
            color={articleTopic ? topicColors[articleTopic] : undefined}
          />
        );
      })}
    </div>
  );
};

export default NewsFeed;

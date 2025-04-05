import React from 'react';
import Header from '@/components/Header';
import { Link } from 'react-router-dom';
import { Newspaper, Settings } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white border-2 border-black p-8 mb-10 shadow-brutal">
            <h2 className="text-3xl font-bebas text-black-500 mb-6">WELCOME TO POPNEWS</h2>
            <p className="text-lg text-black mb-8">
              Get started with your personalized news experience. Choose what you want to do:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Link to="/topics" className="block">
                <div className="border-2 border-black p-6 hover:bg-yellow-500 transition-colors shadow-brutal">
                  <Settings className="w-12 h-12 mb-4 text-black" />
                  <h3 className="text-2xl font-bebas text-black mb-2">MANAGE TOPICS</h3>
                  <p className="text-black">
                    Add or remove news topics you're interested in to personalize your feed.
                  </p>
                </div>
              </Link>
              
              <Link to="/feed" className="block">
                <div className="group border-2 border-black p-6 bg-white text-black transition-colors shadow-brutal hover:bg-blue-500">
                  <Newspaper className="w-12 h-12 mb-4" />
                  <h3 className="text-2xl font-bebas mb-2">VIEW NEWS FEED</h3>
                  <p>
                    Browse your personalized news feed based on your selected topics.
                  </p>
                </div>
              </Link>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <p className="text-sm text-black">
              PopNews uses the GNews API for content. <br />
              This is a demo app built with React and Tailwind CSS.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;

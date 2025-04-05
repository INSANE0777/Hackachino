
import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

interface TopicManagerProps {
  topics: string[];
  onAddTopic: (topic: string) => void;
  onRemoveTopic: (topic: string) => void;
}

const TopicManager: React.FC<TopicManagerProps> = ({ topics, onAddTopic, onRemoveTopic }) => {
  const [newTopic, setNewTopic] = useState('');

  const handleAddTopic = () => {
    const trimmedTopic = newTopic.trim();
    
    if (!trimmedTopic) {
      toast.error('Please enter a topic');
      return;
    }
    
    if (topics.includes(trimmedTopic.toLowerCase())) {
      toast.error(`"${trimmedTopic}" is already in your topics`);
      return;
    }
    
    onAddTopic(trimmedTopic.toLowerCase());
    setNewTopic('');
    toast.success(`Added "${trimmedTopic}" to your topics`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleAddTopic();
    }
  };

  return (
    <div className="mb-8">
      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <div className="flex-1">
          <Input
            className="border-2 border-pop-black h-12 rounded-none"
            placeholder="Add a topic (e.g., AI, Space, Politics)"
            value={newTopic}
            onChange={(e) => setNewTopic(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>
        <Button 
          className="btn-brutal bg-pop-yellow text-pop-black"
          onClick={handleAddTopic}
        >
          <Plus className="mr-2 h-5 w-5" />
          Add Topic
        </Button>
      </div>
      
      <div className="mt-4">
        <div className="text-sm font-semibold mb-2 text-gray-600">YOUR TOPICS:</div>
        <div>
          {topics.length > 0 ? (
            topics.map((topic) => (
              <div key={topic} className="topic-tag">
                <span className="mr-2">{topic}</span>
                <button 
                  onClick={() => onRemoveTopic(topic)}
                  className="text-pop-red hover:text-pop-black transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            ))
          ) : (
            <div className="text-gray-400 italic">
              No topics yet. Add some topics to see news!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopicManager;

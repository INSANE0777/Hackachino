import React, { useEffect, useState } from 'react'
import { NewsArticle } from '@/types/types'
import { formatDistanceToNow } from 'date-fns'

interface NewsCardProps {
  article: NewsArticle
  color?: string
}

const NewsCard: React.FC<NewsCardProps> = ({ article, color = 'pop-blue' }) => {
  const { title, description, url, image, publishedAt, source } = article
  const [aiSummary, setAiSummary] = useState<string[]>(article.aiSummary || [])
  const formattedDate = formatDistanceToNow(new Date(publishedAt), { addSuffix: true })

  useEffect(() => {
    // only fetch if we don’t already have a summary
    if (aiSummary.length === 0 && description) {
      fetch('/api/generate-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: description }),
      })
        .then(res => res.json())
        .then(data => {
          if (data.summary) setAiSummary(data.summary)
        })
        .catch(console.error)
    }
  }, [description, aiSummary.length])

  const cardColors = ['pop-blue', 'pop-red', 'pop-yellow', 'pop-green', 'pop-purple']
  const bgColor = color || cardColors[Math.floor(Math.random() * cardColors.length)]

  return (
    <div className="card-brutal overflow-hidden mb-8 bg-white hover:-translate-y-1 transition-all">
      <div className={`border-b-4 border-pop-black bg-${bgColor} h-2`} />

      {image && (
        <div className="relative w-full h-48 overflow-hidden">
          <img src={image} alt={title} className="w-full h-full object-cover" />
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

        {aiSummary.length > 0 && (
          <div className="mt-4 p-4 bg-gray-50 border-l-4 border-pop-purple">
            <h4 className="font-bebas text-lg mb-2">AI SUMMARY</h4>
            <ul className="list-disc pl-5 space-y-1">
              {aiSummary.map((point, i) => (
                <li key={i} className="text-sm">
                  {point}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-4">
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-4 py-2 bg-white border-2 border-pop-black text-sm font-bold hover:bg-gray-100 transition-colors"
          >
            Read Full Article →
          </a>
        </div>
      </div>
    </div>
  )
}

export default NewsCard

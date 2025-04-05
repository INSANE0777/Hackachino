
export interface NewsArticle {
  title: string;
  description: string;
  content: string;
  url: string;
  image: string;
  publishedAt: string;
  source: {
    name: string;
    url: string;
  };
  aiSummary?: string[];
}

export interface NewsResponse {
  totalArticles: number;
  articles: NewsArticle[];
}

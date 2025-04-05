
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
  factCheck?: FactCheckResult;
}

export interface NewsResponse {
  totalArticles: number;
  articles: NewsArticle[];
}

export interface FactCheckResult {
  credibilityScore: number;
  reliabilityPoints: string[];
  misinformationWarning: string | null;
  sourceVerification?: string[];
  contentIssues?: string[];
  suggestedSources?: string[];
}
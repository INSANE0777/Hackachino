// Add these types if they don't already exist in your types file

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
  fakeNewsScore?: number;
  isFake?: boolean;
  fakeNewsExplanation?: string;
}

export interface NewsResponse {
  totalArticles: number;
  articles: NewsArticle[];
  error?: string;
}

export interface FactCheckResult {
  credibilityScore: number;
  reliabilityPoints: string[];
  misinformationWarning: string | null;
  sourceVerification: string[];
  contentIssues: string[];
  suggestedSources: string[];
}
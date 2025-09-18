export interface Feedback {
  id: string;
  content: string;
  rating: number;
  sentiment: 'positive' | 'negative' | 'neutral';
  category?: string;
  timestamp: string;
  author?: string;
}

export interface FeedbackAnalytics {
  totalCount: number;
  positiveCount: number;
  negativeCount: number;
  neutralCount: number;
  averageRating: number;
  sentimentScore: number;
  groupedNegativeFeedback: GroupedNegativeFeedback[];
}

export interface GroupedNegativeFeedback {
  category: string;
  count: number;
  feedbacks: Feedback[];
  commonKeywords: string[];
}
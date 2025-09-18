import { Feedback, FeedbackAnalytics, GroupedNegativeFeedback } from '../types/feedback';

export function analyzeFeedbacks(feedbacks: Feedback[]): FeedbackAnalytics {
  const totalCount = feedbacks.length;

  const positiveCount = feedbacks.filter(f => f.sentiment === 'positive').length;
  const negativeCount = feedbacks.filter(f => f.sentiment === 'negative').length;
  const neutralCount = feedbacks.filter(f => f.sentiment === 'neutral').length;

  const averageRating =
    totalCount > 0
      ? feedbacks.reduce((sum, f) => sum + (f.rating || 0), 0) / totalCount
      : 0;

  const sentimentScore =
    totalCount > 0 ? (positiveCount - negativeCount) / totalCount : 0;

  const groupedNegativeFeedback = groupNegativeFeedback(
    feedbacks.filter(f => f.sentiment === 'negative')
  );

  return {
    totalCount,
    positiveCount,
    negativeCount,
    neutralCount,
    averageRating,
    sentimentScore,
    groupedNegativeFeedback,
  };
}

function groupNegativeFeedback(
  negativeFeedbacks: Feedback[]
): GroupedNegativeFeedback[] {
  const grouped = new Map<string, Feedback[]>();

  // Group by category (fallback to "Other")
  negativeFeedbacks.forEach(feedback => {
    const category = feedback.category || 'Other';
    if (!grouped.has(category)) {
      grouped.set(category, []);
    }
    grouped.get(category)!.push(feedback);
  });

  // Convert to array and add common keywords
  return Array.from(grouped.entries())
    .map(([category, feedbacks]) => {
      const commonKeywords = extractCommonKeywords(feedbacks);
      return {
        category,
        count: feedbacks.length,
        feedbacks,
        commonKeywords,
      };
    })
    .sort((a, b) => b.count - a.count);
}

function extractCommonKeywords(feedbacks: Feedback[]): string[] {
  const wordCounts = new Map<string, number>();
  const stopWords = new Set([
    'the',
    'a',
    'an',
    'and',
    'or',
    'but',
    'in',
    'on',
    'at',
    'to',
    'for',
    'of',
    'with',
    'by',
    'is',
    'are',
    'was',
    'were',
  ]);

  feedbacks.forEach(feedback => {
    const words = (feedback.text || '') // ✅ use text instead of content
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 2 && !stopWords.has(word));

    words.forEach(word => {
      wordCounts.set(word, (wordCounts.get(word) || 0) + 1);
    });
  });

  return Array.from(wordCounts.entries())
    .filter(([_, count]) => count > 1)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([word]) => word);
}

import React, { useEffect, useState } from 'react';
import { BarChart3, Users, Star } from 'lucide-react';
import { SentimentCard } from './SentimentCard';
import { OverallSentiment } from './OverallSentiment';
import { GroupedNegativeFeedback } from './GroupedNegativeFeedback';
import { analyzeFeedbacks } from '../utils/feedbackAnalyzer';
import { fetchDataset } from '../api';  // ✅ new import

export function FeedbackDashboard() {
  const [analytics, setAnalytics] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDataset()
      .then((records) => {
        const computed = analyzeFeedbacks(records);
        setAnalytics(computed);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-600">Error: {error}</div>;
  if (!analytics) return <div>No data available</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center">
            <BarChart3 className="w-8 h-8 text-indigo-600 mr-3" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Feedback Analytics</h1>
              <p className="text-gray-600 mt-1">
                Comprehensive analysis of customer feedback and sentiment
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Feedback</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {analytics.totalCount}
                </p>
              </div>
              <Users className="w-8 h-8 text-indigo-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Average Rating</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {analytics.averageRating.toFixed(1)}
                </p>
                <div className="flex items-center mt-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-sm text-gray-600 ml-1">out of 5</span>
                </div>
              </div>
              <Star className="w-8 h-8 text-yellow-500" />
            </div>
          </div>

          <SentimentCard
            title="Positive Feedback"
            count={analytics.positiveCount}
            total={analytics.totalCount}
            type="positive"
          />

          <SentimentCard
            title="Negative Feedback"
            count={analytics.negativeCount}
            total={analytics.totalCount}
            type="negative"
          />
        </div>

        {/* Overall Sentiment & Neutral Feedback */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <div className="lg:col-span-3">
            <OverallSentiment
              sentimentScore={analytics.sentimentScore}
              averageRating={analytics.averageRating}
            />
          </div>
          <div className="lg:col-span-1">
            <SentimentCard
              title="Neutral Feedback"
              count={analytics.neutralCount}
              total={analytics.totalCount}
              type="neutral"
            />
          </div>
        </div>

        {/* Grouped Negative Feedback */}
        <GroupedNegativeFeedback groupedFeedback={analytics.groupedNegativeFeedback} />
      </div>
    </div>
  );
}

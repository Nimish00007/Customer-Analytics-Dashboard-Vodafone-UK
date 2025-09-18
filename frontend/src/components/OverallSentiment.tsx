import React from 'react';
import { Heart, AlertTriangle, CheckCircle } from 'lucide-react';

interface OverallSentimentProps {
  sentimentScore: number;
  averageRating: number;
}

export function OverallSentiment({ sentimentScore, averageRating }: OverallSentimentProps) {
  const getSentimentStatus = () => {
    if (sentimentScore > 0.3) return { status: 'Positive', color: 'text-green-600', bgColor: 'bg-green-100', icon: CheckCircle };
    if (sentimentScore < -0.3) return { status: 'Negative', color: 'text-red-600', bgColor: 'bg-red-100', icon: AlertTriangle };
    return { status: 'Neutral', color: 'text-yellow-600', bgColor: 'bg-yellow-100', icon: Heart };
  };

  const { status, color, bgColor, icon: Icon } = getSentimentStatus();

  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
      <div className="text-center">
        <div className={`inline-flex items-center justify-center w-16 h-16 ${bgColor} rounded-full mb-4`}>
          <Icon className={`w-8 h-8 ${color}`} />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Overall Sentiment</h3>
        <p className={`text-4xl font-extrabold ${color} mb-2`}>{status}</p>
        <p className="text-gray-600 mb-4">
          Average Rating: <span className="font-semibold text-gray-900">{averageRating.toFixed(1)}/5.0</span>
        </p>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className={`h-3 rounded-full ${
              sentimentScore > 0 ? 'bg-green-500' : sentimentScore < 0 ? 'bg-red-500' : 'bg-yellow-500'
            }`}
            style={{ width: `${Math.abs(sentimentScore) * 100}%` }}
          ></div>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Sentiment Score: {(sentimentScore * 100).toFixed(1)}%
        </p>
      </div>
    </div>
  );
}
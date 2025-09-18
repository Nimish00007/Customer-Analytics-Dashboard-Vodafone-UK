import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface SentimentCardProps {
  title: string;
  count: number;
  total: number;
  type: 'positive' | 'negative' | 'neutral';
}

export function SentimentCard({ title, count, total, type }: SentimentCardProps) {
  const percentage = Math.round((count / total) * 100);
  
  const getIcon = () => {
    switch (type) {
      case 'positive': return <TrendingUp className="w-6 h-6 text-green-600" />;
      case 'negative': return <TrendingDown className="w-6 h-6 text-red-600" />;
      case 'neutral': return <Minus className="w-6 h-6 text-gray-600" />;
    }
  };

  const getColorClasses = () => {
    switch (type) {
      case 'positive': return 'bg-green-50 border-green-200';
      case 'negative': return 'bg-red-50 border-red-200';
      case 'neutral': return 'bg-gray-50 border-gray-200';
    }
  };

  const getTextColor = () => {
    switch (type) {
      case 'positive': return 'text-green-800';
      case 'negative': return 'text-red-800';
      case 'neutral': return 'text-gray-800';
    }
  };

  return (
    <div className={`p-6 rounded-xl border-2 ${getColorClasses()} transition-all hover:shadow-lg`}>
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-sm font-medium ${getTextColor()}`}>{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{count}</p>
          <p className="text-sm text-gray-600 mt-1">{percentage}% of total</p>
        </div>
        <div className="flex items-center">
          {getIcon()}
        </div>
      </div>
    </div>
  );
}
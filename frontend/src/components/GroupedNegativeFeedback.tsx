import React, { useState } from 'react';
import { ChevronDown, ChevronUp, MessageSquare, Tag, Calendar } from 'lucide-react';
import { GroupedNegativeFeedback as GroupedNegativeFeedbackType } from '../types/feedback';

interface GroupedNegativeFeedbackProps {
  groupedFeedback: GroupedNegativeFeedbackType[];
}

export function GroupedNegativeFeedback({ groupedFeedback }: GroupedNegativeFeedbackProps) {
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  const toggleGroup = (category: string) => {
    setExpandedGroups(prev => {
      const newSet = new Set(prev);
      if (newSet.has(category)) {
        newSet.delete(category);
      } else {
        newSet.add(category);
      }
      return newSet;
    });
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (groupedFeedback.length === 0) {
    return (
      <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200 text-center">
        <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No Negative Feedback</h3>
        <p className="text-gray-600">Great news! There are no negative feedback items to display.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-xl font-bold text-gray-900 flex items-center">
          <MessageSquare className="w-6 h-6 mr-2 text-red-600" />
          Grouped Negative Feedback
        </h3>
        <p className="text-gray-600 mt-1">Similar issues grouped by category</p>
      </div>

      <div className="divide-y divide-gray-200">
        {groupedFeedback.map((group) => (
          <div key={group.category} className="p-6">
            <button
              onClick={() => toggleGroup(group.category)}
              className="w-full flex items-center justify-between text-left hover:bg-gray-50 -m-2 p-2 rounded-lg transition-colors"
            >
              <div className="flex items-center">
                <div className="flex items-center justify-center w-10 h-10 bg-red-100 rounded-full mr-4">
                  <span className="text-red-600 font-bold">{group.count}</span>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900">{group.category}</h4>
                  <p className="text-sm text-gray-600">{group.count} similar issues</p>
                </div>
              </div>
              {expandedGroups.has(group.category) ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </button>

            {group.commonKeywords.length > 0 && (
              <div className="mt-4 flex items-center">
                <Tag className="w-4 h-4 text-gray-400 mr-2" />
                <div className="flex flex-wrap gap-2">
                  {group.commonKeywords.map((keyword) => (
                    <span
                      key={keyword}
                      className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full font-medium"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {expandedGroups.has(group.category) && (
              <div className="mt-6 space-y-4">
                {group.feedbacks.map((feedback) => (
                  <div key={feedback.id} className="bg-gray-50 p-4 rounded-lg border-l-4 border-red-400">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <div
                              key={i}
                              className={`w-4 h-4 ${
                                i < feedback.rating ? 'text-yellow-400' : 'text-gray-300'
                              }`}
                            >
                              ★
                            </div>
                          ))}
                        </div>
                        <span className="ml-2 text-sm font-medium text-gray-700">
                          {feedback.rating}/5
                        </span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="w-4 h-4 mr-1" />
                        {formatDate(feedback.timestamp)}
                      </div>
                    </div>
                    <p className="text-gray-800 mb-2">{feedback.content}</p>
                    {feedback.author && (
                      <p className="text-sm text-gray-500">— {feedback.author}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/ui/Card';
import { ClusterVisualization } from '../../components/clustering/ClusterVisualization';
import { BarChart2, Users, TrendingUp, AlertCircle, Clock, Target } from 'lucide-react';
import { Badge } from '../../components/ui/Badge';

export const InstructorAnalytics = () => {
  const { user } = useAuth();
  const [selectedTimeRange, setSelectedTimeRange] = useState<'live' | 'session' | 'week'>('live');

  // Mock real-time data
  const clusters = [
    {
      id: '1',
      name: 'Active Participants',
      description: 'Highly engaged students',
      studentCount: 18,
      engagementLevel: 'high' as const,
      color: '#10b981',
      prediction: 'stable' as const
    },
    {
      id: '2',
      name: 'Moderate Participants',
      description: 'Moderately engaged students',
      studentCount: 10,
      engagementLevel: 'medium' as const,
      color: '#f59e0b',
      prediction: 'improving' as const
    },
    {
      id: '3',
      name: 'At-Risk Students',
      description: 'Low engagement, need support',
      studentCount: 4,
      engagementLevel: 'low' as const,
      color: '#ef4444',
      prediction: 'declining' as const
    }
  ];

  const engagementMetrics = {
    averageEngagement: 72,
    totalStudents: 32,
    activeNow: 28,
    questionsAnswered: 45,
    averageResponseTime: 12.5
  };

  const atRiskStudents = [
    { id: '1', name: 'John Doe', engagement: 35, cluster: 'At-Risk Students', lastActive: '2 min ago' },
    { id: '2', name: 'Jane Smith', engagement: 28, cluster: 'At-Risk Students', lastActive: '5 min ago' },
    { id: '3', name: 'Bob Wilson', engagement: 42, cluster: 'At-Risk Students', lastActive: '1 min ago' },
  ];

  const recentActivity = [
    { time: '2 min ago', student: 'Alice Johnson', action: 'Answered quiz question', cluster: 'Active Participants' },
    { time: '3 min ago', student: 'Charlie Brown', action: 'Raised hand', cluster: 'Moderate Participants' },
    { time: '4 min ago', student: 'David Lee', action: 'Submitted feedback', cluster: 'Active Participants' },
  ];

  return (
    <div className="py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Real-Time Analytics Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Monitor student engagement, clusters, and performance in real-time
        </p>
      </div>

      {/* Time Range Selector */}
      <div className="mb-6 flex space-x-2">
        {(['live', 'session', 'week'] as const).map((range) => (
          <button
            key={range}
            onClick={() => setSelectedTimeRange(range)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedTimeRange === range
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
            }`}
          >
            {range.charAt(0).toUpperCase() + range.slice(1)}
          </button>
        ))}
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Engagement</p>
              <p className="text-2xl font-bold text-gray-900">{engagementMetrics.averageEngagement}%</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Students</p>
              <p className="text-2xl font-bold text-gray-900">{engagementMetrics.totalStudents}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Now</p>
              <p className="text-2xl font-bold text-gray-900">{engagementMetrics.activeNow}</p>
            </div>
            <div className="p-3 bg-indigo-100 rounded-lg">
              <Clock className="h-6 w-6 text-indigo-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Questions</p>
              <p className="text-2xl font-bold text-gray-900">{engagementMetrics.questionsAnswered}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <Target className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Response</p>
              <p className="text-2xl font-bold text-gray-900">{engagementMetrics.averageResponseTime}s</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <BarChart2 className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Clustering Visualization */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Student Clusters</h2>
        <ClusterVisualization clusters={clusters} showPredictions={true} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* At-Risk Students */}
        <Card>
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <AlertCircle className="h-5 w-5 mr-2 text-red-600" />
                At-Risk Students
              </h3>
              <Badge variant="danger">{atRiskStudents.length}</Badge>
            </div>
            <div className="space-y-3">
              {atRiskStudents.map((student) => (
                <div key={student.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{student.name}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-xs text-gray-500">Engagement: {student.engagement}%</span>
                      <span className="text-xs text-gray-400">•</span>
                      <span className="text-xs text-gray-500">{student.lastActive}</span>
                    </div>
                  </div>
                  <button className="px-3 py-1 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700">
                    Intervene
                  </button>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Recent Activity */}
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Clock className="h-5 w-5 mr-2 text-indigo-600" />
              Recent Activity
            </h3>
            <div className="space-y-3">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="flex-shrink-0 w-2 h-2 bg-indigo-600 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">
                      <span className="font-medium">{activity.student}</span> {activity.action}
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant="default" size="sm">{activity.cluster}</Badge>
                      <span className="text-xs text-gray-500">{activity.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};


import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminService, DashboardData } from '../services/adminService';
import { Badge } from '../components/Badge';
import {
  MessageSquare,
  HelpCircle,
  Bot,
  AlertTriangle,
  FileText,
  ArrowRight,
  TrendingUp,
  Clock,
} from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await adminService.getDashboard();
        setData(res);
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-2 text-slate-500 text-sm">
          <div className="w-5 h-5 border-2 border-brand-600 border-t-transparent rounded-full animate-spin" />
          <span>Loading dashboard metrics...</span>
        </div>
      </div>
    );
  }

  const metrics = data?.metrics || {
    totalConversations: 0,
    totalQuestions: 0,
    totalAiResponses: 0,
    humanEscalationCount: 0,
    totalDocuments: 0,
  };

  const statCards = [
    {
      title: 'Total Conversations',
      value: metrics.totalConversations,
      icon: MessageSquare,
      color: 'text-brand-600 bg-red-50 border-brand-200',
    },
    {
      title: 'Customer Questions',
      value: metrics.totalQuestions,
      icon: HelpCircle,
      color: 'text-blue-600 bg-blue-50 border-blue-200',
    },
    {
      title: 'AI Grounded Answers',
      value: metrics.totalAiResponses,
      icon: Bot,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
    },
    {
      title: 'Human Escalations',
      value: metrics.humanEscalationCount,
      icon: AlertTriangle,
      color: 'text-rose-600 bg-rose-50 border-rose-200',
      urgent: metrics.humanEscalationCount > 0,
    },
    {
      title: 'Documents',
      value: metrics.totalDocuments,
      icon: FileText,
      color: 'text-purple-600 bg-purple-50 border-purple-200',
    },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto w-full space-y-8 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">System Overview</h1>
         
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/admin/documents"
            className="px-4 py-2 text-sm font-medium bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-sm transition-all"
          >
            + Upload PDF
          </Link>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {statCards.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className={`p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between transition-all hover:shadow-md ${
                stat.urgent ? 'ring-2 ring-rose-400/50' : ''
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  {stat.title}
                </span>
                <div className={`p-2 rounded-xl border ${stat.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
                  {stat.value}
                </span>
                {stat.urgent && (
                  <span className="text-[11px] font-bold text-rose-600 uppercase tracking-wider animate-pulse">
                    Action Needed
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Info & Recent Conversations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Conversations Card */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-500" />
              <h2 className="text-base font-semibold text-slate-900">Recent Customer Sessions</h2>
            </div>
            <Link
              to="/admin/conversations"
              className="text-xs font-medium text-red-600 hover:text-red-700 flex items-center gap-1"
            >
              View all
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {data?.recentConversations && data.recentConversations.length > 0 ? (
              data.recentConversations.map((conv) => (
                <div
                  key={conv.id}
                  className="p-4 hover:bg-slate-50/70 transition-colors flex items-center justify-between gap-4"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono text-xs font-semibold text-slate-800">
                        {conv.sessionId}
                      </span>
                      <Badge status={conv.status} />
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      Last active: {new Date(conv.updatedAt).toLocaleString()}
                    </p>
                  </div>
                  <Link
                    to={`/admin/conversations?id=${conv.id}`}
                    className="shrink-0 px-3 py-1.5 text-xs font-medium text-slate-700 hover:text-red-600 bg-slate-100 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    Inspect
                  </Link>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-sm text-slate-400">
                No customer conversations recorded yet. Ask a question from the Customer Website!
              </div>
            )}
          </div>
        </div>

   
      </div>
    </div>
  );
};

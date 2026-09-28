import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { conversationService } from '../services/conversationService';
import { ConversationSummary, ConversationDetail, ConversationStatus } from '../types';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import {
  MessageSquare,
  Bot,
  User,
  Clock,
  FileText,
  AlertTriangle,
  CheckCircle,
  Search,
} from 'lucide-react';

export const AdminConversationsPage: React.FC = () => {
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [conversationDetail, setConversationDetail] = useState<ConversationDetail | null>(null);
  const [loadingList, setLoadingList] = useState(true);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const [searchParams] = useSearchParams();

  // Load conversations list
  const fetchConversations = async () => {
    try {
      const res = await conversationService.getConversations(1, 50);
      setConversations(res.conversations);

      // Check query param for default selection
      const queryId = searchParams.get('id');
      if (queryId) {
        setSelectedId(queryId);
      } else if (res.conversations.length > 0 && !selectedId) {
        setSelectedId(res.conversations[0].id);
      }
    } catch (err) {
      console.error('Failed to load conversations:', err);
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, [searchParams]);

  // Load selected conversation detail
  useEffect(() => {
    if (!selectedId) return;

    const fetchDetail = async () => {
      setLoadingDetail(true);
      try {
        const detail = await conversationService.getConversation(selectedId);
        setConversationDetail(detail);
      } catch (err) {
        console.error('Failed to load conversation details:', err);
      } finally {
        setLoadingDetail(false);
      }
    };

    fetchDetail();
  }, [selectedId]);

  const handleUpdateStatus = async (newStatus: ConversationStatus) => {
    if (!selectedId) return;
    try {
      await conversationService.updateStatus(selectedId, newStatus);
      await fetchConversations();
      const updated = await conversationService.getConversation(selectedId);
      setConversationDetail(updated);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update conversation status.');
    }
  };

  // Filter conversations
  const filteredConversations = conversations.filter((c) => {
    const matchesFilter =
      statusFilter === 'ALL' || c.status.toUpperCase() === statusFilter.toUpperCase();
    const matchesQuery =
      searchQuery.trim() === '' ||
      c.sessionId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.lastQuestion.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesQuery;
  });

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden">
      {/* Top Bar */}
      <div className="h-16 px-8 bg-white border-b border-slate-200/80 flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Conversations </h1>
      
        </div>

        <div className="flex items-center gap-3">
          {/* Status Filter */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-medium">
            {['ALL', 'ACTIVE', 'HUMAN_REQUIRED', 'CLOSED'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1 rounded-lg transition-colors ${
                  statusFilter === st
                    ? 'bg-white text-slate-900 shadow-xs font-semibold'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {st.replace(/_/g, ' ')}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Split Layout */}
      <div className="flex-1 flex min-h-0">
        {/* Left: Conversation List */}
        <div className="w-96 bg-white border-r border-slate-200/80 flex flex-col shrink-0">
          {/* Search box */}
          <div className="p-3 border-b border-slate-100">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs">
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search session or question..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent focus:outline-none text-slate-800 placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* List items */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {loadingList ? (
              <div className="p-8 text-center text-xs text-slate-400">Loading sessions...</div>
            ) : filteredConversations.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">No conversations match your filter.</div>
            ) : (
              filteredConversations.map((conv) => {
                const isSelected = conv.id === selectedId;
                return (
                  <div
                    key={conv.id}
                    onClick={() => setSelectedId(conv.id)}
                    className={`p-4 cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-red-50/70 border-l-4 border-red-600'
                        : 'hover:bg-slate-50/80 border-l-4 border-transparent'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-mono text-xs font-semibold text-slate-800 truncate max-w-[170px]">
                        {conv.sessionId}
                      </span>
                      <Badge status={conv.status} />
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-2">
                      "{conv.lastQuestion}"
                    </p>

                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(conv.updatedAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                      <span>{conv.messageCount} messages</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right: Conversation Thread & RAG Inspection */}
        <div className="flex-1 bg-slate-50/50 flex flex-col min-w-0 overflow-hidden">
          {loadingDetail ? (
            <div className="flex-1 flex items-center justify-center text-sm text-slate-500">
              Loading conversation details...
            </div>
          ) : !conversationDetail ? (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
              <MessageSquare className="w-10 h-10 mb-2 stroke-1" />
              <p className="text-sm">Select a conversation from the list to inspect</p>
            </div>
          ) : (
            <div className="flex-1 flex flex-col h-full overflow-hidden">
              {/* Detail Header */}
              <div className="p-4 px-6 bg-white border-b border-slate-200/80 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="font-mono text-sm font-bold text-slate-900">
                        {conversationDetail.conversation.sessionId}
                      </h2>
                      <Badge status={conversationDetail.conversation.status} />
                    </div>
                    {/* <p className="text-xs text-slate-400 mt-0.5">
                      Created on{' '}
                      {new Date(conversationDetail.conversation.createdAt).toLocaleString()}
                    </p> */}
                  </div>
                </div>

                {/* Status action button */}
                <div className="flex items-center gap-2">
                  {conversationDetail.conversation.status === 'HUMAN_REQUIRED' && (
                    <Button
                      variant="primary"
                      size="sm"
                      leftIcon={<CheckCircle className="w-3.5 h-3.5" />}
                      onClick={() => handleUpdateStatus('CLOSED')}
                    >
                      Resolve & Close
                    </Button>
                  )}
                  {conversationDetail.conversation.status === 'ACTIVE' && (
                    <Button
                      variant="outline"
                      size="sm"
                      leftIcon={<AlertTriangle className="w-3.5 h-3.5 text-amber-500" />}
                      onClick={() => handleUpdateStatus('HUMAN_REQUIRED')}
                    >
                      Flag for Human
                    </Button>
                  )}
                  {conversationDetail.conversation.status === 'CLOSED' && (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleUpdateStatus('ACTIVE')}
                    >
                      Re-open
                    </Button>
                  )}
                </div>
              </div>

              {/* Message Feed */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {conversationDetail.messages.map((msg, index) => {
                  const isUser = msg.role === 'USER';
                  return (
                    <div
                      key={msg.id || index}
                      className={`flex gap-3 max-w-3xl ${
                        isUser ? 'ml-auto flex-row-reverse' : 'mr-auto flex-row'
                      }`}
                    >
                      {/* Avatar */}
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-white text-xs shadow-sm ${
                          isUser ? 'bg-slate-700' : 'bg-red-600'
                        }`}
                      >
                        {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                      </div>

                      {/* Content Card */}
                      <div className="flex-1">
                        <div
                          className={`p-4 rounded-2xl shadow-xs text-sm leading-relaxed ${
                            isUser
                              ? 'bg-slate-900 text-white rounded-tr-xs'
                              : 'bg-white border border-slate-200/90 text-slate-800 rounded-tl-xs'
                          }`}
                        >
                          <div className="whitespace-pre-wrap">{msg.content}</div>

                          {/* Detailed Sources & Similarity Scores */}
                          {!isUser && msg.sources && msg.sources.length > 0 && (
                            <div className="mt-3 pt-3 border-t border-slate-100">
                              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                                Retrieved Knowledge Base Citations ({msg.sources.length})
                              </span>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {msg.sources.map((src, sIdx) => (
                                  <div
                                    key={sIdx}
                                    className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs flex flex-col justify-between gap-1"
                                  >
                                    <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                                      <FileText className="w-3.5 h-3.5 text-brand-600 shrink-0" />
                                      <span className="truncate">{src.documentName}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-200/50">
                                      <span>Page {src.pageNumber}</span>
                                      <span className="font-mono text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                                        Sim: {src.similarityScore ?? 'N/A'}
                                      </span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        <span className="text-[10px] text-slate-400 mt-1 block px-1">
                          {new Date(msg.createdAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit',
                          })}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

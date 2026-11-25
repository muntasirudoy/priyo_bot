import React from 'react';
import { Sliders, Cpu, Database, CheckCircle, ShieldCheck } from 'lucide-react';

export const AdminSettingsPage: React.FC = () => {
  return (
    <div className="p-8 max-w-4xl mx-auto w-full space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">System Settings & Configuration</h1>
        <p className="text-sm text-slate-500 mt-1">
          Review RAG parameters, active Gemini models, and pipeline configurations
        </p>
      </div>

      <div className="space-y-6">
        {/* Model Configurations */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
            <Cpu className="w-5 h-5 text-brand-600" />
            <h2 className="text-base font-semibold text-slate-900">Active AI Models</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/70">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                Embedding Model
              </span>
              <p className="font-mono text-sm font-bold text-slate-800">gemini-embedding-001</p>
              <p className="text-xs text-slate-500 mt-1">
                Single model used for both document chunking and customer query embedding vectors.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/70">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                Generation Model
              </span>
              <p className="font-mono text-sm font-bold text-slate-800">gemini-2.5-flash</p>
              <p className="text-xs text-slate-500 mt-1">
                Strict grounding prompt with JSON validation and hallucination prevention.
              </p>
            </div>
          </div>
        </div>

        {/* Chunking & Retrieval Strategy */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
            <Sliders className="w-5 h-5 text-brand-600" />
            <h2 className="text-base font-semibold text-slate-900">RAG Chunking & Vector Search Parameters</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/70">
              <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block mb-1">
                Target Chunk Size
              </span>
              <p className="text-xl font-bold text-slate-800">600 chars</p>
              <p className="text-xs text-slate-500 mt-1">Preserves paragraph & sentence boundaries</p>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/70">
              <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block mb-1">
                Chunk Overlap
              </span>
              <p className="text-xl font-bold text-slate-800">100 chars</p>
              <p className="text-xs text-slate-500 mt-1">Maintains semantic context across splits</p>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/70">
              <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block mb-1">
                Min Similarity Threshold
              </span>
              <p className="text-xl font-bold text-slate-800">0.50</p>
              <p className="text-xs text-slate-500 mt-1">Filters out irrelevant document chunks</p>
            </div>
          </div>
        </div>

        {/* System Health */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
            <Database className="w-5 h-5 text-brand-600" />
            <h2 className="text-base font-semibold text-slate-900">Database & Security</h2>
          </div>

          <div className="space-y-3 text-xs text-slate-600">
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
              <span className="font-semibold text-slate-800">MongoDB Persistence</span>
              <span className="inline-flex items-center gap-1 text-emerald-600 font-medium">
                <CheckCircle className="w-4 h-4" /> Connected
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
              <span className="font-semibold text-slate-800">JWT Token Security</span>
              <span className="inline-flex items-center gap-1 text-emerald-600 font-medium">
                <ShieldCheck className="w-4 h-4" /> Enabled (7d Expiration)
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
              <span className="font-semibold text-slate-800">Rate Limiting</span>
              <span className="inline-flex items-center gap-1 text-emerald-600 font-medium">
                <CheckCircle className="w-4 h-4" /> Active (30 req/min)
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

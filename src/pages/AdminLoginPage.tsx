import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/Button';
import { ShieldCheck, AlertCircle, Sparkles } from 'lucide-react';

export const AdminLoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in both email and password.');
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      await login(email, password);
      navigate('/admin');
    } catch (err: any) {
      setError(
        err.response?.data?.message || 'Invalid email or password. Please check credentials.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleUseDemo = () => {
    setEmail('admin@support.com');
    setPassword('Admin123!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 p-8 sm:p-10 animate-slide-up">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-red-600 flex items-center justify-center text-white shadow-md shadow-brand-500/30 mb-4">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Admin Portal</h2>
          <p className="text-sm text-slate-500 mt-1">
            Sign in to manage AI knowledge documents and view conversations
          </p>
        </div>

        {/* Demo Credentials Quick-Fill Banner */}
        <div className="mb-6 p-3.5 bg-red-50/70 border border-brand-200/80 rounded-2xl flex items-center justify-between text-xs text-brand-900">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-red-600 shrink-0" />
            <div>
              <p className="font-semibold">Default Demo Account</p>
              <p className="text-[11px] text-red-700">admin@support.com / Admin123!</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleUseDemo}
            className="px-2.5 py-1 text-xs font-semibold bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors shadow-xs"
          >
            Auto-fill
          </button>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@support.com"
              required
              className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isLoading}
            className="w-full mt-2"
          >
            Sign In to Dashboard
          </Button>
        </form>

        <div className="mt-6 text-center">
          <a
            href="/"
            className="text-xs text-slate-500 hover:text-brand-600 transition-colors"
          >
            ← Return to Customer Website
          </a>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { validateEmailClientSide } from '../../utils/emailValidator';

export interface ChatIdentity { email: string; name: string }
export const EmailGate: React.FC<{ onVerified: (identity: ChatIdentity) => void }> = ({ onVerified }) => {
  const [email, setEmail] = useState(''); const [name, setName] = useState('');
  const [reason, setReason] = useState(''); const [suggestion, setSuggestion] = useState(''); const [loading, setLoading] = useState(false);
  const submit = async (event: React.FormEvent) => {
    event.preventDefault(); setLoading(true); setReason(''); setSuggestion('');
    const result = await validateEmailClientSide(email); setLoading(false);
    if (!result.valid) { setReason(result.reason || 'Check your email address.'); setSuggestion(result.suggestion || ''); return; }
    const identity = { email: email.trim().toLowerCase(), name: name.trim() };
    localStorage.setItem('chat_user_identity', JSON.stringify(identity)); onVerified(identity);
  };
  return <form onSubmit={submit} className="flex-1 flex flex-col justify-center p-6 bg-white gap-4">
    <div><h2 className="text-lg font-semibold text-slate-900">Before we chat</h2><p className="text-sm text-slate-500 mt-1">Your email helps our team follow up if needed.</p></div>
    <label className="text-sm font-medium text-slate-700">Email <span className="text-red-600">*</span><input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-300 p-3 outline-none focus:border-red-500" placeholder="you@example.com" /></label>
    <label className="text-sm font-medium text-slate-700">Name <span className="font-normal text-slate-400">(optional)</span><input value={name} maxLength={120} onChange={(e) => setName(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-300 p-3 outline-none focus:border-red-500" placeholder="Your name" /></label>
    {reason && <p role="alert" className="text-xs text-rose-600">{reason}</p>}
    {suggestion && <button type="button" className="text-left text-sm text-blue-600 underline" onClick={() => { setEmail(suggestion); setSuggestion(''); setReason(''); }}>Did you mean {suggestion}?</button>}
    <button type="submit" disabled={loading} className="rounded-xl bg-red-600 p-3 text-white font-semibold disabled:opacity-60">{loading ? 'Checking email…' : 'Start chat'}</button>
  </form>;
};

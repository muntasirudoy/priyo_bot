import React from 'react';
import { ChatWidget } from '../features/chat/ChatWidget';

export const EmbedPage: React.FC = () => {
  const params = new URLSearchParams(window.location.search);
  const requestedParent = params.get('parentOrigin') || '';
  let referrerOrigin = '';
  try { referrerOrigin = document.referrer ? new URL(document.referrer).origin : ''; } catch { referrerOrigin = ''; }
  const allowed = ((import.meta.env.VITE_ALLOWED_EMBED_ORIGINS as string | undefined) || '').split(',').map((value) => value.trim()).filter(Boolean);
  const isEmbedded = window.parent !== window;
  const parentOrigin = referrerOrigin || requestedParent;
  // Empty allowlist means public embedding. Adding one or more origins switches to restricted mode.
  const authorized = !isEmbedded || (parentOrigin === requestedParent && (allowed.length === 0 || allowed.includes(parentOrigin)));
  if (!authorized) return <div className="p-4 text-sm text-red-700">This website is not authorized to embed the support widget.</div>;
  return <ChatWidget embedded siteId={params.get('siteId') || 'default'} title={params.get('title') || undefined} greeting={params.get('greeting') || undefined} primaryColor={params.get('primaryColor') || undefined} parentOrigin={parentOrigin} />;
};

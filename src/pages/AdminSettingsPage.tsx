import React, { useEffect, useState } from 'react';
import { adminService } from '../services/adminService';
import { BotSettings } from '../types';

export const AdminSettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<BotSettings | null>(null); const [message, setMessage] = useState(''); const [saving, setSaving] = useState(false);
  useEffect(() => { adminService.getSettings().then(setSettings).catch(() => setMessage('Could not load settings.')); }, []);
  const save = async (event: React.FormEvent) => { event.preventDefault(); if (!settings) return; setSaving(true); try { setSettings(await adminService.updateSettings(settings)); setMessage('Settings saved.'); } catch { setMessage('Could not save settings.'); } finally { setSaving(false); } };
  if (!settings) return <div className="p-8">{message || 'Loading settings...'}</div>;
  return <form onSubmit={save} className="p-8 max-w-3xl mx-auto space-y-5"><h1 className="text-2xl font-bold">Bot Settings</h1>
    <label className="block text-sm font-medium">Bot name<input className="mt-1 block w-full rounded-lg border p-3" value={settings.botName} onChange={(e) => setSettings({ ...settings, botName: e.target.value })} required /></label>
    <label className="block text-sm font-medium">Tone<select className="mt-1 block w-full rounded-lg border p-3" value={settings.tone} onChange={(e) => setSettings({ ...settings, tone: e.target.value as BotSettings['tone'] })}><option value="friendly">Friendly</option><option value="professional">Professional</option><option value="casual">Casual</option></select></label>
    <label className="block text-sm font-medium">Greeting message<textarea className="mt-1 block w-full rounded-lg border p-3" value={settings.greetingMessage} onChange={(e) => setSettings({ ...settings, greetingMessage: e.target.value })} required /></label>
    <label className="block text-sm font-medium">Fallback message<textarea className="mt-1 block w-full rounded-lg border p-3" value={settings.fallbackMessage} onChange={(e) => setSettings({ ...settings, fallbackMessage: e.target.value })} required /></label>
    <label className="block text-sm font-medium">Confidence threshold: {settings.confidenceThreshold.toFixed(2)}<input type="range" min="0" max="1" step="0.01" className="mt-2 block w-full" value={settings.confidenceThreshold} onChange={(e) => setSettings({ ...settings, confidenceThreshold: Number(e.target.value) })} /></label>
    <button disabled={saving} className="rounded-lg bg-red-600 px-5 py-2 text-white disabled:opacity-50">{saving ? 'Saving...' : 'Save settings'}</button><p role="status" className="text-sm">{message}</p>
  </form>;
};

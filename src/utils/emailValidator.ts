export interface EmailValidationResult { valid: boolean; reason?: string; suggestion?: string }
const typos: Record<string, string> = { 'gmial.com': 'gmail.com', 'gamil.com': 'gmail.com', 'gnail.com': 'gmail.com', 'gmai.com': 'gmail.com', 'yaho.com': 'yahoo.com', 'yahooo.com': 'yahoo.com', 'hotmial.com': 'hotmail.com', 'outlok.com': 'outlook.com', 'icoud.com': 'icloud.com' };
const disposable = new Set(['tempmail.com', '10minutemail.com', 'mailinator.com', 'yopmail.com', 'guerrillamail.com', 'sharklasers.com', 'trashmail.com', 'dispostable.com', 'getnada.com', 'temp-mail.org']);
type DnsAnswer = { type?: number; data?: string };
async function hasMx(url: string, headers?: HeadersInit): Promise<boolean | null> {
  try {
    const response = await fetch(url, { headers, signal: AbortSignal.timeout(3000) });
    if (!response.ok) return null;
    const dns = await response.json() as { Status?: number; Answer?: DnsAnswer[] };
    if (dns.Status !== 0) return false;
    return Boolean(dns.Answer?.some((answer) => answer.type === 15 && typeof answer.data === 'string' && /^\d+\s+[^\s.]+(?:\.[^\s.]+)+\.?$/.test(answer.data)));
  } catch { return null; }
}
export async function validateEmailClientSide(input: string): Promise<EmailValidationResult> {
  const email = input.trim().toLowerCase();
  const match = /^([a-z0-9.!#$%&'*+/=?^_`{|}~-]+)@([a-z0-9-]+(?:\.[a-z0-9-]+)+)$/i.exec(email);
  if (!match || email.length > 254 || match[1].length > 64 || /(^\.|\.\.|\.$)/.test(match[1]) || match[2].split('.').some((label) => label.length > 63 || label.startsWith('-') || label.endsWith('-')) || !/[a-z]{2,}$/i.test(match[2])) return { valid: false, reason: 'Enter a valid email address.' };
  const [, local, domain] = match;
  const suggestion = typos[domain] ? `${local}@${typos[domain]}` : undefined;
  if (suggestion) return { valid: false, reason: 'Please check the email domain.', suggestion };
  if (disposable.has(domain)) return { valid: false, reason: 'Please use a permanent email address.' };
  if (/^(test|asdf|abc|12345|admin)$/i.test(local) || /^(.)\1{3,}$/.test(local) || (local === 'admin' && domain.startsWith('admin.'))) return { valid: false, reason: 'Please use your real email address.' };
  const google = await hasMx(`https://dns.google/resolve?name=${encodeURIComponent(domain)}&type=MX`);
  const mx = google === null ? await hasMx(`https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(domain)}&type=MX`, { Accept: 'application/dns-json' }) : google;
  return mx === false ? { valid: false, reason: 'This email domain does not appear to receive mail.' } : { valid: true };
}

import { PERSONAL } from '../data/personal';

export interface ContactPayload {
  name: string;
  email: string;
  message: string;
}

export type SendResult = { status: 'sent' } | { status: 'unconfigured' } | { status: 'error'; error: string };

const SERVICE_ID = (import.meta.env.VITE_EMAILJS_SERVICE_ID as string | undefined)?.trim();
const TEMPLATE_ID = (import.meta.env.VITE_EMAILJS_TEMPLATE_ID as string | undefined)?.trim();
const PUBLIC_KEY = (import.meta.env.VITE_EMAILJS_PUBLIC_KEY as string | undefined)?.trim();

export const isEmailConfigured = Boolean(SERVICE_ID && TEMPLATE_ID && PUBLIC_KEY);

export function buildMailto(p: Partial<ContactPayload>): string {
  const subject = encodeURIComponent(`Portfolio enquiry${p.name ? ` from ${p.name}` : ''}`);
  const body = encodeURIComponent(`${p.message ?? ''}\n\n${p.name ? `— ${p.name}` : ''}${p.email ? ` (${p.email})` : ''}`);
  return `mailto:${PERSONAL.email}?subject=${subject}&body=${body}`;
}

/**
 * Sends the message through EmailJS. When EmailJS is not configured it NEVER reports success:
 * it returns `unconfigured` so the UI can show a development-mode notice and a mailto fallback.
 */
export async function sendContact(payload: ContactPayload): Promise<SendResult> {
  if (!isEmailConfigured) return { status: 'unconfigured' };
  try {
    const emailjs = (await import('@emailjs/browser')).default;
    await emailjs.send(
      SERVICE_ID as string,
      TEMPLATE_ID as string,
      {
        from_name: payload.name,
        from_email: payload.email,
        reply_to: payload.email,
        message: payload.message,
        to_email: PERSONAL.email,
      },
      { publicKey: PUBLIC_KEY as string },
    );
    return { status: 'sent' };
  } catch (err) {
    const error = err instanceof Error ? err.message : typeof err === 'object' && err && 'text' in err ? String((err as { text: unknown }).text) : 'Unknown error';
    return { status: 'error', error };
  }
}

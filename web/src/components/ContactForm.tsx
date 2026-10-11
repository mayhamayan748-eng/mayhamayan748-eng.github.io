import { useState, type FormEvent } from 'react';

type Strings = {
  name: string;
  email: string;
  message: string;
  send: string;
  sending: string;
  ok: string;
  err: string;
  rate: string;
  invalid: string;
};

type Status = 'idle' | 'sending' | 'ok' | 'err' | 'rate' | 'invalid';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ContactForm({ apiUrl, locale, s }: { apiUrl: string; locale: 'en' | 'ar'; s: Strings }) {
  const [status, setStatus] = useState<Status>('idle');

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form)) as Record<string, string>;
    const name = data.name?.trim() ?? '';
    const email = data.email?.trim() ?? '';
    const message = data.message?.trim() ?? '';
    if (!name || !EMAIL_RE.test(email) || message.length < 10) {
      setStatus('invalid');
      return;
    }
    setStatus('sending');
    try {
      const res = await fetch(`${apiUrl}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message, locale, website: data.website ?? '' }),
      });
      if (res.status === 429) return setStatus('rate');
      if (res.status === 422) return setStatus('invalid');
      if (!res.ok) throw new Error(String(res.status));
      form.reset();
      setStatus('ok');
    } catch {
      setStatus('err');
    }
  }

  const field =
    'w-full rounded-lg border border-line bg-surface px-3.5 py-2.5 text-ink placeholder:text-muted/60 transition-colors focus:border-gold focus:outline-none';
  const msg: Partial<Record<Status, string>> = { ok: s.ok, err: s.err, rate: s.rate, invalid: s.invalid };

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-1.5 text-sm">
          <span className="text-muted">{s.name}</span>
          <input name="name" required maxLength={120} autoComplete="name" className={field} />
        </label>
        <label className="grid gap-1.5 text-sm">
          <span className="text-muted">{s.email}</span>
          <input name="email" type="email" required maxLength={254} autoComplete="email" dir="ltr" className={field} />
        </label>
      </div>
      <label className="grid gap-1.5 text-sm">
        <span className="text-muted">{s.message}</span>
        <textarea name="message" required minLength={10} maxLength={5000} rows={5} className={field} />
      </label>
      {/* Honeypot: hidden from people, filled by naive bots. */}
      <div aria-hidden="true" className="sr-only">
        <label>
          Website
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={status === 'sending'}
          className="inline-flex h-11 items-center rounded-lg bg-gold px-5 font-medium text-on-gold transition-colors hover:bg-gold-bright disabled:opacity-60"
        >
          {status === 'sending' ? s.sending : s.send}
        </button>
        <p role="status" aria-live="polite" className={`text-sm ${status === 'ok' ? 'text-gold' : 'text-amber'}`}>
          {msg[status] ?? ''}
        </p>
      </div>
    </form>
  );
}

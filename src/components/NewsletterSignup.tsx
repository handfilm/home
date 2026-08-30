import React, { useState } from 'react';
import { TranslationDictionary } from '../i18n/translations';
import { Mail, Check, ArrowRight, ShieldCheck } from 'lucide-react';
import { trackEvent } from '../services/analytics';
import { markNewsletterSubscribed, getStoredVisitorState } from '../services/visitorState';

interface NewsletterSignupProps {
  t: TranslationDictionary;
}

export default function NewsletterSignup({ t }: NewsletterSignupProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const visitorState = getStoredVisitorState();
  const alreadySubscribed = visitorState.newsletterSubscribed;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@') || !email.includes('.')) {
      setErrorMessage('Please enter a valid email address.');
      setStatus('error');
      return;
    }

    setStatus('loading');
    setErrorMessage('');

    try {
      // Send to serverless / mock dispatch endpoint
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, timestamp: new Date().toISOString() }),
      }).catch(() => null);

      // Even if offline or mock, save locally
      markNewsletterSubscribed();
      trackEvent('MASTER_NEWSLETTER_SIGNUP', { emailDomain: email.split('@')[1] });

      setStatus('success');
    } catch {
      markNewsletterSubscribed();
      trackEvent('MASTER_NEWSLETTER_SIGNUP', { emailDomain: email.split('@')[1] });
      setStatus('success');
    }
  };

  if (alreadySubscribed || status === 'success') {
    return (
      <div className="p-4 rounded-xl bg-[#151411] border border-emerald-500/30 text-emerald-400 font-mono text-xs flex items-center gap-3">
        <ShieldCheck className="w-5 h-5 flex-shrink-0 text-emerald-400" />
        <div>
          <div className="font-bold uppercase tracking-wider">
            {t.newsletter.badge} · SUBSCRIBED
          </div>
          <div className="text-[10.5px] text-[#f3efe6]/70 mt-0.5">
            {t.newsletter.success}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-5 rounded-xl bg-[#161512] border border-[#f3efe6]/15 font-mono space-y-3">
      <div className="flex items-center gap-2">
        <span className="text-[9.5px] px-2 py-0.5 rounded font-bold uppercase bg-[#c8b89a]/15 text-[#c8b89a] border border-[#c8b89a]/30">
          {t.newsletter.badge}
        </span>
      </div>

      <div>
        <h4 className="text-sm sm:text-base font-bold uppercase text-[#f3efe6] tracking-tight">
          {t.newsletter.title}
        </h4>
        <p className="text-xs text-[#f3efe6]/60 mt-1 leading-relaxed">
          {t.newsletter.subtitle}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 pt-1">
        <div className="relative flex-1">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#f3efe6]/40" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t.newsletter.placeholder}
            disabled={status === 'loading'}
            className="w-full pl-9 pr-3 py-2 bg-[#0e0d0b] border border-[#f3efe6]/20 rounded text-xs text-[#f3efe6] placeholder-[#f3efe6]/30 focus:border-[#c8b89a] outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={status === 'loading'}
          className="px-4 py-2 bg-[#f3efe6] text-[#0e0d0b] hover:bg-[#c8b89a] font-bold text-xs uppercase tracking-wider rounded transition-all cursor-pointer flex items-center justify-center gap-1.5 flex-shrink-0 disabled:opacity-50"
        >
          <span>{status === 'loading' ? 'REGISTERING...' : t.newsletter.submit}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </form>

      {status === 'error' && (
        <div className="text-[10px] text-rose-400">{errorMessage}</div>
      )}

      <div className="text-[9.5px] text-[#f3efe6]/40 flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
        <span>{t.newsletter.note}</span>
      </div>
    </div>
  );
}

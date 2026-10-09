import React, { useState } from 'react';
import { Mail, CheckCircle2, AlertCircle } from 'lucide-react';

export const NewsletterBox: React.FC = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [feedbackMessage, setFeedbackMessage] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmed = email.trim();
    // Basic RFC 5322 regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!trimmed) {
      setStatus('error');
      setFeedbackMessage('Please enter your email address.');
      return;
    }

    if (!emailRegex.test(trimmed)) {
      setStatus('error');
      setFeedbackMessage('Please enter a valid email address (e.g., name@example.com).');
      return;
    }

    // Success in demo mode
    setStatus('success');
    setFeedbackMessage(
      `Demo Mode: Thank you! In a live production deployment, ${trimmed} would be subscribed to our weekly dispatch.`
    );
    setEmail('');
  };

  return (
    <section
      id="newsletter-section"
      className="bg-[#14213D] text-[#FFFFFF] rounded-sm p-8 sm:p-12 lg:p-16 my-16 border border-[#14213D] relative overflow-hidden"
    >
      <div className="max-w-2xl mx-auto text-center space-y-4">
        <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/10 text-white mb-2">
          <Mail className="w-5 h-5 text-blue-300" />
        </div>

        <h2 className="font-heading font-extrabold text-3xl sm:text-4xl tracking-tight text-white">
          Stay curious.
        </h2>

        <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
          Get thoughtful technology stories, simple explainers, and lessons from people building things.
          Delivered every Sunday morning. No spam, ever.
        </p>

        <form onSubmit={handleSubscribe} className="pt-4 max-w-md mx-auto">
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (status === 'error') setStatus('idle');
              }}
              placeholder="Your email address"
              aria-label="Email address for newsletter"
              className="flex-1 px-4 py-3 text-sm text-[#171717] bg-[#FFFFFF] rounded border border-transparent focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
            />
            <button
              type="submit"
              className="px-6 py-3 text-sm font-semibold text-white bg-[#3B82F6] hover:bg-blue-600 rounded transition-colors whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              Subscribe
            </button>
          </div>

          {/* Feedback states */}
          {status === 'error' && (
            <div className="mt-3 flex items-center justify-center gap-2 text-xs text-rose-300 bg-rose-950/40 p-2.5 rounded border border-rose-900/50">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{feedbackMessage}</span>
            </div>
          )}

          {status === 'success' && (
            <div className="mt-4 text-left sm:text-center text-xs text-emerald-300 bg-emerald-950/50 p-3.5 rounded border border-emerald-800/60 leading-relaxed">
              <div className="flex items-start sm:items-center justify-center gap-2 mb-1 font-semibold text-emerald-200">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 sm:mt-0" />
                <span>Subscription preview received</span>
              </div>
              <p className="text-emerald-300/90">{feedbackMessage}</p>
            </div>
          )}

          <p className="text-[11px] text-gray-400 mt-3">
            Local interactive demonstration · No external newsletter service connected
          </p>
        </form>
      </div>
    </section>
  );
};

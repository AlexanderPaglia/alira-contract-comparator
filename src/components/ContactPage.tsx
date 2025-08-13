import React, { useState } from 'react';
import { AliraTextLogoIcon } from './AliraTextLogoIcon';
import { SproutLogoIcon } from './SproutLogoIcon';
import { AnimatedSection } from './AnimatedSection';
import { EnvelopeIcon } from './Icons';
import { LoadingSpinner } from './LoadingSpinner';

interface ContactPageProps {
  onNavigateHome: () => void;
  onNavigateToPrivacy: () => void;
}

const contactReasons = [
  { value: "", label: "Please select a reason...", disabled: true },
  { value: "pricing_inquiry", label: "Request a Plan / Pricing Inquiry" },
  { value: "demo_request", label: "Request a Demo" },
  { value: "technical_support", label: "Seeking Help / Technical Support" },
  { value: "bug_report", label: "Report an Issue / Bug" },
  { value: "general_inquiry", label: "General Inquiry" },
  { value: "feedback", label: "Provide Feedback" },
  { value: "other", label: "Other (Please specify in message)" },
];

export const ContactPage: React.FC<ContactPageProps> = ({ onNavigateHome, onNavigateToPrivacy }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [contactReason, setContactReason] = useState('');
  const [message, setMessage] = useState('');
  const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);
    setSubmissionStatus('submitting');

    if (!name.trim() || !email.trim() || !contactReason || !message.trim()) {
      setFormError('All fields, including a reason for contact, are required. Please fill them out.');
      setSubmissionStatus('error');
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        setFormError('Please enter a valid email address.');
        setSubmissionStatus('error');
        return;
    }

    try {
        const response = await fetch('/api/contact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, reason: contactReason, message }),
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || 'Something went wrong on the server.');
        }

        setSubmissionStatus('success');
        setName('');
        setEmail('');
        setContactReason('');
        setMessage('');

    } catch (e: any) {
        setSubmissionStatus('error');
        setFormError(e.message || "Failed to send message. Please try again later or email us directly.");
        console.error("Error submitting contact form:", e);
    }
  };

  const isSubmitting = submissionStatus === 'submitting';

  return (
    <div className="w-full min-h-screen flex flex-col items-center text-slate-800 dark:text-gray-100 pt-20 pb-10 px-4 sm:px-8 overflow-x-hidden">
      <header className="w-full max-w-5xl mb-12 sm:mb-16 text-center">
        <button 
          onClick={onNavigateHome}
          className="inline-block focus:outline-none focus:ring-2 focus:ring-sky-400 rounded-lg transition-transform duration-200 hover:scale-105"
          aria-label="Back to Alira Home"
        >
          <AliraTextLogoIcon className="h-16 sm:h-20 mb-4 mx-auto text-[#7AD7FF] dark:text-[#7AD7FF]" />
        </button>
      </header>

      <main className="w-full max-w-2xl">
        <AnimatedSection>
          <h1 className="text-3xl sm:text-4xl font-bold text-center text-slate-900 dark:text-white mb-6">
            Get in Touch
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 text-center max-w-xl mx-auto mb-10 sm:mb-12">
            Have questions, feedback, or need support? We'd love to hear from you. Fill out the form below, and we'll get back to you as soon as possible.
          </p>
        </AnimatedSection>

        <AnimatedSection animationClasses={{ delayClass: 'delay-100' }}>
          <form 
            onSubmit={handleSubmit} 
            className="bg-white/80 dark:bg-slate-800/70 backdrop-blur-sm p-6 sm:p-10 rounded-2xl shadow-xl space-y-6"
            noValidate
          >
            {submissionStatus === 'error' && formError && (
              <div className="p-3 bg-red-100 dark:bg-red-900/50 border border-red-300 dark:border-red-500 rounded-md text-red-700 dark:text-red-200 text-sm">
                {formError}
              </div>
            )}
            {submissionStatus === 'success' && (
              <div className="p-3 bg-green-100 dark:bg-green-900/50 border border-green-300 dark:border-green-500 rounded-md text-green-700 dark:text-green-200 text-sm">
                Thank you for your message! We've received it and will get back to you shortly.
              </div>
            )}
            <div>
              <label htmlFor="contact-name" className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1.5">
                Your Name
              </label>
              <input
                type="text"
                id="contact-name"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-2.5 text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-700/50 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400 focus:border-sky-500 dark:focus:border-sky-400 outline-none transition-colors duration-200"
                placeholder="e.g., Jane Doe"
                aria-required="true"
                disabled={isSubmitting}
              />
            </div>
            <div>
              <label htmlFor="contact-email" className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1.5">
                Your Email
              </label>
              <input
                type="email"
                id="contact-email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2.5 text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-700/50 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400 focus:border-sky-500 dark:focus:border-sky-400 outline-none transition-colors duration-200"
                placeholder="e.g., jane.doe@example.com"
                aria-required="true"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label htmlFor="contact-reason" className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1.5">
                Reason for Contact
              </label>
              <div className="relative">
                <select
                  id="contact-reason"
                  name="reason"
                  value={contactReason}
                  onChange={(e) => setContactReason(e.target.value)}
                  required
                  className={`w-full px-4 py-2.5 text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-700/50 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400 focus:border-sky-500 dark:focus:border-sky-400 outline-none transition-colors duration-200 appearance-none pr-10
                              ${contactReason === "" ? 'text-slate-400 dark:text-slate-500' : 'text-slate-700 dark:text-slate-200'}`}
                  aria-required="true"
                  disabled={isSubmitting}
                >
                  {contactReasons.map(reason => (
                    <option 
                      key={reason.value} 
                      value={reason.value} 
                      disabled={reason.disabled}
                      className={reason.value === "" ? "text-slate-400 dark:text-slate-500" : "text-slate-700 dark:text-slate-900"}
                    >
                      {reason.label}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500 dark:text-slate-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="contact-message" className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1.5">
                Your Message
              </label>
              <textarea
                id="contact-message"
                name="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                rows={5}
                className="w-full px-4 py-2.5 text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-700/50 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400 focus:border-sky-500 dark:focus:border-sky-400 outline-none transition-colors duration-200 resize-y"
                placeholder="Let us know how we can help..."
                aria-required="true"
                disabled={isSubmitting}
              ></textarea>
            </div>
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-8 py-3.5 text-base font-semibold text-white rounded-lg shadow-md hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-sky-300 dark:focus:ring-sky-800 transition-all duration-300 transform hover:scale-105
                           bg-gradient-to-r from-sky-500 via-cyan-500 to-teal-500 hover:from-sky-600 hover:via-cyan-600 hover:to-teal-600
                           dark:from-sky-400 dark:via-cyan-400 dark:to-teal-400 dark:hover:from-sky-500 dark:hover:via-cyan-500 dark:hover:to-teal-500
                           disabled:bg-slate-400 disabled:dark:bg-slate-600 disabled:shadow-none disabled:text-slate-100 disabled:dark:text-slate-300 disabled:transform-none disabled:cursor-wait
                           flex items-center justify-center"
                aria-label={isSubmitting ? "Processing your message" : "Send your message"}
              >
                {isSubmitting ? (
                  <>
                    <LoadingSpinner small />
                    <span className="ml-2">Sending...</span>
                  </>
                ) : (
                  <>
                    <EnvelopeIcon className="w-5 h-5 mr-2.5" />
                    Send Message
                  </>
                )}
              </button>
            </div>
          </form>
        </AnimatedSection>
      </main>

      <footer className="w-full max-w-5xl mt-16 pt-8 border-t border-slate-200 dark:border-slate-700 text-center text-sm">
        <p className="text-slate-500 dark:text-slate-400">&copy; {new Date().getFullYear()} Alira. All rights reserved.</p> 
        <div className="mt-3 space-x-4">
            <button 
                onClick={onNavigateToPrivacy}
                className="text-slate-500 dark:text-slate-400 hover:text-sky-600 dark:hover:text-sky-300 hover:underline transition-colors"
                aria-label="View Privacy Policy"
            >
                Privacy Policy
            </button>
        </div>
        <div className="mt-4 flex items-center justify-center space-x-2">
          <SproutLogoIcon className="h-7 w-7 text-[#547732] dark:text-[#6b9449]" />
          <a 
            href="https://www.sproutcircle.ca" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-slate-500 dark:text-slate-400 hover:text-sky-600 dark:hover:text-sky-300 hover:underline transition-colors"
            aria-label="Visit Sprout Circle website (opens in a new tab)"
          >
            Crafted by Sprout Circle
          </a>
        </div>
      </footer>
    </div>
  );
};

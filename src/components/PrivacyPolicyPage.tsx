import React from 'react';
import { AliraTextLogoIcon } from './AliraTextLogoIcon';
import { SproutLogoIcon } from './SproutLogoIcon';
import { AnimatedSection } from './AnimatedSection';
import { ArrowUturnLeftIcon } from './Icons';

interface PrivacyPolicyPageProps {
  onNavigateHome: () => void;
  onNavigateToContact: () => void;
}

const PolicySection: React.FC<{ title: string; children: React.ReactNode; animationDelay?: string }> = ({ title, children, animationDelay = 'delay-0' }) => (
  <AnimatedSection animationClasses={{ delayClass: animationDelay }}>
    <div className="mb-8">
      <h2 className="text-2xl font-semibold text-slate-800 dark:text-white mb-3">{title}</h2>
      <div className="space-y-3 text-slate-600 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
        {children}
      </div>
    </div>
  </AnimatedSection>
);

export const PrivacyPolicyPage: React.FC<PrivacyPolicyPageProps> = ({ onNavigateHome, onNavigateToContact }) => {
  const lastUpdatedDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

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

      <main className="w-full max-w-3xl bg-white/80 dark:bg-slate-800/70 backdrop-blur-sm p-6 sm:p-10 rounded-2xl shadow-xl">
        <AnimatedSection>
          <h1 className="text-3xl sm:text-4xl font-bold text-center text-slate-900 dark:text-white mb-3">
            Privacy Policy
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 text-center mb-10">
            Last Updated: {lastUpdatedDate}
          </p>
        </AnimatedSection>

        <PolicySection title="Introduction">
          <p>Welcome to Alira ("we," "us," or "our"). This Privacy Policy explains how we handle information in relation to your use of the Alira Contract Comparator application (the "Service").</p> 
        </PolicySection>

        <PolicySection title="Information We Process" animationDelay="delay-100">
          <p>We process information solely to provide the core functionality of the Service:</p> 
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li><strong>Document Content:</strong> When you upload documents, their text content is extracted and sent to the Google Gemini API for analysis. The content is used only to generate your comparison report.</li>
            <li><strong>Contact Information:</strong> If you use our contact form, your name, email, and message are sent to our backend service (Resend) to be delivered to our support email address.</li>
            <li><strong>IP Addresses:</strong> For security and abuse prevention, we use your IP address to enforce a daily rate limit on the number of comparisons you can perform.</li>
          </ul>
        </PolicySection>

        <PolicySection title="How We Use Your Information" animationDelay="delay-200">
          <p>The information processed by Alira is used for the following purposes:</p> 
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li>To provide and operate the Service, including file parsing and AI-powered document comparison.</li>
            <li>To respond to your inquiries submitted via the contact form.</li>
            <li>To protect the service from abuse through rate limiting.</li>
          </ul>
        </PolicySection>

        <PolicySection title="Data Storage and Handling" animationDelay="delay-300">
          <p>Your privacy is paramount:</p>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li><strong>Document Content:</strong> Alira does not store your uploaded documents or their content on our servers. The content is handled temporarily for the duration of the API call to Google Gemini and is not retained by us after your comparison is displayed.</li>
            <li><strong>Contact Submissions:</strong> Your contact form submissions are forwarded as emails and are not stored in a separate database by our application.</li>
            <li><strong>Rate Limit Data:</strong> Your IP address is stored temporarily in a secure, serverless key-value store (Vercel KV) solely for the purpose of tracking usage against our daily limit.</li>
          </ul>
        </PolicySection>
        
        <PolicySection title="Third-Party Services" animationDelay="delay-400">
          <p>Alira utilizes the following third-party services:</p> 
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li><strong>Vercel:</strong> Our application is hosted on Vercel.</li>
            <li><strong>Google Gemini API:</strong> For performing the AI-driven comparison of document content.</li>
            <li><strong>Resend:</strong> For securely processing and sending emails from our contact form.</li>
            <li><strong>Vercel KV:</strong> A secure Redis database for managing rate-limit data.</li>
          </ul>
           <p className="mt-2">We recommend reviewing the privacy policies of these services for information on how they handle data.</p>
        </PolicySection>

        <PolicySection title="Data Security" animationDelay="delay-500">
          <p>We implement industry-standard security measures. All communication with our backend services and third-party APIs is encrypted using HTTPS. Access to backend services and API keys is strictly controlled.</p>
        </PolicySection>

        <PolicySection title="Changes to This Policy" animationDelay="delay-600">
          <p>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.</p>
        </PolicySection>

        <PolicySection title="Contact Us" animationDelay="delay-700">
          <p>If you have any questions about this Privacy Policy, please <button onClick={onNavigateToContact} className="text-sky-600 dark:text-sky-400 hover:underline font-medium">contact us here</button>.</p>
        </PolicySection>

        <AnimatedSection animationClasses={{ delayClass: 'delay-[800ms]' }}>
            <div className="mt-12 text-center">
                <button
                    onClick={onNavigateHome}
                    className="flex items-center justify-center mx-auto px-6 py-2 text-sm font-medium rounded-md shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent
                               border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200
                               focus:ring-sky-500"
                    aria-label="Back to Alira Home" 
                >
                    <ArrowUturnLeftIcon className="w-4 h-4 mr-2" />
                    Back to Alira Home
                </button>
            </div>
        </AnimatedSection>
      </main>

      <footer className="w-full max-w-5xl mt-16 pt-8 border-t border-slate-200 dark:border-slate-700 text-center text-sm">
        <p className="text-slate-500 dark:text-slate-400">&copy; {new Date().getFullYear()} Alira. All rights reserved.</p> 
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

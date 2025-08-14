import React from 'react';
import { AliraTextLogoIcon } from './AliraTextLogoIcon';
import { SproutLogoIcon } from './SproutLogoIcon';
import { AnimatedSection } from './AnimatedSection';
import { LightBulbIcon, DocumentDuplicateIcon, ScaleIcon, FileTextIcon, CheckCircleIcon, ShieldCheckIcon, SparklesIcon, BuildingOfficeIcon, UserIcon, GraduationCapIcon } from './Icons';

interface LandingPageProps {
  onNavigateToApp: () => void;
  onNavigateToPrivacy: () => void;
  onNavigateToContact: () => void;
  onNavigateHome: () => void;
}

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({ icon, title, description }) => (
  <div className="flex flex-col items-center p-6 bg-white/80 dark:bg-slate-800/60 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 text-center h-full">
    <div className="p-3 mb-4 text-sky-500 dark:text-sky-400 rounded-full bg-sky-100 dark:bg-sky-900/50">
      {icon}
    </div>
    <h3 className="mb-2 text-xl font-semibold text-slate-800 dark:text-white">{title}</h3>
    <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">{description}</p>
  </div>
);

const BenefitItem: React.FC<{ icon: React.ReactNode; text: string }> = ({ icon, text }) => (
  <li className="flex items-start space-x-4 py-3">
    <div className="flex-shrink-0 p-3 rounded-full bg-green-100 dark:bg-green-900/50 shadow-sm">
        {React.isValidElement<React.SVGProps<SVGSVGElement>>(icon)
          ? React.cloneElement(icon, { className: "w-6 h-6 text-green-500 dark:text-green-400" })
          : icon}
    </div>
    <span className="text-slate-700 dark:text-slate-200 text-base md:text-lg leading-relaxed pt-1.5">{text}</span>
  </li>
);

interface PricingCardProps {
  name: string;
  price: string;
  period: string;
  features: string[];
  buttonText: string;
  ctaAction: () => void;
  isFeatured: boolean;
  icon: React.ReactNode;
}

const PricingCard: React.FC<PricingCardProps> = ({ name, price, period, features, buttonText, ctaAction, isFeatured, icon }) => (
  <div className={`relative flex flex-col p-8 rounded-2xl shadow-lg h-full transition-all duration-300 ${isFeatured ? 'bg-sky-50 dark:bg-sky-900/40 border-2 border-sky-500 scale-105' : 'bg-white/80 dark:bg-slate-800/60'}`}>
    <div className="flex-grow">
      <div className="flex items-center justify-center mb-4 space-x-3">
        <div className={`p-2 rounded-full ${isFeatured ? 'bg-sky-100 dark:bg-sky-800' : 'bg-slate-100 dark:bg-slate-700'}`}>
           {React.isValidElement<React.SVGProps<SVGSVGElement>>(icon)
              ? React.cloneElement(icon, { className: `w-8 h-8 ${isFeatured ? 'text-sky-500' : 'text-slate-500'}` })
              : icon}
        </div>
        <h3 className="text-2xl font-semibold text-slate-800 dark:text-white">{name}</h3>
      </div>
      <div className="flex flex-col items-center justify-center my-6">
        <span className={`text-5xl font-extrabold tracking-tight ${isFeatured ? 'text-sky-600 dark:text-sky-300' : 'text-slate-800 dark:text-white'}`}>{price}</span>
        {period && <span className="mt-1 text-base font-medium text-slate-500 dark:text-slate-400">{period}</span>}
      </div>
      <ul role="list" className="space-y-4 mb-8 text-left">
        {features.map((feature) => (
          <li key={feature} className="flex items-center space-x-3">
            <CheckCircleIcon className={`flex-shrink-0 w-5 h-5 ${isFeatured ? 'text-sky-500' : 'text-green-500'}`} />
            <span className="text-sm text-slate-600 dark:text-slate-300">{feature}</span>
          </li>
        ))}
      </ul>
    </div>
    <button
      onClick={ctaAction}
      className={`w-full py-3 px-6 text-base font-semibold rounded-lg shadow-md hover:shadow-lg focus:outline-none focus:ring-4 transition-all duration-300 transform hover:scale-105
      ${isFeatured
        ? 'text-white bg-gradient-to-r from-sky-500 via-cyan-500 to-teal-500 hover:from-sky-600 hover:via-cyan-600 hover:to-teal-600 focus:ring-sky-300 dark:focus:ring-sky-800'
        : 'text-sky-600 dark:text-sky-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 focus:ring-sky-200 dark:focus:ring-sky-700'
      }`}
    >
      {buttonText}
    </button>
  </div>
);


export const LandingPage: React.FC<LandingPageProps> = ({ onNavigateToApp, onNavigateToPrivacy, onNavigateToContact, onNavigateHome }) => {
  const featureCardAnimation = {
    transition: 'transition-all duration-700 ease-out',
    initial: 'opacity-0 translate-y-8',
    visible: 'opacity-100 translate-y-0'
  };
  const benefitItemAnimation = {
    transition: 'transition-all duration-500 ease-out',
    initial: 'opacity-0 translate-x-[-20px]',
    visible: 'opacity-100 translate-x-0'
  };

  const procurementBenefits = [
    { icon: <ScaleIcon />, text: "Rapid Bid Evaluation: Quickly compare multiple tender submissions." },
    { icon: <ShieldCheckIcon />, text: "Ensure Compliance & Consistency: Verify bids meet requirements and align with proposals." },
    { icon: <LightBulbIcon />, text: "Identify Key Differences & Risks: Spot critical deviations and unique clauses." },
    { icon: <SparklesIcon />, text: "Strengthen Negotiation Positions: Arm your team with AI-identified discussion points." },
  ];
  
  const pricingTiers = [
    {
      name: 'Student & Academic',
      price: 'Free',
      period: 'for personal use',
      features: [
        'Rate-limited daily comparisons',
        'Support for TXT, PDF, DOCX',
        'Export results to TXT/PDF',
        'Ideal for research & study',
      ],
      buttonText: 'Get Started Now',
      ctaAction: onNavigateToApp,
      isFeatured: false,
      icon: <GraduationCapIcon />,
    },
    {
      name: 'Professional',
      price: 'Inquire',
      period: '',
      features: [
        'Higher daily comparison limits',
        'Priority email support',
        'Access to new features first',
        'Perfect for solo practitioners',
      ],
      buttonText: 'Contact for Plan',
      ctaAction: onNavigateToContact,
      isFeatured: false,
      icon: <UserIcon />,
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: 'for teams & orgs',
      features: [
        'Unlimited comparisons',
        'Dedicated support & onboarding',
        'Custom integrations (API access)',
        'Enhanced security & compliance',
      ],
      buttonText: 'Contact for Plan',
      ctaAction: onNavigateToContact,
      isFeatured: false,
      icon: <BuildingOfficeIcon />,
    },
  ];


  return (
    <div className="w-full min-h-screen flex flex-col items-center text-slate-800 dark:text-gray-100 pt-20 pb-10 px-4 sm:px-8 overflow-x-hidden">
      <header className="w-full max-w-5xl mb-16 sm:mb-20 text-center">
        <button 
          onClick={onNavigateHome}
          className="inline-block focus:outline-none focus:ring-2 focus:ring-sky-400 rounded-lg transition-transform duration-200 hover:scale-105"
          aria-label="Alira Home"
        >
          <AliraTextLogoIcon className="h-16 sm:h-20 mb-4 mx-auto text-[#7AD7FF] dark:text-[#7AD7FF]" /> 
        </button>
        <AnimatedSection animationClasses={{ initial: 'opacity-0', visible: 'opacity-100', transition: 'transition-opacity duration-1000 ease-in' }}>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-slate-900 dark:text-white mb-6">
            Revolutionize Your Contract Review.
          </h1>
        </AnimatedSection>
        <AnimatedSection animationClasses={{ delayClass: 'delay-200' }}>
          <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-10">
            Alira leverages cutting-edge AI to instantly compare documents, pinpointing crucial similarities, differences, and unique clauses, so you can make informed decisions faster. 
          </p>
        </AnimatedSection>
        <AnimatedSection animationClasses={{ delayClass: 'delay-300' }}>
          <button
            onClick={onNavigateToApp}
            className="px-10 py-4 text-lg font-semibold text-white rounded-lg shadow-md hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-sky-300 dark:focus:ring-sky-800 transition-all duration-300 transform hover:scale-105
                       bg-gradient-to-r from-sky-500 via-cyan-500 to-teal-500 hover:from-sky-600 hover:via-cyan-600 hover:to-teal-600
                       dark:from-sky-400 dark:via-cyan-400 dark:to-teal-400 dark:hover:from-sky-500 dark:hover:via-cyan-500 dark:hover:to-teal-500"
            aria-label="Go to Comparator App"
          >
            Go to Comparator App
          </button>
        </AnimatedSection>
      </header>

      <section id="features" className="w-full max-w-5xl py-16 sm:py-20">
        <AnimatedSection>
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-slate-900 dark:text-white mb-12 sm:mb-16">
            Powerful Features at Your Fingertips
          </h2>
        </AnimatedSection>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8 sm:gap-10">
          {[
            { icon: <LightBulbIcon className="w-10 h-10" />, title: "AI-Powered Analysis", description: "Sophisticated AI meticulously scans your documents, providing insights that go beyond simple text matching." },
            { icon: <DocumentDuplicateIcon className="w-10 h-10" />, title: "Multi-Format Support", description: "Easily compare TXT, PDF, and DOCX files without needing to convert them manually." },
            { icon: <ScaleIcon className="w-10 h-10" />, title: "Clear, Actionable Insights", description: "Understand agreements, disputes, and unique clauses at a glance with our categorized comparison results." },
            { icon: <FileTextIcon className="w-10 h-10" />, title: "Exportable Reports", description: "Download your comparison results as TXT or PDF files for easy sharing and record-keeping." },
          ].map((feature, index) => (
            <AnimatedSection 
              key={feature.title} 
              animationClasses={{ ...featureCardAnimation, delayClass: `delay-${index * 150}` }}
              className="h-full"
            >
              <FeatureCard 
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
              />
            </AnimatedSection>
          ))}
        </div>
      </section>

      <section id="procurement-tenders" className="w-full max-w-5xl py-16 sm:py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <AnimatedSection animationClasses={{ initial: 'opacity-0 translate-x-[-20px]', visible: 'opacity-100 translate-x-0', delayClass: 'delay-100' }}>
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-6 text-center lg:text-left">
                Streamline Your Procurement & Tender Reviews
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-300 mb-8 leading-relaxed text-center lg:text-left">
                Alira is an invaluable asset for procurement professionals. Effortlessly evaluate bids, ensure compliance, and accelerate your tender processes with AI-driven insights. 
              </p>
              <ul className="space-y-4 md:space-y-5 w-fit mx-auto lg:mx-0">
                {procurementBenefits.map((item, index) => (
                  <AnimatedSection 
                    key={item.text} 
                    animationClasses={{ ...benefitItemAnimation, delayClass: `delay-${(index + 1) * 150}`}}
                  >
                    <BenefitItem icon={item.icon} text={item.text} />
                  </AnimatedSection>
                ))}
              </ul>
            </div>
          </AnimatedSection>
          <AnimatedSection className="hidden lg:flex items-center justify-center" animationClasses={{ initial: 'opacity-0 scale-90', visible: 'opacity-100 scale-100', delayClass:'delay-300'}}>
            <div className="p-8 bg-white/50 dark:bg-slate-800/40 rounded-xl shadow-xl">
              <BuildingOfficeIcon className="w-48 h-48 mx-auto text-sky-500/40 dark:text-sky-400/40" />
            </div>
          </AnimatedSection>
        </div>
      </section>
      
      <section id="pricing" className="w-full max-w-6xl py-16 sm:py-20 text-center">
        <AnimatedSection>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-6">
            Plans for Every Need
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-16">
            Choose the plan that's right for you. From casual academic use to enterprise-level solutions, we have you covered.
          </p>
        </AnimatedSection>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-stretch">
            {pricingTiers.map((tier, index) => (
                 <AnimatedSection 
                    key={tier.name}
                    className="h-full"
                    animationClasses={{ ...featureCardAnimation, delayClass: `delay-${index * 150}` }}
                 >
                    <PricingCard {...tier} />
                </AnimatedSection>
            ))}
        </div>
      </section>

      <section className="w-full max-w-5xl py-16 sm:py-20 text-center">
        <AnimatedSection>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-6">
            Ready to Experience the Difference?
          </h2>
        </AnimatedSection>
        <AnimatedSection animationClasses={{ delayClass: 'delay-200' }}>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-xl mx-auto mb-10">
            Take control of your contract comparisons with Alira. Upload your documents and let our AI do the heavy lifting. 
          </p>        
        </AnimatedSection>
        <AnimatedSection animationClasses={{ delayClass: 'delay-300' }}>
          <button
            onClick={onNavigateToApp}
            className="px-10 py-4 text-lg font-semibold text-white rounded-lg shadow-md hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-sky-300 dark:focus:ring-sky-800 transition-all duration-300 transform hover:scale-105
                       bg-gradient-to-r from-sky-500 via-cyan-500 to-teal-500 hover:from-sky-600 hover:via-cyan-600 hover:to-teal-600
                       dark:from-sky-400 dark:via-cyan-400 dark:to-teal-400 dark:hover:from-sky-500 dark:hover:via-cyan-500 dark:hover:to-teal-500"
            aria-label="Start Comparing Documents Now"
          >
            Start Comparing Now
          </button>
        </AnimatedSection>
      </section>

      <footer className="w-full max-w-5xl mt-12 pt-8 border-t border-slate-200 dark:border-slate-700 text-center text-sm">
        <p className="text-slate-500 dark:text-slate-400">&copy; {new Date().getFullYear()} Alira. All rights reserved.</p> 
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
            AI analysis provided for informational purposes. Not legal advice.
        </p>
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

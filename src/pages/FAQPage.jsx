import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ChevronUp, HelpCircle, Mail } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const faqs = [
    {
        question: 'What is Nexus SEO and how does it work?',
        answer: 'Nexus SEO is an AI-powered SEO platform that helps you analyze, optimize, and track your website\'s search engine performance. It combines advanced analytics with AI recommendations to give you actionable insights that improve your rankings and organic traffic.',
    },
    {
        question: 'What SEO services do you offer?',
        answer: 'We offer a comprehensive suite of services including technical SEO audits, keyword research and tracking, on-page optimization, backlink analysis, local SEO (GEO), content optimization, competitor analysis, and AI-powered suggestions powered by Google Gemini and Mistral.',
    },
    {
        question: 'How long does it take to see results?',
        answer: 'SEO is a long-term investment. Most clients start seeing measurable improvements in rankings and traffic within 3–6 months of implementing our recommendations. Technical fixes often show results faster, while content and authority building takes longer.',
    },
    {
        question: 'Do you offer a free trial?',
        answer: 'Yes! We offer a 14-day free trial on all plans — no credit card required. You get full access to all features during the trial period so you can evaluate the platform thoroughly before committing.',
    },
    {
        question: 'Can I cancel my subscription at any time?',
        answer: 'Absolutely. There are no long-term contracts. You can cancel your subscription at any time directly from your dashboard. If you cancel, you\'ll continue to have access until the end of your current billing period.',
    },
    {
        question: 'What makes Nexus SEO different from other SEO tools?',
        answer: 'We combine traditional SEO analytics with cutting-edge AI integrations (Gemini, Mistral, Firecrawl) and emerging optimization techniques like LLMO (Language Model Optimization) and GEO SEO. Our platform is designed to future-proof your strategy as search evolves.',
    },
    {
        question: 'Is my data secure?',
        answer: 'Security is our top priority. We use industry-standard encryption (AES-256 at rest, TLS in transit), never share your data with third parties, and comply with GDPR and CCPA regulations. Your data is yours — you can export or delete it at any time.',
    },
    {
        question: 'Do you provide support and onboarding?',
        answer: 'Yes. All plans include email support. Pro and Enterprise plans include live chat support and a dedicated onboarding session. Enterprise customers also get a dedicated account manager and priority phone support.',
    },
];

const FAQItem = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border border-slate-200 rounded-xl overflow-hidden">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between px-6 py-5 text-left bg-white hover:bg-slate-50 transition"
                aria-expanded={isOpen}
            >
                <span className="font-semibold text-slate-900 pr-4">{question}</span>
                {isOpen
                    ? <ChevronUp className="w-5 h-5 text-emerald-600 shrink-0" />
                    : <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
                }
            </button>
            {isOpen && (
                <div className="px-6 pb-5 bg-white">
                    <p className="text-slate-600 leading-relaxed">{answer}</p>
                </div>
            )}
        </div>
    );
};

const FAQPage = () => {
    return (
        <div>
            <Header />
            <div className="min-h-screen bg-slate-50 pt-24 pb-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto">
                    {/* Hero */}
                    <div className="text-center mb-14">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mb-4">
                            <HelpCircle className="w-8 h-8 text-emerald-600" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
                            Frequently Asked Questions
                        </h1>
                        <p className="text-xl text-slate-500">
                            Everything you need to know about Nexus SEO
                        </p>
                    </div>

                    {/* FAQ Accordion */}
                    <div className="space-y-3 mb-16">
                        {faqs.map((faq, index) => (
                            <FAQItem key={index} question={faq.question} answer={faq.answer} />
                        ))}
                    </div>

                    {/* Contact CTA */}
                    <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center shadow-sm">
                        <Mail className="w-10 h-10 text-emerald-600 mx-auto mb-3" />
                        <h2 className="text-2xl font-bold text-slate-900 mb-2">Still have questions?</h2>
                        <p className="text-slate-500 mb-6">
                            Can't find the answer you're looking for? Our team is happy to help.
                        </p>
                        <Link
                            to="/contact"
                            className="inline-block py-3 px-8 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition"
                        >
                            Contact Support
                        </Link>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default FAQPage;

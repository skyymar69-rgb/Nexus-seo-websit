import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Clock, User, Calendar, Tag } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const allPosts = [
    {
        id: 1,
        title: 'The Future of SEO in 2026',
        excerpt: 'Explore emerging trends and technologies that will shape SEO.',
        date: 'March 10, 2026',
        author: 'Sarah Johnson',
        category: 'SEO Trends',
        readTime: '5 min read',
        content: `Search engine optimization is evolving faster than ever in 2026. With the rise of AI-powered search, voice interfaces, and multimodal queries, the landscape looks very different from what it was just a few years ago.

**AI-Driven Search Results**

Google's Search Generative Experience (SGE) and similar AI answer engines are now handling a significant portion of search queries directly, without sending users to websites. This means SEO professionals must optimize not just for traditional rankings, but for inclusion in AI-generated answers.

**Core Web Vitals Still Matter**

Page experience signals continue to be a major ranking factor. Sites that load quickly, respond interactively, and provide visual stability are consistently rewarded in rankings.

**E-E-A-T at the Center**

Experience, Expertise, Authoritativeness, and Trustworthiness remain the gold standard for content quality. Google's algorithms are more sophisticated than ever at detecting genuine expertise.

**What This Means for Your Strategy**

Focus on building topical authority, creating high-quality content that answers user intent comprehensively, and ensuring your technical SEO is airtight. The fundamentals of good SEO have not changed — but the execution has become more nuanced.`,
    },
    {
        id: 2,
        title: 'Understanding GEO Analytics',
        excerpt: 'Deep dive into geographic SEO and local search optimization.',
        date: 'March 8, 2026',
        author: 'Michael Chen',
        category: 'GEO SEO',
        readTime: '7 min read',
        content: `Geographic SEO — or GEO SEO — is the practice of optimizing your digital presence for location-specific search queries. As mobile usage continues to dominate, local intent signals have become increasingly important.

**Why GEO Analytics Matters**

Understanding where your traffic comes from geographically allows you to tailor your content, offers, and user experience to specific regions. This is especially critical for businesses with physical locations or regional service areas.

**Google Business Profile Optimization**

Your Google Business Profile is the foundation of local SEO. Ensure it is complete, accurate, and regularly updated with fresh posts, photos, and responses to reviews.

**Local Schema Markup**

Implementing LocalBusiness schema markup helps search engines understand your business's location, hours, and contact information, which can lead to rich results in local search.

**Building Local Citations**

Consistent NAP (Name, Address, Phone) information across directories, review sites, and industry listings remains a key ranking factor for local search.`,
    },
    {
        id: 3,
        title: 'AI and Content Optimization',
        excerpt: 'How artificial intelligence is revolutionizing content creation.',
        date: 'March 5, 2026',
        author: 'Emma Rodriguez',
        category: 'AI & SEO',
        readTime: '6 min read',
        content: `Artificial intelligence has fundamentally changed how content is created, optimized, and distributed. Understanding how to work with AI tools effectively is now a core skill for SEO professionals.

**AI as a Content Assistant**

Modern AI tools can help with keyword research, content outlines, first drafts, and meta descriptions. However, human oversight remains essential to ensure accuracy, voice, and genuine value.

**Semantic SEO and Topic Clusters**

AI-powered tools can analyze your existing content and identify gaps in topic coverage. Building comprehensive topic clusters that cover a subject from multiple angles signals expertise to search engines.

**Automated Technical Audits**

AI tools can now automatically audit sites for technical SEO issues, prioritize fixes by potential impact, and even suggest implementation approaches — significantly reducing manual audit time.

**The Human Element**

Despite AI's capabilities, the most successful content strategies still rely on human insight, original research, and authentic perspectives that AI cannot replicate.`,
    },
    {
        id: 4,
        title: 'LLMO: Preparing for AI Models',
        excerpt: 'Everything about optimizing for language learning models.',
        date: 'March 1, 2026',
        author: 'David Thompson',
        category: 'LLMO',
        readTime: '8 min read',
        content: `Language Learning Model Optimization (LLMO) is the emerging practice of optimizing your content to be understood and cited by large language models like GPT, Gemini, and Claude.

**Why LLMO Matters Now**

As AI assistants become the primary interface for information retrieval for many users, being cited by these models can drive significant referral traffic and brand visibility.

**Structured, Factual Content**

LLMs favor content that is clearly structured, factually accurate, and cites authoritative sources. Use clear headings, bullet points, and avoid ambiguous language.

**Entity Optimization**

Ensure your brand, products, and key personnel are well-represented as entities in public knowledge graphs (like Wikipedia and Wikidata), which LLMs use extensively for fact verification.

**Q&A Formats**

Content structured as questions and answers maps well to how LLMs process and retrieve information. Consider adding comprehensive FAQ sections to key pages.

**Monitoring AI Citations**

New tools are emerging to track how often and in what context your brand is mentioned in AI-generated responses. Set up monitoring to understand your LLMO performance.`,
    },
];

const BlogDetailPage = () => {
    const { id } = useParams();
    const post = allPosts.find(p => String(p.id) === String(id));
    const related = allPosts.filter(p => String(p.id) !== String(id)).slice(0, 3);

    if (!post) {
        return (
            <div>
                <Header />
                <div className="min-h-screen flex flex-col items-center justify-center pt-24 px-4">
                    <h1 className="text-3xl font-bold text-slate-900 mb-4">Article not found</h1>
                    <Link to="/blog" className="text-emerald-600 font-semibold hover:text-emerald-700 flex items-center gap-2">
                        <ArrowLeft className="w-4 h-4" /> Back to Blog
                    </Link>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div>
            <Header />
            <div className="min-h-screen bg-slate-50 pt-24 pb-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto">
                    {/* Breadcrumb */}
                    <nav className="mb-8">
                        <Link to="/blog" className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-medium text-sm">
                            <ArrowLeft className="w-4 h-4" /> Back to Blog
                        </Link>
                    </nav>

                    {/* Article */}
                    <article className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="p-8 md:p-12">
                            <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-700 text-sm font-semibold rounded-full mb-4">
                                {post.category}
                            </span>
                            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 leading-tight">
                                {post.title}
                            </h1>

                            {/* Meta */}
                            <div className="flex flex-wrap gap-4 text-sm text-slate-500 mb-8 pb-8 border-b border-slate-100">
                                <span className="flex items-center gap-1.5"><User className="w-4 h-4" />{post.author}</span>
                                <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" />{post.date}</span>
                                <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" />{post.readTime}</span>
                                <span className="flex items-center gap-1.5"><Tag className="w-4 h-4" />{post.category}</span>
                            </div>

                            {/* Content */}
                            <div className="prose prose-slate max-w-none">
                                {post.content.split('\n\n').map((paragraph, i) => {
                                    if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                                        return (
                                            <h2 key={i} className="text-xl font-bold text-slate-900 mt-8 mb-3">
                                                {paragraph.replace(/\*\*/g, '')}
                                            </h2>
                                        );
                                    }
                                    return (
                                        <p key={i} className="text-slate-600 leading-relaxed mb-4">{paragraph}</p>
                                    );
                                })}
                            </div>
                        </div>
                    </article>

                    {/* Related Articles */}
                    {related.length > 0 && (
                        <div className="mt-12">
                            <h2 className="text-2xl font-bold text-slate-900 mb-6">Related Articles</h2>
                            <div className="grid sm:grid-cols-3 gap-6">
                                {related.map(item => (
                                    <Link key={item.id} to={`/blog/${item.id}`} className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition group">
                                        <span className="inline-block px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-full mb-2">
                                            {item.category}
                                        </span>
                                        <h3 className="font-semibold text-slate-900 group-hover:text-emerald-600 transition mb-2 text-sm leading-snug">
                                            {item.title}
                                        </h3>
                                        <p className="text-xs text-slate-500">{item.date}</p>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default BlogDetailPage;

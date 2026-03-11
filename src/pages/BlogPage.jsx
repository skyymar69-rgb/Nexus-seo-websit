import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const BlogPage = () => {
    const [posts] = React.useState([
        { id: 1, title: 'The Future of SEO in 2026', excerpt: 'Explore emerging trends and technologies that will shape SEO.', date: 'March 10, 2026', author: 'Sarah Johnson', category: 'SEO Trends' },
        { id: 2, title: 'Understanding GEO Analytics', excerpt: 'Deep dive into geographic SEO and local search optimization.', date: 'March 8, 2026', author: 'Michael Chen', category: 'GEO SEO' },
        { id: 3, title: 'AI and Content Optimization', excerpt: 'How artificial intelligence is revolutionizing content creation.', date: 'March 5, 2026', author: 'Emma Rodriguez', category: 'AI & SEO' },
        { id: 4, title: 'LLMO: Preparing for AI Models', excerpt: 'Everything about optimizing for language learning models.', date: 'March 1, 2026', author: 'David Thompson', category: 'LLMO' }
    ]);

    return (
        <div>
            <Header />
            <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-5xl font-bold text-slate-900 mb-4 text-center">Blog</h1>
                    <p className="text-xl text-slate-600 text-center mb-16">Latest insights from our SEO experts</p>
                    <div className="grid md:grid-cols-3 gap-8">
                        {posts.map(post => (
                            <div key={post.id} className="bg-white rounded-lg shadow border border-slate-200 p-6">
                                <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-700 text-sm font-semibold rounded-full mb-3">{post.category}</span>
                                <h3 className="text-xl font-bold text-slate-900 mb-3">{post.title}</h3>
                                <p className="text-slate-600 mb-4">{post.excerpt}</p>
                                <p className="text-sm text-slate-500 mb-4">{post.author} • {post.date}</p>
                                <a href="#" className="text-emerald-600 font-semibold hover:text-emerald-700">Read More →</a>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default BlogPage;
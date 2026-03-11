import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
const AboutPage = () => {
    return (
        <div>
            <Header />
            <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-5xl font-bold text-slate-900 mb-8">About Nexus SEO</h1>
                    <div className="space-y-6 text-slate-600">
                        <h2 className="text-3xl font-bold text-slate-900">Our Mission</h2>
                        <p>At Nexus SEO, we believe that every business deserves to be found online. Our mission is to empower companies with cutting-edge SEO solutions that leverage artificial intelligence to achieve unprecedented digital visibility.</p>
                        <h2 className="text-3xl font-bold text-slate-900 mt-8">Our Story</h2>
                        <p>Founded in 2024, Nexus SEO emerged from a vision to revolutionize how businesses approach search engine optimization. With a team of seasoned SEO experts and AI engineers, we have developed innovative solutions.</p>
                        <h2 className="text-3xl font-bold text-slate-900 mt-8">Our Values</h2>
                        <ul className="list-disc list-inside space-y-2">
                            <li><strong>Innovation</strong></li>
                            <li><strong>Transparency</strong></li>
                            <li><strong>Results</strong></li>
                            <li><strong>Ethics</strong></li>
                        </ul>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};
export default AboutPage;
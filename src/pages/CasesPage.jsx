import React from 'react';
import Header from '../components/Header';
import CaseStudies from '../components/CaseStudies';
import Footer from '../components/Footer';

const CasesPage = () => {
    return (
        <div>
            <Header />
            <div className="pt-24 pb-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-12">
                    <h1 className="text-5xl font-bold text-slate-900 mb-4">Success Stories</h1>
                    <p className="text-xl text-slate-600">See how we helped clients achieve their goals</p>
                </div>
                <CaseStudies />
            </div>
            <Footer />
        </div>
    );
};

export default CasesPage;
import React from 'react';
import Header from '../components/Header';
import Pricing from '../components/Pricing';
import Footer from '../components/Footer';

const PricingPage = () => {
    return (
        <div>
            <Header />
            <div className="pt-24 pb-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-12">
                    <h1 className="text-5xl font-bold text-slate-900 mb-4">Our Pricing Plans</h1>
                    <p className="text-xl text-slate-600">Choose the perfect plan for your business</p>
                </div>
                <Pricing />
            </div>
            <Footer />
        </div>
    );
};

export default PricingPage;
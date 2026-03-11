import React from 'react';
import Header from '../components/Header';
import Services from '../components/Services';
import Footer from '../components/Footer';
const ServicesPage = () => {
    return (
        <div>
            <Header />
            <div className="pt-32 pb-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-12">
                    <h1 className="text-5xl font-bold text-slate-900 mb-4">Our Services</h1>
                    <p className="text-xl text-slate-600">Complete SEO solutions for your business</p>
                </div>
                <Services />
            </div>
            <Footer />
        </div>
    );
};
export default ServicesPage;
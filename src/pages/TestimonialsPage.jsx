import React from 'react';
import Header from '../components/Header';
import Testimonials from '../components/Testimonials';
import Footer from '../components/Footer';
const TestimonialsPage = () => {
    return (<div>
        <Header />
        <div className="pt-24 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-12">
                <h1 className="text-5xl font-bold text-slate-900 mb-4">Client Testimonials</h1>
                <p className="text-xl text-slate-600">What our satisfied customers say about us</p>
            </div>
            <Testimonials />
        </div>
        <Footer />
    </div>);
};
export default TestimonialsPage;
import React from 'react';
import { ArrowRight } from 'lucide-react';

const Hero = () => {
    return (
        <section id="home" className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto text-center">
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-slate-900 mb-6">L'autorité IA du SEO en 2026</h1>
                <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto">Optimisez votre présence en ligne avec nos solutions IA révolutionnaires. GEO, AEO, LLMO : tout pour dominer les moteurs de recherche.</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                    <button className="px-8 py-4 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition flex items-center justify-center gap-2">
                        Commencer maintenant <ArrowRight size={20} />
                    </button>
                    <button className="px-8 py-4 border-2 border-emerald-600 text-emerald-600 rounded-lg hover:bg-emerald-50 transition">Voir la démo</button>
                </div>
                <div className="relative">
                    <div className="glass rounded-2xl p-8 sm:p-12">
                        <img src="https://images.unsplash.com/photo-1633356122544-f134324ef6cb?w=1200&h=600&fit=crop" alt="Dashboard" className="rounded-lg w-full h-auto" />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
import React from 'react';
import { Menu, X } from 'lucide-react';

const Header = () => {
    const [isOpen, setIsOpen] = React.useState(false);

    return (
        <header className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-slate-200">
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div className="flex justify-between items-center">
                    <div className="text-2xl font-bold text-emerald-600">Nexus SEO</div>
                    <div className="hidden md:flex gap-8">
                        <a href="#home" className="text-slate-700 hover:text-emerald-600 transition">Accueil</a>
                        <a href="#services" className="text-slate-700 hover:text-emerald-600 transition">Services</a>
                        <a href="#pricing" className="text-slate-700 hover:text-emerald-600 transition">Tarifs</a>
                        <a href="#cases" className="text-slate-700 hover:text-emerald-600 transition">Cas d'études</a>
                        <a href="#testimonials" className="text-slate-700 hover:text-emerald-600 transition">Avis</a>
                    </div>
                    <div className="hidden md:flex gap-4">
                        <button className="px-6 py-2 text-emerald-600 border border-emerald-600 rounded-lg hover:bg-emerald-50 transition">Connexion</button>
                        <button className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition">Démarrer</button>
                    </div>
                    <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
                        {isOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
                {isOpen && (
                    <div className="md:hidden mt-4 pb-4 space-y-2">
                        <a href="#home" className="block text-slate-700 hover:text-emerald-600">Accueil</a>
                        <a href="#services" className="block text-slate-700 hover:text-emerald-600">Services</a>
                        <a href="#pricing" className="block text-slate-700 hover:text-emerald-600">Tarifs</a>
                        <a href="#cases" className="block text-slate-700 hover:text-emerald-600">Cas d'études</a>
                        <a href="#testimonials" className="block text-slate-700 hover:text-emerald-600">Avis</a>
                    </div>
                )}
            </nav>
        </header>
    );
};

export default Header;
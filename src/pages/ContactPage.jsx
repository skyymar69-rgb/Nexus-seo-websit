import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Mail, Phone, MapPin } from 'lucide-react';

const ContactPage = () => {
    const [formData, setFormData] = React.useState({ name: '', email: '', subject: '', message: '' });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Message:', formData);
        alert('Message sent successfully!');
        setFormData({ name: '', email: '', subject: '', message: '' });
    };

    return (
        <div>
            <Header />
            <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-5xl font-bold text-slate-900 mb-4 text-center">Contact Us</h1>
                    <p className="text-xl text-slate-600 text-center mb-12">Get in touch with our team</p>
                    <div className="grid md:grid-cols-2 gap-12">
                        <div className="space-y-8">
                            <div className="flex items-start gap-4">
                                <Mail className="text-emerald-600 mt-1" size={24} />
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900">Email</h3>
                                    <p className="text-slate-600">contact@nexusseo.com</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <Phone className="text-emerald-600 mt-1" size={24} />
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900">Phone</h3>
                                    <p className="text-slate-600">+33 (0) 1 23 45 67 89</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <MapPin className="text-emerald-600 mt-1" size={24} />
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900">Address</h3>
                                    <p className="text-slate-600">123 Tech Street, Paris, France</p>
                                </div>
                            </div>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Your Name" className="w-full px-4 py-2 border border-slate-300 rounded-lg" required />
                            <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Your Email" className="w-full px-4 py-2 border border-slate-300 rounded-lg" required />
                            <input type="text" name="subject" value={formData.subject} onChange={handleChange} placeholder="Subject" className="w-full px-4 py-2 border border-slate-300 rounded-lg" required />
                            <textarea name="message" value={formData.message} onChange={handleChange} placeholder="Your Message" rows="5" className="w-full px-4 py-2 border border-slate-300 rounded-lg" required></textarea>
                            <button type="submit" className="w-full py-3 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700">Send Message</button>
                        </form>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default ContactPage;
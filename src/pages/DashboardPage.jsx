import React from 'react';
import { Link } from 'react-router-dom';
import { BarChart2, Globe, TrendingUp, Cpu, ArrowRight, User, Lock } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const stats = [
    { label: 'Sites Analyzed', value: '12', icon: Globe, color: 'bg-emerald-100 text-emerald-600' },
    { label: 'Keywords Tracked', value: '248', icon: BarChart2, color: 'bg-blue-100 text-blue-600' },
    { label: 'Organic Traffic', value: '+34%', icon: TrendingUp, color: 'bg-violet-100 text-violet-600' },
    { label: 'AI Suggestions', value: '57', icon: Cpu, color: 'bg-amber-100 text-amber-600' },
];

const recentAnalyses = [
    { site: 'example.com', score: 87, status: 'Excellent', date: 'Mar 10, 2026' },
    { site: 'mystore.io', score: 72, status: 'Good', date: 'Mar 8, 2026' },
    { site: 'blog.tech', score: 55, status: 'Needs work', date: 'Mar 5, 2026' },
    { site: 'portfolio.dev', score: 91, status: 'Excellent', date: 'Mar 1, 2026' },
];

const statusColor = (status) => {
    if (status === 'Excellent') return 'bg-emerald-100 text-emerald-700';
    if (status === 'Good') return 'bg-blue-100 text-blue-700';
    return 'bg-amber-100 text-amber-700';
};

const DashboardPage = () => {
    return (
        <div>
            <Header />
            <div className="min-h-screen bg-slate-50 pt-24 pb-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-10">
                        <h1 className="text-4xl font-bold text-slate-900">Dashboard</h1>
                        <p className="text-slate-500 mt-1">Welcome back! Here's an overview of your SEO performance.</p>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                        {stats.map(({ label, value, icon: Icon, color }) => (
                            <div key={label} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex items-center gap-4">
                                <div className={`p-3 rounded-full ${color}`}>
                                    <Icon className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-slate-900">{value}</p>
                                    <p className="text-sm text-slate-500">{label}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Recent Analyses */}
                        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                            <h2 className="text-lg font-bold text-slate-900 mb-5">Recent Analyses</h2>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-slate-100">
                                            <th className="text-left py-2 text-slate-500 font-medium">Website</th>
                                            <th className="text-left py-2 text-slate-500 font-medium">Score</th>
                                            <th className="text-left py-2 text-slate-500 font-medium">Status</th>
                                            <th className="text-left py-2 text-slate-500 font-medium">Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {recentAnalyses.map((item) => (
                                            <tr key={item.site} className="border-b border-slate-50 hover:bg-slate-50 transition">
                                                <td className="py-3 font-medium text-slate-800">{item.site}</td>
                                                <td className="py-3">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-20 h-2 bg-slate-200 rounded-full overflow-hidden">
                                                            <div
                                                                className="h-full bg-emerald-500 rounded-full"
                                                                style={{ width: `${item.score}%` }}
                                                            />
                                                        </div>
                                                        <span className="text-slate-700">{item.score}</span>
                                                    </div>
                                                </td>
                                                <td className="py-3">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColor(item.status)}`}>
                                                        {item.status}
                                                    </span>
                                                </td>
                                                <td className="py-3 text-slate-500">{item.date}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Account Info */}
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                            <h2 className="text-lg font-bold text-slate-900 mb-5">Account</h2>
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-14 h-14 rounded-full bg-emerald-600 flex items-center justify-center">
                                    <span className="text-white text-xl font-bold">J</span>
                                </div>
                                <div>
                                    <p className="font-semibold text-slate-900">John Doe</p>
                                    <p className="text-sm text-slate-500">john@example.com</p>
                                    <span className="inline-block mt-1 px-2 py-0.5 text-xs font-semibold bg-emerald-100 text-emerald-700 rounded-full">Pro Plan</span>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <button className="w-full flex items-center justify-between py-2 px-3 rounded-lg hover:bg-slate-50 transition text-slate-700">
                                    <span className="flex items-center gap-2"><User className="w-4 h-4 text-slate-400" /> Edit Profile</span>
                                    <ArrowRight className="w-4 h-4 text-slate-400" />
                                </button>
                                <button className="w-full flex items-center justify-between py-2 px-3 rounded-lg hover:bg-slate-50 transition text-slate-700">
                                    <span className="flex items-center gap-2"><Lock className="w-4 h-4 text-slate-400" /> Change Password</span>
                                    <ArrowRight className="w-4 h-4 text-slate-400" />
                                </button>
                            </div>
                            <div className="mt-6 pt-6 border-t border-slate-100">
                                <Link to="/pricing" className="block text-center py-2 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg text-sm transition">
                                    Upgrade Plan
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default DashboardPage;

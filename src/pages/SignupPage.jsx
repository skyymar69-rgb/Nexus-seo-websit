import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, Phone, UserPlus } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const SignupPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
    });
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const validate = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = 'Full name is required';
        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email';
        }
        if (formData.phone && !/^\+?[\d\s\-()]{7,}$/.test(formData.phone)) {
            newErrors.phone = 'Please enter a valid phone number';
        }
        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
        }
        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }
        return newErrors;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
        }, 1500);
    };

    const fields = [
        { id: 'name', label: 'Full name', type: 'text', icon: User, placeholder: 'John Doe', autoComplete: 'name' },
        { id: 'email', label: 'Email address', type: 'email', icon: Mail, placeholder: 'you@example.com', autoComplete: 'email' },
        { id: 'phone', label: 'Phone number (optional)', type: 'tel', icon: Phone, placeholder: '+1 555 000 0000', autoComplete: 'tel' },
    ];

    return (
        <div>
            <Header />
            <div className="min-h-screen bg-slate-50 flex items-center justify-center pt-24 pb-16 px-4">
                <div className="w-full max-w-md">
                    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mb-4">
                                <UserPlus className="w-8 h-8 text-emerald-600" />
                            </div>
                            <h1 className="text-3xl font-bold text-slate-900">Create account</h1>
                            <p className="text-slate-500 mt-2">Join Nexus SEO and start growing</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {fields.map(({ id, label, type, icon: Icon, placeholder, autoComplete }) => (
                                <div key={id}>
                                    <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-1">
                                        {label}
                                    </label>
                                    <div className="relative">
                                        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                        <input
                                            id={id}
                                            name={id}
                                            type={type}
                                            autoComplete={autoComplete}
                                            value={formData[id]}
                                            onChange={handleChange}
                                            placeholder={placeholder}
                                            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition ${errors[id] ? 'border-red-400 bg-red-50' : 'border-slate-300'}`}
                                        />
                                    </div>
                                    {errors[id] && <p className="mt-1 text-sm text-red-600">{errors[id]}</p>}
                                </div>
                            ))}

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">
                                    Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? 'text' : 'password'}
                                        autoComplete="new-password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="Min. 8 characters"
                                        className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition ${errors.password ? 'border-red-400 bg-red-50' : 'border-slate-300'}`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                                {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
                            </div>

                            <div>
                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 mb-1">
                                    Confirm password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type={showConfirm ? 'text' : 'password'}
                                        autoComplete="new-password"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        placeholder="Re-enter your password"
                                        className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition ${errors.confirmPassword ? 'border-red-400 bg-red-50' : 'border-slate-300'}`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirm(!showConfirm)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                    >
                                        {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                                {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-semibold rounded-lg transition focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                            >
                                {isLoading ? 'Creating account...' : 'Create account'}
                            </button>
                        </form>

                        <p className="mt-6 text-center text-sm text-slate-500">
                            Already have an account?{' '}
                            <Link to="/login" className="text-emerald-600 font-semibold hover:text-emerald-700">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default SignupPage;

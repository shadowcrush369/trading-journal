import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { CheckCircle } from 'lucide-react';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showLogoutToast, setShowLogoutToast] = useState(false);
    const { login } = useAuth();

    useEffect(() => {
        const logoutMessage = sessionStorage.getItem('logoutMessage');
        if (logoutMessage) {
            setShowLogoutToast(true);
            sessionStorage.removeItem('logoutMessage');
            const timer = setTimeout(() => {
                setShowLogoutToast(false);
            }, 3000); // Hide toast after 3 seconds
            return () => clearTimeout(timer);
        }
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        login(email, password);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            {/* Logout Toast */}
            {showLogoutToast && (
                <div className="fixed top-5 right-5 bg-success text-white px-4 py-2 rounded-lg shadow-lg flex items-center animate-fade-in-down">
                    <CheckCircle size={20} className="mr-2" />
                    You have been logged out successfully.
                </div>
            )}

            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-text-main">
                        Trade<span className="text-primary">Journal</span>
                    </h1>
                    <p className="text-text-muted mt-2">Log in to access your dashboard.</p>
                </div>
                <div className="bg-card p-8 rounded-2xl shadow-2xl">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-text-muted mb-1">
                                Email Address
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-card-alt border-none rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary text-text-main"
                                placeholder="you@example.com"
                            />
                        </div>

                        <div>
                            <label htmlFor="password"className="block text-sm font-medium text-text-muted mb-1">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-card-alt border-none rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary text-text-main"
                                placeholder="••••••••"
                            />
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-light transition-colors"
                            >
                                Sign in
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
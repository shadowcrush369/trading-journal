import React, { useState } from 'react';
import { Trade } from '../types';
import ThemeToggle from './ThemeToggle';
import { SaveIcon, UploadIcon, DownloadIcon, LogOutIcon } from './icons';
import { useAuth } from '../contexts/AuthContext';

const SettingsCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="bg-card p-6 rounded-2xl shadow-lg">
        <h3 className="text-xl font-semibold mb-4 border-b border-card-alt pb-2">{title}</h3>
        <div className="space-y-4">{children}</div>
    </div>
);

const Settings: React.FC<{trades: Trade[]}> = ({ trades }) => {
    const [profile, setProfile] = useState({ username: 'Ajay', email: 'ajay@example.com' });
    const { logout } = useAuth();

    const handleExport = () => {
        if (trades.length === 0) {
            alert("No trade data to export.");
            return;
        }
        const headers = Object.keys(trades[0]).join(',');
        const rows = trades.map(trade => 
            Object.values(trade).map(value => {
                if (Array.isArray(value)) return `"${value.join(';')}"`;
                if (typeof value === 'string' && value.includes(',')) return `"${value}"`;
                return value;
            }).join(',')
        );
        const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join('\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', 'trade_journal_export.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            alert(`File "${file.name}" selected. Import functionality not fully implemented in this demo.`);
        }
    };

    const handleLogout = () => {
        if (window.confirm('Are you sure you want to log out?')) {
            sessionStorage.setItem('logoutMessage', 'true');
            logout();
        }
    };
    
    return (
        <div className="space-y-8">
            <SettingsCard title="Profile Management">
                <div>
                    <label className="block text-sm font-medium text-text-muted mb-1">Username</label>
                    <input type="text" value={profile.username} onChange={e => setProfile({...profile, username: e.target.value})} className="w-full bg-card-alt border-none rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary text-text-main"/>
                </div>
                 <div>
                    <label className="block text-sm font-medium text-text-muted mb-1">Email</label>
                    <input type="email" value={profile.email} onChange={e => setProfile({...profile, email: e.target.value})} className="w-full bg-card-alt border-none rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary text-text-main"/>
                </div>
                 <div>
                    <label className="block text-sm font-medium text-text-muted mb-1">New Password</label>
                    <input type="password" placeholder="••••••••" className="w-full bg-card-alt border-none rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary text-text-main"/>
                </div>
                 <button className="bg-primary hover:bg-primary/90 text-white font-bold px-4 py-2 rounded-lg flex items-center transition-colors">
                    <SaveIcon />
                    <span className="ml-2">Save Profile</span>
                 </button>
            </SettingsCard>
            
            <SettingsCard title="Appearance">
                <div className="flex justify-between items-center">
                    <p className="text-text-main">Theme</p>
                    <ThemeToggle />
                </div>
            </SettingsCard>

            <SettingsCard title="Data Management">
                <div className="flex flex-col md:flex-row gap-4">
                    <label htmlFor="import-csv" className="w-full cursor-pointer bg-secondary hover:bg-secondary/90 text-white font-bold px-4 py-2 rounded-lg flex items-center justify-center transition-colors">
                        <UploadIcon />
                        <span className="ml-2">Import from CSV</span>
                    </label>
                    <input type="file" id="import-csv" accept=".csv" onChange={handleImport} className="hidden" />
                    
                    <button onClick={handleExport} className="w-full bg-accent hover:bg-accent/90 text-white font-bold px-4 py-2 rounded-lg flex items-center justify-center transition-colors">
                        <DownloadIcon />
                        <span className="ml-2">Export to CSV</span>
                    </button>
                </div>
            </SettingsCard>

            <SettingsCard title="Account Actions">
                <button 
                    onClick={handleLogout} 
                    className="w-full md:w-auto bg-danger hover:bg-danger/90 text-white font-bold px-4 py-2 rounded-lg flex items-center justify-center transition-colors"
                >
                    <LogOutIcon />
                    <span className="ml-2">Logout</span>
                </button>
            </SettingsCard>
        </div>
    );
};

export default Settings;
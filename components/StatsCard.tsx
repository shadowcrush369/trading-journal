import React from 'react';
import { TradesIcon } from './icons';

interface StatsCardProps {
    title: string;
    value: string;
    icon?: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'default';
    change?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon, variant = 'default', change }) => {
    const cardClasses = {
        primary: 'from-primary to-accent text-white',
        secondary: 'from-secondary to-blue-500 text-white',
        default: 'bg-card'
    };

    const isGradient = variant === 'primary' || variant === 'secondary';

    return (
        <div className={`p-6 rounded-2xl shadow-lg ${isGradient ? `bg-gradient-to-br ${cardClasses[variant]}` : cardClasses.default}`}>
            <div className="flex justify-between items-start">
                <div>
                    <p className={`text-sm mb-1 ${isGradient ? 'text-white/80' : 'text-text-muted'}`}>{title}</p>
                    <p className="text-3xl font-bold">{value}</p>
                </div>
                {icon && (
                    <div className={`p-3 rounded-full ${isGradient ? 'bg-white/20' : 'bg-primary/10 text-primary-light'}`}>
                        {icon}
                    </div>
                )}
            </div>
            {change && (
                <p className={`text-sm mt-2 ${isGradient ? 'text-white/90' : 'text-text-main'}`}>
                    {change}
                </p>
            )}
        </div>
    );
};

export default StatsCard;

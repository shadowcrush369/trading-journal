import React from 'react';

interface StatsCardProps {
    title: string;
    value: string;
    icon?: React.ReactNode;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon }) => {
    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow flex items-center justify-between">
            <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
                <p className="text-2xl font-bold">{value}</p>
            </div>
            {icon && (
                <div className="bg-blue-100 dark:bg-gray-700 p-3 rounded-full">
                    {icon}
                </div>
            )}
        </div>
    );
};

export default StatsCard;

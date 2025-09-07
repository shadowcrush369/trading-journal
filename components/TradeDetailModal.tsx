import React, { useState, useEffect } from 'react';
import { CalendarDay, ScreenshotTrade } from '../types';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { CameraIcon } from './icons';

interface TradeDetailModalProps {
    day: CalendarDay | null;
    onClose: () => void;
}

const Lightbox: React.FC<{ images: string[], selectedIndex: number, onClose: () => void }> = ({ images, selectedIndex, onClose }) => {
    const [currentIndex, setCurrentIndex] = useState(selectedIndex);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
            if (e.key === 'ArrowRight') setCurrentIndex(prev => (prev + 1) % images.length);
            if (e.key === 'ArrowLeft') setCurrentIndex(prev => (prev - 1 + images.length) % images.length);
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [images.length, onClose]);

    const nextImage = () => setCurrentIndex(prev => (prev + 1) % images.length);
    const prevImage = () => setCurrentIndex(prev => (prev - 1 + images.length) % images.length);

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <button className="absolute top-4 right-4 text-white hover:text-gray-300" onClick={onClose}><X size={32} /></button>
            <div className="relative w-full max-w-4xl h-full max-h-[90vh]" onClick={e => e.stopPropagation()}>
                <img src={images[currentIndex]} alt={`Screenshot ${currentIndex + 1}`} className="w-full h-full object-contain" />
                {images.length > 1 && (
                    <>
                        <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/80"><ChevronLeft size={24} /></button>
                        <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/80"><ChevronRight size={24} /></button>
                    </>
                )}
            </div>
        </div>
    );
};


const TradeDetailModal: React.FC<TradeDetailModalProps> = ({ day, onClose }) => {
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);

    if (!day) return null;

    const allScreenshots = day.trades.flatMap(t => t.screenshots);

    const openLightbox = (trade: ScreenshotTrade, screenshotIndex: number) => {
        const overallIndex = day.trades.reduce((acc, currentTrade, index) => {
            if (index < day.trades.indexOf(trade)) {
                return acc + currentTrade.screenshots.length;
            }
            return acc;
        }, 0) + screenshotIndex;

        setSelectedImageIndex(overallIndex);
        setLightboxOpen(true);
    };

    return (
        <>
            <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose}></div>
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[95vw] max-w-2xl bg-card rounded-lg shadow-xl z-50">
                <div className="p-4 md:p-6 border-b border-card-alt flex justify-between items-center">
                    <h2 className="text-xl md:text-2xl font-bold">Trades for {new Date(day.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', timeZone: 'UTC' })}</h2>
                    <button onClick={onClose} className="text-text-muted hover:text-text-main"><X /></button>
                </div>
                <div className="p-4 md:p-6 max-h-[70vh] overflow-y-auto space-y-6">
                    {day.trades.map(trade => (
                        <div key={trade.id} className="bg-card-alt/50 p-4 rounded-lg">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-bold text-lg">{trade.instrument} <span className={`text-sm font-semibold ${trade.direction === 'Long' ? 'text-success' : 'text-danger'}`}>{trade.direction}</span></h3>
                                    <p className="text-xs text-text-muted">{trade.entryTime} &rarr; {trade.exitTime}</p>
                                </div>
                                <p className={`text-lg font-bold ${trade.pnl >= 0 ? 'text-success' : 'text-danger'}`}>
                                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(trade.pnl)}
                                </p>
                            </div>
                            {trade.notes && (
                                <p className="text-sm mt-3 py-2 px-3 bg-background rounded italic">"{trade.notes}"</p>
                            )}
                            {trade.screenshots.length > 0 && (
                                <div className="mt-3">
                                    <h4 className="text-xs font-semibold uppercase text-text-muted mb-2 flex items-center"><CameraIcon className="mr-1.5" /> Screenshots</h4>
                                    <div className="flex gap-2 flex-wrap">
                                        {trade.screenshots.map((src, index) => (
                                            <img
                                                key={index}
                                                src={src}
                                                alt={`Screenshot ${index + 1}`}
                                                className="w-24 h-16 object-cover rounded-md cursor-pointer hover:opacity-80 transition-opacity"
                                                onClick={() => openLightbox(trade, index)}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
            {lightboxOpen && <Lightbox images={allScreenshots} selectedIndex={selectedImageIndex} onClose={() => setLightboxOpen(false)} />}
        </>
    );
};

export default TradeDetailModal;
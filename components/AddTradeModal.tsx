import React, { useState, useEffect, ChangeEvent } from 'react';
import { Trade } from '../types';
import { XIcon, CameraIcon } from './icons';
import { 
    SYMBOLS, SESSIONS, TRADE_TYPES, ORDER_TYPES, STATUSES, 
    MISTAKES, PSYCHOLOGY_OPTIONS, NEWS_IMPACTS, NARRATIVES, BIASES, PROFIT_LOSS
} from '../data/tradeOptions';

interface AddTradeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (trade: Trade) => void;
    tradeToEdit: Trade | null;
}

const initialTradeState: Trade = {
    id: 0,
    date: new Date().toISOString().split('T')[0],
    instrument: '',
    symbol: 'MNQ1!',
    direction: 'Long',
    status: 'Open',
    entry: 0,
    exit: 0,
    position: 0,
    pnl: 0,
    risk: 0,
    netPnL: 0,
    slRisk: 0,
    maxRR: '1:1',
    model: '',
    newsImpact: 'Low',
    session: 'NY AM Session',
    timeframe: '15m',
    narrative: 'Neutral',
    bias: 'Neutral',
    tradeType: 'Day Trade',
    pdArray: '',
    orderType: 'Market Order',
    mistake: 'None',
    psychology: 'Focused',
    confidenceLevel: 3,
    stressLevel: 3,
    notes: '',
    tags: [],
    profitOrLoss: 'Breakeven',
    images: [],
};

const inputBaseClasses = "w-full bg-card-alt border border-card-alt rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary text-text-main placeholder:text-text-muted";
const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => <input {...props} className={inputBaseClasses} />;
const Select = ({ children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement> & { children: React.ReactNode }) => <select {...props} className={inputBaseClasses}>{children}</select>;
const Textarea = (props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => <textarea {...props} className={inputBaseClasses} rows={3} />;
const Label = ({ children }: { children: React.ReactNode }) => <label className="block text-xs font-medium text-text-muted mb-1">{children}</label>;
const SectionTitle = ({ children }: { children: React.ReactNode }) => <h3 className="text-lg font-semibold mb-2 col-span-full border-b border-card-alt pb-1 mt-4 first:mt-0">{children}</h3>;

const AddTradeModal: React.FC<AddTradeModalProps> = ({ isOpen, onClose, onSave, tradeToEdit }) => {
    const [formData, setFormData] = useState<Trade>(initialTradeState);

    useEffect(() => {
        if (isOpen) {
            setFormData(tradeToEdit ? { ...tradeToEdit, tags: Array.isArray(tradeToEdit.tags) ? tradeToEdit.tags : [], images: tradeToEdit.images || [] } : initialTradeState);
        }
    }, [isOpen, tradeToEdit]);
    
    if (!isOpen) return null;

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        
        const numericFields = [
            'entry', 'exit', 'position', 'pnl', 'netPnL', 'risk', 'slRisk', 
            'confidenceLevel', 'stressLevel'
        ];
        
        if (numericFields.includes(name)) {
            setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleTagChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, tags: e.target.value.split(',').map(tag => tag.trim()).filter(Boolean) }));
    };

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            files.forEach(file => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setFormData(prev => ({...prev, images: [...(prev.images || []), reader.result as string]}));
                };
                reader.readAsDataURL(file);
            });
        }
    };

    const removeImage = (index: number) => {
        setFormData(prev => ({...prev, images: prev.images?.filter((_, i) => i !== index)}));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <div className="bg-card rounded-lg shadow-xl w-[95vw] max-w-5xl max-h-[90vh] flex flex-col">
                <div className="flex justify-between items-center p-4 border-b border-card-alt">
                    <h2 className="text-xl font-bold">{tradeToEdit ? 'Edit Trade' : 'Add New Trade'}</h2>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-card-alt"><XIcon size={20} /></button>
                </div>
                <form onSubmit={handleSubmit} className="overflow-y-auto p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <SectionTitle>Core Info</SectionTitle>
                        <div><Label>Date</Label><Input type="date" name="date" value={formData.date} onChange={handleChange} /></div>
                        <div><Label>Instrument</Label><Input name="instrument" value={formData.instrument} onChange={handleChange} placeholder="e.g. NQ100" /></div>
                        <div><Label>Symbol</Label><Select name="symbol" value={formData.symbol} onChange={handleChange}>{SYMBOLS.map(s => <option key={s}>{s}</option>)}</Select></div>
                        <div><Label>Direction</Label><Select name="direction" value={formData.direction} onChange={handleChange}><option value="Long">Long (Buy)</option><option value="Short">Short (Sell)</option></Select></div>
                        
                        <SectionTitle>Execution Details</SectionTitle>
                        <div><Label>Entry Price</Label><Input type="number" name="entry" value={formData.entry} onChange={handleChange} step="any" /></div>
                        <div><Label>Exit Price</Label><Input type="number" name="exit" value={formData.exit} onChange={handleChange} step="any" /></div>
                        <div><Label>Position Size</Label><Input type="number" name="position" value={formData.position} onChange={handleChange} step="any" /></div>
                        <div><Label>Order Type</Label><Select name="orderType" value={formData.orderType} onChange={handleChange}>{ORDER_TYPES.map(o => <option key={o}>{o}</option>)}</Select></div>
                        
                        <SectionTitle>Performance</SectionTitle>
                        <div><Label>Gross P&L ($)</Label><Input type="number" name="pnl" value={formData.pnl} onChange={handleChange} step="any" /></div>
                        <div><Label>Net P&L ($)</Label><Input type="number" name="netPnL" value={formData.netPnL} onChange={handleChange} step="any" /></div>
                        <div><Label>Risk ($)</Label><Input type="number" name="risk" value={formData.risk} onChange={handleChange} step="any" /></div>
                        <div><Label>SL Risk ($)</Label><Input type="number" name="slRisk" value={formData.slRisk} onChange={handleChange} step="any" /></div>
                        <div><Label>Max R/R</Label><Input name="maxRR" value={formData.maxRR} onChange={handleChange} placeholder="e.g. 1:3" /></div>
                        <div><Label>Status</Label><Select name="status" value={formData.status} onChange={handleChange}>{STATUSES.map(s => <option key={s}>{s}</option>)}</Select></div>
                        <div className="lg:col-span-2"><Label>Profit/Loss/BE</Label><Select name="profitOrLoss" value={formData.profitOrLoss} onChange={handleChange}>{PROFIT_LOSS.map(p => <option key={p}>{p}</option>)}</Select></div>

                        <SectionTitle>Context & Analysis</SectionTitle>
                        <div><Label>Session</Label><Select name="session" value={formData.session} onChange={handleChange}>{SESSIONS.map(s => <option key={s}>{s}</option>)}</Select></div>
                        <div><Label>Timeframe</Label><Input name="timeframe" value={formData.timeframe} onChange={handleChange} placeholder="e.g. 5m, 1h" /></div>
                        <div><Label>News Impact</Label><Select name="newsImpact" value={formData.newsImpact} onChange={handleChange}>{NEWS_IMPACTS.map(n => <option key={n}>{n}</option>)}</Select></div>
                        <div><Label>Bias</Label><Select name="bias" value={formData.bias} onChange={handleChange}>{BIASES.map(b => <option key={b}>{b}</option>)}</Select></div>
                        <div><Label>Narrative</Label><Select name="narrative" value={formData.narrative} onChange={handleChange}>{NARRATIVES.map(n => <option key={n}>{n}</option>)}</Select></div>
                        <div><Label>Model/Setup</Label><Input name="model" value={formData.model} onChange={handleChange} placeholder="e.g. ORB, ICT Silver Bullet"/></div>
                        <div><Label>Type of Trade</Label><Select name="tradeType" value={formData.tradeType} onChange={handleChange}>{TRADE_TYPES.map(t => <option key={t}>{t}</option>)}</Select></div>
                        <div><Label>PD Array</Label><Input name="pdArray" value={formData.pdArray} onChange={handleChange} placeholder="e.g. FVG, Order Block" /></div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div><Label>Mistake Analysis</Label><Select name="mistake" value={formData.mistake} onChange={handleChange}>{MISTAKES.map(m => <option key={m}>{m}</option>)}</Select></div>
                        <div><Label>Psychology</Label><Select name="psychology" value={formData.psychology} onChange={handleChange}>{PSYCHOLOGY_OPTIONS.map(p => <option key={p}>{p}</option>)}</Select></div>
                        <div>
                            <Label>Confidence Level (1-5)</Label>
                            <Select name="confidenceLevel" value={formData.confidenceLevel} onChange={handleChange}>
                                <option value={1}>1 - Very Low</option>
                                <option value={2}>2 - Low</option>
                                <option value={3}>3 - Neutral</option>
                                <option value={4}>4 - High</option>
                                <option value={5}>5 - Very High</option>
                            </Select>
                        </div>
                        <div>
                            <Label>Stress Level (1-5)</Label>
                            <Select name="stressLevel" value={formData.stressLevel} onChange={handleChange}>
                                <option value={1}>1 - Calm</option>
                                <option value={2}>2 - Slight Pressure</option>
                                <option value={3}>3 - Stressed</option>
                                <option value={4}>4 - High Stress</option>
                                <option value={5}>5 - Extremely Stressed</option>
                            </Select>
                        </div>
                        <div className="md:col-span-2"><Label>Narrative/Notes</Label><Textarea name="notes" value={formData.notes} onChange={handleChange} placeholder="Detailed notes about the trade rationale, execution, and outcome." /></div>
                        <div className="md:col-span-2"><Label>Tags (comma-separated)</Label><Input name="tags" value={Array.isArray(formData.tags) ? formData.tags.join(', ') : ''} onChange={handleTagChange} placeholder="e.g. breakout, news-fade, high-volume" /></div>
                    </div>

                    <div className="mt-4">
                        <SectionTitle>Images</SectionTitle>
                        <div className="mt-2 p-4 border-2 border-dashed border-card-alt rounded-lg">
                            <label htmlFor="image-upload" className="cursor-pointer flex flex-col items-center justify-center text-text-muted hover:text-primary">
                                <CameraIcon className="w-8 h-8" />
                                <span className="text-sm mt-1">Click to upload screenshots</span>
                            </label>
                            <Input id="image-upload" type="file" multiple accept="image/*" className="hidden" onChange={handleImageChange} />
                        </div>
                        {formData.images && formData.images.length > 0 && (
                            <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                                {formData.images.map((imgSrc, index) => (
                                    <div key={index} className="relative group">
                                        <img src={imgSrc} alt={`upload-preview-${index}`} className="w-full h-24 object-cover rounded-md" />
                                        <button type="button" onClick={() => removeImage(index)} className="absolute top-1 right-1 bg-danger text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <XIcon size={12} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </form>
                <div className="flex justify-end p-4 border-t border-card-alt bg-background mt-auto">
                    <button onClick={onClose} type="button" className="px-4 py-2 text-sm font-medium rounded-md mr-2 bg-card-alt hover:brightness-125">Cancel</button>
                    <button onClick={handleSubmit} type="submit" className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary/90">Save Trade</button>
                </div>
            </div>
        </div>
    );
};

export default AddTradeModal;
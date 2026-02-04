import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { Clock, CheckCircle, Map, Search } from 'lucide-react';
import Header from '../components/layout/Header';
import { format } from 'date-fns';

interface HistoryItem {
    id: string;
    type: 'analysis' | 'roadmap';
    title: string;
    date: string;
    details: string;
}

const History = () => {
    const { user } = useAuth();
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            if (user?.id) {
                try {
                    const data = await api.getHistory(user.id);
                    setHistory(data);
                } catch (error) {
                    console.error("Failed to load history", error);
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchHistory();
    }, [user]);

    return (
        <main className="main-content">
            <Header />

            <div className="max-w-4xl mx-auto">
                <div className="flex items-center gap-3 mb-8">
                    <div className="p-3 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
                        <Clock className="text-indigo-400" size={32} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">Your Journey</h1>
                        <p className="text-muted-foreground">Timeline of your analyses and roadmaps.</p>
                    </div>
                </div>

                {loading ? (
                    <div className="text-center py-12">Loading history...</div>
                ) : history.length === 0 ? (
                    <div className="glass-card p-12 text-center">
                        <p className="text-muted-foreground">No history found yet. Start by running an analysis!</p>
                    </div>
                ) : (
                    <div className="relative border-l border-white/10 ml-4 space-y-8">
                        {history.map((item) => (
                            <div key={item.id} className="ml-8 relative">
                                {/* Dot */}
                                <div className={`absolute -left-[41px] top-2 w-5 h-5 rounded-full border-4 border-background ${item.type === 'analysis' ? 'bg-blue-500' : 'bg-green-500'
                                    }`} />

                                <div className="glass-card p-6 hover:border-primary/50 transition-colors">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex items-center gap-2">
                                            {item.type === 'analysis' ? (
                                                <Search size={18} className="text-blue-400" />
                                            ) : (
                                                <Map size={18} className="text-green-400" />
                                            )}
                                            <h3 className="font-semibold text-lg">{item.title}</h3>
                                        </div>
                                        <span className="text-xs text-muted-foreground">
                                            {format(new Date(item.date), 'MMM d, yyyy h:mm a')}
                                        </span>
                                    </div>
                                    <p className="text-muted-foreground text-sm">{item.details}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
};

export default History;

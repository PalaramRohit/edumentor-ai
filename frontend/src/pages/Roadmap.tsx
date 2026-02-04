import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Map, Sparkles, Loader2, ArrowRight } from 'lucide-react';
import Header from '../components/layout/Header';

const Roadmap = () => {
    // Basic user fetching logic inline for now (or could use context)
    const [user, setUser] = useState<any>(null);
    useEffect(() => {
        const stored = localStorage.getItem('edumentor_user');
        if (stored) setUser(JSON.parse(stored));
    }, []);

    const [loading, setLoading] = useState(false);
    const [roadmap, setRoadmap] = useState<any>(null);
    const [hours, setHours] = useState(10);
    const [missingSkills, setMissingSkills] = useState("");

    const handleGenerate = async () => {
        if (!user) return;
        setLoading(true);
        try {
            const skillsList = missingSkills.split(',').map(s => s.trim()).filter(Boolean);
            const res = await api.generateRoadmap(
                user.id,
                skillsList.length ? skillsList : ["General Upskilling"], // Default if empty
                hours
            );
            setRoadmap(res.roadmap);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="main-content">
            <Header />

            <div className="mb-8">
                <h1 className="text-3xl font-bold text-foreground">Learning Roadmap</h1>
                <p className="text-muted-foreground">Your personalized AI-generated path to mastery.</p>
            </div>

            {!roadmap && (
                <div className="glass-card p-8 max-w-2xl mx-auto">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 rounded-xl bg-primary/20 text-primary">
                            <Map size={24} />
                        </div>
                        <h2 className="text-xl font-semibold">Configure Your Path</h2>
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground">Focus Skills (Optional)</label>
                            <textarea
                                className="input-glass h-32 resize-none"
                                placeholder="e.g. Docker, GraphQL, Kubernetes (Leave empty for general role based roadmap)"
                                value={missingSkills}
                                onChange={e => setMissingSkills(e.target.value)}
                            />
                        </div>

                        <div className="space-y-4">
                            <div className="flexjustify-between">
                                <label className="text-sm font-medium text-muted-foreground">Weekly Commitment</label>
                                <span className="text-accent font-bold">{hours} Hours</span>
                            </div>
                            <input
                                type="range"
                                min="5" max="40" step="5"
                                value={hours}
                                onChange={e => setHours(Number(e.target.value))}
                                className="w-full accent-primary h-2 bg-secondary rounded-lg appearance-none cursor-pointer"
                            />
                            <div className="flex justify-between text-xs text-muted-foreground">
                                <span>Casual (5h)</span>
                                <span>Intense (40h)</span>
                            </div>
                        </div>

                        <button
                            onClick={handleGenerate}
                            disabled={loading || !user}
                            className="btn-primary w-full flex items-center justify-center gap-2 py-4"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : <Sparkles size={18} />}
                            {loading ? "Designing Curriculum..." : "Generate My Roadmap"}
                        </button>
                    </div>
                </div>
            )}

            {roadmap && (
                <div className="space-y-8 animate-fade-in">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="glass-card p-4 border-l-4 border-primary">
                            <p className="text-xs text-muted-foreground uppercase font-bold">Duration</p>
                            <p className="text-2xl font-bold text-foreground">{roadmap.weeks?.length || 0} Weeks</p>
                        </div>
                        <div className="glass-card p-4 border-l-4 border-accent">
                            <p className="text-xs text-muted-foreground uppercase font-bold">Total Topics</p>
                            <p className="text-2xl font-bold text-foreground">
                                {roadmap.weeks?.reduce((acc: any, w: any) => acc + (w.tasks?.length || 0), 0)}
                            </p>
                        </div>
                    </div>

                    <div className="space-y-6 relative before:absolute before:left-8 before:top-4 before:bottom-4 before:w-[2px] before:bg-white/10">
                        {roadmap.weeks?.map((week: any, idx: number) => (
                            <div key={idx} className="pl-20 relative">
                                <div className="absolute left-4 top-0 w-8 h-8 rounded-full bg-card border-2 border-primary flex items-center justify-center text-xs font-bold text-primary z-10">
                                    {week.week}
                                </div>

                                <div className="glass-card p-6 hover:bg-white/[0.02] transition-colors">
                                    <h3 className="text-lg font-bold text-foreground mb-1">{week.focus}</h3>
                                    <p className="text-sm text-muted-foreground mb-4">{week.expected_outcome}</p>

                                    <div className="space-y-3">
                                        {week.tasks?.map((task: string, tIdx: number) => (
                                            <div key={tIdx} className="flex gap-3 items-start group">
                                                <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-accent/50 group-hover:bg-accent transition-colors" />
                                                <p className="text-sm text-foreground/80">{task}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-center pt-8 pb-12">
                        <button
                            onClick={() => setRoadmap(null)}
                            className="text-muted-foreground hover:text-white transition-colors text-sm flex items-center gap-2"
                        >
                            <ArrowRight size={14} className="rotate-180" />
                            Create New Roadmap
                        </button>
                    </div>
                </div>
            )}
        </main>
    );
};

export default Roadmap;

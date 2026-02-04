import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { FileText, Search, Loader2, CheckCircle2 } from 'lucide-react';
import Header from '../components/layout/Header';

const Syllabus = () => {
    const [user, setUser] = useState<any>(null);
    useEffect(() => {
        const stored = localStorage.getItem('edumentor_user');
        if (stored) setUser(JSON.parse(stored));
    }, []);

    const [text, setText] = useState("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);

    const handleAnalyze = async () => {
        if (!user || !text.trim()) return;
        setLoading(true);
        try {
            // Note: api.ts might need processSyllabus update if not present
            // But we can add it or assume standard fetch for now if missing
            const res = await fetch(`http://127.0.0.1:5000/syllabus/process`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ user_id: user.id, text })
            });
            const data = await res.json();
            setResult(data);
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
                <h1 className="text-3xl font-bold text-foreground">Syllabus Analysis</h1>
                <p className="text-muted-foreground">Paste your course curriculum to extract key skills.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-4">
                    <div className="glass-card p-1">
                        <textarea
                            className="w-full bg-transparent border-none text-foreground p-6 resize-none focus:outline-none min-h-[400px] leading-relaxed"
                            placeholder="Paste your syllabus text here... (e.g. 'CS101: Introduction to Python, Data Structures...')"
                            value={text}
                            onChange={e => setText(e.target.value)}
                        />
                    </div>
                    <div className="flex justify-end">
                        <button
                            onClick={handleAnalyze}
                            disabled={loading || !text.trim()}
                            className="btn-primary flex items-center gap-2 px-8"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : <Search size={18} />}
                            {loading ? "Analyzing..." : "Analyze Syllabus"}
                        </button>
                    </div>
                </div>

                <div className="lg:col-span-1">
                    <div className="glass-card p-6 h-full min-h-[400px]">
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <FileText size={18} className="text-accent" />
                            Extracted Skills
                        </h3>

                        {!result && !loading && (
                            <div className="text-center text-muted-foreground py-10 opacity-50">
                                <Search size={48} className="mx-auto mb-4" />
                                <p>Waiting for input...</p>
                            </div>
                        )}

                        {loading && (
                            <div className="flex flex-col items-center justify-center py-20 gap-4">
                                <Loader2 className="animate-spin text-accent" size={32} />
                                <p className="text-sm text-muted-foreground">Reading extraction...</p>
                            </div>
                        )}

                        {result && (
                            <div className="animate-fade-in">
                                <div className="flex items-center gap-2 text-green-400 mb-6 bg-green-500/10 p-3 rounded-xl border border-green-500/20">
                                    <CheckCircle2 size={18} />
                                    <span className="font-medium text-sm">Analysis Complete!</span>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    {result.normalized_skills?.map((skill: string, idx: number) => (
                                        <span key={idx} className="suggestion-chip text-xs py-2">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
};

export default Syllabus;

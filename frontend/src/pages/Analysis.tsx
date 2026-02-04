import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { BarChart3, AlertTriangle, CheckCircle, Loader2, Target } from 'lucide-react';
import Header from '../components/layout/Header';
import ReadinessGauge from '../components/dashboard/ReadinessGauge';

const Analysis = () => {
    const [user, setUser] = useState<any>(null);
    useEffect(() => {
        const stored = localStorage.getItem('edumentor_user');
        if (stored) setUser(JSON.parse(stored));
    }, []);

    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);

    const [manualSkills, setManualSkills] = useState("");
    const [savingSkills, setSavingSkills] = useState(false);

    useEffect(() => {
        if (user && user.skills) {
            setManualSkills(user.skills.join(", "));
        }
    }, [user]);

    const handleSaveSkills = async () => {
        if (!user) return;
        setSavingSkills(true);
        try {
            const skillsArray = manualSkills.split(",").map(s => s.trim()).filter(s => s.length > 0);
            const updatedUser = await api.updateUser(user.id, { skills: skillsArray });

            // Update local user state and localStorage
            const newUser = { ...user, skills: updatedUser.skills };
            setUser(newUser);
            localStorage.setItem('edumentor_user', JSON.stringify(newUser));

            // Force re-analysis if needed, or just let user click run
        } catch (err) {
            console.error("Failed to save skills", err);
        } finally {
            setSavingSkills(false);
        }
    };

    const handleRunAnalysis = async () => {
        if (!user) return;
        // Auto-save skills before running if changed? 
        // For simplicity, we assume user clicked 'Save' or we just run with what's in DB. 
        // Better: Save current input before running.

        setLoading(true);
        try {
            // Ensure skills are saved first
            const skillsArray = manualSkills.split(",").map(s => s.trim()).filter(s => s.length > 0);
            if (skillsArray.length > 0) {
                await api.updateUser(user.id, { skills: skillsArray });
                // Update local state implicitly
                const newUser = { ...user, skills: skillsArray };
                setUser(newUser);
                localStorage.setItem('edumentor_user', JSON.stringify(newUser));
            }

            const res = await api.runAnalysis(user.id, user.target_role || "Developer");
            setResult(res);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="main-content">
            <Header />

            {/* Manual Skills Input Section */}
            <div className="glass-card p-6 mb-8 border border-white/10">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Target className="text-primary" size={20} />
                    Manage Your Skills
                </h2>
                <p className="text-muted-foreground mb-4 text-sm">
                    Enter your skills manually to get a more accurate analysis. These will prioritize over syllabus data.
                </p>
                <div className="flex gap-4">
                    <input
                        type="text"
                        value={manualSkills}
                        onChange={(e) => setManualSkills(e.target.value)}
                        placeholder="e.g. Python, React, SQL, Docker (comma separated)"
                        className="input-glass flex-1"
                    />
                    <button
                        onClick={handleSaveSkills}
                        disabled={savingSkills}
                        className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
                    >
                        {savingSkills ? "Saving..." : "Save Skills"}
                    </button>
                </div>
            </div>

            <div className="flex items-end justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Skill Gap Analysis</h1>
                    <p className="text-muted-foreground">Compare your skills against industry standards for <b>{user?.target_role}</b>.</p>
                </div>
                {!result && (
                    <button
                        onClick={handleRunAnalysis}
                        disabled={loading}
                        className="btn-primary"
                    >
                        {loading ? <Loader2 className="animate-spin w-4 h-4 mr-2 inline" /> : null}
                        {loading ? "Analyzing..." : "Run Analysis"}
                    </button>
                )}
            </div>

            {loading && !result && (
                <div className="glass-card h-64 flex flex-col items-center justify-center">
                    <Loader2 className="w-10 h-10 text-accent animate-spin mb-4" />
                    <p className="text-muted-foreground">Analyzing your profile against 50+ job descriptions...</p>
                </div>
            )}

            {result && (
                <div className="space-y-6 animate-fade-in">
                    {/* Top Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="glass-card p-6 flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground font-medium uppercase tracking-wide">Readiness</p>
                                <p className="text-3xl font-bold text-foreground mt-1">{result.readiness_pct?.toFixed(0)}%</p>
                            </div>
                            <div className="w-16 h-16">
                                <ReadinessGauge percentage={result.readiness_pct || 0} />
                            </div>
                        </div>

                        <div className="glass-card p-6 border-l-4 border-red-500/50">
                            <div className="flex items-center gap-3 mb-2">
                                <AlertTriangle className="text-red-400" size={20} />
                                <p className="text-sm text-muted-foreground font-medium uppercase">Missing Skills</p>
                            </div>
                            <p className="text-3xl font-bold text-foreground">{result.missing_skills?.length || 0}</p>
                        </div>

                        <div className="glass-card p-6 border-l-4 border-yellow-500/50">
                            <div className="flex items-center gap-3 mb-2">
                                <Target className="text-yellow-400" size={20} />
                                <p className="text-sm text-muted-foreground font-medium uppercase">Weak Areas</p>
                            </div>
                            <p className="text-3xl font-bold text-foreground">{result.weak_skills?.length || 0}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Missing Skills */}
                        <div className="glass-card p-6">
                            <h3 className="text-lg font-semibold mb-4 text-red-400 flex items-center gap-2">
                                <AlertTriangle size={18} />
                                Critical Gaps
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {result.missing_skills?.map((skill: string, idx: number) => (
                                    <span key={idx} className="px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-200 text-sm">
                                        {skill}
                                    </span>
                                ))}
                                {(!result.missing_skills || result.missing_skills.length === 0) && (
                                    <p className="text-muted-foreground text-sm">No critical gaps found!</p>
                                )}
                            </div>
                        </div>

                        {/* Weak Skills */}
                        <div className="glass-card p-6">
                            <h3 className="text-lg font-semibold mb-4 text-yellow-400 flex items-center gap-2">
                                <Target size={18} />
                                Needs Improvement
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {result.weak_skills?.map((skill: string, idx: number) => (
                                    <span key={idx} className="px-3 py-1.5 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-yellow-200 text-sm">
                                        {skill}
                                    </span>
                                ))}
                                {(!result.weak_skills || result.weak_skills.length === 0) && (
                                    <p className="text-muted-foreground text-sm">No weak areas detected.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
};

export default Analysis;

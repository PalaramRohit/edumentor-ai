import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { FileText, Download, Loader2, Briefcase, GraduationCap, Code } from 'lucide-react';
import Header from '../components/layout/Header';

const ResumeBuilder = () => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        education: '',
        experience: '',
        projects: ''
    });

    const { user } = useAuth();

    // Pre-fill from user context if available
    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                name: user.name || '',
                email: user.email || ''
            }));
        }
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleGenerate = async () => {
        console.log("Generating Resume for User ID:", user?.id);
        setLoading(true);
        try {
            const blob = await api.generateResume({ ...formData, user_id: user?.id });

            // Create download link
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `Resume_${formData.name.replace(' ', '_') || 'My'}.pdf`;
            document.body.appendChild(a);
            a.click();
            a.remove();
        } catch (err) {
            console.error("Resume generation failed", err);
            // Optionally show toast error
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="main-content">
            <Header />

            <div className="max-w-4xl mx-auto">
                <div className="flex items-center gap-3 mb-8">
                    <div className="p-3 bg-blue-500/10 rounded-xl border border-blue-500/20">
                        <FileText className="text-blue-400" size={32} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">Resume Builder</h1>
                        <p className="text-muted-foreground">Auto-format a professional resume using your profile data and inputs.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6">
                    {/* Personal Info */}
                    <div className="glass-card p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium mb-1 block">Full Name</label>
                            <input
                                name="name"
                                type="text"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="John Doe"
                                className="input-glass w-full"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium mb-1 block">Email</label>
                            <input
                                name="email"
                                type="text"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="john@example.com"
                                className="input-glass w-full"
                            />
                        </div>
                    </div>

                    {/* Education */}
                    <div className="glass-card p-6">
                        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                            <GraduationCap className="text-primary" size={20} />
                            Education
                        </h2>
                        <textarea
                            name="education"
                            value={formData.education}
                            onChange={handleChange}
                            placeholder="e.g. B.Tech in CSE, XYZ University (2022-2026), CGPA: 8.5"
                            className="input-glass w-full h-32 resize-none"
                        />
                    </div>

                    {/* Experience */}
                    <div className="glass-card p-6">
                        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                            <Briefcase className="text-primary" size={20} />
                            Experience
                        </h2>
                        <textarea
                            name="experience"
                            value={formData.experience}
                            onChange={handleChange}
                            placeholder="e.g. Summer Intern at Tech Corp (June - Aug 2024). Worked on Frontend optimization."
                            className="input-glass w-full h-32 resize-none"
                        />
                    </div>

                    {/* Projects */}
                    <div className="glass-card p-6">
                        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                            <Code className="text-primary" size={20} />
                            Projects
                        </h2>
                        <textarea
                            name="projects"
                            value={formData.projects}
                            onChange={handleChange}
                            placeholder="e.g. EduMentor AI - Built a platform for student mentorship using React and Python."
                            className="input-glass w-full h-32 resize-none"
                        />
                    </div>

                    <div className="flex justify-end mt-4">
                        <button
                            onClick={handleGenerate}
                            disabled={loading}
                            className="btn-primary flex items-center gap-2 text-lg px-8"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : <Download size={20} />}
                            {loading ? "Generating PDF..." : "Generate Resume PDF"}
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default ResumeBuilder;

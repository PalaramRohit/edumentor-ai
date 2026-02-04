import { useState } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { BookOpen, Download, Loader2, Sparkles, PenTool, Hash } from 'lucide-react';
import Header from '../components/layout/Header';

const PaperGenerator = () => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        topic: '',
        points: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleGenerate = async () => {
        if (!formData.title || !formData.topic) return;

        setLoading(true);
        try {
            const blob = await api.generatePaper(formData);

            // Create download link
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${formData.title.replace(/\s+/g, '_')}_Paper.pdf`;
            document.body.appendChild(a);
            a.click();
            a.remove();
        } catch (err) {
            console.error("Paper generation failed", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="main-content">
            <Header />

            <div className="max-w-4xl mx-auto">
                <div className="flex items-center gap-3 mb-8">
                    <div className="p-3 bg-purple-500/10 rounded-xl border border-purple-500/20">
                        <BookOpen className="text-purple-400" size={32} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">Technical Paper Generator</h1>
                        <p className="text-muted-foreground">Draft professional academic papers with AI assistance.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6">
                    {/* Title */}
                    <div className="glass-card p-6">
                        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                            <PenTool className="text-purple-400" size={20} />
                            Paper Title
                        </h2>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="e.g. The Impact of AI on Modern Education"
                            className="input-glass w-full"
                        />
                    </div>

                    {/* Topic / Abstract Idea */}
                    <div className="glass-card p-6">
                        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                            <Sparkles className="text-purple-400" size={20} />
                            Core Topic & Abstract Idea
                        </h2>
                        <textarea
                            name="topic"
                            value={formData.topic}
                            onChange={handleChange}
                            placeholder="Describe what the paper is about. E.g. Exploring how Large Language Models can act as personalized tutors..."
                            className="input-glass w-full h-32 resize-none"
                        />
                    </div>

                    {/* Key Points */}
                    <div className="glass-card p-6">
                        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                            <Hash className="text-purple-400" size={20} />
                            Key Points to Cover
                        </h2>
                        <textarea
                            name="points"
                            value={formData.points}
                            onChange={handleChange}
                            placeholder="e.g. 1. Skill Gap Analysis methods. 2. Role of AI in roadmap generation. 3. Ethical considerations."
                            className="input-glass w-full h-32 resize-none"
                        />
                    </div>

                    <div className="flex justify-end mt-4">
                        <button
                            onClick={handleGenerate}
                            disabled={loading || !formData.title || !formData.topic}
                            className="btn-primary bg-purple-600 hover:bg-purple-500 flex items-center gap-2 text-lg px-8"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : <Download size={20} />}
                            {loading ? "Writing & Generating PDF..." : "Generate Research Paper"}
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default PaperGenerator;

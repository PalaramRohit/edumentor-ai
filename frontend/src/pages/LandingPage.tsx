import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Map, MessageSquare, ArrowRight, ShieldCheck } from 'lucide-react';

const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col relative overflow-hidden">
            {/* Background Ambience */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/20 rounded-full blur-[120px] animate-pulse delay-1000" />
            </div>

            {/* Navbar */}
            <nav className="relative z-10 w-full max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20">
                        <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80">
                        EduMentor AI
                    </span>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/login')}
                        className="px-6 py-2.5 rounded-xl font-medium text-sm text-white/90 hover:text-white transition-colors"
                    >
                        Login
                    </button>
                    <button
                        onClick={() => navigate('/signup')}
                        className="px-6 py-2.5 rounded-xl bg-white/10 border border-white/10 backdrop-blur-md text-white font-medium text-sm hover:bg-white/20 transition-all duration-300"
                    >
                        Get Started
                    </button>
                </div>
            </nav>

            {/* Hero Section */}
            <main className="relative z-10 flex-1 flex flex-col justify-center items-center text-center px-4 sm:px-6 lg:px-8 mt-10 mb-20">
                <div className="max-w-4xl mx-auto space-y-8">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
                        </span>
                        <span className="text-xs font-medium text-accent tracking-wide uppercase">AI-Powered Career Guidance</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white leading-[1.1]">
                        Your Personal AI <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-400 to-accent animate-gradient-x">
                            Learning & Career Mentor
                        </span>
                    </h1>

                    <p className="max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground leading-relaxed">
                        Master your career path with AI-driven skill gap analysis, personalized learning roadmaps, and 24/7 mentorship.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                        <button
                            onClick={() => navigate('/signup')}
                            className="group relative px-8 py-4 bg-gradient-to-r from-primary to-accent rounded-xl text-white font-semibold shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:scale-[1.02] transition-all duration-300 w-full sm:w-auto"
                        >
                            <span className="flex items-center justify-center gap-2">
                                Start Your Journey
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </span>
                        </button>
                        <button
                            onClick={() => navigate('/login')}
                            className="px-8 py-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-medium w-full sm:w-auto transition-all duration-300"
                        >
                            Continue Learning
                        </button>
                    </div>
                </div>

                {/* Feature Highlights */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto mt-24 w-full">
                    <FeatureCard
                        icon={<Map className="w-6 h-6 text-accent" />}
                        title="Skill Gap Analysis"
                        description="Identify missing skills and get a tailored plan to bridge the gap effectively."
                    />
                    <FeatureCard
                        icon={<Sparkles className="w-6 h-6 text-primary" />}
                        title="Personalized Roadmaps"
                        description="Generate dynamic learning paths adapted to your pace and career goals."
                    />
                    <FeatureCard
                        icon={<MessageSquare className="w-6 h-6 text-blue-400" />}
                        title="AI Mentor Chat"
                        description="Get instant answers, code reviews, and career advice from your AI mentor."
                    />
                </div>
            </main>

            {/* Footer */}
            <footer className="relative z-10 border-t border-white/5 py-8 mt-auto">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
                    <p>&copy; 2026 EduMentor AI. All rights reserved.</p>
                    <div className="flex gap-6 mt-4 md:mt-0">
                        <span className="hover:text-white cursor-pointer transition-colors">Privacy Policy</span>
                        <span className="hover:text-white cursor-pointer transition-colors">Terms of Service</span>
                    </div>
                </div>
            </footer>
        </div>
    );
};

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
    <div className="group p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-primary/50 hover:bg-white/[0.07] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1">
        <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
            {icon}
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
        <p className="text-muted-foreground leading-relaxed">{description}</p>
    </div>
);

export default LandingPage;

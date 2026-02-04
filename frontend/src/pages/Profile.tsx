import { User, Mail, GraduationCap, Target, Award, Code2, Edit2 } from 'lucide-react';
import Header from '../components/layout/Header';
import ReadinessGauge from '../components/dashboard/ReadinessGauge';
import { useAuth } from '@/context/AuthContext';

const Profile = () => {
    const { user } = useAuth();

    if (!user) return (
        <main className="main-content">
            <div className="p-8 text-center text-muted-foreground">Loading Profile...</div>
        </main>
    );

    // Default values
    const displayName = user.name || "Learner";
    const displayEmail = user.email || "No email provided";
    const displayRole = user.target_role || "Aspiring Developer";
    const displayInitial = displayName.charAt(0).toUpperCase();
    const readinessScore = 0; // Placeholder until backend provides real score
    const academicYear = "Not Specified"; // Placeholder
    const branch = "Computer Science"; // Placeholder
    const skills = ["Python", "React", "Machine Learning", "System Design"]; // Placeholder dynamic list if possible

    return (
        <main className="main-content">
            <Header />

            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">My Profile</h1>
                    <p className="text-muted-foreground">Manage your academic and career settings.</p>
                </div>
                <button className="btn-primary flex items-center gap-2 px-6">
                    <Edit2 size={16} />
                    <span>Edit Profile</span>
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left Column: Personal Info & Readiness */}
                <div className="space-y-6 lg:col-span-1">
                    {/* Identity Card */}
                    <div className="glass-card p-6 flex flex-col items-center text-center">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-4 shadow-lg shadow-primary/20">
                            <span className="text-3xl font-bold text-white max-w-full truncate px-2">
                                {displayInitial}
                            </span>
                        </div>
                        <h2 className="text-xl font-bold text-foreground">{displayName}</h2>
                        <p className="text-accent font-medium mb-1">{displayRole}</p>
                        <div className="flex items-center gap-2 text-muted-foreground text-sm mt-2">
                            <Mail size={14} />
                            <span>{displayEmail}</span>
                        </div>
                    </div>

                    {/* Readiness Score */}
                    <div className="glass-card p-6">
                        <h3 className="text-sm font-semibold text-muted-foreground uppercase mb-4 flex items-center gap-2">
                            <Award size={16} />
                            Current Readiness
                        </h3>
                        <div className="flex justify-center py-4">
                            <div className="w-40 h-40">
                                <ReadinessGauge percentage={readinessScore} />
                            </div>
                        </div>
                        <p className="text-center text-sm text-gray-400 mt-2">
                            Based on your skills vs. {displayRole} requirements.
                        </p>
                    </div>
                </div>

                {/* Right Column: Details */}
                <div className="space-y-6 lg:col-span-2">

                    {/* Academic Details */}
                    <div className="glass-card p-8">
                        <h3 className="text-lg font-bold text-foreground mb-6 flex items-center gap-2">
                            <GraduationCap className="text-accent" size={20} />
                            Academic Information
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                                <p className="text-xs text-muted-foreground uppercase mb-1">Degree Program</p>
                                <p className="font-semibold text-lg">Undergraduate (B.Tech)</p>
                            </div>
                            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                                <p className="text-xs text-muted-foreground uppercase mb-1">Current Year</p>
                                <p className="font-semibold text-lg">{academicYear}</p>
                            </div>
                            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                                <p className="text-xs text-muted-foreground uppercase mb-1">Branch / Major</p>
                                <p className="font-semibold text-lg">{branch}</p>
                            </div>
                            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                                <p className="text-xs text-muted-foreground uppercase mb-1">University</p>
                                <p className="font-semibold text-lg">EduMentor University</p>
                            </div>
                        </div>
                    </div>

                    {/* Career Goals */}
                    <div className="glass-card p-8">
                        <h3 className="text-lg font-bold text-foreground mb-6 flex items-center gap-2">
                            <Target className="text-accent" size={20} />
                            Career Criteria
                        </h3>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
                                <div>
                                    <p className="text-xs text-muted-foreground uppercase mb-1">Target Role</p>
                                    <p className="font-semibold text-lg">{displayRole}</p>
                                </div>
                                <span className="px-3 py-1 bg-accent/20 text-accent text-xs rounded-full">High Priority</span>
                            </div>

                            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                                <p className="text-xs text-muted-foreground uppercase mb-3">Focus Skills (Criteria)</p>
                                <div className="flex flex-wrap gap-2">
                                    {skills.map((skill: string, idx: number) => (
                                        <div key={idx} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary/50 border border-white/5">
                                            <Code2 size={14} className="text-muted-foreground" />
                                            <span className="text-sm">{skill}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </main>
    );
};

export default Profile;

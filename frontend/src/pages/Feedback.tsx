import { useState } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { MessageSquare, Send, CheckCircle2, Loader2, Sparkles } from 'lucide-react';
import Header from '../components/layout/Header';

const Feedback = () => {
    const { user } = useAuth();
    const { t, language } = useLanguage();
    const [feedback, setFeedback] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [aiResponse, setAiResponse] = useState('');

    const handleSubmit = async () => {
        if (!feedback.trim()) return;
        setLoading(true);
        try {
            // We use the general chat endpoint for AI-assisted response
            const response = await api.chat(
                `A user provided the following feedback about EduMentor AI: "${feedback}". 
                Respond to them directly in a supportive, professional, and appreciative manner. 
                Keep it concise.`
            );
            setAiResponse(response.reply);
            setSubmitted(true);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const strings = {
        en: {
            title: 'Feedback',
            sub: 'Help us improve EduMentor AI with your thoughts.',
            label: 'Your Feedback',
            placeholder: 'Type your feedback here...',
            btn: 'Submit Feedback',
            success: 'Thank You!',
            success_sub: 'Our AI has analyzed your feedback:',
            reset: 'Send more feedback'
        },
        hi: {
            title: 'प्रतिक्रिया',
            sub: 'अपने विचारों के साथ EduMentor AI को बेहतर बनाने में हमारी मदद करें।',
            label: 'आपकी प्रतिक्रिया',
            placeholder: 'अपनी प्रतिक्रिया यहाँ लिखें...',
            btn: 'प्रतिक्रिया भेजें',
            success: 'धन्यवाद!',
            success_sub: 'हमारे AI ने आपकी प्रतिक्रिया का विश्लेषण किया है:',
            reset: 'और प्रतिक्रिया भेजें'
        },
        te: {
            title: 'అభిప్రాయం',
            sub: 'EduMentor AI ని మెరుగుపరచడానికి మీ ఆలోచనలను పంచుకోండి.',
            label: 'మీ అభిప్రాయం',
            placeholder: 'మీ అభిప్రాయాన్ని ఇక్కడ టైప్ చేయండి...',
            btn: 'అభిప్రాయాన్ని పంపండి',
            success: 'ధన్యవాదాలు!',
            success_sub: 'మా AI మీ అభిప్రాయాన్ని విశ్లేషించింది:',
            reset: 'మరింత అభిప్రాయాన్ని పంపండి'
        }
    };

    const s = (strings as any)[language] || strings.en;

    return (
        <main className="main-content">
            <Header />

            <div className="max-w-2xl mx-auto py-8">
                <div className="flex items-center gap-3 mb-8">
                    <div className="p-3 bg-pink-500/10 rounded-xl border border-pink-500/20">
                        <MessageSquare className="text-pink-400" size={32} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">{s.title}</h1>
                        <p className="text-muted-foreground">{s.sub}</p>
                    </div>
                </div>

                {!submitted ? (
                    <div className="glass-card p-6 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">{s.label}</label>
                            <textarea
                                value={feedback}
                                onChange={(e) => setFeedback(e.target.value)}
                                placeholder={s.placeholder}
                                className="input-glass w-full h-48 resize-none text-lg"
                            />
                        </div>

                        <button
                            onClick={handleSubmit}
                            disabled={loading || !feedback.trim()}
                            className="btn-primary w-full py-4 text-lg flex items-center justify-center gap-2"
                        >
                            {loading ? <Loader2 size={24} className="animate-spin" /> : <Send size={24} />}
                            {loading ? 'Processing...' : s.btn}
                        </button>
                    </div>
                ) : (
                    <div className="glass-card p-8 text-center space-y-6 animate-in zoom-in duration-500">
                        <div className="flex justify-center">
                            <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center">
                                <CheckCircle2 size={48} className="text-green-400" />
                            </div>
                        </div>
                        <h2 className="text-2xl font-bold">{s.success}</h2>

                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-left space-y-3">
                            <div className="flex items-center gap-2 text-primary font-medium">
                                <Sparkles size={18} />
                                <span>{s.success_sub}</span>
                            </div>
                            <p className="italic text-foreground/90 leading-relaxed">
                                "{aiResponse}"
                            </p>
                        </div>

                        <button
                            onClick={() => { setSubmitted(false); setFeedback(''); }}
                            className="text-primary hover:underline font-medium"
                        >
                            {s.reset}
                        </button>
                    </div>
                )}
            </div>
        </main>
    );
};

export default Feedback;

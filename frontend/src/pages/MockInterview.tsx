import { useState, useEffect, useRef } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { Mic, Send, User, Bot, Play } from 'lucide-react';
import Header from '../components/layout/Header';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

const MockInterview = () => {
    const { user } = useAuth();
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [active, setActive] = useState(false);
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const startInterview = async () => {
        setLoading(true);
        setActive(true);
        try {
            const res = await api.startInterview(user?.target_role || 'Software Engineer');
            setMessages([{ role: 'assistant', content: res.message }]);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const sendMessage = async () => {
        if (!input.trim()) return;
        const newMsg: Message = { role: 'user', content: input };
        setMessages(prev => [...prev, newMsg]);
        setInput('');
        setLoading(true);

        try {
            const res = await api.sendInterviewMessage(input, messages);
            setMessages(prev => [...prev, { role: 'assistant', content: res.message }]);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="main-content">
            <Header />

            <div className="max-w-4xl mx-auto h-[calc(100vh-120px)] flex flex-col">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-green-500/10 rounded-xl border border-green-500/20">
                        <Mic className="text-green-400" size={32} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">AI Mock Interviewer</h1>
                        <p className="text-muted-foreground">Practice technical questions for {user?.target_role || 'your role'}.</p>
                    </div>
                </div>

                {!active ? (
                    <div className="flex-1 flex flex-col items-center justify-center glass-card p-12 text-center">
                        <h2 className="text-2xl font-bold mb-4">Ready to practice?</h2>
                        <p className="mb-8 text-muted-foreground max-w-md">
                            The AI will act as a hiring manager. Answer concisely.
                            It will evaluate your responses and probe deeper.
                        </p>
                        <button
                            onClick={startInterview}
                            className="btn-primary text-xl px-12 py-4 flex items-center gap-3"
                            disabled={loading}
                        >
                            {loading ? 'Initializing...' : <><Play size={24} /> Start Interview</>}
                        </button>
                    </div>
                ) : (
                    <div className="flex-1 glass-card flex flex-col overflow-hidden">
                        {/* Chat Area */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {messages.map((m, i) => (
                                <div key={i} className={`flex gap-4 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${m.role === 'user' ? 'bg-primary/20 text-primary' : 'bg-green-500/20 text-green-400'
                                        }`}>
                                        {m.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                                    </div>
                                    <div className={`p-4 rounded-2xl max-w-[80%] ${m.role === 'user' ? 'bg-primary/10 text-foreground' : 'bg-white/5 border border-white/10'
                                        }`}>
                                        {m.content}
                                    </div>
                                </div>
                            ))}
                            {loading && (
                                <div className="flex gap-4">
                                    <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                                        <Bot size={16} className="text-green-400" />
                                    </div>
                                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10 animate-pulse">
                                        Thinking...
                                    </div>
                                </div>
                            )}
                            <div ref={bottomRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-4 border-t border-white/10 bg-black/20">
                            <div className="flex gap-2">
                                <input
                                    className="input-glass flex-1"
                                    placeholder="Type your answer..."
                                    value={input}
                                    onChange={e => setInput(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && sendMessage()}
                                    disabled={loading}
                                />
                                <button
                                    onClick={sendMessage}
                                    disabled={loading || !input.trim()}
                                    className="btn-primary p-3 rounded-xl"
                                >
                                    <Send size={20} />
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
};

export default MockInterview;

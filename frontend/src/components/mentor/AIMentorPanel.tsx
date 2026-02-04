import { useState } from 'react';
import { MoreHorizontal, Send, Sparkles, BookOpen, Code, Database, HelpCircle, User, Loader2 } from 'lucide-react';
import aiAvatar from '@/assets/ai-mentor-avatar.png';
import { api } from '@/lib/api';
import { useLanguage } from '../../context/LanguageContext';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

// HARDCODED DEMO USER ID (same as WelcomeCard)
const DEMO_USER_ID = "6981ff670d537d053907fcb1";

const AIMentorPanel = () => {
  const { t, language } = useLanguage();

  const suggestions_map = {
    en: [
      { icon: <Sparkles size={16} />, text: "What's the focus of this week?" },
      { icon: <BookOpen size={16} />, text: "Explain Kubernetes step-by-step" },
      { icon: <Code size={16} />, text: "How can I improve my coding speed?" },
    ],
    hi: [
      { icon: <Sparkles size={16} />, text: "इस सप्ताह का मुख्य फोकस क्या है?" },
      { icon: <BookOpen size={16} />, text: "कुबेरनेट्स को स्टेप-बाय-स्टेप समझाएं" },
      { icon: <Code size={16} />, text: "मैं अपनी कोडिंग गति कैसे सुधार सकता हूँ?" },
    ],
    te: [
      { icon: <Sparkles size={16} />, text: "ఈ వారం దేనిపై దృష్టి పెట్టాలి?" },
      { icon: <BookOpen size={16} />, text: "కుబెర్నెటిస్ గురించి వివరించండి" },
      { icon: <Code size={16} />, text: "నా కోడింగ్ వేగాన్ని ఎలా పెంచుకోవాలి?" },
    ]
  };

  const welcome_msgs = {
    en: "How can I assist you with your studies today?",
    hi: "आज मैं आपकी पढ़ाई में कैसे मदद कर सकता हूँ?",
    te: "ఈరోజు మీ చదువులో నేను మీకు ఎలా సహాయపడగలను?"
  };

  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: (welcome_msgs as any)[language] || welcome_msgs.en }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const suggestions = (suggestions_map as any)[language] || suggestions_map.en;

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    try {
      // Use the new generic chat API
      const res = await api.chat(userMsg);
      setMessages(prev => [...prev, { role: 'assistant', content: res.reply || "I'm having trouble thinking." }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I encountered an error connecting to the brain." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mentor-panel">
      <div className="glass-card flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/[0.06]">
          <h2 className="text-lg font-semibold text-foreground">AI Mentor</h2>
          <button className="icon-btn p-1">
            <MoreHorizontal size={20} className="text-muted-foreground" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 p-4 flex flex-col overflow-hidden">
          {/* Chat History */}
          <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-1">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                {msg.role === 'assistant' ? (
                  <img src={aiAvatar} alt="AI" className="w-8 h-8 rounded-lg object-cover" />
                ) : (
                  <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
                    <User size={16} />
                  </div>
                )}

                <div className={`p-3 rounded-xl max-w-[80%] text-sm ${msg.role === 'user'
                  ? 'bg-primary text-white'
                  : 'bg-white/[0.06] text-foreground'
                  }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex gap-3">
                <img src={aiAvatar} alt="AI" className="w-8 h-8 rounded-lg object-cover" />
                <div className="bg-white/[0.06] p-3 rounded-xl flex items-center">
                  <Loader2 size={16} className="animate-spin text-accent" />
                </div>
              </div>
            )}
          </div>

          {/* Suggestions (Only show if few messages) */}
          {messages.length < 3 && (
            <div className="flex flex-col gap-2 mb-2">
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="suggestion-chip"
                  onClick={() => {
                    setInput(suggestion.text);
                    // Optional: auto-send
                  }}
                >
                  <span className="text-accent">{suggestion.icon}</span>
                  <span className="truncate">{suggestion.text}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Input */}
        <div className="p-4 border-t border-white/[0.06]">
          <div className="relative">
            <input
              type="text"
              placeholder="Ask EduMentor..."
              className="input-glass pr-12"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              disabled={loading}
            />
            <button
              onClick={handleSend}
              disabled={loading || !input.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg hover:bg-white/[0.06] transition-colors disabled:opacity-50"
            >
              <Send size={18} className="text-accent" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIMentorPanel;

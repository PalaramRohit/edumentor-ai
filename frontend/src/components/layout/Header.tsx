import { Home, Plus, Bell, Settings, Languages } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const Header = () => {
  const { language, setLanguage, t } = useLanguage();

  return (
    <header className="flex items-center justify-between py-4">
      {/* Breadcrumb */}
      <div className="flex items-center gap-3 text-foreground">
        <Home size={20} />
        <span className="text-lg font-semibold">{t('dashboard')}</span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        {/* Language Selection */}
        <div className="flex items-center gap-2 bg-white/5 rounded-lg px-2 py-1 border border-white/10">
          <Languages size={16} className="text-primary" />
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as any)}
            className="bg-transparent border-none text-sm focus:ring-0 cursor-pointer text-foreground"
          >
            <option value="en" className="bg-background">English</option>
            <option value="hi" className="bg-background">Hindi (हिन्दी)</option>
            <option value="te" className="bg-background">Telugu (తెలుగు)</option>
          </select>
        </div>

        <button className="icon-btn">
          <Plus size={20} className="text-muted-foreground" />
        </button>
        <div className="w-9 h-9 rounded-full bg-gradient-primary flex items-center justify-center">
          <span className="text-sm font-semibold text-white">R</span>
        </div>
        <button className="icon-btn">
          <Bell size={20} className="text-muted-foreground" />
        </button>
        <button className="icon-btn">
          <Settings size={20} className="text-muted-foreground" />
        </button>
      </div>
    </header>
  );
};

export default Header;

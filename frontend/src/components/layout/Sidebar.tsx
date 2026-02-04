import { NavLink } from 'react-router-dom';
import { Home, Map, FileText, BarChart3, User, History, LogOut, Rocket, Mic, MessageSquare } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';


const Sidebar = () => {
  const { t } = useLanguage();

  const navItems = [
    { icon: <Home size={20} />, label: t('dashboard'), path: '/' },
    { icon: <Map size={20} />, label: t('roadmap'), path: '/roadmap' },
    { icon: <FileText size={20} />, label: t('syllabus'), path: '/syllabus' },
    { icon: <BarChart3 size={20} />, label: t('analysis'), path: '/analysis' },
    { icon: <User size={20} />, label: t('profile'), path: '/profile' },
    { icon: <FileText size={20} />, label: t('resume'), path: '/resume' },
    { icon: <Rocket size={20} />, label: t('paper'), path: '/paper' },
    { icon: <History size={20} />, label: t('history'), path: '/history' },
    { icon: <div className="text-green-500"><Mic size={20} /></div>, label: t('interview'), path: '/interview' },
    { icon: <MessageSquare size={20} />, label: t('feedback'), path: '/feedback' },
  ];

  return (
    <aside className="sidebar-nav flex flex-col h-screen p-4">
      {/* Logo */}
      <div className="flex items-center gap-3 px-3 py-4 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center overflow-hidden">
          <img src="/lovable-logo.png" alt="EduMentor" className="w-full h-full object-cover" />
        </div>
        <span className="text-xl font-semibold text-foreground">EduMentor AI</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col gap-1">
        {navItems.map((item, index) => (
          <NavLink
            key={index}
            to={item.path}
            className={({ isActive }) =>
              `sidebar-item ${isActive ? 'active' : ''}`
            }
          >
            {item.icon}
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>



      {/* Logout */}
      <div className="sidebar-item text-muted-foreground hover:text-foreground">
        <LogOut size={20} />
        <span className="font-medium">Log Out</span>
      </div>
    </aside>
  );
};

export default Sidebar;

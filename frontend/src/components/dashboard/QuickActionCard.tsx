import { ChevronRight } from 'lucide-react';

interface QuickActionCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const QuickActionCard = ({ icon, title, description }: QuickActionCardProps) => {
  return (
    <div className="glass-card p-5 cursor-pointer hover:bg-white/[0.06] transition-all duration-200 group">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div className="text-muted-foreground">{icon}</div>
          <div>
            <h3 className="font-semibold text-foreground mb-1">{title}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
        <ChevronRight 
          size={20} 
          className="text-muted-foreground group-hover:text-accent transition-colors" 
        />
      </div>
    </div>
  );
};

export default QuickActionCard;

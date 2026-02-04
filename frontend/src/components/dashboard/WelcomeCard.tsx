import { User, Rocket } from 'lucide-react';
import ReadinessGauge from './ReadinessGauge';
import { useAuth } from '@/context/AuthContext';

const WelcomeCard = () => {
  const { user } = useAuth();

  if (!user) return null;

  // Default values if user properties are missing
  const displayName = user.name || "Learner";
  const displayRole = user.target_role || "Aspiring Developer";
  // Readiness score is not yet in the user object from AuthContext, assuming 0 for now or fetching it separately.
  // For now, we'll keep it static or use a placeholder until backend provides it.
  const readinessScore = 0;

  return (
    <div className="glass-card p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-foreground mb-1">Hello, {displayName}</h1>
          <h2 className="text-xl text-muted-foreground mb-6">{displayRole}</h2>

          {/* Role Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary/50 text-muted-foreground mb-6">
            <User size={16} />
            <span className="text-sm">Target Role: {displayRole}</span>
          </div>

          {/* Generate Button */}
          <button className="btn-primary flex items-center gap-2">
            <Rocket size={18} />
            <span>Generate New Roadmap</span>
          </button>

          <p className="text-sm text-muted-foreground mt-6 max-w-sm">
            You're at {readinessScore}% readiness – keep learning!
          </p>
        </div>

        {/* Readiness Gauge */}
        <div className="flex-shrink-0 ml-8">
          <ReadinessGauge percentage={readinessScore} />
        </div>
      </div>
    </div>
  );
};

export default WelcomeCard;

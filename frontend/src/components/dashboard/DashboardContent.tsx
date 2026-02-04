import { Map, BarChart3 } from 'lucide-react';
import Header from '../layout/Header';
import WelcomeCard from './WelcomeCard';
import QuickActionCard from './QuickActionCard';

const DashboardContent = () => {
  return (
    <main className="main-content">
      <Header />
      
      {/* Welcome Section */}
      <section className="mb-6">
        <WelcomeCard />
      </section>

      {/* Quick Actions */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <QuickActionCard
          icon={<Map size={22} />}
          title="Quick Roadmap"
          description="Click here to get a personalized learning roadmap."
        />
        <QuickActionCard
          icon={<BarChart3 size={22} />}
          title="Skill Gap Analysis"
          description="Understand your strong and weak skills."
        />
      </section>
    </main>
  );
};

export default DashboardContent;

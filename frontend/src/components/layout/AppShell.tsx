import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import AIMentorPanel from '../mentor/AIMentorPanel';

interface AppShellProps {
  children?: React.ReactNode;
}

const AppShell = ({ children }: AppShellProps) => {
  return (
    <div className="app-shell">
      <Sidebar />
      {children || <Outlet />}
      <AIMentorPanel />
    </div>
  );
};

export default AppShell;

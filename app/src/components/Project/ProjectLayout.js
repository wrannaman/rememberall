import LoggedInNav from '@/components/Nav/LoggedInNav';
import Tabs from '@/components/Project/Tabs';

export default function ProjectLayout({ children }) {
  return (
    <LoggedInNav name="Edit Project">
      <div className="max-w-4xl mx-auto">
        <Tabs />
        {children}
      </div>
    </LoggedInNav>
  );
}
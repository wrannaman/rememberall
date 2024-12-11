import { useRouter } from 'next/router';
import LoggedInNav from '@/components/Nav/LoggedInNav';
import Sources from '@/components/Project/Source/Sources';
import ProjectLayout from '@/components/Project/ProjectLayout';
export default function ProjectSources() {

  return (
    <ProjectLayout name="Edit Project">
      <div className="max-w-4xl mx-auto py-8">
        <Sources />
      </div>
    </ProjectLayout>
  );
}
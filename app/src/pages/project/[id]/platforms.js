import { useRouter } from 'next/router';
import LoggedInNav from '@/components/Nav/LoggedInNav';
import Platforms from '@/components/Project/Platform/Platform';
import ProjectLayout from '@/components/Project/ProjectLayout';

// Copy the same tabs array and basic structure, but render Platforms component
export default function ProjectPlatforms() {
  // ... similar setup to index.js ...

  return (
    <ProjectLayout name="Edit Project">
      <div className="max-w-4xl mx-auto py-8">
        <Platforms />
      </div>
    </ProjectLayout>
  );
}
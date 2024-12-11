import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useStore } from '@/store/use-store';
import { observer } from 'mobx-react-lite';
import { CheckIcon } from '@heroicons/react/20/solid';
import { toJS } from 'mobx';

const tabs = [
  { name: '📝 Details', href: '' },
  { name: '📚 Sources', href: 'sources' },
  { name: '🎯 Platforms', href: 'platforms' },
  { name: '💧 Drops', href: 'drops' },
];

function Tabs() {
  const router = useRouter();
  const { id } = router.query;
  const [isLoading, setIsLoading] = useState(true);
  const store = useStore();
  const { global: { token, update, platforms, project } } = store;

  useEffect(() => {
    if (id && token) {
      fetchProject();
    }
  }, [id, token]);

  const fetchProject = async () => {
    try {
      setIsLoading(true);
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API}/project/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (data) {
        update('sources', data.sources)
        update('platforms', data.platforms)
        update('project', data.project);
      }
    } catch (error) {
      console.error('Failed to fetch project');
    } finally {
      setIsLoading(false);
    }
  };

  const getSteps = () => {
    const steps = [];
    const platformOrder = ['ghost', 'linkedin', 'twitter', 'castos', 'youtube', 'tiktok'];

    // Add platforms in specific order if they are enabled
    platformOrder.forEach(platformType => {
      const platform = platforms.find(p => p.type === platformType && p.enabled);
      if (platform) {
        steps.push({
          name: platformType === 'ghost' ? 'Blog Post' :
            platformType === 'castos' ? 'Audio' :
              platformType.charAt(0).toUpperCase() + platformType.slice(1),
          platform: platformType
        });
      }
    });

    return steps;
  };

  return (
    <div>
      <div className="">
        <h4 className="sr-only">Publishing Flow</h4>
      </div>
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <Link
              key={tab.href}
              href={`/project/${id}${tab.href ? '/' + tab.href : ''}`}
              shallow={true}
              className={`whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium ${router.pathname === `/project/[id]${tab.href ? '/' + tab.href : ''}`
                ? 'border-rose-500 text-rose-600'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
            >
              {tab.name}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}

export default observer(Tabs);
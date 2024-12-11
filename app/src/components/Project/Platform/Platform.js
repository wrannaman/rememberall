import { useState } from 'react'
import { CheckCircleIcon } from '@heroicons/react/20/solid'
import PlatformEditModal from './PlatformEditModal'
import { observer } from 'mobx-react';
import { useStore } from '@/store/use-store';
import axios from 'axios';
const OAUTH_PLATFORMS = ['youtube', 'linkedin', 'twitter', 'tiktok', 'reddit', 'threads']
import { Switch, Field, Label, Description } from '@headlessui/react'

const getOAuthLink = async (provider, token, id) => {
  try {
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_API}/project-oauth/${provider}?ProjectId=${id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return data?.authUrl;
  } catch (error) {
    console.error(`Failed to get ${provider} OAuth link:`, error);
    throw new Error(`Failed to get ${provider} OAuth link`);
  }
};

const handleOAuthConnect = async (provider, token, id) => {
  try {
    const url = await getOAuthLink(provider, token, id);
    window.location.href = url;
  } catch (error) {
    throw new Error(`Failed to connect to ${provider}`, error);
  }
};

function Platforms({ }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { global: { platforms, update, token, project, } } = useStore();

  const handleEdit = (platform) => {
    update('platform', platform);
    setIsModalOpen(true);
  };

  const fetchProject = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API}/project/${project?.id}`,
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
      console.error('Failed to fetch project', error);
    }
  };

  const onSave = async () => {
    setIsModalOpen(false);
    await fetchProject();
    update('platform', { id: '', name: '', type: '', meta: {} });
  }

  const handleEnabledToggle = async (platformId, newState) => {
    console.log("newState:", newState)
    console.log("platformId:", platformId)
    try {
      const { data } = await axios.put(
        `${process.env.NEXT_PUBLIC_API}/platform/${platformId}`,
        { enabled: newState, ProjectId: project.id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("data:", data)

      if (data?.success) {
        // Update local state
        update('platforms', platforms.map(p =>
          p.id === platformId ? { ...p, enabled: newState } : p
        ));
      }
    } catch (error) {
      console.error('Error updating platform:', error);
      throw new Error('Failed to update platform status');
    }
  };

  const oauthPlatforms = platforms.filter(p => OAUTH_PLATFORMS.includes(p.type));
  const editablePlatforms = platforms.filter(p => !OAUTH_PLATFORMS.includes(p.type));

  return (
    <div className="bg-white shadow sm:rounded-lg p-6">
      <h2 className="text-base font-semibold leading-7 text-gray-900">Platforms</h2>
      <div className='flex flex-row flex-wrap gap-2 mt-4'>
        {OAUTH_PLATFORMS.map((platformType) => (
          <div key={platformType}>
            <button
              type="button"
              onClick={() => handleOAuthConnect(platformType, token, project.id)}
              className="rounded-md bg-rose-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-rose-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600"
            >
              Connect {platformType.charAt(0).toUpperCase() + platformType.slice(1)}
            </button>
          </div>
        ))}
      </div>
      {/* OAuth Platforms List */}
      <ul role="list" className="divide-y divide-gray-100 mt-4">
        {oauthPlatforms.map((platform) => (
          <li key={platform.id} className="flex justify-between gap-x-6 py-5">
            <div className="flex min-w-0 gap-x-4">
              <div className="size-12 flex-none rounded-full bg-gray-100 flex items-center justify-center">
                <span className="text-gray-500 text-sm">{platform.type[0].toUpperCase()}</span>
              </div>
              <div className="min-w-0 flex-auto">
                <p className="text-sm/6 font-semibold text-gray-900">
                  {platform.type.charAt(0).toUpperCase() + platform.type.slice(1)}
                </p>
                <p className="mt-1 truncate text-xs/5 text-gray-500">
                  {platform.meta?.email || platform.meta?.username || 'Connected Account'}
                </p>
              </div>
            </div>
            <div className="shrink-0 flex flex-col gap-y-4">
              <div className="flex items-center gap-x-2">
                {!OAUTH_PLATFORMS.includes(platform.type) && (
                  <button
                    type="button"
                    onClick={() => handleEdit(platform)}
                    className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                  >
                    Edit
                  </button>
                )}
                <div className="flex items-center gap-x-1">
                  <CheckCircleIcon className="h-5 w-5 text-green-500" />
                  <span className="text-sm text-gray-500">Connected</span>
                </div>
              </div>
              <Field className="flex items-center justify-between">
                <Switch
                  checked={platform.enabled}
                  onChange={(newState) => handleEnabledToggle(platform.id, newState)}
                  className={`group relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full 
                    border-2 border-transparent transition-colors duration-200 ease-in-out 
                    focus:outline-none focus:ring-2 focus:ring-rose-600 focus:ring-offset-2
                    ${platform.enabled ? 'bg-rose-600' : 'bg-gray-200'}`}
                >
                  <span className="sr-only">
                    {platform.enabled ? 'Stop publishing' : 'Start publishing'}
                  </span>
                  <span
                    aria-hidden="true"
                    className="pointer-events-none inline-block size-5 transform rounded-full 
                      bg-white shadow ring-0 transition duration-200 ease-in-out 
                      group-data-[checked]:translate-x-5"
                  >
                    <span
                      aria-hidden="true"
                      className="absolute inset-0 flex size-full items-center justify-center 
                        transition-opacity duration-200 ease-in 
                        group-data-[checked]:opacity-0 group-data-[checked]:duration-100"
                    >
                      <svg fill="none" viewBox="0 0 12 12" className="size-3 text-gray-400">
                        <path
                          d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2"
                          stroke="currentColor"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                    <span
                      aria-hidden="true"
                      className="absolute inset-0 flex size-full items-center justify-center 
                        opacity-0 transition-opacity duration-100 ease-out 
                        group-data-[checked]:opacity-100 group-data-[checked]:duration-200"
                    >
                      <svg fill="currentColor" viewBox="0 0 12 12" className="size-3 text-rose-600">
                        <path d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z" />
                      </svg>
                    </span>
                  </span>
                </Switch>
                <span className="flex grow flex-col">
                  <Label as="span" passive className="text-sm/6 font-medium text-gray-900 pl-2">
                    Publish
                  </Label>
                </span>
              </Field>
            </div>
          </li>
        ))}

        {/* Editable Platforms List */}
        {editablePlatforms.map((platform) => (
          <li key={platform.id} className="flex justify-between gap-x-6 py-5">
            <div className="flex min-w-0 gap-x-4">
              <div className="size-12 flex-none rounded-full bg-gray-100 flex items-center justify-center">
                <span className="text-gray-500 text-sm">{platform.name[0].toUpperCase()}</span>
              </div>
              <div className="min-w-0 flex-auto">
                <p className="text-sm/6 font-semibold text-gray-900">{platform.name}</p>
                <p className="mt-1 truncate text-xs/5 text-gray-500">
                  {platform.meta?.email || platform.meta?.username || 'Connected Account'}
                </p>
              </div>
            </div>
            <div className="shrink-0 flex flex-col gap-y-4">
              <div className="flex items-center gap-x-2">
                {!OAUTH_PLATFORMS.includes(platform.type) && (
                  <button
                    type="button"
                    onClick={() => handleEdit(platform)}
                    className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                  >
                    Edit
                  </button>
                )}

              </div>
              <Field className="flex items-center justify-between">

                <Switch
                  checked={platform.enabled}
                  onChange={(newState) => handleEnabledToggle(platform.id, newState)}
                  className={`group relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full 
                    border-2 border-transparent transition-colors duration-200 ease-in-out 
                    focus:outline-none focus:ring-2 focus:ring-rose-600 focus:ring-offset-2
                    ${platform.enabled ? 'bg-rose-600' : 'bg-gray-200'}`}
                >
                  <span className="sr-only">
                    {platform.enabled ? 'Stop publishing' : 'Start publishing'}
                  </span>
                  <span
                    aria-hidden="true"
                    className="pointer-events-none inline-block size-5 transform rounded-full 
                      bg-white shadow ring-0 transition duration-200 ease-in-out 
                      group-data-[checked]:translate-x-5"
                  >
                    <span
                      aria-hidden="true"
                      className="absolute inset-0 flex size-full items-center justify-center 
                        transition-opacity duration-200 ease-in 
                        group-data-[checked]:opacity-0 group-data-[checked]:duration-100"
                    >
                      <svg fill="none" viewBox="0 0 12 12" className="size-3 text-gray-400">
                        <path
                          d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2"
                          stroke="currentColor"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                    <span
                      aria-hidden="true"
                      className="absolute inset-0 flex size-full items-center justify-center 
                        opacity-0 transition-opacity duration-100 ease-out 
                        group-data-[checked]:opacity-100 group-data-[checked]:duration-200"
                    >
                      <svg fill="currentColor" viewBox="0 0 12 12" className="size-3 text-rose-600">
                        <path d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z" />
                      </svg>
                    </span>
                  </span>
                </Switch>
                <span className="flex grow flex-col">
                  <Label as="span" passive className="text-sm/6 font-medium text-gray-900 pl-2">
                    Publish
                  </Label>
                </span>
              </Field>
            </div>
          </li>
        ))}
      </ul>

      {/* Edit Modal */}
      <PlatformEditModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={onSave}
      />
    </div>
  )
}

export default observer(Platforms)
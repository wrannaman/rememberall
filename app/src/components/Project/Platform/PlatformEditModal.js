import { useState } from 'react';
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import { PLATFORM_TYPES } from '@/lib/models';
import { observer } from 'mobx-react';
import { useStore } from '@/store/use-store';
import axios from 'axios';
import { Switch } from '@headlessui/react';

const GHOST_FIELDS = [
  { key: 'url', label: 'Blog URL', type: 'text' },
  { key: 'adminKey', label: 'Admin API Key', type: 'text' },
  { key: 'contentKey', label: 'Content API Key', type: 'text' },
  { key: 'autoPublishNewsletter', label: 'Auto Publish Newsletter', type: 'switch' },
];

const CASTOS_FIELDS = [
  { key: 'image', label: 'Podcast Image URL', type: 'text' },
  { key: 'intro', label: 'Podcast Intro', type: 'textarea' },
  { key: 'outro', label: 'Podcast Outro', type: 'textarea' },
  { key: 'api_key', label: 'API Key', type: 'text' },
  { key: 'podcast_id', label: 'Podcast ID (In Castos)', type: 'text' },
  { key: 'podcast_name', label: 'Podcast Name (In Castos)', type: 'text' },
];

function PlatformEditModal({ isOpen, onClose, onSave }) {
  const { global: { platform, update, token, _alert } } = useStore();

  const handleMetaChange = (field, value) => {
    update('platform', {
      ...platform,
      meta: { ...platform.meta, [field]: value }
    });
  };

  const handleNameChange = (value) => {
    update('platform', {
      ...platform,
      name: value
    });
  };

  const handleTypeChange = (value) => {
    update('platform', {
      ...platform,
      type: value,
      meta: {} // Reset meta when type changes
    });
  };

  const renderMetaFields = () => {
    switch (platform.type) {
      case 'ghost':
        return GHOST_FIELDS.map(field => (
          <div key={field.key}>
            <label className="block text-sm/6 text-gray-500">{field.label}</label>
            {field.type === 'switch' ? (
              <Switch
                checked={platform.meta?.[field.key] || false}
                onChange={(checked) => handleMetaChange(field.key, checked)}
                className={`${platform.meta?.[field.key] ? 'bg-rose-600' : 'bg-gray-200'
                  } relative inline-flex h-6 w-11 items-center rounded-full mt-1`}
              >
                <span className="sr-only">{field.label}</span>
                <span
                  className={`${platform.meta?.[field.key] ? 'translate-x-6' : 'translate-x-1'
                    } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                />
              </Switch>
            ) : (
              <input
                type={field.type}
                value={platform.meta?.[field.key] || ''}
                onChange={(e) => handleMetaChange(field.key, e.target.value)}
                className="mt-1 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-rose-600 sm:text-sm/6"
              />
            )}
          </div>
        ));

      case 'castos':
        return CASTOS_FIELDS.map(field => (
          <div key={field.key}>
            <label className="block text-sm/6 text-gray-500">{field.label}</label>
            {field.type === 'textarea' ? (
              <textarea
                value={platform.meta?.[field.key] || ''}
                onChange={(e) => handleMetaChange(field.key, e.target.value)}
                rows={4}
                className="mt-1 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-rose-600 sm:text-sm/6 font-mono"
              />
            ) : (
              <input
                type={field.type}
                value={platform.meta?.[field.key] || ''}
                onChange={(e) => handleMetaChange(field.key, e.target.value)}
                className="mt-1 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-rose-600 sm:text-sm/6"
              />
            )}
          </div>
        ));

      default:
        return null;
    }
  };

  const save = async () => {
    try {
      const { data } = await axios.put(
        `${process.env.NEXT_PUBLIC_API}/platform/${platform.id}`,
        platform,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("save platformdata:", data)
      if (data?.success) {
        _alert('Platform updated successfully', 'success')
        onSave()
      }
    } catch (error) {
      console.error("Error updating platform:", error)
    }
  }

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-10">
      <DialogBackdrop className="fixed inset-0 bg-gray-500/75" />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl sm:my-8 sm:w-full sm:max-w-2xl sm:p-6">
            <DialogTitle as="h3" className="text-base font-semibold text-gray-900">
              Edit Platform
            </DialogTitle>

            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-sm/6 font-medium text-gray-900">Platform Name</label>
                <input
                  type="text"
                  value={platform.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-rose-600 sm:text-sm/6"
                />
              </div>

              <div>
                <label className="block text-sm/6 font-medium text-gray-900">Type</label>
                <select
                  value={platform.type}
                  onChange={(e) => handleTypeChange(e.target.value)}
                  className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-rose-600 sm:text-sm/6"
                >
                  {PLATFORM_TYPES.filter(type => !['youtube', 'linkedin', 'twitter', 'tiktok'].includes(type)).map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-4">
                {renderMetaFields()}
              </div>

              <div className="mt-6 flex justify-end gap-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={save}
                  className="rounded-md bg-rose-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-rose-500"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}

export default observer(PlatformEditModal)
import { useState } from 'react';
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import { SOURCE_TYPES } from '@/lib/models';

export default function SourceEditModal({ source, handleChange, handleMetaChange, onDelete, isOpen, onClose, onSave }) {

  const renderMetaFields = () => {
    switch (source.type) {
      case 'castos':
        return (
          <div className="space-y-4">
            <div>
              <label className="label">
                <span className="label-text">Podcast Name</span>
              </label>
              <input
                type="text"
                value={source.meta?.podcast_name || ''}
                onChange={(e) => handleMetaChange('podcast_name', e.target.value)}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-rose-600 sm:text-sm/6"
              />
            </div>
            {/* ... other Castos fields ... */}
          </div>
        );

      case 'website':
        return (
          <div className="space-y-4">
            <div>
              <label className="label">
                <span className="label-text">Source Type</span>
              </label>
              <select
                value={source.meta?.url ? 'url' : 'rss'}
                onChange={(e) => {
                  const newMeta = {};
                  if (e.target.value === 'url') {
                    newMeta.url = '';
                  } else {
                    newMeta.rss = '';
                  }
                  handleChange('meta', newMeta);
                }}
                className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-rose-600 sm:text-sm/6"
              >
                <option value="url">Direct Website URL</option>
                <option value="rss">RSS Feed</option>
              </select>
            </div>

            {source.meta?.url !== undefined ? (
              <div>
                <label className="label">
                  <span className="label-text">Website URL</span>
                </label>
                <input
                  type="url"
                  value={source.meta?.url || ''}
                  onChange={(e) => handleMetaChange('url', e.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-rose-600 sm:text-sm/6"
                  placeholder="https://example.com"
                />
              </div>
            ) : (
              <div>
                <label className="label">
                  <span className="label-text">RSS Feed URL</span>
                </label>
                <input
                  type="url"
                  value={source.meta?.rss || ''}
                  onChange={(e) => handleMetaChange('rss', e.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-rose-600 sm:text-sm/6"
                  placeholder="https://example.com/feed.xml"
                />
              </div>
            )}
          </div>
        );

      case 'newsletter':
        return (
          <div>
            <label className="label">
              <span className="label-text">RSS Feed URL</span>
            </label>
            <input
              type="url"
              value={source.meta?.rss || ''}
              onChange={(e) => handleMetaChange('rss', e.target.value)}
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-rose-600 sm:text-sm/6"
              placeholder="https://newsletter.example.com/feed"
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-10">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500/75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
      />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel
            transition
            className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-2xl sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
          >
            <DialogTitle as="h3" className="text-base font-semibold text-gray-900">
              Edit Source
            </DialogTitle>

            <div className="mt-4 space-y-4">
              <div>
                <label htmlFor="source-name" className="block text-sm/6 font-medium text-gray-900">
                  Source Name
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    id="source-name"
                    value={source.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-rose-600 sm:text-sm/6"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="source-type" className="block text-sm/6 font-medium text-gray-900">
                  Type
                </label>
                <select
                  id="source-type"
                  value={source.type}
                  onChange={(e) => {
                    const newType = e.target.value;
                    const newMeta = {};

                    // Set default meta values based on type
                    if (newType === 'website') {
                      newMeta.url = ''; // Default to URL type
                    } else if (newType === 'newsletter') {
                      newMeta.rss = '';
                    } else if (newType === 'castos') {
                      newMeta.podcast_name = '';
                    }

                    handleChange('type', newType);
                    handleChange('meta', newMeta);
                  }}
                  className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-rose-600 sm:text-sm/6"
                >
                  <option disabled value="">Select source type</option>
                  {SOURCE_TYPES.map(type => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              {renderMetaFields()}

              <div className="mt-6 flex justify-end gap-x-3">
                {source.id && (
                  <button
                    type="button"
                    onClick={() => onDelete(source.id)}
                    className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                  >
                    Delete
                  </button>
                )}
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => onSave(source)}
                  className="rounded-md bg-rose-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-rose-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600"
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
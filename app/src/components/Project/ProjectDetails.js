import { observer } from 'mobx-react';
import { useStore } from '@/store/use-store';
import { InformationCircleIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/router'
import axios from 'axios'
import { useState, useEffect } from 'react';
import moment from 'moment-timezone';

const DAYS_OF_WEEK = [
  { id: 'monday', label: 'Monday' },
  { id: 'tuesday', label: 'Tuesday' },
  { id: 'wednesday', label: 'Wednesday' },
  { id: 'thursday', label: 'Thursday' },
  { id: 'friday', label: 'Friday' },
  { id: 'saturday', label: 'Saturday' },
  { id: 'sunday', label: 'Sunday' },
];

// Update this constant to include all prompt fields
const PROMPT_FIELDS = [
  {
    id: 'intro',
    label: 'Introduction',
    tooltip: 'Intro text that is static to include at the beginning of the newsletter.'
  },
  {
    id: 'outro',
    label: 'Conclusion',
    tooltip: 'Outro text that is static to include at the end of the newsletter.'
  },
  {
    id: 'persona',
    label: 'Persona',
    tooltip: 'Define the author\'s character and target audience.\n\nExample: "Write as a tech-savvy millennial speaking to small business owners interested in digital transformation."'
  },
  {
    id: 'content_filter',
    label: 'Content Filter',
    tooltip: 'Define any content filtering or specific topics to avoid.\n\nExample: "Exclude any political content or controversial topics."'
  },
  {
    id: 'newsletter',
    label: 'Newsletter Template',
    tooltip: 'Custom template or formatting instructions for the newsletter.\n\nExample: "Structure the content with three main sections: Industry News, Tips & Tricks, and Case Studies."'
  },
  {
    id: 'podcast',
    label: 'Podcast Script',
    tooltip: 'Template or guidelines for podcast script generation.\n\nExample: "Structure as: Introduction (2min), Main Topics (15min), Closing Thoughts (3min)."'
  }
];

function ProjectDetails({ handleProjectChange, onSave }) {
  const { global: { project, } } = useStore();

  // Generate time options in 30-minute intervals
  const timeOptions = [...Array(48)].map((_, i) => {
    const time = moment().startOf('day').add(i * 30, 'minutes');
    return {
      value: time.format('HH:mm'),
      label: time.format('h:mm A')
    };
  });

  // Get timezone options
  const [timezoneOptions] = useState(
    moment.tz.names().map(tz => ({
      value: tz,
      label: `${tz.replace(/_/g, ' ')} (${moment.tz(tz).format('z')})`
    }))
  );

  // Add this new handler specifically for checkboxes
  const handleDayChange = (e) => {
    const { name, checked } = e.target;
    // Extract the day from name (e.g., "schedule.days.monday" -> "monday")
    const day = name.split('.').pop();

    handleProjectChange({
      target: {
        name: name,
        type: 'checkbox',
        checked: checked,
        value: checked
      }
    });
  };

  useEffect(() => {
    if (!project.schedule) {
      handleProjectChange({
        target: {
          name: 'schedule',
          value: {
            time: '09:00',
            timeZone: 'America/New_York',
            days: {}
          }
        }
      });
    }

    // Initialize prompt fields if they don't exist
    if (!project.prompt) {
      handleProjectChange({
        target: {
          name: 'prompt',
          value: {
            intro: '',
            persona: '',
            outro: '',
            content_filter: '',
            newsletter: '',
            podcast: '',
          }
        }
      });
    }
  }, []);

  return (
    <div className="bg-white shadow sm:rounded-lg p-6">
      <div className="flex justify-between items-center">
        <h2 className="text-base font-semibold leading-7 text-gray-900">Project Details</h2>
      </div>
      {/* Project Fields */}
      <div className="space-y-4 mt-4">
        <div className="space-y-4 mt-4">
          <div>
            <label htmlFor="name" className="block text-sm/6 font-medium text-gray-900">
              Project Name
            </label>
            <div className="mt-2">
              <input
                type="text"
                id="name"
                name="name"
                value={project.name}
                onChange={handleProjectChange}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-rose-600 sm:text-sm/6"
              />
            </div>
          </div>

          {/* <div>
            <label htmlFor="description" className="block text-sm/6 font-medium text-gray-900">
              Description
            </label>
            <div className="mt-2">
              <textarea
                id="description"
                name="description"
                value={project.description}
                onChange={handleProjectChange}
                rows={2}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-rose-600 sm:text-sm/6"
              />
            </div>
          </div> */}

          {/* Prompt Fields */}
          <div className="mt-8 border-t border-gray-200 pt-8">
            <h3 className="text-sm font-medium text-gray-900 mb-4">Prompt Configuration</h3>
            <div className="space-y-4">
              {PROMPT_FIELDS.map(({ id, label, tooltip }) => (
                <div key={id}>
                  <div className="flex items-center gap-2">
                    <label htmlFor={`prompt-${id}`} className="block text-sm/6 font-medium text-gray-900">
                      {label}
                    </label>
                    <div className="group relative">
                      <div className="cursor-help">
                        <InformationCircleIcon className="h-4 w-4 text-gray-500" />
                      </div>
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-72 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-lg z-50">
                        {tooltip}
                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-2">
                    <textarea
                      id={`prompt-${id}`}
                      name={`prompt.${id}`}
                      value={project.prompt?.[id] || ''}
                      onChange={handleProjectChange}
                      rows={3}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-rose-600 sm:text-sm/6"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Schedule Fields */}
          <div className="mt-8 border-t border-gray-200 pt-8">
            <h3 className="text-sm font-medium text-gray-900 mb-4">Delivery Schedule</h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="schedule-time" className="block text-sm/6 font-medium text-gray-900">
                  Delivery Time
                </label>
                <div className="mt-2">
                  <select
                    id="schedule-time"
                    name="schedule.time"
                    value={project.schedule?.time || '09:00'}
                    onChange={handleProjectChange}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-rose-600 sm:text-sm/6"
                  >
                    {timeOptions.map(({ value, label }) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="schedule-timezone" className="block text-sm/6 font-medium text-gray-900">
                  Time Zone
                </label>
                <div className="mt-2">
                  <select
                    id="schedule-timezone"
                    name="schedule.timeZone"
                    value={project.schedule?.timeZone || 'America/New_York'}
                    onChange={handleProjectChange}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-rose-600 sm:text-sm/6"
                  >
                    {timezoneOptions.map(({ value, label }) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <fieldset className="mt-4">
              <legend className="text-sm font-medium text-gray-900">Delivery Days</legend>
              <div className="mt-2 space-y-2">
                {DAYS_OF_WEEK.map(({ id, label }) => (
                  <div key={id} className="relative flex items-start">
                    <div className="flex h-6 items-center">
                      <input
                        id={`schedule-${id}`}
                        name={`schedule.days.${id}`}
                        type="checkbox"
                        checked={project.schedule?.days?.[id] ?? false}
                        onChange={handleDayChange}
                        className="size-4 rounded border-gray-300 text-rose-600 focus:ring-rose-600"
                      />
                    </div>
                    <div className="ml-3 text-sm/6">
                      <label htmlFor={`schedule-${id}`} className="font-medium text-gray-900">
                        {label}
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </fieldset>
          </div>
        </div>
      </div>
    </div>
  );
}

export default observer(ProjectDetails)
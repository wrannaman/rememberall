import { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { useRouter } from 'next/router';
import { useStore } from '@/store/use-store';
import axios from 'axios';
import ProjectLayout from '@/components/Project/ProjectLayout';
import moment from 'moment';
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';

// Step type icons mapping
const stepIcons = {
  raw_text: '📝',
  newsletter: '📨',
  image: '🖼️',
  ghost: '👻',
  linkedin: '💼',
  audio: '🎧',
  castos: '🎙️',
  video: '🎬',
  youtube: '▶️',
  tiktok: '🎥',
  threads: '🧵',
  reddit: '🔥',
  twitter: '🐦',
};

const FAIL_TIMEOUT_MINUTES = 8;
const STEPS_REQUIRED = 9;

function ProjectEdit() {
  const router = useRouter();
  const { id } = router.query;
  const store = useStore();
  const { global: { token } } = store;
  const [drops, setDrops] = useState([]);
  const [selectedDrop, setSelectedDrop] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchDrops = async () => {
    const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API}/drops?ProjectId=${id}`, { headers: { Authorization: `Bearer ${token}` } });
    console.log("data:", JSON.stringify(data, null, 2))
    setDrops(data?.drops || []);
  }

  useEffect(() => {
    if (id && token) {
      fetchDrops();
    }
  }, [id, token]);

  const handleViewDrop = (drop) => {
    setSelectedDrop(drop);
    setIsModalOpen(true);
  };

  const isDropSuccessful = (drop) => {
    return drop.Steps.length >= STEPS_REQUIRED &&
      drop.Steps.every(step => step.success === true);
  };

  const getDropStatus = (drop) => {
    const minutesSinceCreation = moment().diff(moment(drop.createdAt), 'minutes');
    const isTimeout = minutesSinceCreation > FAIL_TIMEOUT_MINUTES;

    if (drop.Steps.length > 0 &&
      drop.Steps.length < STEPS_REQUIRED &&
      !isTimeout) {
      return {
        text: '⏳ In Progress',
        classes: 'text-yellow-700 bg-yellow-50 ring-yellow-600/20'
      };
    }

    return isDropSuccessful(drop)
      ? {
        text: '✨ Complete',
        classes: 'text-green-700 bg-green-50 ring-green-600/20'
      }
      : {
        text: '❌ Failed',
        classes: 'text-red-700 bg-red-50 ring-red-600/20'
      };
  };

  const getStepStats = (drop) => {
    const total = drop.Steps.length;
    const successful = drop.Steps.filter(step => step.success).length;
    return { total, successful };
  };

  return (
    <ProjectLayout name="Edit Project">
      <div className="max-w-4xl mx-auto py-8 pt-0 mt-2">
        <ul role="list" className="divide-y divide-gray-100">
          {drops.map((drop) => (
            <li key={drop.id} className="flex items-center justify-between gap-x-6 py-5">
              <div className="min-w-0">
                <div className="flex items-start gap-x-3">
                  <p className="text-sm font-semibold text-gray-900">{drop.name}</p>
                  <div className="flex gap-2">

                    {drop.Steps.length > 0 && (
                      <div className="flex items-center gap-1">
                        <p className={`mt-0.5 whitespace-nowrap rounded-md px-1.5 py-0.5 text-xs font-medium ring-1 ring-inset ${getDropStatus(drop).classes}`}>
                          {getDropStatus(drop).text}
                        </p>
                        <div className="flex gap-0.5 items-center">
                          {drop.Steps
                            .sort((a, b) => a.step_number - b.step_number)
                            .map((step, index) => (
                              <span
                                key={index}
                                className={`h-1.5 w-1.5 rounded-full ${step.success
                                  ? 'bg-green-500'
                                  : 'bg-red-500'
                                  }`}
                                title={`${step.name}: ${step.success ? 'Success' : 'Failed'}`}
                              />
                            ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="mt-1 text-xs text-gray-500">
                  Created on {moment(drop.createdAt).format('MMM Do, YYYY')}
                </div>
              </div>
              <button
                onClick={() => handleViewDrop(drop)}
                className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              >
                View Drop 🪄
              </button>
            </li>
          ))}
        </ul>

        <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} className="relative z-10">
          <DialogBackdrop className="fixed inset-0 bg-gray-500/75" />

          <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <DialogPanel className="relative transform overflow-hidden rounded-lg bg-white px-4 py-4 text-left shadow-xl w-full max-w-2xl">
                <DialogTitle as="h3" className="text-lg font-semibold leading-6 text-gray-900 mb-3">
                  {selectedDrop?.name} Steps
                </DialogTitle>

                <div className="space-y-2">
                  {selectedDrop?.Steps
                    .sort((a, b) => a.step_number - b.step_number)
                    .map((step) => (
                      <div
                        key={step.id}
                        className="flex items-center gap-4 p-2.5 rounded-lg border border-gray-200 hover:bg-gray-50"
                      >
                        <span className="text-2xl">{stepIcons[step.name] || '🔹'}</span>
                        <div className="flex-1">
                          <h4 className="font-medium capitalize">{step.name}</h4>
                          {step.link && (
                            <a
                              href={step.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-rose-600 hover:text-rose-800"
                            >
                              View →
                            </a>
                          )}
                        </div>
                        {step.success ? (
                          <span className="text-green-600">✅</span>
                        ) : (
                          <span className="text-red-600">❌</span>
                        )}
                      </div>
                    ))}
                </div>

                <div className="mt-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="w-full rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
                  >
                    Close
                  </button>
                </div>
              </DialogPanel>
            </div>
          </div>
        </Dialog>
      </div>
    </ProjectLayout>
  );
}

export default observer(ProjectEdit);

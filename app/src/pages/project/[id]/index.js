import { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { useRouter } from 'next/router';
import LoggedInNav from '@/components/Nav/LoggedInNav';
import { useStore } from '@/store/use-store';
import ProjectDetails from '@/components/Project/ProjectDetails';
import axios from 'axios';
import debounce from 'lodash/debounce';
import ProjectLayout from '@/components/Project/ProjectLayout';

function ProjectEdit() {
  const router = useRouter();
  const { id } = router.query;
  const store = useStore();
  const { global: { token, sources, _alert, project, platforms, update } } = store;
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleProjectChange = (e) => {
    const { name, value, type, checked } = e.target;
    const parts = name.split('.');

    const inputValue = type === 'checkbox' ? checked : value;

    const updatedProject = { ...project };

    if (name.startsWith('prompt.')) {
      const promptField = parts[1];
      updatedProject.prompt = {
        ...project.prompt,
        [promptField]: inputValue
      };
    }
    else if (name.startsWith('schedule.days.')) {
      const day = parts[2];
      updatedProject.schedule = {
        ...project.schedule,
        days: {
          ...project.schedule?.days,
          [day]: inputValue
        }
      };
    }
    else if (name.startsWith('schedule.')) {
      const scheduleField = parts[1];
      updatedProject.schedule = {
        ...project.schedule,
        [scheduleField]: inputValue
      };
    }
    else {
      updatedProject[name] = inputValue;
    }

    update('project', updatedProject);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const { data } = await axios.put(
        `${process.env.NEXT_PUBLIC_API}/project/${id}`,
        project,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      if (data?.success) {
        _alert('Project updated successfully', 'success')
      }

      // router.push('/dashboard');
    } catch (error) {
      setError('Failed to update project');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this project? This action cannot be undone.')) return

    try {
      const { data } = await axios.put(
        `${process.env.NEXT_PUBLIC_API}/project/${project.id}`,
        { deleted: true },
        { headers: { Authorization: `Bearer ${token}` } }
      )

      if (data?.success) {
        _alert('Project deleted successfully', 'success')
        router.push('/dashboard')
      }
    } catch (error) {
      console.error('Error deleting project:', error)
      _alert('Failed to delete project', 'error')
    }
  }

  return (
    <ProjectLayout name="Edit Project">
      <div className="max-w-4xl mx-auto py-8 pt-0 mt-2">
        <form onSubmit={handleSubmit} className="space-y-8">
          {error && (
            <div className="alert alert-error">{error}</div>
          )}

          {/* Remove tab conditional rendering since this page will only show Details */}
          <div className="">
            <ProjectDetails
              handleProjectChange={handleProjectChange}
              handleOAuthConnect={(provider) => handleOAuthConnect(provider, token, id)}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between mt-6">
            <div>
              <button
                onClick={handleDelete}
                className="inline-flex items-center rounded-md bg-red-100 px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-200"
              >
                Delete Project
              </button>
            </div>
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={isLoading}
                className="rounded-md bg-rose-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-rose-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600"
              >
                {isLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </ProjectLayout>
  );
}

export default observer(ProjectEdit)

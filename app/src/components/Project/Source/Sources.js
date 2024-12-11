import { useState } from 'react';
import SourceList from './SourceList';
import SourceEditModal from './SourceEditModal';
import { useStore } from '@/store/use-store';
import { observer } from 'mobx-react';
import axios from 'axios';

const defaultSource = {
  id: '',
  name: '',
  url: '',
  prompt: null,
  type: "website",
  meta: { url: '' },
  ProjectId: ''
}

function Sources() {
  const { global: { sources, update, project, token, _alert } } = useStore();
  const [editingSource, setEditingSource] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleEdit = (source) => {
    setEditingSource(source);
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

  const handleDelete = async (index) => {
    const source = sources[index]
    const { data } = await axios.delete(`${process.env.NEXT_PUBLIC_API}/source/${source.id}`, {
      headers: { Authorization: `Bearer ${token}` },
      data: { ProjectId: project.id }
    })
    if (data?.success) _alert('Source deleted successfully', 'success')
    update({ sources: sources.filter((_, i) => i !== index) })
    setEditingSource({ ...defaultSource, ProjectId: project.id })
    setIsModalOpen(false)
    fetchProject()
  }

  const handleSave = async (index, updatedSource) => {
    try {
      const method = updatedSource.id ? 'put' : 'post'
      const { data } = await axios[method](
        `${process.env.NEXT_PUBLIC_API}/source${method === 'put' ? `/${updatedSource.id}` : ''}`,
        { ...updatedSource, ProjectId: project.id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data?.success) _alert('Source updated successfully', 'success')
      setIsModalOpen(false);
      fetchProject()
    } catch (error) {
      console.error('Failed to update source:', error);
    }
  };

  const handleMetaChange = (field, value) => {
    // update the editingSource meta field
    setEditingSource(prev => ({
      ...prev,
      meta: { ...prev.meta, [field]: value }
    }));
  };

  const handleChange = (field, value) => {
    setEditingSource(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="p-4 bg-base-100 shadow">
      <div className="flex flex-col">
        <div className="flex justify-between">
          <h2 className="text-lg font-semibold">Sources</h2>
          <button
            className="rounded bg-rose-600 px-2 py-1 text-sm font-semibold text-white shadow-sm hover:bg-rose-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600"
            onClick={() => {
              setEditingSource({ ...defaultSource, ProjectId: project.id })
              setIsModalOpen(true)
            }}
          >
            Add Source
          </button>
        </div>

        <SourceList
          sources={sources}
          onEdit={handleEdit}
        />

        {
          editingSource && (
            <SourceEditModal
              source={editingSource}
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              handleMetaChange={handleMetaChange}
              handleChange={handleChange}
              onDelete={() => {
                const index = sources.findIndex(s => s.id === editingSource.id);
                handleDelete(index)
              }}
              onSave={(updatedSource) => {
                console.log("updatedSource:", updatedSource)
                const index = sources.findIndex(s => s.id === editingSource.id);
                handleSave(index, updatedSource);
              }}
            />
          )
        }
      </div >
    </div >
  );
}

export default observer(Sources)

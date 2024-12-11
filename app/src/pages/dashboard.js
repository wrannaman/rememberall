import LoggedInNav from '@/components/Nav/LoggedInNav'
import { useEffect, useState, Fragment, useMemo, useCallback } from 'react'
import { useRouter } from 'next/router'
import { observer } from 'mobx-react'
import dynamic from 'next/dynamic'
import { useStore } from '@/store/use-store'
import { toJS } from 'mobx'
import axios from 'axios'
import Link from 'next/link'
import { PlusIcon, XMarkIcon, EyeIcon, TrashIcon } from '@heroicons/react/24/solid'
import { Field, Label, Description, Switch, Dialog, Transition } from '@headlessui/react'
import { KeyIcon, ChevronDownIcon } from '@heroicons/react/24/outline'


function Dashboard() {
  const store = useStore()
  const { global: { user, token, update, _alert } } = store
  const [showApiKeyModal, setShowApiKeyModal] = useState(false)
  const [apiKey, setApiKey] = useState('')
  const [apiUrl, setApiUrl] = useState('')
  const [openaiModel, setOpenaiModel] = useState('')
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [memories, setMemories] = useState([])
  const [newMemory, setNewMemory] = useState('')
  const [selectedMemory, setSelectedMemory] = useState(null)
  const [showMemoryModal, setShowMemoryModal] = useState(false)

  // Set initial URL value only once when component mounts
  useEffect(() => {
    setApiUrl(user?.Org?.openai_url || 'https://api.openai.com/v1')
    setOpenaiModel(user?.Org?.openai_model || 'gpt-4o')
  }, [user?.Org?.openai_url, user?.Org?.openai_model])

  // Check for missing API key
  useEffect(() => {
    if (user?.Org && !user.Org.openai_api_key) {
      setShowApiKeyModal(true)
    }
  }, [user])

  // Fetch memories on component mount
  useEffect(() => {
    fetchMemories()
  }, [token])

  const fetchMemories = async () => {
    if (!token) return
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API}/memories`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      console.log("data:", data)
      setMemories(data.memories)
    } catch (error) {
      _alert('Failed to fetch memories', 'error')
    }
  }

  const saveMemory = async (e) => {
    e.preventDefault()
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API}/memory`,
        { memory: newMemory },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      _alert('Memory saved successfully', 'success')
      setNewMemory('')
      fetchMemories()
    } catch (error) {
      _alert('Failed to save memory', 'error')
    }
  }

  const forgetMemory = async (id) => {
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API}/memory/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      _alert('Memory forgotten successfully', 'success')
      fetchMemories()
    } catch (error) {
      _alert('Failed to forget memory', 'error')
    }
  }

  return (
    <LoggedInNav name="Dashboard">
      {/* API Key Display Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="w-full max-w-md mb-6">
          <p className='text-md pb-4'>
            Here's your API key. Keep this safe.
          </p>
          <div>
            <label htmlFor="apikey" className="block text-sm font-medium text-gray-900">
              API Key
            </label>
            <div className="mt-2 flex gap-2">
              <input
                id="apikey"
                name="apikey"
                type="text"
                className="pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
                value={user?.apikey?.slice(0, 17) + '...'}
                onChange={() => { }}
              />
              <button
                className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                onClick={() => {
                  navigator.clipboard.writeText(user?.apikey)
                  _alert('Copied API Key to clipboard', 'success')
                }}
              >
                Copy
              </button>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={showApiKeyModal} onClose={() => { }} className="relative z-50">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75" />
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100">
                <KeyIcon className="h-6 w-6 text-indigo-600" />
              </div>

              <Dialog.Title className="mt-3 text-center text-lg font-semibold leading-6 text-gray-900">
                Configure AI Settings
              </Dialog.Title>

              <p className="mt-2 text-center text-sm text-gray-500">
                To enable perfect memory for your AI conversations, we need your OpenAI API key.
              </p>

              <form onSubmit={async (e) => {
                e.preventDefault()
                try {
                  const { data } = await axios.post(
                    `${process.env.NEXT_PUBLIC_API}/org`,
                    { openai_api_key: apiKey, openai_url: apiUrl, openai_model: openaiModel },
                    { headers: { Authorization: `Bearer ${token}` } }
                  )
                  if (data?.success) {
                    update('org', { ...user.org, openai_api_key: apiKey, openai_url: apiUrl, openai_model: openaiModel })
                    _alert('Settings saved successfully', 'success')
                    setShowApiKeyModal(false)
                  }
                } catch (error) {
                  console.error(error)
                  _alert(error.response?.data?.message || 'Failed to save API key', 'error')
                }
              }}>
                <input
                  type="password"
                  value={apiKey}
                  onChange={e => setApiKey(e.target.value)}
                  placeholder="OpenAI API Key"
                  className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />

                <button
                  type="button"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="mt-4 text-sm text-gray-600"
                >
                  Advanced Settings
                </button>

                {showAdvanced && (
                  <>
                    <input
                      type="url"
                      value={apiUrl}
                      onChange={e => setApiUrl(e.target.value)}
                      placeholder="API URL"
                      className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                    <input
                      type="text"
                      value={openaiModel}
                      onChange={e => setOpenaiModel(e.target.value)}
                      placeholder="OpenAI Model"
                      className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </>
                )}

                <button
                  type="submit"
                  className="mt-4 w-full rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Save Settings
                </button>
              </form>
            </Dialog.Panel>
          </div>
        </div>
      </Dialog>

      {/* New Memory Input Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <form onSubmit={saveMemory} className="space-y-4">
          <textarea
            value={newMemory}
            onChange={(e) => setNewMemory(e.target.value)}
            placeholder="Enter a new memory..."
            className="w-full h-32 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Save Memory
          </button>
        </form>

        {/* Memories Table */}
        <div className="mt-8">
          <table className="min-w-full divide-y divide-gray-300">
            <thead>
              <tr>
                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Memory</th>
                <th className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {memories.map((memory) => (
                <tr key={memory.id}>
                  <td className="px-3 py-4 text-sm text-gray-500">
                    {memory.memory.substring(0, 100)}...
                  </td>
                  <td className="px-3 py-4 text-right text-sm">
                    <button
                      onClick={() => {
                        setSelectedMemory(memory)
                        setShowMemoryModal(true)
                      }}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      <EyeIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => forgetMemory(memory.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Memory Modal */}
      <Dialog open={showMemoryModal} onClose={() => setShowMemoryModal(false)} className="relative z-50">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75" />
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6">
              <div className="flex justify-between items-start">
                <Dialog.Title className="text-lg font-semibold text-gray-900">
                  Memory Details
                </Dialog.Title>
                <button
                  onClick={() => setShowMemoryModal(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
              <div className="mt-4">
                <p className="text-sm text-gray-500 whitespace-pre-wrap">
                  {selectedMemory?.memory}
                </p>
              </div>
            </Dialog.Panel>
          </div>
        </div>
      </Dialog>
    </LoggedInNav>
  )
}
export default observer(Dashboard)
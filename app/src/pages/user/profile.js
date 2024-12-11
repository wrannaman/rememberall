import LoggedInNav from '@/components/Nav/LoggedInNav'
import { useRouter } from 'next/router'
import { observer } from 'mobx-react'
import { useStore } from '@/store/use-store'
import axios from 'axios'
import { useState, useEffect } from 'react'

function Profile() {
  const router = useRouter()
  const store = useStore()
  const { global: { user, token, update, _alert } } = store

  // Add new state variables
  const [apiKey, setApiKey] = useState('')
  const [apiUrl, setApiUrl] = useState('')
  const [openaiModel, setOpenaiModel] = useState('')

  // Initialize values from user data
  useEffect(() => {
    setApiUrl(user?.Org?.openai_url || 'https://api.openai.com/v1')
    setOpenaiModel(user?.Org?.openai_model || 'gpt-4-turbo-preview')
    setApiKey(user?.Org?.openai_api_key || '')
  }, [user?.org])

  // Add save settings function
  const saveSettings = async (e) => {
    e.preventDefault()
    try {
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_API}/org`,
        {
          openai_api_key: apiKey,
          openai_url: apiUrl,
          openai_model: openaiModel
        },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      if (data?.success) {
        update('org', { ...user.org, openai_api_key: apiKey, openai_url: apiUrl, openai_model: openaiModel })
        _alert('Settings saved successfully', 'success')
      }
    } catch (error) {
      console.error(error)
      _alert(error.response?.data?.message || 'Failed to save settings', 'error')
    }
  }

  const rotateApiKey = async () => {
    const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API}/user/rotateApiKey`, {
      email: user?.email,
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    update('user', data?.user)
    console.log("data:", data?.user?.apikey)
    // copy to clipboard 
    navigator.clipboard.writeText(data?.user?.apikey)
    _alert('Api Key rotated and copied to clipboard', 'success')
  }

  return <LoggedInNav name="Profile">
    <div className="flex flex-col justify-center items-center space-y-8">
      {/* Existing API Key section */}
      <div className="w-full max-w-md">
        <p className='text-md pb-4'>
          Here's your api key.
          Keep this safe.
        </p>
        <div>
          <label htmlFor="apikey" className="block text-sm/6 font-medium text-gray-900">
            API Key
          </label>
          <div className="mt-2 flex gap-2">
            <input
              id="apikey"
              name="apikey"
              type="text"
              className="pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-rose-600 sm:text-sm/6"
              value={user?.apikey?.slice(0, 17) + '...'}
              onChange={() => { }}
            />
            <button
              className="rounded-md bg-rose-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-rose-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600"
              onClick={() => {
                navigator.clipboard.writeText(user?.apikey)
                _alert('Copied API Key to clipboard', 'success')
              }}
            >
              Copy
            </button>
            <button
              className="rounded-md bg-rose-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-rose-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600"
              onClick={rotateApiKey}
            >
              Rotate
            </button>
          </div>
        </div>
      </div>

      {/* New OpenAI Settings section */}
      <div className="w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4">OpenAI Settings</h2>
        <form onSubmit={saveSettings} className="space-y-4">
          <div>
            <label htmlFor="openai_api_key" className="block text-sm font-medium text-gray-900">
              OpenAI API Key
            </label>
            <input
              type="password"
              id="openai_api_key"
              value={apiKey}
              onChange={e => setApiKey(e.target.value)}
              className="mt-1 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-rose-600 sm:text-sm/6"
              placeholder="sk-..."
            />
          </div>

          <div>
            <label htmlFor="openai_url" className="block text-sm font-medium text-gray-900">
              API URL
            </label>
            <input
              type="url"
              id="openai_url"
              value={apiUrl}
              onChange={e => setApiUrl(e.target.value)}
              className="mt-1 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-rose-600 sm:text-sm/6"
            />
          </div>

          <div>
            <label htmlFor="openai_model" className="block text-sm font-medium text-gray-900">
              OpenAI Model
            </label>
            <input
              type="text"
              id="openai_model"
              value={openaiModel}
              onChange={e => setOpenaiModel(e.target.value)}
              className="mt-1 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-rose-600 sm:text-sm/6"
              placeholder="gpt-4-turbo-preview"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-md bg-rose-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-rose-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600"
          >
            Save Settings
          </button>
        </form>
      </div>
    </div>
  </LoggedInNav>
}

export default observer(Profile)
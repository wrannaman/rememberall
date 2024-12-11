import { useStore } from '@/store/use-store'
export default function Code({ code, apikey }) {
  const store = useStore()
  const { global: { _alert } } = store
  return (
    <div className="mockup-code mt-4 mb-4">
      <pre data-prefix="$">
        <code>
          {code}
        </code>
      </pre>
      <button
        className='rounded bg-rose-600 px-2 py-1 text-sm font-semibold text-white shadow-sm hover:bg-rose-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600  pl-8 float-right'
        onClick={() => {
          navigator.clipboard.writeText(code.replace('<API_KEY>', apikey))
          _alert('Copied to clipboard')
        }}
      >
        copy
      </button>
    </div>
  )
}
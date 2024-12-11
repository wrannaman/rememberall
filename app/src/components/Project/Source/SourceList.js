export default function SourceList({ sources, onEdit }) {
  return (
    <ul role="list" className="divide-y divide-gray-100">
      {sources.map((source) => (
        <li key={source.id} className="flex justify-between gap-x-6 py-5">
          <div className="flex min-w-0 gap-x-4">
            <div className="size-6 mt-3 flex-none rounded-full bg-gray-100 flex items-center justify-center">
              <span className="text-gray-500 text-sm">{source.name[0]}</span>
            </div>
            <div className="min-w-0 flex-auto">
              <p className="text-sm/6 font-semibold text-gray-900">{source.name}</p>
              <p className="mt-1 truncate text-xs/5 text-gray-500">{source.type}</p>
            </div>
          </div>
          <div className="shrink-0 flex items-center">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onEdit(source);
              }}
              className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            >
              Edit
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
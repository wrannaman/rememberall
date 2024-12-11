

import { observer } from 'mobx-react'
import { useStore } from '@/store/use-store'
import { useEffect, useState } from 'react'
import { toJS } from 'mobx'
import axios from 'axios'
import moment from 'moment'
import { CheckCircleIcon } from '@heroicons/react/24/outline'

function Syncs() {
  const store = useStore()
  const { global: { token, syncs, update, _alert, } } = store
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    fetchSyncs()
  }, [token])
  const fetchSyncs = async () => {
    if (!token) return
    setLoading(true)
    const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API}/user/syncs`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    update('syncs', data?.syncs)
    setLoading(false)
  }
  return (
    <div className="overflow-x-auto">
      <h1 className='text-2xl font-bold pb-4'>
        Syncs
      </h1>
      <table className="table">
        <thead>
          <tr>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {/* row 1 */}
          {syncs.map(s => (
            <tr key={s.id}>
              <th className='flex'> <CheckCircleIcon className="text-rose-500 w-5 h-5 mr-4" /> {moment(s.date).format('MM/DD/YY hh:mm A')}</th>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}


export default observer(Syncs)
import React, { Component, Fragment, useRef } from 'react';
import { observer } from "mobx-react";
import { toJS } from 'mobx'
import moment from 'moment'
import axios from 'axios'
import LoggedInNav from '@/components/Nav/LoggedInNav';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

const findTeamName = (teams, id) => {
  return teams.find(team => team?.id === id)?.name
}

const DATATYPES = ['weight', 'steps', 'bloodpressure', 'activitysummary', 'heartrate', 'sleep', 'vo2', 'height']

class DataExplorer extends Component {

  constructor(props) {
    super(props)
    this.state = {
      types: DATATYPES,
      type: 'steps',
      limit: 10,
      offset: 0,
      count: 0
    };
  }

  componentDidMount() {
    const interval = setInterval(() => {
      const { global: { update, user, token } } = this.props.store
      if (!token) return
      clearInterval(interval)
      this.init()
    }, 100)
  }

  fetchData = async () => {
    const { global: { update, user, token } } = this.props.store
    const { limit, offset, type, } = this.state

    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_API}/data/${encodeURIComponent(type)}?limit=${encodeURIComponent(limit)}&offset=${encodeURIComponent(offset)}&interval=raw`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );


    if (data.success && Array.isArray(data.data)) {
      const clean = data.data.map(d => {
        const clone = toJS(d)
        delete clone.id
        delete clone.userId
        clone.date = moment(clone.date).format('MM/DD/YY hh:mm a')
        return clone
      })
      update('data', clean)
      this.setState({ count: data.totalRecords })
    }
    this.setState({ loading: false })
  }

  init = async () => {
    const { admin } = this.props
    const { global: { update, apps, user, org } } = this.props.store
    // if (apps.length > 0) return this.setState({ loading: false })
    await this.fetchData()
    this.setState({ loading: false })
  }


  change = (key) => (e) => {
    const { global: { update, app } } = this.props.store
    const clone = toJS(app);
    clone[key] = e.target.value
    if (key === 'type') clone[key] = Number(e.target.value)
    update('app', clone)
  }

  onSubmit = async (e) => {
    e.preventDefault()
    const { global: { app, analytics, user, _alert, apps } } = this.props.store
    if (this.state.loading) return _alert('Please wait...', 'warning')
    this.setState({ loading: true })
    const isFirstApp = _.isEmpty(apps);

    if (!app.type) {
      this.setState({ loading: false })
      return _alert('please select type', 'error')
    }

    const TeamId = localStorage.getItem('@MONSTER_TEAM')
    const res = await api.create(`auto/app`, { ...app, variant: app.type === 1 ? 'linkedin' : 'twitter', TeamId })
    if (res.success) {
      this.init();
      this.close({ throwConfetti: isFirstApp }); // to throw confetti on creating first sender
      _alert('App Updated!');
    } else {
      _alert(res.error || 'Something went wrong', 'error');
    }
    this.setState({ loading: false })
  }

  close = (opts = {}) => {
    const updateOpts = { throwConfetti: !!opts?.throwConfetti, isAppModalOpen: false };
    const { global: { update } } = this.props.store
    this.setState(updateOpts, () => {
      setTimeout(() => {
        update('app', {})
      }, 300)
    })
  }

  delete = (appId) => async (e) => {
    const { global: { _alert } } = this.props.store
    const TeamId = localStorage.getItem('@MONSTER_TEAM')
    const res = await api.del(`auto/app/${appId}`, { TeamId })
    if (res.success) {
      _alert('App Deleted!');
      this.init()
    } else {
      _alert(res.error || 'Something went wrong', 'error');
    }
  }

  select = (id) => (e) => {
    const { global: { update } } = this.props.store
    update('app', id)
    this.setState({ isAppModalOpen: true })
  }

  getExpires = (id) => {
    if (!id || !app.creds) return 'unknown'
    if (app?.creds?.cookie) {
      const expires = app.creds.cookie.expires
      return moment(expires * 1000).format('MMM Do YYYY, hh:mm:ss a')
    }
    return 'unknown'
  }

  changeTeams = (id, idx) => async (e, a) => {
    console.log('yes change teams for:', id, e, a);
    const { global: { _alert } } = this.props.store
    const res = await api.update(`auto/app/${id}`, { AppId: id, TeamId: e })
    if (res.success) _alert('App Updated!');
    else _alert(res.error || 'Something went wrong', 'error');
    this.init()
  }



  toggleLinkedinModal = () => {
    const { linkedinModalOpen } = this.state
    this.setState({ linkedinModalOpen: !linkedinModalOpen })
  }

  page = (dir) => async (e) => {
    if (this.state.loading) return
    const { limit, offset, count } = this.state
    if (dir === -1) {
      this.setState({ offset: offset - limit < 0 ? 0 : offset - limit, loading: true }, () => {
        this.fetchData()
      })
    } else {
      this.setState({ offset: offset + limit > count ? offset : offset + limit, loading: true }, () => {
        this.fetchData()
      })
    }

  }

  render() {
    const { type, limit, offset, count } = this.state
    const { global: { user, data } } = this.props.store;
    let keys = []
    if (data.length > 0) {
      keys = Object.keys(data[0])
    }
    return (
      <LoggedInNav>
        <div className=" ">
          <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
              <h1 className="text-xl font-semibold">Data</h1>
              <div className='flex flex-row justify-start items-center gap-4'>
                <p className="mt-2 text-sm text-slate-700 ">
                  Data Explorer
                </p>
                <select
                  className="select select-bordered w-full max-w-xs"
                  onChange={(e) => this.setState({ type: e.target.value, offset: 0, }, () => this.fetchData())}
                  value={type}
                >
                  <option disabled selected>Pick your data type</option>
                  {DATATYPES.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}

                </select>
              </div>


            </div>
          </div>
          {data?.length === 0 && (
            <div className="pt-8">
              <button
                type="button"
                className="relative block w-full rounded-lg border-2 border-dashed border-slate-300 p-12 text-center hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <span className="mt-2 block text-sm font-medium  ">No data Yet!</span>
              </button>
            </div>
          )}
          {data?.length > 0 && (
            <div className="mt-8 flex flex-col">
              <div className="-my-2 -mx-4 sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8 ">
                  <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg ">
                    <table className="min-w-full divide-y">
                      <thead>
                        <tr>
                          {keys.filter(k => !['updatedAt', 'createdAt'].includes(k)).map((key, index) => (
                            <th
                              key={index}
                              scope="col"
                              className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold sm:pl-6"
                            >
                              {key}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {data.map((app, index) => (
                          <tr key={JSON.stringify(app)} className="relative">
                            {keys.filter(k => !['updatedAt', 'createdAt'].includes(k)).map((key, index) => (
                              <td
                                key={app[key] + String(index)}
                                className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6"
                              >
                                <div className="flex items-center">
                                  <div className="ml-4">
                                    <div className="font-medium">
                                      {key === 'date' && moment(app[key]).format('MM/DD/YY hh:mm A')}
                                      {key !== 'date' && app[key]}
                                    </div>
                                  </div>
                                </div>
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <nav
                    className="flex items-center justify-between  px-4 py-3 sm:px-6"
                    aria-label="Pagination"
                  >
                    <div className="hidden sm:block">
                      <p className="text-sm ">
                        Showing <span className="font-medium">{offset + 1}</span> {' '}
                        to <span className="font-medium">{limit + offset}</span> of{' '}
                        <span className="font-medium">{count}</span> results
                      </p>
                    </div>
                    <div className="flex flex-1 justify-between sm:justify-end">
                      <button
                        onClick={this.page(-1)}
                        className="relative inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold  ring-1 ring-inset ring-slate-300 hover:bg-slate-50 focus-visible:outline-offset-0"
                      >
                        Previous
                      </button>
                      <button
                        onClick={this.page(1)}
                        className="relative ml-3 inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold  ring-1 ring-inset ring-slate-300 hover:bg-slate-50 focus-visible:outline-offset-0"
                      >
                        Next
                      </button>
                    </div>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      </LoggedInNav>
    )
  }
}

DataExplorer.propTypes = {

}

export default observer(DataExplorer);

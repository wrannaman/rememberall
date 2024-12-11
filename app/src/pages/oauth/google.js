import React, { Component } from 'react';
import Router, { withRouter } from 'next/router';
import Head from 'next/head'
import { inject, observer } from "mobx-react";
import { toJS } from "mobx";
import axios from 'axios'
import { ArrowPathIcon } from '@heroicons/react/24/outline';
import LoggedInNav from '@/components/Nav/LoggedInNav';

class Oauth extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.inProgress = false
  }

  componentDidMount() {
    setTimeout(async () => {
      if (this.inProgress) return
      this.inProgress = true
      const { router } = this.props.router
      const { global: { _alert, analytics, token, user, update } } = this.props.store;
      const { query: { admin_consent, tenant, provider, code, scope, state, authuser, hd, prompt, oauth_token, oauth_verifier } } = this.props.router;
      console.log("provider:", provider)
      const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API}/oauth/google`,
        {
          redirect: `${window.location.origin}/oauth/google`,
          token,
          code,
          scope,
          authuser,
          hd,
          provider: 'google'
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
      console.log("data:", data)
      // set data.token if exist in local storage and cookie 
      if (data?.token) {
        localStorage.setItem('token', data.token)
        document.cookie = `token=${data.token}; path=/`
      }

      _alert('logged in')
      Router.push({ pathname: '/dashboard' })
      this.inProgress = false
    }, 800)
  }

  render() {
    return (
      <LoggedInNav>
        <div className="flex flex-col justify-center items-center m-10">
          <div>
            <ArrowPathIcon className='w-10 h-10 text-gray-300 animate-spin' />
          </div>
          <p className="mt-10 text-base font-extrabold text-rose-700">Please Wait</p>
        </div>
      </LoggedInNav>
    )
  }
}

Oauth.propTypes = {

}

export default withRouter(observer(Oauth));

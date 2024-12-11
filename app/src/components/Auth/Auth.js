import { useEffect, useState, } from "react";
import { toJS } from "mobx";
import { useRouter } from "next/router";
import { useStore } from '@/store/use-store'
import { observer } from "mobx-react";
import axios from 'axios'
const api = process.env.NEXT_PUBLIC_API

function Auth() {
  const store = useStore()
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const { global: { user, update, _alert } } = store
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const checkError = () => {
      const { error, error_description } = router.query
      if (error) {
        _alert(error_description, 'error', 6000)
      }
    }

    const setup = async () => {
      const token = localStorage.getItem('token')
      if (token) {
        try {
          const { data } = await axios.get(`${api}/user`, {
            headers: { Authorization: `Bearer ${token}` }
          })
          if (data?.user) {
            update('user', data.user)
            update('token', token)
            return router.push('/dashboard')
          }
        } catch (error) {
          console.error("Error fetching user:", error)
          // localStorage.removeItem('token')
        }
      }
    }

    checkError()
    setup()
  }, [])

  const loginGmail = async () => {
    try {
      const { data } = await axios.get(`${api}/user/oauth`)
      console.log("data:", data)
      if (data?.link) {
        window.location.href = data.link
      } else {
        _alert("Error initiating Google login", 'error')
      }
    } catch (error) {
      console.error("OAuth error:", error)
      _alert("Error initiating Google login", 'error')
    }
  }

  const sendMagicLink = async (e) => {
    e.preventDefault()
    if (!email) return _alert("Please enter an email", 'error')
    try {
      const response = await axios.get(`${api}/user/link?email=${email}`)
      _alert("Check your email!")
    } catch (error) {
      _alert("Error sending magic link", 'error')
    }
  };
  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <a href="/">
            <img
              alt="Health Data API"
              src="/icon.png"
              className="mx-auto h-10 w-auto"
            />
          </a>
          <h2 className="mt-10 capitalize text-center text-2xl font-bold leading-9 tracking-tight ">
            Sign In Or Create an account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={sendMagicLink} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium leading-6 ">
                Email Address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  required
                  autoComplete="email"
                  placeholder="Email"
                  className="block w-full rounded-md border-0 px-1 py-1.5  shadow-sm ring-1 ring-inset ring-rose-600 focus:ring-2 focus:ring-inset focus:ring-rose-500 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            {/* <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium leading-6 ">
                  Password
                </label>
                <div className="text-sm">
                  <a href="#" className="font-semibold text-rose-400 hover:text-rose-300">
                    Forgot password?
                  </a>
                </div>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  type="password"
                  placeholder="Password"
                  required
                  autoComplete="current-password"
                  className="block w-full rounded-md border-0 px-1 py-1.5 shadow-sm ring-1 ring-inset ring-rose-600 focus:ring-2 focus:ring-inset focus:ring-rose-500 sm:text-sm sm:leading-6"
                />
              </div>
            </div> */}

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md text-white bg-rose-500 px-3 py-1.5 text-sm font-semibold leading-6  shadow-sm hover:bg-rose-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-500"
              >
                Send Magic Link
              </button>
            </div>
          </form>
          <div className="mt-6 grid grid-cols-1 gap-4">
            <button
              onClick={loginGmail}
              className="flex w-full items-center justify-center gap-3 rounded-md bg-rose-500 px-3 py-2 text-sm font-semibold  shadow-sm ring-1 ring-inset ring-rose-300 hover:bg-rose-700 focus-visible:ring-transparent"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
                <path
                  d="M12.0003 4.75C13.7703 4.75 15.3553 5.36002 16.6053 6.54998L20.0303 3.125C17.9502 1.19 15.2353 0 12.0003 0C7.31028 0 3.25527 2.69 1.28027 6.60998L5.27028 9.70498C6.21525 6.86002 8.87028 4.75 12.0003 4.75Z"
                  fill="#EA4335"
                />
                <path
                  d="M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.945 21.1C22.2 19.01 23.49 15.92 23.49 12.275Z"
                  fill="#4285F4"
                />
                <path
                  d="M5.26498 14.2949C5.02498 13.5699 4.88501 12.7999 4.88501 11.9999C4.88501 11.1999 5.01998 10.4299 5.26498 9.7049L1.275 6.60986C0.46 8.22986 0 10.0599 0 11.9999C0 13.9399 0.46 15.7699 1.28 17.3899L5.26498 14.2949Z"
                  fill="#FBBC05"
                />
                <path
                  d="M12.0004 24.0001C15.2404 24.0001 17.9654 22.935 19.9454 21.095L16.0804 18.095C15.0054 18.82 13.6204 19.245 12.0004 19.245C8.8704 19.245 6.21537 17.135 5.2654 14.29L1.27539 17.385C3.25539 21.31 7.3104 24.0001 12.0004 24.0001Z"
                  fill="#34A853"
                />
              </svg>
              <span className="text-sm font-semibold leading-6 text-white">Google</span>
            </button>
          </div>

          {/* <p className="mt-10 text-center text-sm text-gray-400">
            Not a member?{' '}
            <a href="#" className="font-semibold leading-6 text-rose-400 hover:text-rose-300">
              Sign Up
            </a>
          </p> */}
        </div>
      </div>
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className=" p-4 rounded-md">
            <p>Logging you in...</p>
          </div>
        </div>
      )}
    </>
  )
}


export default observer(Auth)
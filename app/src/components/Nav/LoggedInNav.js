import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { useStore } from '@/store/use-store'
import { toJS } from 'mobx'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { observer } from 'mobx-react'
import axios from 'axios'
import Link from 'next/link'

const userNavigation = [
  { name: 'Your Profile', href: '/user/profile' },
  // { name: 'Settings', href: '#' },
  { name: 'Sign out', href: '/logout' },
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

function LoggedInNav(props) {
  const [loading, setLoading] = useState(true)
  const [imageError, setImageError] = useState(false)
  const store = useStore()
  const router = useRouter()
  const { global: { user, update, token, } } = store
  const [navigation, setNavigation] = useState([
    { name: 'Dashboard', target: "", href: '/dashboard', current: router.pathname === '/dashboard' },
    // { name: 'API Docs', target: "_blank", href: process.env.NEXT_PUBLIC_API, current: false },
  ])
  useEffect(() => {
    const setup = async () => {
      try {
        const localToken = localStorage.getItem('token')
        if (!localToken) {
          return router.push('/auth')
        }

        // Only update token in store if it's not already set
        if (!token) {
          update('token', localToken)
        }

        const u = await axios.get(`${process.env.NEXT_PUBLIC_API}/user`, {
          headers: {
            Authorization: `Bearer ${localToken}`,
          },
        })

        if (!u?.data?.user?.id) {
          return router.push('/auth')
        }

        update('user', u?.data?.user)
        setLoading(false)
      } catch (e) {
        console.log('error', e)
        return router.push('/auth')
      }
    }
    setup()
  }, []) // Empty dependency array - only run once on mount

  // if (loading) return <div className="min-h-full h-screen"></div>
  return (
    <>
      {/*
        This example requires updating your template:

        ```
        <html class="h-full bg-gray-100">
        <body class="h-full">
        ```
      */}
      <div className="min-h-full h-screen">
        <div className="">
          <Disclosure as="div" className="border-none">
            <div className="mx-auto  px-2 sm:px-4 lg:px-8">
              <div className="relative flex h-16 items-center justify-between lg:border-b lg:border-rose-400 lg:border-opacity-25">
                <div className="flex items-center px-2 lg:px-0">
                  <div className="flex-shrink-0">
                    <img
                      alt=""
                      src="/icon.png"
                      className="block h-8 w-8"
                    />
                  </div>
                  <div className="hidden lg:ml-10 lg:block">
                    <div className="flex space-x-4">
                      {navigation.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          target={item.target}
                          aria-current={item.current ? 'page' : undefined}
                          className={classNames(
                            item.current
                              ? 'underline underline-offset-8 text-rose-600'
                              : '',
                            'rounded-md px-3 py-2 text-sm font-medium',
                          )}
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
                {/* <div className="flex flex-1 justify-center px-2 lg:ml-6 lg:justify-end">
                  <div className="w-full max-w-lg lg:max-w-xs">
                    <label htmlFor="search" className="sr-only">
                      Search
                    </label>
                    <div className="relative text-gray-400 focus-within:text-gray-600">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <MagnifyingGlassIcon aria-hidden="true" className="h-5 w-5" />
                      </div>
                      <input
                        id="search"
                        name="search"
                        type="search"
                        placeholder="Search"
                        className="block w-full rounded-md border-0 bg-white py-1.5 pl-10 pr-3 text-gray-900 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-rose-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                </div> */}
                <div className="flex lg:hidden">
                  {/* Mobile menu button */}
                  <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md bg-rose-600 p-2 text-rose-200 hover:bg-rose-500 hover:bg-opacity-75 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-rose-600">
                    <span className="absolute -inset-0.5" />
                    <span className="sr-only">Open main menu</span>
                    <Bars3Icon aria-hidden="true" className="block h-6 w-6 group-data-[open]:hidden" />
                    <XMarkIcon aria-hidden="true" className="hidden h-6 w-6 group-data-[open]:block" />
                  </DisclosureButton>
                </div>
                <div className="hidden lg:ml-4 lg:block">
                  <div className="flex items-center">
                    {/* <button
                      type="button"
                      className="relative flex-shrink-0 rounded-full bg-rose-600 p-1 text-rose-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-rose-600"
                    >
                      <span className="absolute -inset-1.5" />
                      <span className="sr-only">View notifications</span>
                      <BellIcon aria-hidden="true" className="h-6 w-6" />
                    </button> */}

                    {/* Profile dropdown */}
                    <Menu as="div" className="relative ml-3 flex-shrink-0">
                      <div>
                        <MenuButton className="relative flex rounded-full bg-rose-600 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-rose-600">
                          <span className="absolute -inset-1.5" />
                          <span className="sr-only">Open user menu</span>
                          {!imageError && user?.photo && (
                            <img
                              alt=""
                              src={user?.photo}
                              onError={(e) => {
                                console.log('fail tto load img');
                                setImageError(true)
                              }}
                              className="h-8 w-8 rounded-full"
                            />
                          )}
                          {(imageError || !user?.photo) && (
                            <div className='h-8 w-8 rounded-full flex items-center justify-center'>
                              <p className='text-xs uppercase'>{user?.email?.slice(0, 2)}</p>
                            </div>
                          )}
                        </MenuButton>
                      </div>
                      <MenuItems
                        transition
                        className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                      >
                        {userNavigation.map((item) => (
                          <MenuItem key={item.name}>
                            <a
                              href={item.href}
                              className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100"
                            >
                              {item.name}
                            </a>
                          </MenuItem>
                        ))}
                        <MenuItem >
                          <p
                            className="block px-4 py-2 text-xs overflow-wrap overflow-hidden text-gray-700 "
                          >
                            signed in as {user?.email}
                          </p>
                        </MenuItem>
                      </MenuItems>
                    </Menu>
                  </div>
                </div>
              </div>
            </div>

            <DisclosurePanel className="lg:hidden">
              <div className="space-y-1 px-2 pb-3 pt-2">
                {navigation.map((item) => (
                  <DisclosureButton
                    key={item.name}
                    as="a"
                    href={item.href}
                    aria-current={item.current ? 'page' : undefined}
                    className={classNames(
                      item.current ? 'bg-rose-700 text-white' : 'hover:bg-rose-500 hover:bg-opacity-75',
                      'block rounded-md px-3 py-2 text-base font-medium',
                    )}
                  >
                    {item.name}
                  </DisclosureButton>
                ))}
              </div>
              <div className="border-t border-rose-700 pb-3 pt-4">
                <div className="flex items-center px-5">
                  {/* <div className="flex-shrink-0">
                    <img alt="" src={user.imageUrl} className="h-10 w-10 rounded-full" />
                  </div> */}
                  {/* <div className="ml-3">
                    <div className="text-base font-medium text-white">{user.name}</div>
                    <div className="text-sm font-medium text-rose-300">{user.email}</div>
                  </div> */}
                  <a href="/logout">
                    <button
                      type="button"
                      className="rounded bg-rose-600 px-2 py-1 text-xs font-semibold text-white shadow-sm hover:bg-rose-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600"
                    >
                      Sign Out
                    </button>
                  </a>
                </div>
                <div className="mt-3 space-y-1 px-2">
                  {userNavigation.map((item) => (
                    <DisclosureButton
                      key={item.name}
                      as="a"
                      href={item.href}
                      className="block rounded-md px-3 py-2 text-base font-medium text-white hover:bg-rose-500 hover:bg-opacity-75"
                    >
                      {item.name}
                    </DisclosureButton>
                  ))}
                </div>
              </div>
            </DisclosurePanel>
          </Disclosure>
        </div>

        <main className="pt-4">
          <div className="mx-auto max-w-7xl ">
            <div className="">
              {props.children}
            </div>
          </div>
        </main>
      </div>
    </>
  )
}


export default observer(LoggedInNav)
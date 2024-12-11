import { useEffect } from 'react'
import { useRouter } from 'next/router'

export default function Logout() {
  const router = useRouter()
  useEffect(() => {
    console.log("Logging out")
    localStorage.removeItem('token')
    // remove cookie 
    document.cookie = 'token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;'
    router.push('/')
  }, [])
  return (
    <div className="flex flex-col justify-center items-center pt-32">
      <div className="text-4xl text-gray-900">
        <img src="/icon.png" className="h-16 w-16 m-auto" />
        <h1 className="text-xl font-bold">Logging you out...</h1>
      </div>
    </div>
  )
}
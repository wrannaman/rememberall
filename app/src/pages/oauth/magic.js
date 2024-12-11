import { useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { useStore } from '@/store/use-store';
export default function MagicAuth() {
  const router = useRouter();
  const store = useStore();
  const { global: { update } } = store;

  useEffect(() => {
    const handleAuth = async () => {
      try {
        const { token } = router.query;
        if (!token) return;

        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API}/user`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        console.log("response.data:", response.data)

        const newToken = response.data.token;

        // Using document.cookie for client-side
        document.cookie = `token=${newToken}; path=/; max-age=${30 * 24 * 60 * 60}`; // 30 days

        // Also set in localStorage
        localStorage.setItem('token', newToken);
        update('token', newToken)
        update('user', response.data.user)
        router.push('/dashboard');
      } catch (error) {
        console.error('Authentication error:', error);
        // router.push('/auth');
      }
    };

    if (router.isReady) {
      handleAuth();
    }
  }, [router.isReady, router.query]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-xl font-semibold">Authenticating...</h1>
        <p className="text-gray-500 mt-2">Please wait while we log you in</p>
      </div>
    </div>
  );
}

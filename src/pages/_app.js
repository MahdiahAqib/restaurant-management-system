import '../styles/globals.css';
import Sidebar from '../components/common/Sidebar';
import { useRouter } from 'next/router';

export default function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const showSidebar = router.pathname.startsWith('/dashboard');

  return (
    <div className='relative flex h-screen bg-gray-900 text-gray-100 overflow-hidden'>
      {/* Background layer - lower z-index */}
      <div className='fixed inset-0 z-0 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800' />

      {/* Foreground content wrapper */}
      <div className='relative z-10 flex w-full'>
        {showSidebar && <Sidebar />}
        <main className='flex-1 overflow-auto'>
          <Component {...pageProps} />
        </main>
      </div>
    </div>
  );
}

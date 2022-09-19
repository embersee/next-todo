import { signOut, useSession } from 'next-auth/react'

import { Toaster } from 'react-hot-toast'
import { useRouter } from 'next/router'

export const Nav = ({ title }: { title: string }) => {
  const { data: session, status } = useSession()
  const router = useRouter()

  return (
    <>
      <div className='flex justify-between items-center bg-absence'>
        <div>
          <button
            onClick={() => router.push('/')}
            className='text-md inline-block m-2 px-6 py-2 bg-white dark:bg-black-velvet leading-tight rounded-md shadow-md border-2 border-transparent hover:border-blue-500 transition duration-150 ease-in-out'
          >
            Home
          </button>
          {status === 'authenticated' && (
            <button
              onClick={() => router.push('/dashboard')}
              className='text-md inline-block m-2 px-6 py-2 bg-white dark:bg-black-velvet leading-tight rounded-md shadow-md border-2 border-transparent hover:border-blue-500 transition duration-150 ease-in-out'
            >
              Dashboard
            </button>
          )}
        </div>
        <Toaster />
        <h1 className=' text-3xl'>{title}</h1>
        <div className='flex justify-items-end'>
          {status === 'authenticated' ? (
            <div className='flex items-center'>
              <p className='h-6'>Signed in as {session.user?.email}</p>
              <button
                className='flex items-center m-2 px-4 py-2 bg-white dark:bg-black-velvet font-medium text-md leading-tight rounded-md shadow-md border-2 border-transparent hover:border-blue-500 transition duration-150 ease-in-out'
                onClick={() => signOut({ callbackUrl: '/' })}
              >
                Logout
              </button>
            </div>
          ) : (
            <>
              <button
                onClick={() =>
                  router.push('/sign-up', undefined, { shallow: true })
                }
                className='inline-block m-2 px-6 py-2 bg-white dark:bg-black-velvet font-medium text-md leading-tight rounded-md shadow-md border-2 border-transparent hover:border-blue-500 transition duration-150 ease-in-out'
              >
                Sign Up
              </button>

              <button
                onClick={() =>
                  router.push('/sign-in', undefined, { shallow: true })
                }
                className='inline-block m-2 px-6 py-2 bg-white dark:bg-black-velvet font-medium text-md leading-tight rounded-md shadow-md border-2 border-transparent hover:border-blue-500 transition duration-150 ease-in-out'
              >
                Sign In
              </button>
            </>
          )}
        </div>
      </div>
    </>
  )
}

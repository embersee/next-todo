import { signOut, useSession } from 'next-auth/react'

import Link from 'next/link'

export const Nav = ({ title }: { title: string }) => {
  const { data: session, status } = useSession()

  return (
    <>
      <div className='flex justify-around items-center'>
        <Link href='/'>
          <button className='text-md inline-block m-2 px-6 py-2 bg-white dark:bg-night-sky leading-tight rounded-md shadow-md border-2 hover:border-blue-500 transition duration-150 ease-in-out'>
            Home
          </button>
        </Link>
        <h1 className=' text-3xl'>{title}</h1>
        <div className='flex justify-items-end'>
          {status === 'authenticated' ? (
            <div className='flex items-center'>
              <p className='h-6'>Signed in as {session.user?.email}</p>
              <button
                className='flex items-center m-2 px-4 py-2 bg-white dark:bg-night-sky font-medium text-md leading-tight rounded-md shadow-md border-2 hover:border-blue-500 transition duration-150 ease-in-out'
                onClick={() => signOut({ callbackUrl: '/' })}
              >
                Logout
              </button>
            </div>
          ) : (
            <>
              <Link href='/sign-up'>
                <button className='inline-block m-2 px-6 py-2 bg-white dark:bg-night-sky font-medium text-md leading-tight rounded-md shadow-md border-2 hover:border-blue-500 transition duration-150 ease-in-out'>
                  Sign Up
                </button>
              </Link>
              <Link href='/sign-in'>
                <button className='inline-block m-2 px-6 py-2 bg-white dark:bg-night-sky font-medium text-md leading-tight rounded-md shadow-md border-2 hover:border-blue-500 transition duration-150 ease-in-out'>
                  Sign In
                </button>
              </Link>
            </>
          )}
        </div>
      </div>
    </>
  )
}

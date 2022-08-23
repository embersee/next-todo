import { createUserSchema, SignIn } from '../schema/user.schema'

import Head from 'next/head'
import Link from 'next/link'
import type { NextPage } from 'next'
import { signIn } from 'next-auth/react'
import { useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

const SignIn: NextPage = () => {
  const { register, handleSubmit } = useForm<SignIn>({
    resolver: zodResolver(createUserSchema),
  })

  const onSubmit = useCallback(async (data: SignIn) => {
    await signIn('credentials', { ...data, callbackUrl: '/dashboard' })
  }, [])

  return (
    <div>
      <Head>
        <title>Next App - Login</title>
        <meta name='description' content='Generated by create next app' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main>
        <form
          className='flex items-center justify-center h-screen w-full'
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className='card w-96 bg-base-100 shadow-xl'>
            <div className='card-body'>
              <h2 className='card-title'>Welcome back!</h2>
              <input
                type='text'
                placeholder='Type your username...'
                className='input input-bordered w-full max-w-xs mt-2 bg-black-velvet'
                {...register('username')}
              />
              <input
                type='password'
                placeholder='Type your password...'
                className='input input-bordered w-full max-w-xs my-2 bg-black-velvet'
                {...register('password')}
              />
              <div className='flex justify-between'>
                <Link href='/sign-up' className='link'>
                  Go to sign up
                </Link>
                <button className='' type='submit'>
                  Login
                </button>
              </div>
            </div>
          </div>
        </form>
      </main>
    </div>
  )
}

export default SignIn
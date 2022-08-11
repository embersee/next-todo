import type { NextPage } from 'next'
import { useEffect, useState } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import Board from '../components/Board'

const Home: NextPage = () => {
  const [isBrowser, setIsBrowser] = useState(false)

  useEffect(() => {
    setIsBrowser(process.browser)
  }, [])

  return (
    <div className='h-screen w-screen'>
      <Head>
        <title>Create Next App</title>
        <meta name='description' content='Generated by create next app' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main className='container mx-auto'>{isBrowser ? <Board /> : null}</main>

      <footer className=''></footer>
    </div>
  )
}

export default Home

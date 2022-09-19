import { Nav } from './Nav'
import { Sidebar } from './Sidebar'
import { useRouter } from 'next/router'

type WithChildren<T = {}> = T & { children?: React.ReactNode }

type Props = WithChildren<{
  title: string
}>

export const Layout = ({ children, title }: Props) => {
  const router = useRouter()
  return (
    <>
      <Nav title={title} />

      <main className='flex'>
        {router.query.board && <Sidebar />}

        <div className='flex flex-col h-screen flex-grow'>{children}</div>
      </main>
    </>
  )
}

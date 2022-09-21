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
    <div className='dark:bg-absence'>
      <Nav title={title} />

      <main className='flex'>
        {router.query.board && <Sidebar />}

        <div
          onContextMenu={(e) => {
            e.preventDefault()
            return false
          }}
          className='flex flex-col h-[96vh] flex-grow rounded-md dark:bg-black-velvet/50'
        >
          {children}
        </div>
      </main>
    </div>
  )
}

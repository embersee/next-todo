import { Nav } from './Nav'

type WithChildren<T = {}> = T & { children?: React.ReactNode }

type Props = WithChildren<{}>

export const Layout = ({ children }: Props) => {
  return (
    <div className='dark:bg-absence flex flex-col'>
      <Nav title={''} />

      <main
        onContextMenu={(e) => {
          e.preventDefault()
          return false
        }}
        className='flex flex-col h-[92vh] flex-grow rounded-xl dark:bg-black-velvet/50'
      >
        {children}
      </main>
      <footer className='flex h-[3vh] justify-center items-center gap-4 bg-absence'>
        <p>made by philipp@shiyanov </p>
        <p>–</p>
        <a href='https://github.com/philippshiyanov/next-todo'> github </a>
      </footer>
    </div>
  )
}

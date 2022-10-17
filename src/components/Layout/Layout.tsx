import { Nav } from './Nav'

type WithChildren<T = {}> = T & { children?: React.ReactNode }

type Props = WithChildren<{}>

export const Layout = ({ children }: Props) => {
  return (
    <div className='dark:bg-absence flex flex-col h-screen'>
      <Nav title={''} />

      <main
        onContextMenu={(e) => {
          e.preventDefault()
          return false
        }}
        className='flex flex-col flex-grow rounded-xl dark:bg-black-velvet/50'
      >
        {children}
      </main>
      <footer className='sticky top-[100vh] py-2 flex justify-center items-center bg-absence'>
        <p>
          made by philipp@shiyanov –
          <a href='https://github.com/philippshiyanov/next-todo'> github </a>
        </p>
      </footer>
    </div>
  )
}

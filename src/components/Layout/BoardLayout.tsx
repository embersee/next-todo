import { Sidebar } from './Sidebar'

type WithChildren<T = {}> = T & { children?: React.ReactNode }

type Props = WithChildren<{}>

export const BoardLayout = ({ children }: Props) => {
  return (
    <div className='dark:bg-absence flex h-full'>
      <Sidebar />

      <div
        onContextMenu={(e) => {
          e.preventDefault()
          return false
        }}
        className='flex flex-col flex-grow rounded-2xl dark:bg-black-velvet/50 overflow-scroll overflow-x-hidden'
      >
        {children}
      </div>
    </div>
  )
}

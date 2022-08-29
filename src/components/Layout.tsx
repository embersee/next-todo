import { Nav } from './Nav'

type WithChildren<T = {}> = T & { children?: React.ReactNode }

type Props = WithChildren<{
  title: string
}>

export const Layout = ({ children, title }: Props) => {
  return (
    <>
      <Nav title={title} />

      <main className='flex flex-col h-screen w-screen'>{children}</main>
    </>
  )
}

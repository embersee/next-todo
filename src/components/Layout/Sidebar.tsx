import * as ContextMenuPrimitive from '@radix-ui/react-context-menu'

import { ArrowRightIcon, PlusIcon } from '@radix-ui/react-icons'

import { BoardTitle } from '../Board/BoardTitle'
import { DashboardContextMenu } from '../utils/DashboardContextMenu'
import FullScreenLoader from '../utils/FullscreenLoader'
import { SidebarItem } from './SidebarItem'
import toast from 'react-hot-toast'
import { trpc } from '../../utils/trpc'
import { useRouter } from 'next/router'
import { useState } from 'react'

export const Sidebar = () => {
  const [contextOpen, setContextOpen] = useState(false)
  const { data, error, isLoading, isFetching, refetch } = trpc.useQuery([
    'users.me',
  ])

  const router = useRouter()

  const trpcClient = trpc.useContext()

  const { mutate } = trpc.useMutation(['board.createBoard'], {
    onMutate: () => {
      toast.loading('Creating new board...', {
        id: 'createBoard',
        style: {
          borderRadius: '10px',
          background: '#1E1E2A', //#1E1E2A
          color: '#fff',
          minWidth: '50px',
        },
      })
    },
    onSuccess: () => {
      toast.success('Board created', {
        id: 'createBoard',
        style: {
          borderRadius: '10px',
          background: '#1E1E2A', //#22C55E
          color: '#fff',
          minWidth: '50px',
        },
      })
      trpcClient.refetchQueries(['users.me'])
    },
  })

  const { mutate: deleteMutation } = trpc.useMutation(['board.deleteBoard'], {
    onMutate: () => {
      toast.loading('Deleting...', {
        id: 'deleteBoard',
        style: {
          borderRadius: '10px',
          background: '#1E1E2A', //#1E1E2A
          color: '#fff',
          minWidth: '50px',
        },
      })
    },
    onSuccess: () => {
      toast.success('Board deleted', {
        id: 'deleteBoard',
        style: {
          borderRadius: '10px',
          background: '#1E1E2A', //#22C55E
          color: '#fff',
          minWidth: '50px',
        },
      })
      trpcClient.refetchQueries(['users.me'])
    },
  })

  const createBoard = () => {
    mutate()
  }

  const deleteBoard = (board: string) => {
    deleteMutation(board)
  }

  if (isLoading || isFetching)
    return (
      <div className=' bg-absence w-[304px]'>
        <h1 className='text-2xl font-bold text-center'>My Boards</h1>
        {/* TODO: add loading skeleton on SidebarItem */}
        <div className='flex flex-col h-screen justify-center items-center relative -left-4'>
          <FullScreenLoader />
        </div>
        {/* <div className='animate-pulse border-2 border-transparent rounded-md m-2 py-2 h-16 w-72 bg-white dark:bg-black-velvet'></div>
        <div className='animate-pulse border-2 border-transparent rounded-md m-2 py-2 h-16 w-72 bg-white dark:bg-black-velvet'></div>
        <div className='animate-pulse border-2 border-transparent rounded-md m-2 py-2 h-16 w-72 bg-white dark:bg-black-velvet'></div>
        <div className='flex justify-center '>
          <div className='animate-pulse w-12 h-12 border-2 border-transparent rounded-md dark:bg-black-velvet'></div>
        </div> */}
      </div>
    )

  return (
    <div className=' bg-absence w-[304px]'>
      <h1 className='text-2xl font-bold text-center'>My Boards</h1>
      {data?.result?.boards.map((board, i) => {
        const currentTitle = board.title
        const currentBoard = router.query.board === board.title

        return (
          <div key={i}>
            <SidebarItem
              currentTitle={currentTitle}
              currentBoard={currentBoard}
              deleteBoard={deleteBoard}
            />
          </div>
        )
      })}
      <div className='flex justify-center '>
        <button
          onClick={createBoard}
          className='text-xl w-12 h-12 flex justify-center items-center border-2 border-transparent rounded-md dark:bg-black-velvet hover:border-green-500 transition-colors'
        >
          <PlusIcon className='h-6 w-6' />
        </button>
      </div>
    </div>
  )
}

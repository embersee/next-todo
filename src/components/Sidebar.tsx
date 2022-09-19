import * as ContextMenuPrimitive from '@radix-ui/react-context-menu'

import { ArrowRightIcon, PlusIcon } from '@radix-ui/react-icons'

import { BoardTitle } from './BoardTitle'
import { DashboardContextMenu } from './utils/DashboardContextMenu'
import { SidebarItem } from './SidebarItem'
import toast from 'react-hot-toast'
import { trpc } from '../utils/trpc'
import { useRouter } from 'next/router'
import { useState } from 'react'

export const Sidebar = () => {
  const [contextOpen, setContextOpen] = useState(false)
  const { data, error, isLoading, isFetching, refetch } = trpc.useQuery([
    'users.me',
  ])

  const router = useRouter()

  const trpcClient = trpc.useContext()

  const { mutate } = trpc.useMutation(['users.createBoard'], {
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

  const { mutate: deleteMutation } = trpc.useMutation(['users.deleteBoard'], {
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

  return (
    <div className=' bg-absence'>
      <h1 className='text-2xl font-bold text-center'>My Boards</h1>
      {data?.result?.boards.map((board, i) => {
        const currentTitle = board.title
        const currentBoard = router.query.board == board.title
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

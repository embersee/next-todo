import * as ContextMenuPrimitive from '@radix-ui/react-context-menu'

import { ArrowRightIcon, PlusIcon } from '@radix-ui/react-icons'

import { BoardTitle } from '../Board/BoardTitle'
import { DashboardContextMenu } from '../utils/DashboardContextMenu'
import { useRouter } from 'next/router'
import { useState } from 'react'

interface sidebarProps {
  currentBoard: boolean
  currentTitle: string
  deleteBoard: (board: string) => void
}

export const SidebarItem = ({
  currentBoard,
  currentTitle,
  deleteBoard,
}: sidebarProps) => {
  const [contextOpen, setContextOpen] = useState(false)
  const router = useRouter()
  return (
    <ContextMenuPrimitive.Root onOpenChange={(open) => setContextOpen(open)}>
      <ContextMenuPrimitive.Trigger>
        <div
          className={`border-2 border-transparent rounded-md m-2 py-2 w-72 flex justify-between items-center text-center bg-white dark:bg-black-velvet transition-colors ${
            currentBoard && 'border-blue-500'
          } ${contextOpen && 'border-blue-500 dark:border-blue-500'}`}
        >
          <DashboardContextMenu
            boardTitle={currentTitle}
            deleteBoard={deleteBoard}
          />
          <BoardTitle currentTitle={currentTitle} textSize='text-xl' />

          <button
            onClick={() => router.push(`/boards/${currentTitle}`)}
            className='flex items-center text-center mr-2 p-2 bg-super-silver dark:bg-black-velvet font-medium text-md leading-tight rounded-md border-2 border-transparent hover:border-blue-500 transition duration-150 ease-in-out'
          >
            <ArrowRightIcon className='h-6 w-6' />
          </button>
        </div>
      </ContextMenuPrimitive.Trigger>
    </ContextMenuPrimitive.Root>
  )
}

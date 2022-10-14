import * as ContextMenuPrimitive from '@radix-ui/react-context-menu'

import { ArrowRightIcon } from '@radix-ui/react-icons'
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
          className={`border-2 border-transparent rounded-md m-2 p-1 w-auto flex justify-between items-center text-center bg-white dark:bg-black-velvet transition-colors cursor-pointer ${
            currentBoard && 'border-blue-600'
          } ${contextOpen && 'border-blue-600 dark:border-blue-600'}`}
          onClick={() => router.push(`/boards/${currentTitle}`)}
        >
          <DashboardContextMenu
            boardTitle={currentTitle}
            deleteBoard={deleteBoard}
          />
          <BoardTitle
            currentTitle={currentTitle}
            textSize=' font-normal ml-2 my-1'
          />

          <button className='flex justify-center items-center text-center h-8 w-8  bg-super-silver dark:bg-black-velvet font-medium text-md leading-tight rounded-md border-2 border-transparent hover:border-blue-500 transition duration-150 ease-in-out'>
            <ArrowRightIcon className='h-5 w-5' />
          </button>
        </div>
      </ContextMenuPrimitive.Trigger>
    </ContextMenuPrimitive.Root>
  )
}

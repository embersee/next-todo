import * as ContextMenuPrimitive from '@radix-ui/react-context-menu'

import {
  ChatBubbleIcon,
  ChevronRightIcon,
  InputIcon,
  PlusIcon,
  TextAlignTopIcon,
  TrashIcon,
} from '@radix-ui/react-icons'

interface ContextMenuProps {
  boardTitle: string
  deleteBoard: (board: string) => void
}

export const DashboardContextMenu = ({
  boardTitle,
  deleteBoard,
}: ContextMenuProps) => {
  return (
    <ContextMenuPrimitive.Portal>
      <ContextMenuPrimitive.Content className='radix-side-top:animate-slide-up radix-side-bottom:animate-slide-down w-48 rounded-lg px-1 py-1 shadow-md md:w-56 bg-white dark:bg-black-velvet border-2 border-blue-600'>
        <ContextMenuPrimitive.Item
          onClick={() => deleteBoard(boardTitle)}
          className='flex cursor-default select-none items-center rounded-md px-2 py-2 text-xs outline-none focus:bg-super-silver   dark:focus:bg-night-sky/75'
        >
          <TrashIcon className='mr-2' />
          <span className='flex-grow'>Delete Board</span>
          <span>⌘+D</span>
        </ContextMenuPrimitive.Item>
      </ContextMenuPrimitive.Content>
    </ContextMenuPrimitive.Portal>
  )
}

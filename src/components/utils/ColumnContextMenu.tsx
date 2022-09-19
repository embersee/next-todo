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
  column: string
  renameColumn: () => void
  addTask: (column: string, text: string) => void
  deleteColumn: () => void
  clearTasks: () => void
}

export const ColumnContextMenu = ({
  column,
  renameColumn,
  addTask,
  deleteColumn,
  clearTasks,
}: ContextMenuProps) => {
  return (
    <ContextMenuPrimitive.Portal>
      <ContextMenuPrimitive.Content className='radix-side-top:animate-slide-up radix-side-bottom:animate-slide-down w-48 rounded-lg px-1 py-1 shadow-md md:w-56 bg-white dark:bg-black-velvet border-2 border-blue-600'>
        <ContextMenuPrimitive.Item
          onClick={renameColumn}
          className='flex cursor-default select-none items-center rounded-md px-2 py-2 text-xs outline-none focus:bg-super-silver   dark:focus:bg-night-sky/75'
        >
          <InputIcon className='mr-2' />
          <span className='flex-grow'>Re-name</span>
          <span>⌘+R</span>
        </ContextMenuPrimitive.Item>
        <ContextMenuPrimitive.Item
          onClick={() => addTask(column, '')}
          className='flex cursor-default select-none items-center rounded-md px-2 py-2 text-xs outline-none focus:bg-super-silver   dark:focus:bg-night-sky/75'
        >
          <PlusIcon className='mr-2' />
          <span className='flex-grow'>Add Task</span>
          <span>⌘+R</span>
        </ContextMenuPrimitive.Item>
        <ContextMenuPrimitive.Separator className='my-1 h-px bg-gray-200 dark:bg-gray-700' />

        <ContextMenuPrimitive.Item
          onClick={deleteColumn}
          className='flex cursor-default select-none items-center rounded-md px-2 py-2 text-xs outline-none focus:bg-super-silver   dark:focus:bg-night-sky/75'
        >
          <TrashIcon className='mr-2' />
          <span className='flex-grow'>Delete Column</span>
          <span>⌘+D</span>
        </ContextMenuPrimitive.Item>
        <ContextMenuPrimitive.Item
          onClick={clearTasks}
          className='flex cursor-default select-none items-center rounded-md px-2 py-2 text-xs outline-none focus:bg-super-silver   dark:focus:bg-night-sky/75'
        >
          <TrashIcon className='mr-2' />
          <span className='flex-grow'>Clear Tasks</span>
          <span>⌘+T</span>
        </ContextMenuPrimitive.Item>
      </ContextMenuPrimitive.Content>
    </ContextMenuPrimitive.Portal>
  )
}

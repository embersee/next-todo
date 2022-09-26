import * as ContextMenuPrimitive from '@radix-ui/react-context-menu'

import {
  ChatBubbleIcon,
  ChevronRightIcon,
  InputIcon,
  TextAlignTopIcon,
  TrashIcon,
} from '@radix-ui/react-icons'

import { RefObject } from 'react'

interface ContextMenuProps {
  renameTask: () => void
  givePriority: ({ prio }: { prio: string }) => void
  deleteTask: () => void
}

export const TaskContextMenu = ({
  renameTask,
  givePriority,
  deleteTask,
}: ContextMenuProps) => {
  return (
    <ContextMenuPrimitive.Portal>
      <ContextMenuPrimitive.Content className='radix-side-top:animate-slide-up radix-side-bottom:animate-slide-down w-48 rounded-lg px-1 py-1 shadow-md md:w-56 bg-white dark:bg-black-velvet border-2 border-blue-400 '>
        <ContextMenuPrimitive.Item
          onClick={renameTask}
          className='flex cursor-default select-none items-center rounded-md px-2 py-2 text-xs outline-none focus:bg-super-silver   dark:focus:bg-night-sky/75'
        >
          <InputIcon className='mr-2' />
          <span className='flex-grow'>Re-name</span>
          <span>⌘+R</span>
        </ContextMenuPrimitive.Item>
        <ContextMenuPrimitive.Separator className='my-1 h-px bg-gray-200 dark:bg-gray-700' />
        <ContextMenuPrimitive.Item className='flex cursor-default select-none items-center rounded-md px-2 py-2 text-xs outline-none  focus:bg-super-silver   dark:focus:bg-night-sky/75'>
          <ChatBubbleIcon className='mr-2' />
          <span className='flex-grow'>Label</span>
          <span>⌘+L</span>
        </ContextMenuPrimitive.Item>

        <ContextMenuPrimitive.Sub>
          <ContextMenuPrimitive.SubTrigger className='flex cursor-default select-none items-center rounded-md px-2 py-2 text-xs outline-none  focus:bg-super-silver  dark:focus:bg-night-sky/75'>
            <TextAlignTopIcon className='mr-2 relative top-[2px]' />
            <span className='flex-grow'>Priority</span>
            <ChevronRightIcon />
          </ContextMenuPrimitive.SubTrigger>
          <ContextMenuPrimitive.Portal>
            <ContextMenuPrimitive.SubContent className='ml-1 origin-radix-context-menu radix-side-right:animate-scale-in w-full rounded-md px-1 py-1 text-xs shadow-md bg-white dark:bg-black-velvet border-2 border-blue-400 '>
              <ContextMenuPrimitive.Item
                onClick={() => givePriority({ prio: 'high' })}
                className='flex cursor-default select-none items-center rounded-md px-2 py-2 text-xs outline-none  focus:bg-super-silver  dark:focus:bg-night-sky/75'
              >
                <div className='h-[16px] w-1 bg-red-500 rounded-md mr-2'></div>
                <span>High</span>
              </ContextMenuPrimitive.Item>
              <ContextMenuPrimitive.Item
                onClick={() => givePriority({ prio: 'medium' })}
                className='flex cursor-default select-none items-center rounded-md px-2 py-2 text-xs outline-none  focus:bg-super-silver  dark:focus:bg-night-sky/75'
              >
                <div className='h-[16px] w-1 bg-yellow-500 rounded-md mr-2'></div>
                <span>Medium</span>
              </ContextMenuPrimitive.Item>
              <ContextMenuPrimitive.Item
                onClick={() => givePriority({ prio: 'low' })}
                className='flex cursor-default select-none items-center rounded-md px-2 py-2 text-xs outline-none  focus:bg-super-silver  dark:focus:bg-night-sky/75'
              >
                <div className='h-[16px] w-1 bg-green-500 rounded-md mr-2'></div>
                <span>Low</span>
              </ContextMenuPrimitive.Item>
              <ContextMenuPrimitive.Item
                onClick={() => givePriority({ prio: '' })}
                className='flex cursor-default select-none items-center rounded-md px-2 py-2 text-xs outline-none  focus:bg-super-silver  dark:focus:bg-night-sky/75'
              >
                <div className='h-[16px] w-1 rounded-md mr-2'></div>
                <span>None</span>
              </ContextMenuPrimitive.Item>
            </ContextMenuPrimitive.SubContent>
          </ContextMenuPrimitive.Portal>
        </ContextMenuPrimitive.Sub>
        <ContextMenuPrimitive.Separator className='my-1 h-px bg-gray-200 dark:bg-gray-700' />
        <ContextMenuPrimitive.Item
          onClick={deleteTask}
          className='flex cursor-default select-none items-center rounded-md px-2 py-2 text-xs outline-none focus:bg-super-silver   dark:focus:bg-night-sky/75'
        >
          <TrashIcon className='mr-2' />
          <span className='flex-grow'>Delete</span>
          <span>⌘+D</span>
        </ContextMenuPrimitive.Item>
      </ContextMenuPrimitive.Content>
    </ContextMenuPrimitive.Portal>
  )
}

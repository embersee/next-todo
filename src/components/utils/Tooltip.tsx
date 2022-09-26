import * as TooltipPrimitive from '@radix-ui/react-tooltip'

import { ReactNode } from 'react'

type WithChildren<T = {}> = T & { children?: ReactNode }

type ToolProps = WithChildren<{
  tip?: string
}>

const Tooltip = ({ children, tip }: ToolProps) => {
  return (
    <TooltipPrimitive.Provider>
      <TooltipPrimitive.Root>
        <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
        <TooltipPrimitive.Content
          sideOffset={4}
          className='inline-flex items-center rounded-md px-4 py-2.5 bg-white dark:bg-absence/90'
        >
          <TooltipPrimitive.Arrow className='fill-current text-white dark:text-[#0D0D12]/90' />
          <span className='block text-xs leading-none'>{tip}</span>
        </TooltipPrimitive.Content>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  )
}

export default Tooltip

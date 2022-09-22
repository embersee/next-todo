import * as SelectPrimitive from '@radix-ui/react-select'

import { CheckIcon, ChevronDownIcon } from '@radix-ui/react-icons'
import React, { Dispatch, SetStateAction } from 'react'

type Props = {
  value: string
  setValue: Dispatch<SetStateAction<string>>
}

const SelectPriority = ({ value, setValue }: Props) => {
  return (
    <SelectPrimitive.Root
      value={value}
      onValueChange={setValue}
      defaultValue={value}
    >
      <SelectPrimitive.SelectTrigger asChild aria-label={value}>
        <div className='inline-flex select-none items-center justify-center rounded-md border-2 border-transparent shadow-md px-6 py-2 text-sm font-medium bg-super-silver hover:bg-gray-50 dark:bg-black-velvet dark:text-gray-100 dark:hover:bg-absence/50 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75 '>
          <div
            className={`h-[20px] w-1 ${
              value === 'High'
                ? 'bg-rose-500'
                : value === 'Medium'
                ? 'bg-yellow-500'
                : value === 'Low'
                ? 'bg-green-500'
                : ''
            } rounded-md mr-2`}
          ></div>
          <SelectPrimitive.SelectValue placeholder='Priority' />
          <SelectPrimitive.Icon className='ml-1'>
            <ChevronDownIcon />
          </SelectPrimitive.Icon>
        </div>
      </SelectPrimitive.SelectTrigger>
      <SelectPrimitive.Content className='z-50'>
        <SelectPrimitive.Viewport className='bg-white dark:bg-black-velvet p-1 rounded-lg shadow-lg'>
          {['High', 'Medium', 'Low', 'None'].map((f, i) => (
            <SelectPrimitive.Item
              key={`${f}-${i}`}
              value={f}
              className='relative flex items-center px-6 py-2 rounded-md text-sm text-gray-700 dark:text-gray-300 font-medium focus:bg-gray-100 dark:focus:bg-absence/50 focus:outline-none select-none'
            >
              <div
                className={`h-[20px] w-1 ${
                  f === 'High'
                    ? 'bg-rose-500'
                    : f === 'Medium'
                    ? 'bg-yellow-500'
                    : f === 'Low'
                    ? 'bg-green-500'
                    : ''
                } rounded-md mr-2`}
              ></div>
              <SelectPrimitive.ItemText>{f}</SelectPrimitive.ItemText>
              <SelectPrimitive.ItemIndicator className='absolute right-2 inline-flex items-center'>
                <CheckIcon />
              </SelectPrimitive.ItemIndicator>
            </SelectPrimitive.Item>
          ))}
        </SelectPrimitive.Viewport>
      </SelectPrimitive.Content>
    </SelectPrimitive.Root>
  )
}

export default SelectPriority

import * as SelectPrimitive from '@radix-ui/react-select'

import { CheckIcon, ChevronDownIcon } from '@radix-ui/react-icons'
import React, { Dispatch, SetStateAction } from 'react'

import { Column } from '../ts/interfaces'

type Props = {
  columns: { [key: string]: Column }
  value: string
  setValue: Dispatch<SetStateAction<string>>
  error: boolean
}

const SelectColumn = ({ columns, value, setValue, error }: Props) => {
  return (
    <div className='ml-2'>
      <SelectPrimitive.Root onValueChange={setValue}>
        <SelectPrimitive.SelectTrigger asChild aria-label={value}>
          <div
            className={` inline-flex select-none items-center justify-center rounded-md border-2 border-transparent shadow-md px-6 py-2 text-sm font-medium bg-super-silver hover:bg-gray-50 dark:bg-black-velvet dark:text-gray-100 dark:hover:bg-absence/50 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75 ${
              error && ' border-rose-500'
            }`}
          >
            <SelectPrimitive.SelectValue placeholder='Column' />
            <SelectPrimitive.Icon className='ml-1'>
              <ChevronDownIcon />
            </SelectPrimitive.Icon>
          </div>
        </SelectPrimitive.SelectTrigger>
        <SelectPrimitive.Content className='z-50'>
          <SelectPrimitive.Viewport className='bg-white dark:bg-black-velvet p-1 rounded-lg shadow-lg'>
            {Object.entries(columns).map(([c, { title }], i) => (
              <SelectPrimitive.Item
                key={`${title}-${i}`}
                value={title}
                className='relative flex items-center px-6 py-2 rounded-md text-sm text-gray-700 dark:text-gray-300 font-medium focus:bg-gray-100 dark:focus:bg-absence/50 focus:outline-none select-none'
              >
                <SelectPrimitive.ItemText>{title}</SelectPrimitive.ItemText>
                <SelectPrimitive.ItemIndicator className='absolute right-2 inline-flex items-center'>
                  <CheckIcon />
                </SelectPrimitive.ItemIndicator>
              </SelectPrimitive.Item>
            ))}
          </SelectPrimitive.Viewport>
        </SelectPrimitive.Content>
      </SelectPrimitive.Root>
    </div>
  )
}

export default SelectColumn

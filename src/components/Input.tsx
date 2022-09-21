import React, { useEffect, useState } from 'react'

import { InputProps } from '../ts/interfaces'
import SelectColumn from './SelectColumn'
import SelectPriority from './SelectPriority'
import _ from 'lodash'

const Input = ({ state, setState }: InputProps) => {
  const [text, setText] = useState('')

  const [error, setError] = useState(false)
  const [colError, setColError] = useState(false)

  const [selectColumn, setSelectColumn] = React.useState('')
  const [selectPriority, setSelectPriority] = React.useState('')

  const handleChange = (e: React.FormEvent<HTMLInputElement>) => {
    setText(e.currentTarget.value)
  }

  useEffect(() => {
    if (text === '') return

    const keyDownHandler = (event: KeyboardEvent) => {
      setColError(false)
      if (event.key === 'Enter') {
        event.preventDefault()
        setError(false)
        handleClick()
        setText('')
      }
    }
    document.addEventListener('keydown', keyDownHandler)
    return () => {
      document.removeEventListener('keydown', keyDownHandler)
    }
  })

  const handleClick = () => {
    if (text === '') return
    if (!selectColumn) {
      setColError((prev) => !prev)
      return
    }

    setState((prev) => {
      const filterEmptyTasks = _.filter(
        prev.tasks,
        (task) => task.content === ''
      )

      if (filterEmptyTasks.length > 0) {
        setError(true)
        return {
          ...prev,
        }
      }

      const index = _.size(prev.tasks)

      const findColKey = _.findKey(
        prev.columns,
        (col) => col.title === selectColumn
      ) as string

      if (index <= 0)
        return {
          ...prev,
          tasks: {
            ...prev.tasks,
            'task-1': {
              id: 'task-1',
              content: text,
              priority: '',
              label: '',
              objectives: [],
            },
          },
          columns: {
            ...prev.columns,
            [findColKey]: {
              id: findColKey,
              title: prev.columns[findColKey].title,
              taskIds: [...prev.columns[findColKey].taskIds, 'task-1'],
            },
          },
        }

      const last = _.keys(prev.tasks)
      const highestTaskIndex = last[index - 1]
      const lastNum = highestTaskIndex.slice(
        highestTaskIndex.length === 6 ? -1 : -2
      )
      const task = `task-${Number(lastNum) + 1}`

      return {
        ...prev,
        tasks: {
          ...prev.tasks,
          [task]: {
            id: task,
            content: text,
            priority: selectPriority.toLowerCase(),
            label: '',
            objectives: [],
          },
        },
        columns: {
          ...prev.columns,
          [findColKey]: {
            id: findColKey,
            title: prev.columns[findColKey].title,
            taskIds: [...prev.columns[findColKey].taskIds, task],
          },
        },
      }
    })

    setText('')
  }

  const isDisabled = _.isEmpty(state.columns)

  return (
    <div
      className={`border-2 border-transparent rounded-md dark:bg-night-sky bg-white flex justify-center items-center w-full px-2 mt-2 transition-color ${
        error && 'border-rose-500'
      } `}
    >
      <SelectPriority value={selectPriority} setValue={setSelectPriority} />
      <SelectColumn
        columns={state.columns}
        value={selectColumn}
        setValue={setSelectColumn}
        error={colError}
      />
      <input
        autoFocus
        type='text'
        value={text}
        onChange={handleChange}
        placeholder={
          isDisabled ? 'Add a column to add tasks!' : 'Add new item...'
        }
        className='dark:bg-night-sky flex-auto w-auto text-md pl-4 outline-none '
        disabled={isDisabled}
      />
      <button
        onClick={handleClick}
        disabled={isDisabled}
        // onClick={() => console.log(JSON.stringify(state, undefined, 4))}
        className='inline-block my-2 px-6 py-2 bg-white dark:bg-black-velvet font-medium text-md leading-tight rounded-md shadow-md border-2 border-transparent hover:border-green-500 transition duration-150 ease-in-out'
      >
        add
      </button>
    </div>
  )
}

export default Input

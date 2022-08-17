import React, { useEffect, useState } from 'react'
import Select, { SingleValue } from 'react-select'

import { InputProps } from '../ts/interfaces'
import _ from 'lodash'

interface SelectValue {
  value: string
  label: string
}

const Input = ({ state, setState }: InputProps) => {
  const [text, setText] = useState('')
  const [optionsArray, setOptionsArray] = useState([
    { value: 'column-1', label: 'To do' },
    { value: 'column-2', label: 'In progress' },
    { value: 'column-3', label: 'Done' },
  ])
  const [error, setError] = useState(false)
  const [selectedOption, setSelectedOption] = useState(null)
  const [selectedColumn, setSelectedColumn] = useState(state.columnOrder[0])
  const handleChange = (e: React.FormEvent<HTMLInputElement>) => {
    setText(e.currentTarget.value)
  }

  useEffect(() => {
    if (text === '') return
    const keyDownHandler = (event: KeyboardEvent) => {
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
    const index = _.size(state.tasks)
    const task = `task-${index + 1}`

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
      return {
        ...prev,
        tasks: {
          ...prev.tasks,
          [task]: { id: task, content: text },
        },
        columns: {
          ...prev.columns,
          [selectedColumn]: {
            id: selectedColumn,
            title: prev.columns[selectedColumn].title,
            taskIds: [...prev.columns[selectedColumn].taskIds, task],
          },
        },
      }
    })

    setText('')
  }

  useEffect(() => {
    const columnsWithTitles = _.pickBy(state.columns, (val) => val.title !== '')

    const findColumnTitle = _.mapValues(
      columnsWithTitles,
      (column) => column.title
    )

    const objectEntries = Object.entries(findColumnTitle)

    const optionsArray = []
    for (let i = 0; i < objectEntries.length; i++) {
      optionsArray.push({
        value: objectEntries[i][0],
        label: objectEntries[i][1],
      })
    }

    setOptionsArray(optionsArray)
  }, [state.columnOrder, state.columns])

  const selectOptions: SelectValue[] = optionsArray

  const handleSelect = (newSelections: SingleValue<SelectValue>) => {
    if (newSelections) {
      setSelectedColumn(newSelections.value)
    }
  }

  return (
    <div
      className={`border-2 rounded-md dark:bg-black bg-white flex justify-center items-center max-w-screen-md mx-auto mt-2 transition-color ${
        error && 'border-rose-500'
      }`}
    >
      <Select
        className='my-react-select-container '
        classNamePrefix='my-react-select'
        defaultValue={selectedOption}
        onChange={(e) => handleSelect(e)}
        options={selectOptions}
        placeholder={optionsArray[0].label}
        isClearable={false}
        isSearchable={false}
        // menuIsOpen
      />
      <input
        autoFocus
        type='text'
        value={text}
        onChange={handleChange}
        placeholder='Add new item...'
        className=' dark:bg-black flex-auto w-auto text-md pl-4 outline-none '
      ></input>
      <button
        onClick={handleClick}
        className='inline-block m-2 px-6 py-2 bg-white dark:bg-black font-medium text-md leading-tight rounded-md shadow-md border-2 hover:border-blue-500 transition duration-150 ease-in-out'
      >
        add
      </button>
    </div>
  )
}

export default Input

import React, { useState, useEffect } from 'react'
import { Search } from '../ts/interfaces'
import Select, { SingleValue, StylesConfig } from 'react-select'
import _ from 'lodash'

const Search = ({ text, setText, state, setState }: Search) => {
  const [selectedOption, setSelectedOption] = useState(null)
  const [selectedColumn, setSelectedColumn] = useState('column-1')
  const handleChange = (e: React.FormEvent<HTMLInputElement>) => {
    setText(e.currentTarget.value)
  }

  useEffect(() => {
    if (text === '') return
    const keyDownHandler = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        event.preventDefault()
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
    const task = `task-${index + 2}`

    setState((prev) => ({
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
    }))

    setText('')
  }

  interface SelectValue {
    value: string
    label: string
  }

  const selectOptions: SelectValue[] = [
    { value: 'column-1', label: 'To do' },
    { value: 'column-2', label: 'Progress' },
    { value: 'column-3', label: 'Done' },
  ]

  const handleSelect = (newSelections: SingleValue<SelectValue>) => {
    if (newSelections) {
      console.log(newSelections.value)
      setSelectedColumn(newSelections.value)
    }
  }

  const colourStyles: StylesConfig<SelectValue, false> = {
    control: (provided, state) => ({
      ...provided,
      background: 'black',
      height: '100%',
      border: '2px solid white',
      borderRadius: '0.375rem',
      outline: 'none',
      outlineWidth: 0,
      marginBottom: 0,
    }),
    menuList: (provider, state) => ({
      ...provider,
      color: 'white',
      background: 'black',
      border: '2px solid white',
      borderRadius: '0.375rem',
    }),
    option: (provided, state) => ({
      ...provided,
      'fontWeight': state.isSelected ? 'bold' : 'normal',
      'color': 'white',
      'background': state.isSelected ? 'rgb(37,99,235)' : 'black',
      ':hover': {
        background: 'rgb(37,99,235)',
      },
    }),
    singleValue: (provided, state) => ({
      ...provided,
      background: 'black',
      color: 'white',
    }),
    container: (provided, state) => ({
      ...provided,
      marginBottom: 0,
      outline: 'none',
      outlineWidth: 0,
      height: '40px',
    }),
    placeholder: (provided, state) => ({
      ...provided,
      color: 'white',
    }),
  }

  return (
    <div className='border-2 rounded-md bg-black flex items-center mx-20'>
      <Select
        className='w-32 ml-2 select-none'
        defaultValue={selectedOption}
        onChange={(e) => handleSelect(e)}
        options={selectOptions}
        placeholder='To do'
        styles={colourStyles}
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
        className=' bg-black flex-auto w-96 text-md pl-4 outline-none '
      ></input>
      <button
        onClick={handleClick}
        className='inline-block m-2 px-6 py-2.5 bg-blue-600 text-white font-medium text-md leading-tight rounded-md shadow-md hover:bg-blue-700  transition duration-150 ease-in-out'
      >
        add
      </button>
    </div>
  )
}

export default Search

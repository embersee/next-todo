import React, { useEffect } from 'react'
import { Search } from '../ts/interfaces'
import _ from 'lodash'

const Search = ({ text, setText, state, setState }: Search) => {
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
        'column-1': {
          id: 'column-1',
          title: 'To do',
          taskIds: [...prev.columns['column-1'].taskIds, task],
        },
      },
    }))

    setText('')
  }

  return (
    <div className='w-full flex justify-center '>
      <div className='border-2 rounded-md bg-black'>
        <input
          autoFocus
          type='text'
          value={text}
          onChange={handleChange}
          placeholder='Add new item...'
          className=' bg-black w-96 text-md pl-4 outline-none'
        ></input>
        <button
          onClick={handleClick}
          className='inline-block m-2 px-6 py-2.5 bg-blue-600 text-white font-medium text-md leading-tight rounded-md shadow-md hover:bg-blue-700  transition duration-150 ease-in-out'
        >
          add
        </button>
      </div>
    </div>
  )
}

export default Search

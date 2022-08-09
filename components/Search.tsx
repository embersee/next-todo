import React from 'react'
import { Search } from '../ts/interfaces'
import _ from 'lodash'

const Search = ({ text, setText, state, setState }: Search) => {
  const handleChange = (e: React.FormEvent<HTMLInputElement>) => {
    setText(e.currentTarget.value)
  }

  const handleClick = () => {
    const index = _.size(state?.tasks)
    const task: string = `task-${index + 2}`
    console.log(state)
    setState((prev: any) => ({
      ...prev,
      tasks: {
        ...prev.tasks,
        task: { id: task, content: text },
      },
      columns: {
        ...prev.columns,
        'column-1': {
          id: 'column-1',
          title: 'To do',
          taskIds: ['task-1', 'task-2', 'task-3', 'task-4', task],
        },
      },
    }))
    console.log(state)
    setText('')
  }

  return (
    <div>
      <input type='text' value={text} onChange={handleChange} />
      <button onClick={handleClick}>add</button>
    </div>
  )
}

export default Search

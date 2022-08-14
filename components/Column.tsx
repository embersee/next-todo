import { Droppable, Draggable } from 'react-beautiful-dnd'
import Task from './Task'
import { ColumnProps } from '../ts/interfaces'
import _ from 'lodash'
import { useEffect, useState } from 'react'

const Column = ({ column, tasks, index, setState }: ColumnProps) => {
  const [title, setTitle] = useState('')
  const [isFocus, setIsFocus] = useState(true)
  const [isBlur, setIsBlur] = useState(false)

  const handleAddItem = (column: string, text: string) => {
    setState((prev) => {
      //check if there already is a existing new empty task

      //replace lodash with .length xddddd
      const index = _.size(prev.tasks)
      const task = `task-${index + 1}`
      const taskID = `task-${index}`
      const lastTaskObject = _.get(prev.tasks, taskID)

      if (lastTaskObject?.content === '')
        return {
          ...prev,
        }

      return {
        ...prev,
        tasks: {
          ...prev.tasks,
          [task]: { id: task, content: text },
        },
        columns: {
          ...prev.columns,
          [column]: {
            id: column,
            title: prev.columns[column].title,
            taskIds: [...prev.columns[column].taskIds, task],
          },
        },
      }
    })
  }

  useEffect(() => {
    if (title === '') return
    const keyDownHandler = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        event.preventDefault()
        setState((prev) => {
          const columnIndex = prev.columnOrder.length
          const newColumn = `column-${columnIndex}`
          return {
            ...prev,
            columns: {
              ...prev.columns,
              [newColumn]: {
                id: newColumn,
                title: title,
                taskIds: [],
              },
            },
          }
        })
        setTitle('')
      }
    }
    document.addEventListener('keydown', keyDownHandler)
    return () => {
      document.removeEventListener('keydown', keyDownHandler)
    }
  })
  const titleHandler = (input: string) => setTitle(input)
  const blurHandler = () => {
    setIsFocus(false)
    setIsBlur(true)
  }
  const focusHandler = () => {
    setIsFocus(true)
    setIsBlur(false)
  }
  return (
    <Draggable draggableId={column.id} index={index}>
      {({ draggableProps, dragHandleProps, innerRef }, { isDragging }) => (
        <div
          {...draggableProps}
          ref={innerRef}
          className={`w-full bg-white dark:bg-black border-2 rounded-br-3xl border-black rounded-md my-2 mr-2 flex flex-col max-w-xs ${
            isDragging ? 'border-blue-600' : 'border-inherit'
          }`}
        >
          {column.title === '' ? (
            <input
              {...dragHandleProps}
              type='text'
              className={`dark:bg-black text-2xl font-bold flex justify-center mx-2 mt-2 text-center outline-none ${
                isFocus
                  ? 'border-2 rounded-md border-orange-500'
                  : isBlur
                  ? 'border-2 rounded-md border-rose-500'
                  : ''
              }`}
              value={title}
              onChange={(e) => titleHandler(e.target.value)}
              onFocus={focusHandler}
              onBlur={blurHandler}
            />
          ) : (
            <h1
              {...dragHandleProps}
              className='text-2xl font-bold flex justify-center mx-2 pt-2'
            >
              {column.title}
            </h1>
          )}
          <Droppable droppableId={column.id} type='task'>
            {({ droppableProps, innerRef, placeholder }) => (
              <div className='container flex flex-col justify-end h-full'>
                <div
                  ref={innerRef}
                  {...droppableProps}
                  className='flex flex-col flex-grow px-2 pb-2 '
                >
                  {tasks.map((task, i) => (
                    <Task
                      key={task.id}
                      task={task}
                      index={i}
                      setState={setState}
                      column={column.id}
                    />
                  ))}
                  {placeholder}
                </div>
                <button
                  className='border-2 w-8 h-8 rounded-md text-xl m-2'
                  onClick={() => handleAddItem(column.id, '')}
                >
                  <p>+</p>
                </button>
              </div>
            )}
          </Droppable>
        </div>
      )}
    </Draggable>
  )
}

export default Column

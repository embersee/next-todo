import { ChevronUpIcon, MinusIcon, PlusIcon } from '@radix-ui/react-icons'
import { Draggable, Droppable } from 'react-beautiful-dnd'
import { useEffect, useState } from 'react'

import { ColumnProps } from '../ts/interfaces'
import Task from './Task'
import { Tree } from './Tree'
import _ from 'lodash'

const Column = ({ column, tasks, index, setState }: ColumnProps) => {
  const [title, setTitle] = useState('')
  const [isFocus, setIsFocus] = useState(false)
  const [isBlur, setIsBlur] = useState(false)
  const [isOpen, setOpen] = useState(true)

  useEffect(() => {
    if (title === '') return
    const keyDownHandler = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        event.preventDefault()
        handleAddColumn()
        setTitle('')
      }
    }
    document.addEventListener('keydown', keyDownHandler)
    return () => {
      document.removeEventListener('keydown', keyDownHandler)
    }
  })

  const handleAddColumn = () => {
    setIsFocus(false)
    setIsBlur(false)
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
  }

  const handleAddTask = (column: string, text: string) => {
    setState((prev) => {
      const index = _.size(prev.tasks)
      const task = `task-${index + 1}`
      //check if there already is a existing new empty task
      const filterEmptyTasks = _.filter(
        prev.tasks,
        (task) => task.content === ''
      )

      if (filterEmptyTasks.length > 0)
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

  const handleDeleteTask = (column: string) => {
    setState((prev) => {
      return {
        ...prev,
        columns: {
          ...prev.columns,
          [column]: {
            id: column,
            title: prev.columns[column].title,
            taskIds: [...prev.columns[column].taskIds.slice(0, -1)],
          },
        },
      }
    })
  }

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
    <Draggable
      draggableId={column.id}
      index={index}
      isDragDisabled={column.title === ''}
    >
      {({ draggableProps, dragHandleProps, innerRef }, { isDragging }) => (
        <div
          {...draggableProps}
          ref={innerRef}
          className={`w-full border-2 bg-white dark:bg-black border-black rounded-md my-2 mr-2 flex flex-col max-w-xs h-fit transition-colors duration-300 ${
            isDragging ? 'border-blue-600' : 'border-inherit'
          }`}
        >
          <div
            {...dragHandleProps}
            className='p-2 box-border flex flex-row justify-start items-center '
          >
            <PlusIcon
              className='h-7 w-7 shrink-0 cursor-pointer '
              onClick={() => setOpen(!isOpen)}
            />
            {column.title === '' ? (
              <input
                autoFocus
                type='text'
                className={`dark:bg-black text-2xl font-bold w-full outline-none pl-1 transition-colors duration-300  ${
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
                placeholder='Type column name...'
              />
            ) : (
              <h1 className='text-2xl ml-1 font-bold flex justify-center border-2 border-white dark:border-black'>
                {column.title}
              </h1>
            )}
          </div>
          <Droppable
            droppableId={column.id}
            type='task'
            isDropDisabled={!isOpen}
          >
            {(
              { droppableProps, innerRef, placeholder },
              { isDraggingOver }
            ) => (
              <div className='container flex flex-col justify-end h-fit'>
                <Tree isOpen={isOpen}>
                  <div
                    ref={innerRef}
                    {...droppableProps}
                    className={`flex flex-col flex-grow px-2 pb-2 transition-colors duration-500 min-h-400
                    } ${isDraggingOver ? 'bg-blue-500/10' : 'bg-inherit'}`}
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

                  <div className='flex flex-row pl-2 mt-2'>
                    <button
                      className='border-2 p-1 mb-2 rounded-md hover:border-green-500 transition-colors duration-200'
                      onClick={() => handleAddTask(column.id, '')}
                    >
                      <PlusIcon className='h-4 w-4' />
                    </button>
                    <button
                      className='border-2 p-1 mb-2 rounded-md ml-2 hover:border-rose-500 transition-colors duration-200'
                      onClick={() => handleDeleteTask(column.id)}
                    >
                      <MinusIcon className='h-4 w-4' />
                    </button>
                  </div>
                </Tree>
              </div>
            )}
          </Droppable>
        </div>
      )}
    </Draggable>
  )
}

export default Column

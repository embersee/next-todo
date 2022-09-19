import * as ContextMenuPrimitive from '@radix-ui/react-context-menu'

import { ChevronDownIcon, MinusIcon, PlusIcon } from '@radix-ui/react-icons'
import { Draggable, Droppable } from 'react-beautiful-dnd'
import { useEffect, useState } from 'react'

import { ColumnContextMenu } from './utils/ColumnContextMenu'
import { ColumnProps } from '../ts/interfaces'
import Task from './Task'
import { Tree } from './utils/Tree'
import _ from 'lodash'

const Column = ({ column, tasks, index, setState }: ColumnProps) => {
  const [title, setTitle] = useState('')
  const [isFocus, setIsFocus] = useState(false)
  const [isBlur, setIsBlur] = useState(false)
  const [isOpen, setOpen] = useState(true)
  const [renameColumns, setRenameColumns] = useState(false)
  const [contextOpen, setContextOpen] = useState(false)

  useEffect(() => {
    if (title === '') return

    const keyDownHandler = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        event.preventDefault()

        if (renameColumns) {
          handleRenameColumn()
        } else {
          handleAddColumn()
        }
        setRenameColumns(false)
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
      const newColumn = prev.columnOrder.slice(-1)[0]

      //check if there already is a existing new empty column, return nothing if there is more than 1 already existing column
      const filterEmptyColumns = _.filter(
        prev.columns,
        (column) => column.title === ''
      )

      if (filterEmptyColumns.length > 1)
        return {
          ...prev,
        }

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

  const handleRenameColumn = () => {
    setIsFocus(false)
    setIsBlur(false)
    setState((prev) => {
      return {
        ...prev,
        columns: {
          ...prev.columns,
          [column.id]: {
            id: column.id,
            title: title,
            taskIds: prev.columns[column.id].taskIds,
          },
        },
      }
    })
  }

  const handleAddTask = (column: string, text: string) => {
    setState((prev) => {
      const index = _.size(prev.tasks)
      const task = `task-${index + 1}`
      //TODO: task should equal 'task' + 1 from not the amount of tasks left over but take latest task and add a +1 to the number of task
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
          [task]: {
            id: task,
            content: text,
            priority: '',
            label: '',
            objectives: [],
          },
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
      //check if there already is a existing empty task else return
      const filterEmptyTasks = _.filter(
        prev.tasks,
        (task) => task.content === ''
      )

      if (filterEmptyTasks.length > 0)
        return {
          ...prev,
        }

      //get rid of last task in selected column( delete it)
      const newTaskIds = [...prev.columns[column].taskIds.slice(0, -1)]

      const newColumns = {
        ...prev.columns,
        [column]: {
          id: column,
          title: prev.columns[column].title,
          taskIds: newTaskIds,
        },
      }

      //get all tasks inside [column-name].taskIds and combine into single array
      const combinedArray: string[] = []
      Object.keys(prev.columns).forEach((key) => {
        combinedArray.push(...newColumns[key].taskIds)
      })
      //a collator allows for sorting an array of strings with number values inside, so here its 'column-1, column-2' etc, so i sort it in ascending numeric value
      var collator = new Intl.Collator(undefined, {
        numeric: true,
        sensitivity: 'base',
      })

      combinedArray.sort(collator.compare) //sort array with collator

      const filteredTasksInColumn = _.filter(prev.tasks, (task) =>
        combinedArray.includes(task.id)
      )

      //create new tasks object using the array of task names and their respected properties
      const tasksObject = _.zipObject(combinedArray, filteredTasksInColumn)

      return {
        ...prev,
        tasks: tasksObject,
        columns: newColumns,
      }
    })
  }

  const renameColumn = () => {
    setRenameColumns(true)
    setState((prev) => {
      return {
        ...prev,
        columns: {
          ...prev.columns,
          [column.id]: {
            id: column.id,
            title: '',
            taskIds: prev.columns[column.id].taskIds,
          },
        },
      }
    })
  }

  const deleteColumn = () => {
    setState((prev) => {
      const taskToDelete = prev.columns[column.id].taskIds
      const keepTasks = _.omit(prev.tasks, taskToDelete)

      const deleteColumn = _.omit(prev.columns, column.id)
      const newColumnOrder = prev.columnOrder.filter(
        (entry) => entry !== column.id
      )

      return {
        ...prev,
        tasks: keepTasks,
        columns: deleteColumn,
        columnOrder: newColumnOrder,
      }
    })
  }

  const clearTasks = () => {
    setState((prev) => {
      const taskToDelete = prev.columns[column.id].taskIds
      const removeTasks = _.omit(prev.tasks, taskToDelete)
      return {
        ...prev,
        tasks: removeTasks,
        columns: {
          ...prev.columns,
          [column.id]: {
            id: column.id,
            title: prev.columns[column.id].title,
            taskIds: [],
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
          className={`w-full border-2 bg-white dark:bg-night-sky border-night-sky/50 dark:border-super-silver rounded-md my-2 mr-2 flex flex-col max-w-xs h-fit transition-colors ${
            isDragging
              ? 'border-blue-600 dark:border-blue-600'
              : 'border-inherit'
          } ${contextOpen && 'border-blue-600 dark:border-blue-600'}`}
        >
          <ContextMenuPrimitive.Root
            onOpenChange={(open) => setContextOpen(open)}
          >
            <ContextMenuPrimitive.Trigger>
              <ColumnContextMenu
                column={column.id}
                renameColumn={renameColumn}
                addTask={handleAddTask}
                clearTasks={clearTasks}
                deleteColumn={deleteColumn}
              />
              <div
                {...dragHandleProps}
                className='p-2 box-border flex flex-row justify-start items-center '
              >
                <ChevronDownIcon
                  className={`h-6 w-6 shrink-0 cursor-pointer transition-transform duration-300 ${
                    isOpen && '-rotate-90'
                  }`}
                  onClick={() => setOpen(!isOpen)}
                />
                {column.title === '' ? (
                  <input
                    autoFocus
                    type='text'
                    className={`dark:bg-night-sky text-2xl font-bold w-full outline-none pl-1 transition-colors duration-300  ${
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
                  <h1 className='text-2xl ml-1 font-bold flex justify-center border-2 border-white dark:border-night-sky dark:bg-night-sky'>
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
                        className={`flex flex-col flex-grow px-2 pb-2 min-h-400 transition-colors duration-300`}
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
                          className='border-2 dark:bg-black-velvet dark:border-super-silver p-1 mb-2 rounded-md hover:border-green-500 transition-colors duration-200'
                          onClick={() => handleAddTask(column.id, '')}
                        >
                          <PlusIcon className='h-4 w-4' />
                        </button>
                        <button
                          className='border-2 dark:bg-black-velvet  dark:border-super-silver p-1 mb-2 rounded-md ml-2 hover:border-rose-500 transition-colors duration-200'
                          onClick={() => handleDeleteTask(column.id)}
                        >
                          <MinusIcon className='h-4 w-4' />
                        </button>
                      </div>
                    </Tree>
                  </div>
                )}
              </Droppable>
            </ContextMenuPrimitive.Trigger>
          </ContextMenuPrimitive.Root>
        </div>
      )}
    </Draggable>
  )
}

export default Column

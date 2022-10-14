import * as ContextMenuPrimitive from '@radix-ui/react-context-menu'

import { Draggable, DraggableStateSnapshot } from 'react-beautiful-dnd'
import { useEffect, useRef, useState } from 'react'

import { Priority } from './Priority'
import { TaskContextMenu } from '../utils/TaskContextMenu'
import { TaskProps } from '../../ts/interfaces'
import { Tree } from '../utils/Tree'
import _ from 'lodash'
import useDraggableInPortal from '../utils/Portal'
import useLongPress from '../utils/useLongPress'

const Task = ({ task, index, setState, column }: TaskProps) => {
  const [isFocus, setIsFocus] = useState(false)
  const [isBlur, setIsBlur] = useState(false)
  const [isOpen, setOpen] = useState(false)
  const [step, setStep] = useState('')
  const [text, setText] = useState('')
  const [addStep, setAddStep] = useState(false)
  const [completeObjectives, setCompleteObjectives] = useState<number>()
  const [renameTrigger, setRenameTrigger] = useState(false)
  const [contextOpen, setContextOpen] = useState(false)

  const renderDraggable = useDraggableInPortal()

  //using longPress on a step of a task to delete it!
  const longPressProps = useLongPress(
    {
      onLongPress: (e) => {
        let target = e.target as HTMLInputElement
        target.className =
          'checkbox-custom-label transiton-color select-none text-rose-500'
        setTimeout(() => {
          setState((prev) => {
            return {
              ...prev,
              tasks: {
                ...prev.tasks,
                [task.id]: {
                  id: prev.tasks[task.id].id,
                  content: prev.tasks[task.id].content,
                  priority: prev.tasks[task.id].priority,
                  label: prev.tasks[task.id].label,
                  objectives: [
                    ...prev.tasks[task.id].objectives.filter(
                      (item) => item.step !== target.id
                    ),
                  ],
                },
              },
            }
          })
          target.className = 'checkbox-custom-label transiton-color select-none'
        }, 500)
      },
    },
    {
      delay: 1000,
      shouldPreventDefault: true,
    }
  )

  //update title of task to step completion value
  useEffect(() => {
    const countCompleteObjectives = _.filter(
      task.objectives,
      (step) => step.complete === true
    )
    setCompleteObjectives(countCompleteObjectives.length)
  }, [task.objectives])

  const textareaRef = useRef<HTMLTextAreaElement>(null)
  //expand textarea element depending on user input / length of the text
  useEffect(() => {
    if (textareaRef.current === null) return
    textareaRef.current.style.height = '0px'
    const scrollHeight = textareaRef.current.scrollHeight
    textareaRef.current.style.height = scrollHeight + 'px'
    textareaRef.current.blur
  }, [step])

  //set task title
  useEffect(() => {
    if (text === '') return
    const keyDownTaskHandler = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        event.preventDefault()

        if (renameTrigger) {
          setRetriggerTaskTitle()
        } else {
          setTaskTitle()
        }
        setRenameTrigger(false)
        setText('')
      }
    }
    document.addEventListener('keydown', keyDownTaskHandler)
    return () => {
      document.removeEventListener('keydown', keyDownTaskHandler)
    }
  })

  const setTaskTitle = () => {
    setIsFocus(false)
    setIsBlur(false)
    setState((prev) => {
      const index = _.size(prev.tasks)

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
            [column]: {
              id: column,
              title: prev.columns[column].title,
              taskIds: [...prev.columns[column].taskIds, 'task-1'],
            },
          },
        }

      const last = _.keys(prev.tasks)
      const highestTaskIndex = last[index - 1]
      const lastNum = highestTaskIndex.slice(
        highestTaskIndex.length === 6 ? -1 : -2
      )
      const task = `task-${Number(lastNum)}` //because we are modifying a previously empty content task we remove the +1

      return {
        ...prev,
        tasks: {
          ...prev.tasks,
          [task]: {
            id: task, //??
            content: text,
            priority: prev.tasks[task].priority,
            label: prev.tasks[task].label,
            objectives: [],
          },
        },
        columns: {
          ...prev.columns,
          [column]: {
            id: column,
            title: prev.columns[column].title,
            taskIds: [...prev.columns[column].taskIds.slice(0, -1), task],
          },
        },
      }
    })
  }

  const setRetriggerTaskTitle = () => {
    setIsFocus(false)
    setIsBlur(false)
    setState((prev) => {
      return {
        ...prev,
        tasks: {
          ...prev.tasks,
          [task.id]: {
            id: task.id, //??
            content: text,
            priority: prev.tasks[task.id].priority,
            label: prev.tasks[task.id].label,
            objectives: prev.tasks[task.id].objectives,
          },
        },
        columns: {
          ...prev.columns,
          [column]: {
            id: column,
            title: prev.columns[column].title,
            taskIds: prev.columns[column].taskIds,
          },
        },
      }
    })
  }
  //set steps
  useEffect(() => {
    if (step === '') return

    if (step) {
      const keyDownStepHandler = (event: KeyboardEvent) => {
        if (event.key === 'Enter') {
          event.preventDefault()
          setStepsName()
          setStep('')
        }
      }

      document.addEventListener('keydown', keyDownStepHandler)
      return () => {
        document.removeEventListener('keydown', keyDownStepHandler)
      }
    }
  })

  const setStepsName = () => {
    setIsFocus(false)
    setIsBlur(false)
    setState((prev) => {
      return {
        ...prev,
        tasks: {
          ...prev.tasks,
          [task.id]: {
            id: prev.tasks[task.id].id,
            content: prev.tasks[task.id].content,
            priority: prev.tasks[task.id].priority,
            label: prev.tasks[task.id].label,
            objectives: [...task.objectives, { step: step, complete: false }],
          },
        },
      }
    })
  }

  const updateChecked = (index: number, newCheck: boolean) => {
    const updatedCheckedItems = [...task.objectives]
    updatedCheckedItems[index].complete = newCheck
    setState((prev) => {
      return {
        ...prev,
        tasks: {
          ...prev.tasks,
          [task.id]: {
            id: prev.tasks[task.id].id,
            content: prev.tasks[task.id].content,
            priority: prev.tasks[task.id].priority,
            label: prev.tasks[task.id].label,
            objectives: [...updatedCheckedItems],
          },
        },
      }
    })
    const countCompleteObjectives = _.filter(
      task.objectives,
      (step) => step.complete === true
    )
    setCompleteObjectives(countCompleteObjectives.length)
  }

  const handleChange = (text: string) => setText(text)
  const handleStep = (step: string) => setStep(step)
  const blurHandler = () => {
    setIsFocus(false)
    setIsBlur(true)
  }
  const focusHandler = () => {
    setIsFocus(true)
    setIsBlur(false)
  }

  const renameTask = () => {
    setRenameTrigger(true)

    setState((prev) => {
      return {
        ...prev,
        tasks: {
          ...prev.tasks,
          [task.id]: {
            id: prev.tasks[task.id].id,
            content: '',
            priority: prev.tasks[task.id].priority,
            label: prev.tasks[task.id].label,
            objectives: prev.tasks[task.id].objectives,
          },
        },
      }
    })
  }

  const givePriority = ({ prio }: { prio: string }) => {
    setState((prev) => {
      return {
        ...prev,
        tasks: {
          ...prev.tasks,
          [task.id]: {
            id: prev.tasks[task.id].id,
            content: prev.tasks[task.id].content,
            priority: prio,
            label: prev.tasks[task.id].label,
            objectives: prev.tasks[task.id].objectives,
          },
        },
      }
    })
  }

  const deleteTask = () => {
    setState((prev) => {
      //get rid of last task in selected column( delete it)
      const taskToDelete = task.id
      const newTaskIds = [
        ...prev.columns[column].taskIds.filter((task) => task !== taskToDelete),
      ]

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

  return (
    <Draggable
      draggableId={task.id}
      index={index}
      isDragDisabled={isFocus || isBlur || isOpen} // || isOpen
      shouldRespectForcePress={true}
    >
      {renderDraggable(
        (
          { draggableProps, dragHandleProps, innerRef },
          snapshot: DraggableStateSnapshot
        ) => (
          <div
            {...draggableProps}
            ref={innerRef}
            className={`bg-white dark:bg-black-velvet border-2 p-2 pb-1 rounded-md mb-2 h-auto min-h-[43px] transition-colors duration-300 shadow-md
            ${
              contextOpen
                ? 'border-blue-400 dark:border-blue-400'
                : snapshot.isDragging
                ? 'border-blue-400 dark:border-blue-400'
                : isFocus
                ? ' border-orange-500 '
                : isBlur
                ? ' border-rose-500 '
                : 'border-black-velvet'
            } `}
          >
            <ContextMenuPrimitive.Root
              onOpenChange={(open) => setContextOpen(open)}
            >
              <ContextMenuPrimitive.Trigger>
                <TaskContextMenu
                  renameTask={renameTask}
                  givePriority={givePriority}
                  deleteTask={deleteTask}
                />

                <div
                  {...dragHandleProps}
                  className='flex flex-row select-none cursor-pointer h-auto leading-normal'
                >
                  <div className='flex-grow-0 '>
                    <Priority prio={task.priority} />
                  </div>
                  <div className='flex flex-row items-center w-full'>
                    {task.content ? (
                      <span
                        onClick={() => {
                          setAddStep(
                            !(task.objectives.length > 0) ? true : false
                          ),
                            setOpen((prev) => !prev)
                        }}
                      >
                        {task.content}
                        <span
                          className={`ml-2 ${
                            (
                              task.objectives.length && completeObjectives
                                ? 1
                                : 0
                            )
                              ? `opacity-100`
                              : 'opacity-0'
                          }`}
                        >
                          {completeObjectives}/{task.objectives.length}
                        </span>
                      </span>
                    ) : (
                      <input
                        autoFocus
                        type='text'
                        value={text}
                        onChange={(e) => handleChange(e.target.value)}
                        onFocus={focusHandler}
                        onBlur={blurHandler}
                        placeholder='Type your task...'
                        className={`dark:bg-black-velvet h-full text-md outline-none w-full`}
                      ></input>
                    )}
                  </div>
                </div>
                <div className='flex flex-col h-full mx-2 mt-1'>
                  <Tree isOpen={isOpen}>
                    {task.objectives.map((obj, i) => {
                      return (
                        <div
                          key={i}
                          className='text-sm h-full py-1 flex justify-items-center'
                        >
                          <input
                            id={obj.step}
                            type='checkbox'
                            name={obj.step}
                            checked={obj.complete}
                            onChange={(e) => updateChecked(i, !obj.complete)}
                            className='styled-checkbox'
                            tabIndex={-1}
                          />
                          <label
                            {...longPressProps}
                            id={obj.step}
                            className='checkbox-custom-label select-none transiton-color'
                            htmlFor={obj.step}
                            tabIndex={-1}
                          >
                            {obj.step}
                          </label>
                        </div>
                      )
                    })}

                    <Tree isOpen={addStep}>
                      <textarea
                        tabIndex={-1}
                        ref={textareaRef}
                        value={step}
                        onChange={(e) => handleStep(e.target.value)}
                        // onFocus={focusHandler}
                        // onBlur={blurHandler}
                        placeholder='add step...'
                        className={`bg-super-silver dark:bg-night-sky h-[28px] p-1 ml-[22px] text-sm outline-none w-[90%] overflow-x-hidden resize-none rounded-md`}
                        autoComplete='on'
                        spellCheck='false'
                      />
                    </Tree>
                  </Tree>
                </div>
              </ContextMenuPrimitive.Trigger>
            </ContextMenuPrimitive.Root>
          </div>
        )
      )}
    </Draggable>
  )
}
export default Task

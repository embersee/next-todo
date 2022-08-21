import { Draggable, DraggableStateSnapshot } from 'react-beautiful-dnd'
import { Transition, animated } from '@react-spring/web'
import { useEffect, useRef, useState } from 'react'

import { Pencil1Icon } from '@radix-ui/react-icons'
import { TaskProps } from '../ts/interfaces'
import { Tree } from './utils/Tree'
import _ from 'lodash'
import useDraggableInPortal from './utils/Portal'
import useLongPress from './utils/useLongPress'

const Task = ({ task, index, setState, column }: TaskProps) => {
  const [isFocus, setIsFocus] = useState(false)
  const [isBlur, setIsBlur] = useState(false)
  const [isOpen, setOpen] = useState(false)
  const [step, setStep] = useState('')
  const [text, setText] = useState('')
  const [addStep, setAddStep] = useState(false)
  const [completeObjectives, setCompleteObjectives] = useState<number>()

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

  //set task content
  useEffect(() => {
    if (text === '') return
    const keyDownTaskHandler = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        event.preventDefault()
        setTaskTitle()
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
      const task = `task-${index}`

      return {
        ...prev,
        tasks: {
          ...prev.tasks,
          [task]: { id: task, content: text, objectives: [] },
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
            className={`bg-white dark:bg-black-velvet border-2 p-2 pb-1 rounded-md mt-2 h-auto min-h-[43px] transition-colors duration-300 ${
              isFocus
                ? 'transition-none border-orange-500 '
                : isBlur
                ? 'border-rose-500 '
                : snapshot.isDragging
                ? ' border-blue-400 '
                : ' hover:border-blue-400'
            } `}
          >
            <div
              {...dragHandleProps}
              className='flex flex-row justify-between items-center select-none cursor-pointer h-auto'
            >
              {task.content ? (
                <span
                  onClick={() => {
                    setOpen((prev) => !prev),
                      setAddStep(!(task.objectives.length > 0) ? true : false)
                  }}
                >
                  {task.content}{' '}
                  <span
                    className={`${
                      (task.objectives.length && completeObjectives ? 1 : 0)
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
              {isOpen ? (
                <Transition
                  items={isOpen}
                  from={{ opacity: 0 }}
                  enter={{ opacity: 1 }}
                  leave={{ opacity: 0 }}
                  delay={200}
                >
                  {(style) => (
                    <animated.div style={{ ...style }}>
                      <Pencil1Icon
                        className={`h-5 w-5 cursor-pointer`}
                        onClick={() => {
                          task.objectives.length
                            ? setAddStep((prev) => !prev)
                            : setOpen((prev) => !prev)
                        }}
                      />
                    </animated.div>
                  )}
                </Transition>
              ) : (
                ''
              )}
            </div>
            <div className='flex flex-col h-auto mx-2'>
              <Tree isOpen={isOpen}>
                <div className='pt-1'>
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
                        />
                        <label
                          {...longPressProps}
                          id={obj.step}
                          className='checkbox-custom-label select-none transiton-color'
                          htmlFor={obj.step}
                        >
                          {obj.step}
                        </label>
                      </div>
                    )
                  })}

                  <Tree isOpen={addStep}>
                    <textarea
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
                </div>
              </Tree>
            </div>
          </div>
        )
      )}
    </Draggable>
  )
}
export default Task

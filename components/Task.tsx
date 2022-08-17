import {
  Draggable,
  DraggableProvided,
  DraggableStateSnapshot,
  DraggingStyle,
} from 'react-beautiful-dnd'
import { ReactElement, useEffect, useRef, useState } from 'react'

import { TaskProps } from '../ts/interfaces'
import _ from 'lodash'
import { createPortal } from 'react-dom'

const useDraggableInPortal = () => {
  const element = useRef<HTMLDivElement>(document.createElement('div')).current

  useEffect(() => {
    if (element) {
      element.style.pointerEvents = 'none'
      element.style.position = 'absolute'
      element.style.height = '100%'
      element.style.width = '100%'
      element.style.top = '0'

      document.body.appendChild(element)

      return () => {
        document.body.removeChild(element)
      }
    }
  }, [element])

  return (
      render: (
        { draggableProps, dragHandleProps, innerRef }: DraggableProvided,
        snapshot: DraggableStateSnapshot
      ) => ReactElement
    ) =>
    (
      { draggableProps, dragHandleProps, innerRef }: DraggableProvided,
      snapshot: DraggableStateSnapshot
    ) => {
      const result = render(
        { draggableProps, dragHandleProps, innerRef },
        snapshot
      )
      const style = draggableProps.style as DraggingStyle
      if (style.position === 'fixed') {
        return createPortal(result, element)
      }
      return result
    }
}

const Task = ({ task, index, setState, column }: TaskProps) => {
  const [isFocus, setIsFocus] = useState(false)
  const [isBlur, setIsBlur] = useState(false)
  const [text, setText] = useState('')

  const renderDraggable = useDraggableInPortal()

  useEffect(() => {
    if (text === '') return
    const keyDownHandler = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        event.preventDefault()
        setIsFocus(false)
        setIsBlur(false)
        setState((prev) => {
          const index = _.size(prev.tasks)
          const task = `task-${index}`

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
                taskIds: [...prev.columns[column].taskIds.slice(0, -1), task],
              },
            },
          }
        })
        setText('')
      }
    }
    document.addEventListener('keydown', keyDownHandler)
    return () => {
      document.removeEventListener('keydown', keyDownHandler)
    }
  })

  const handleChange = (text: string) => setText(text)
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
      isDragDisabled={isFocus || isBlur}
    >
      {renderDraggable(
        (
          { draggableProps, dragHandleProps, innerRef },
          snapshot: DraggableStateSnapshot
        ) => (
          <div
            {...draggableProps}
            {...dragHandleProps}
            ref={innerRef}
            className={`bg-white dark:bg-black border-2 p-2 rounded-md flex flex-col mt-2 min-h-[43px] transition-colors duration-300  ${
              isFocus
                ? 'transition-none border-orange-500 '
                : isBlur
                ? 'border-rose-500 '
                : snapshot.isDragging
                ? ' border-blue-400 '
                : 'transition-none hover:border-blue-400'
            }`}
          >
            {task.content !== '' ? (
              task.content
            ) : (
              <input
                autoFocus
                type='text'
                value={text}
                onChange={(e) => handleChange(e.target.value)}
                onFocus={focusHandler}
                onBlur={blurHandler}
                placeholder='Type your task...'
                className={`dark:bg-black text-md outline-none w-full`}
              ></input>
            )}
          </div>
        )
      )}
    </Draggable>
  )
}
export default Task

import { useState, useEffect } from 'react'
import { Draggable, DraggableProvidedDraggableProps } from 'react-beautiful-dnd'
import { TaskProps } from '../ts/interfaces'
import _ from 'lodash'

const Task = ({ task, index, setState, column }: TaskProps) => {
  const [isFocus, setIsFocus] = useState(false)
  const [isBlur, setIsBlur] = useState(false)
  const [text, setText] = useState('')
  const getItemStyle = (
    isDragging: boolean,
    draggableStyle: DraggableProvidedDraggableProps
  ) => ({
    borderColor: isDragging ? '#2563eb' : 'white',
    ...draggableStyle.style,
  })

  useEffect(() => {
    if (text === '') return
    const keyDownHandler = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        event.preventDefault()
        setState((prev) => {
          const index = _.size(prev.tasks)
          const task = `task-${index + 1}`

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
    <Draggable draggableId={task.id} index={index}>
      {({ draggableProps, dragHandleProps, innerRef }, { isDragging }) => (
        <div
          {...draggableProps}
          {...dragHandleProps}
          ref={innerRef}
          className={`border-2 p-2 rounded-md flex flex-col mt-2 min-h-[43px] ${
            isFocus
              ? ' border-orange-500'
              : isBlur
              ? 'border-rose-500'
              : isDragging
              ? 'border-blue-600'
              : 'border-inherit'
          }`}
          //style={getItemStyle(isDragging, draggableProps)}
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
              className={`bg-black text-md outline-none `}
            ></input>
          )}
        </div>
      )}
    </Draggable>
  )
}
export default Task

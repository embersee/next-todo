import {
  Droppable,
  Draggable,
  DraggableProvidedDraggableProps,
} from 'react-beautiful-dnd'
import Task from './Task'
import { ColumnProps } from '../ts/interfaces'
import _ from 'lodash'

const Column = ({ column, tasks, index, setState }: ColumnProps) => {
  const getItemStyle = (
    isDragging: boolean,
    draggableStyle: DraggableProvidedDraggableProps
  ) => ({
    borderColor: isDragging ? '#2563eb' : 'white',
    ...draggableStyle.style,
  })

  const handleAddItem = (column: string, text: string) => {
    setState((prev) => {
      //check if there already is a existing new empty task
      const index = _.size(prev.tasks)
      const task = `task-${index + 1}`
      const taskID = `task-${index}`
      const lastTaskObject = _.get(prev.tasks, taskID)

      if (lastTaskObject.content === '')
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

  return (
    <Draggable draggableId={column.id} index={index}>
      {({ draggableProps, dragHandleProps, innerRef }, { isDragging }) => (
        <div
          {...draggableProps}
          // {...draggableProvided.dragHandleProps}
          ref={innerRef}
          className='w-full border-2 rounded-md my-2 mr-2 flex flex-col max-w-xs'
          style={getItemStyle(isDragging, draggableProps)}
        >
          <h1
            {...dragHandleProps}
            className='text-2xl font-bold flex justify-center m-2 '
          >
            {column.title}
          </h1>
          <Droppable droppableId={column.id} type='task'>
            {({ droppableProps, innerRef, placeholder }) => (
              <div className='container flex flex-col justify-end h-full'>
                <div
                  ref={innerRef}
                  {...droppableProps}
                  className='flex flex-col flex-grow p-2 '
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
                  className='border-2 p-2 rounded-md m-2 mt-auto'
                  onClick={() => handleAddItem(column.id, '')}
                >
                  add item
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

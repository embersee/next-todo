import {
  Droppable,
  Draggable,
  DraggableProvidedDraggableProps,
} from 'react-beautiful-dnd'
import Task from './Task'
import { ColumnProps } from '../ts/interfaces'

const Column = ({ column, tasks, index }: ColumnProps) => {
  const getItemStyle = (
    isDragging: boolean,
    draggableStyle: DraggableProvidedDraggableProps
  ) => ({
    borderColor: isDragging ? '#2563eb' : 'white',
    ...draggableStyle.style,
  })

  return (
    <Draggable draggableId={column.id} index={index}>
      {({ draggableProps, dragHandleProps, innerRef }, { isDragging }) => (
        <div
          {...draggableProps}
          // {...draggableProvided.dragHandleProps}
          ref={innerRef}
          className='border-2 rounded-md m-2'
          style={getItemStyle(isDragging, draggableProps)}
        >
          <h1
            {...dragHandleProps}
            className='text-2xl font-bold flex justify-center w-72 m-2'
          >
            {column.title}
          </h1>
          <Droppable droppableId={column.id} type='task'>
            {({ droppableProps, innerRef, placeholder }, snapshot) => (
              <div
                ref={innerRef}
                {...droppableProps}
                className='flex flex-col flex-grow justify-between p-2 min-h-[100px]'
              >
                {tasks.map((task, i) => (
                  <Task key={task.id} task={task} index={i} />
                ))}
                {placeholder}
              </div>
            )}
          </Droppable>
        </div>
      )}
    </Draggable>
  )
}

export default Column

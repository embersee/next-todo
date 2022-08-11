import { Draggable, DraggableProvidedDraggableProps } from 'react-beautiful-dnd'
import { TaskProps } from '../ts/interfaces'

const Task = ({ task, index }: TaskProps) => {
  const getItemStyle = (
    isDragging: boolean,
    draggableStyle: DraggableProvidedDraggableProps
  ) => ({
    borderColor: isDragging ? '#2563eb' : 'white',
    ...draggableStyle.style,
  })
  return (
    <Draggable draggableId={task.id} index={index}>
      {({ draggableProps, dragHandleProps, innerRef }, { isDragging }) => (
        <div
          {...draggableProps}
          {...dragHandleProps}
          ref={innerRef}
          className='border-2 p-2 rounded-md flex flex-col mt-2 '
          style={getItemStyle(isDragging, draggableProps)}
        >
          {task.content}
        </div>
      )}
    </Draggable>
  )
}
export default Task

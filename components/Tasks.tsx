import { Draggable } from 'react-beautiful-dnd'
import { TaskProps } from '../ts/interfaces'

const Task = ({ task, index }: TaskProps) => {
  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          className='border m-4 p-8'
        >
          {task.content}
        </div>
      )}
    </Draggable>
  )
}

export default Task

import { Droppable, Draggable } from 'react-beautiful-dnd'
import Tasks from './Tasks'
import { ColumnProps } from '../ts/interfaces'

const Column = ({ column, tasks, index }: ColumnProps) => (
  <Draggable draggableId={column.id} index={index}>
    {(draggableProvided, snapshot) => (
      <div
        {...draggableProvided.draggableProps}
        // {...draggableProvided.dragHandleProps}
        ref={draggableProvided.innerRef}
        className='border rounded-md m-2'
      >
        <h1
          {...draggableProvided.dragHandleProps}
          className='text-2xl font-bold flex justify-center w-72 m-2'
        >
          {column.title}
        </h1>
        <Droppable droppableId={column.id} type='task'>
          {(droppableProvided, snapshot) => (
            <div
              ref={droppableProvided.innerRef}
              {...droppableProvided.droppableProps}
              className='flex flex-col flex-grow justify-between p-2 min-h-[100px]'
            >
              {tasks.map((t, i) => (
                <Tasks key={t.id} task={t} index={i} />
              ))}

              {droppableProvided.placeholder}
            </div>
          )}
        </Droppable>
      </div>
    )}
  </Draggable>
)

export default Column

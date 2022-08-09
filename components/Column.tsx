import { Droppable, Draggable } from 'react-beautiful-dnd'
import Tasks from './Tasks'
import { ColumnProps } from '../ts/interfaces'

const Column = ({ column, tasks, index }: ColumnProps) => (
  <div className=''>
    <Draggable draggableId={column.id} index={index}>
      {(draggableProvided, snapshot) => (
        <div
          {...draggableProvided.draggableProps}
          // {...draggableProvided.dragHandleProps}
          ref={draggableProvided.innerRef}
        >
          <h1
            {...draggableProvided.dragHandleProps}
            className='text-2xl border flex justify-center min-w-[250px]'
          >
            {column.title}
          </h1>
          <Droppable droppableId={column.id} type='task'>
            {(droppableProvided, snapshot) => (
              <div
                ref={droppableProvided.innerRef}
                {...droppableProvided.droppableProps}
                className='border min-h-[40px]'
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
  </div>
)

export default Column

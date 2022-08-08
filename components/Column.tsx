import { Droppable, Draggable } from 'react-beautiful-dnd'
import Tasks from './Tasks'
import { ColumnProps } from '../ts/interfaces'

const Column = ({ column, tasks, index }: ColumnProps) => (
  <div className='flex-row mx-8 w-1/3'>
    <Draggable draggableId={column.id} index={index}>
      {(provided, snapshot) => (
        <div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
        >
          <h1 {...provided.dragHandleProps} className='text-2xl border'>
            {column.title}
          </h1>
          <Droppable droppableId={column.id} type='task'>
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className='border'
              >
                {tasks.map((t, i) => (
                  <Tasks key={t.id} task={t} index={i} />
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
      )}
    </Draggable>
  </div>
)

export default Column

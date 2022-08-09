import React, { useState } from 'react'
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd'
import Column from './Column'
import { data } from './Data'
import Search from './Search'

export default function App() {
  const [state, setState] = useState(data)

  const onDragEnd = (res: DropResult) => {
    const { destination, source, draggableId, type } = res

    if (!destination) {
      return
    }
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return
    }

    //move columns
    if (type === 'column') {
      const newColumnOrder = [...state.columnOrder]
      newColumnOrder.splice(source.index, 1)
      newColumnOrder.splice(destination.index, 0, draggableId)

      const newState = {
        ...state,
        columnOrder: newColumnOrder,
      }
      setState(newState)
      return
    }

    //move inside columns
    const startcol = state.columns[source.droppableId]
    const endcol = state.columns[destination.droppableId]

    if (startcol === endcol) {
      const tasks = [...startcol.taskIds]
      tasks.splice(source.index, 1)
      tasks.splice(destination.index, 0, draggableId)

      const newCol = {
        ...startcol,
        taskIds: tasks,
      }

      const newState = {
        ...state,
        columns: {
          ...state.columns,
          [newCol.id]: newCol,
        },
      }

      setState(newState)
      return
    }

    //move between columns
    const startTaskIds = [...startcol.taskIds]
    startTaskIds.splice(source.index, 1)
    const newStart = {
      ...startcol,
      taskIds: startTaskIds,
    }
    const endTaskIds = [...endcol.taskIds]
    endTaskIds.splice(destination.index, 0, draggableId)
    const newEnd = {
      ...endcol,
      taskIds: endTaskIds,
    }
    const newState = {
      ...state,
      columns: {
        ...state.columns,
        [newStart.id]: newStart,
        [newEnd.id]: newEnd,
      },
    }
    setState(newState)
  }

  return (
    <div>
      {/* <Search /> */}
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId='columns' direction='horizontal' type='column'>
          {(providedr) => (
            <div
              {...providedr.droppableProps}
              ref={providedr.innerRef}
              className='flex justify-center border h-fit w-full'
            >
              {state.columnOrder.map((id: string, i: number) => {
                const col = state.columns[id]
                const tasks = col.taskIds.map((taskid) => state.tasks[taskid])
                return <Column key={id} column={col} tasks={tasks} index={i} />
              })}
              {providedr.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  )
}

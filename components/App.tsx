import React, { useState } from 'react'
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd'
import Column from './Column'
import { data } from '../src/Data'
import Search from './Search'

export default function App() {
  const [state, setState] = useState(data)
  const [text, setText] = useState('')

  const onDragEnd = (res: DropResult) => {
    const { destination, source, draggableId, type } = res

    if (!destination) {
      return
    }

    //dropped task in the origin location
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return
    }

    //move columns order
    if (type === 'column') {
      const newColumnOrder = [...state.columnOrder]
      newColumnOrder.splice(source.index, 1)
      newColumnOrder.splice(destination.index, 0, draggableId)

      setState((prev) => ({
        ...prev,
        columnOrder: newColumnOrder,
      }))
      return
    }

    //move tasks inside columns
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

      setState((prev) => ({
        ...prev,
        columns: {
          ...prev.columns,
          [newCol.id]: newCol,
        },
      }))
      return
    }

    //move tasks between columns
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

    setState((prev) => ({
      ...prev,
      columns: {
        ...prev.columns,
        [newStart.id]: newStart,
        [newEnd.id]: newEnd,
      },
    }))
  }

  return (
    <>
      <Search text={text} setText={setText} state={state} setState={setState} />

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId='columns' direction='horizontal' type='column'>
          {(providedr) => (
            <div
              {...providedr.droppableProps}
              ref={providedr.innerRef}
              className='flex justify-center h-fit w-full'
            >
              {state.columnOrder.map((id, i) => {
                const col = state.columns[id]
                const tasks = col.taskIds.map((taskid) => state.tasks[taskid])
                return <Column key={id} column={col} tasks={tasks} index={i} />
              })}
              {providedr.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </>
  )
}

import React, { useState } from 'react'
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd'
import Column from './Column'
import { Data } from '../ts/interfaces'

const data: Data = {
  tasks: {
    task1: {
      id: 'task1',
      content: 'Take out the bins',
    },
    task2: {
      id: 'task2',
      content: 'Watch TV',
    },
    task3: {
      id: 'task3',
      content: 'Charge phone',
    },
    task4: {
      id: 'task4',
      content: 'Cook dinner',
    },
  },
  columns: {
    col1: {
      id: 'col1',
      title: 'Todo',
      taskIds: ['task1', 'task2', 'task3', 'task4'],
    },
    col2: {
      id: 'col2',
      title: 'Progress',
      taskIds: [],
    },
    col3: {
      id: 'col3',
      title: 'Done',
      taskIds: [],
    },
  },
  columnOrder: ['col1', 'col2', 'col3'],
}

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
      const newColOrd = [...state.columnOrder]
      newColOrd.splice(source.index, 1)
      newColOrd.splice(destination.index, 0, draggableId)

      const newState = {
        ...state,
        columnOrder: newColOrd,
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
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId='columns' direction='horizontal' type='column'>
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className='flex w-full border'
          >
            {state.columnOrder.map((id: string, i: number) => {
              const col = state.columns[id]
              const tasks = col.taskIds.map((taskid) => state.tasks[taskid])
              return <Column key={id} column={col} tasks={tasks} index={i} />
            })}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  )
}

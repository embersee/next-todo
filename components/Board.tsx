import { DragDropContext, DropResult, Droppable } from 'react-beautiful-dnd'
import React, { useState } from 'react'

import Column from './Column'
import Input from './Input'
import Plus from './buttons/Plus'
import X from './buttons/X'
import { data } from '../pages/api/data'

export default function Board() {
  const [state, setState] = useState(data)

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

  const addColumn = () => {
    setState((prev) => {
      const columnIndex = prev.columnOrder.length
      const newColumn = `column-${columnIndex + 1}`
      return {
        ...prev,
        columns: {
          ...prev.columns,
          [newColumn]: {
            id: newColumn,
            title: '',
            taskIds: [],
          },
        },

        columnOrder: [...prev.columnOrder, newColumn],
      }
    })
  }

  const deleteColumn = () => {
    setState((prev) => {
      return {
        ...prev,
        columns: {
          ...prev.columns,
          [prev.columnOrder[prev.columnOrder.length - 1]]: {
            id: '',
            title: '',
            taskIds: [],
          },
        },
        columnOrder: [...prev.columnOrder.slice(0, -1)],
      }
    })
  }
  return (
    <>
      <Input state={state} setState={setState} />
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId='columns' direction='horizontal' type='column'>
          {({ droppableProps, innerRef, placeholder }) => (
            <div
              {...droppableProps}
              ref={innerRef}
              className=' h-fit w-full container flex justify-center'
            >
              {state.columnOrder.map((id, i) => {
                const col = state.columns[id]
                const tasks = col.taskIds.map((taskid) => state.tasks[taskid])
                return (
                  <Column
                    key={id}
                    column={col}
                    tasks={tasks}
                    index={i}
                    setState={setState}
                  />
                )
              })}
              {placeholder}

              {state.columnOrder.length < 5 ? (
                <div className='flex flex-col mb-2 mt-2'>
                  <button
                    onClick={addColumn}
                    className='border-2 bg-white dark:bg-black w-8 h-8 rounded-md mb-2 flex flex-col justify-center hover:border-green-500 transition-colors duration-200'
                  >
                    <Plus />
                  </button>
                  <button
                    onClick={deleteColumn}
                    className='border-2 bg-white dark:bg-black w-8 h-8 rounded-md flex flex-col justify-center hover:border-rose-500 transition-colors duration-200'
                  >
                    <X />
                  </button>
                </div>
              ) : (
                ''
              )}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </>
  )
}

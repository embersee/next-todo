import { Data } from '../../ts/interfaces'

export const data: Data = {
  tasks: {
    'task-1': {
      id: 'task-1',
      content: 'Take out the garbage',
      objectives: [
        { step: 'get garbage bag', complete: false },
        { step: 'collect trash', complete: false },
      ],
    },
    'task-2': {
      id: 'task-2',
      content: 'Watch my favorite show',
      objectives: [
        { step: 'plug in the tv', complete: false },
        { step: 'find the remote', complete: false },
        { step: 'intall nexflix', complete: false },
      ],
    },
    'task-3': {
      id: 'task-3',
      content: 'Charge my phone',
      objectives: [],
    },
    'task-4': {
      id: 'task-4',
      content: 'Cook dinner',
      objectives: [],
    },
  },
  columns: {
    'column-1': {
      id: 'column-1',
      title: 'To do',
      taskIds: ['task-1', 'task-2', 'task-3', 'task-4'],
    },
    'column-2': {
      id: 'column-2',
      title: 'In progress',
      taskIds: [],
    },
    'column-3': {
      id: 'column-3',
      title: 'Done',
      taskIds: [],
    },
  },
  // Facilitate reordering of the columns
  columnOrder: ['column-1', 'column-2', 'column-3'],
}

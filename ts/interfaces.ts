
export interface Task {
  map?: any
  id: string
  content: string
}

export interface Column {
  id: string
  title: string
  taskIds: string[]
}

export interface ColumnProps {
  tasks: Task[]
  index: number
  column: Column
  
}

export interface TaskProps {
  task: Task
  index: number
  //provider?: React.ReactElement<HTMLElement, string | React.JSXElementConstructor<any>> | null | undefined
}

export interface Data {
  tasks: {[key: string]: Task}
  columns: {[key: string]: Column}
  columnOrder: Array<string>
}
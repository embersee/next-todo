import { Dispatch, SetStateAction } from "react"

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
  setState: Dispatch<SetStateAction<Data>>  
}

export interface TaskProps {
  task: Task
  index: number
  setState: Dispatch<SetStateAction<Data>> 
  column: string
  //provider?: React.ReactElement<HTMLElement, string | React.JSXElementConstructor<any>> | null | undefined
}

export interface Data {
  tasks: {[key: string]: Task}
  columns: {[key: string]: Column}
  columnOrder: Array<string>
}

export interface InputProps {
  state: Data
  setState: Dispatch<SetStateAction<Data>>  
}
import { z } from 'zod'

const task = z.object({
  id: z.string(),
  content: z.string(),
  priority: z.string(),
  label: z.string(),
  objectives: z.array(z.object({ step: z.string(), complete: z.boolean() })),
})

const column = z.object({
  id: z.string(),
  title: z.string(),
  taskIds: z.array(z.string()),
})

export const DataSchema = z.object({
  boardTitle: z.string(),
  state: z.object({
    tasks: z.record(z.string(), task.extend({})),
    columns: z.record(z.string(), column.extend({})),
    columnOrder: z.array(z.string()),
  }),
})

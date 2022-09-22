import { DataSchema } from '../../schema/data.schema'
import { Prisma } from '@prisma/client'
import { createProtectedRouter } from '../protected-router'
import { z } from 'zod'

export const boardRouter = createProtectedRouter()
  .mutation('change', {
    input: DataSchema,
    resolve: async ({ ctx, input }) => {
      const { state, boardTitle } = input

      const result = await ctx.prisma.board.updateMany({
        where: {
          author: {
            email: ctx.session.user.email as string,
          },
          title: boardTitle,
        },
        data: {
          data: state,
          title: boardTitle,
        },
      })

      return {
        status: 201,
        message: 'Updated data successfully',
        result: result,
      }
    },
  })
  .query('board', {
    input: z.string(),
    resolve: async ({ ctx, input }) => {
      const selectedBoard = await ctx.prisma.board.findFirst({
        where: {
          author: {
            email: ctx.session.user.email as string,
          },
          title: input,
        },
      })

      return { selectedBoard }
    },
  })
  .mutation('titleChange', {
    input: z.object({ old: z.string(), new: z.string() }),
    resolve: async ({ ctx, input }) => {
      const newBoardTitle = await ctx.prisma.board.updateMany({
        where: {
          author: {
            email: ctx.session.user.email as string,
          },
          title: input.old,
        },
        data: {
          title: input.new,
        },
      })
      return {
        status: 201,
        message: 'Updated Title successfully',
        result: newBoardTitle,
      }
    },
  })
  .mutation('createBoard', {
    resolve: async ({ ctx }) => {
      const me = await ctx.prisma.user.findUnique({
        where: {
          email: ctx.session.user.email as string,
        },
        include: {
          boards: true,
        },
      })

      if (!me) return
      const createBoard = await ctx.prisma.board.create({
        data: {
          title: `${
            me?.username.charAt(0).toUpperCase() + me?.username.slice(1)
          }'s Board ${me.boards.length !== 0 ? me.boards.length : ''}`,
          authorId: me?.id,
          data: data,
        },
      })
      return createBoard
    },
  })
  .mutation('deleteBoard', {
    input: z.string(),
    resolve: async ({ ctx, input }) => {
      const deleteBoard = ctx.prisma.board.deleteMany({
        where: {
          author: {
            username: ctx.session?.user?.name as string,
          },
          title: input,
        },
      })
      return deleteBoard
    },
  })

const data = {
  tasks: {
    'task-1': {
      id: 'task-1',
      content: 'Take out the garbage',
      priority: 'high',
      label: '',
      objectives: [
        { step: 'get garbage bag', complete: true },
        { step: 'collect trash', complete: false },
      ],
    },
    'task-2': {
      id: 'task-2',
      content: 'Watch my favorite show',
      priority: 'medium',
      label: '',
      objectives: [
        { step: 'plug in the tv', complete: true },
        { step: 'intall nexflix', complete: false },
      ],
    },
    'task-3': {
      id: 'task-3',
      content: 'Charge my phone',
      priority: 'low',
      label: '',
      objectives: [],
    },
    'task-4': {
      id: 'task-4',
      content: 'Cook dinner',
      priority: 'high',
      label: '',
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
  columnOrder: ['column-1', 'column-2', 'column-3'],
} as Prisma.JsonObject

import * as trpc from '@trpc/server'

import { DataSchema } from '../../schema/data.schema'
import { Prisma } from '@prisma/client'
import { createRouter } from '../createRouter'
import { hash } from 'argon2'
import { signUpSchema } from '../../schema/user.schema'
import { z } from 'zod'

const data = {
  tasks: {
    'task-1': {
      id: 'task-1',
      content: 'Take out the garbage',
      objectives: [
        { step: 'get garbage bag', complete: true },
        { step: 'collect trash', complete: false },
      ],
    },
    'task-2': {
      id: 'task-2',
      content: 'Watch my favorite show',
      objectives: [
        { step: 'plug in the tv', complete: true },
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
  columnOrder: ['column-1', 'column-2', 'column-3'],
} as Prisma.JsonObject

export const userRouter = createRouter()
  .mutation('signup', {
    input: signUpSchema,
    // output: createUserOutputSchema,
    resolve: async ({ ctx, input }) => {
      const { username, email, password } = input

      const exists = await ctx.prisma.user.findFirst({
        where: { username },
      })

      if (exists) {
        throw new trpc.TRPCError({
          code: 'CONFLICT',
          message: 'User already exists.',
        })
      }

      const hashedPassword = await hash(password)

      const result = await ctx.prisma.user.create({
        data: { username, email, password: hashedPassword },
      })

      const createBoard = await ctx.prisma.board.create({
        data: {
          title: `${result.username}'s Board`,
          authorId: result.id,
          data: data,
        },
      })

      return {
        status: 201,
        message: 'Account created successfully',
        result: result.email,
      }
    },
  })
  .query('me', {
    resolve: async ({ ctx }) => {
      if (!ctx.session?.user?.email)
        throw new trpc.TRPCError({
          code: 'NOT_FOUND',
          message: 'User doesnt exist',
        })
      const me = await ctx.prisma.user.findUnique({
        where: {
          email: ctx.session.user.email,
        },
        include: {
          boards: true,
        },
      })

      if (!me) return
      if (me?.boards.length < 1) {
        const createData = await ctx.prisma.board.create({
          data: {
            title: `${
              me?.username.charAt(0).toUpperCase() + me?.username.slice(1)
            }'s Board`,
            authorId: me?.id,
            data: data,
          },
        })
        const me2 = await ctx.prisma.user.findUnique({
          where: {
            email: ctx.session.user.email,
          },
          include: {
            boards: true,
          },
        })
        return {
          status: 201,
          message: 'User GET request successfully',
          result: me2,
        }
      }
      return {
        status: 201,
        message: 'User GET request successfully',
        result: me,
      }
    },
  })
  .mutation('change', {
    input: DataSchema,
    resolve: async ({ ctx, input }) => {
      const { state, boardTitle } = input

      if (!ctx.session?.user?.email)
        throw new trpc.TRPCError({
          code: 'NOT_FOUND',
          message: 'User doesnt exist',
        })

      const result = await ctx.prisma.board.updateMany({
        where: {
          author: {
            email: ctx.session.user.email,
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
      if (!ctx.session?.user?.email)
        throw new trpc.TRPCError({
          code: 'NOT_FOUND',
          message: 'User doesnt exist',
        })

      const selectedBoard = await ctx.prisma.board.findFirst({
        where: {
          author: {
            email: ctx.session.user.email,
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
      if (!ctx.session?.user?.email)
        throw new trpc.TRPCError({
          code: 'NOT_FOUND',
          message: 'User doesnt exist',
        })

      const newBoardTitle = await ctx.prisma.board.updateMany({
        where: {
          author: {
            email: ctx.session.user.email,
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
      if (!ctx.session?.user?.email)
        throw new trpc.TRPCError({
          code: 'NOT_FOUND',
          message: 'User doesnt exist',
        })

      const me = await ctx.prisma.user.findUnique({
        where: {
          email: ctx.session.user.email,
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
          }'s Board ${me.boards.length}`,
          authorId: me?.id,
          data: data,
        },
      })
      return createBoard
    },
  })

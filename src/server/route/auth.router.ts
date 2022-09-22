import * as trpc from '@trpc/server'

import { Prisma } from '@prisma/client'
import { createRouter } from '../context'
import { hash } from 'argon2'
import { signUpSchema } from '../../schema/user.schema'

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

export const authRouter = createRouter().mutation('signup', {
  input: signUpSchema,
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
        title: `${
          result?.username.charAt(0).toUpperCase() + result?.username.slice(1)
        }'s Board`,
        authorId: result.id,
        data: data,
      },
    })

    return {
      status: 201,
      message: 'Account created successfully',
      result: { email: result.email, username: result.username },
    }
  },
})

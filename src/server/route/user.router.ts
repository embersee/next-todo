import { createProtectedRouter } from '../protected-router'

export const userRouter = createProtectedRouter().query('me', {
  resolve: async ({ ctx }) => {
    const me = await ctx.prisma.user.findUnique({
      where: {
        email: ctx.session.user.email as string,
      },
      include: {
        boards: true,
      },
    })

    return {
      status: 201,
      message: 'User GET request successfully',
      result: me,
    }
  },
})

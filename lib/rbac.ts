import { prisma } from "./prisma"

export async function getUserPermissions(userId: number) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      role: {
        include: {
          permissions: {
            include: { permission: true }
          }
        }
      }
    }
  })

  return user?.role.permissions.map(p => p.permission.action) ?? []
}

export async function can(userId: number, action: string) {
  const permissions = await getUserPermissions(userId)
  return permissions.includes(action)
}

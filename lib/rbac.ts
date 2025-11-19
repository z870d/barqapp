import { prisma } from "./prisma"

function matchesPermission(permission: string, requested: string) {
  if (permission === requested) return true

  if (permission.endsWith("*")) {
    const prefix = permission.slice(0, -1)
    return requested.startsWith(prefix)
  }

  if (requested.endsWith("*")) {
    const prefix = requested.slice(0, -1)
    return permission.startsWith(prefix)
  }

  return false
}

export async function getUserPermissions(userId: number) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      role: {
        include: {
          rolePermissions: {
            include: { permission: true },
          },
        },
      },
    },
  })

  if (!user?.role) return []

  return user.role.rolePermissions.map((rp) => rp.permission.action)
}

export async function can(userId: number, action: string) {
  const permissions = await getUserPermissions(userId)
  return permissions.some((permission) => matchesPermission(permission, action))
}

export function hasPermission(permissions: string[], action: string) {
  return permissions.some((permission) => matchesPermission(permission, action))
}

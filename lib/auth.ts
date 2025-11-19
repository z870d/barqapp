import { cookies } from "next/headers"
import type { NextRequest } from "next/server"

import { prisma } from "@/lib/prisma"
import { SESSION_COOKIE } from "@/lib/session"

function parseUserId(value?: string | null): number | null {
  if (!value) return null
  const parsed = Number(value)
  if (Number.isNaN(parsed)) return null
  return parsed
}

const userInclude = {
  role: {
    include: {
      rolePermissions: {
        include: {
          permission: true,
        },
      },
    },
  },
} as const

export async function getCurrentUser() {
  const cookieStore = await cookies()
  const userId = parseUserId(cookieStore.get(SESSION_COOKIE)?.value)
  if (!userId) return null

  return prisma.user.findUnique({
    where: { id: userId },
    include: userInclude,
  })
}

export async function getCurrentUserFromRequest(req: NextRequest) {
  const userId = parseUserId(req.cookies.get(SESSION_COOKIE)?.value)
  if (!userId) return null

  return prisma.user.findUnique({
    where: { id: userId },
    include: userInclude,
  })
}

"use server"

import { redirect } from "next/navigation"
import { cookies } from "next/headers"

import { prisma } from "@/lib/prisma"
import { SESSION_COOKIE } from "@/lib/session"
import { ROLE_HOME_PATH } from "@/lib/roles"

export type LoginState = {
  error?: string
}

export async function loginAction(
  _prevState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const username = formData.get("username")

  if (!username || typeof username !== "string" || !username.trim()) {
    return { error: "Username is required." }
  }

  const normalizedUsername = username.trim().toLowerCase()

  const user = await prisma.user.findFirst({
    where: {
      username: normalizedUsername,
    },
    include: {
      role: true,
    },
  })

  if (!user) {
    return { error: `No user found for "${normalizedUsername}".` }
  }

  const cookieStore = await cookies()
  cookieStore.set({
    name: SESSION_COOKIE,
    value: String(user.id),
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  })

  const destination =
    ROLE_HOME_PATH[user.role?.name ?? ""] ?? "/dashboard/admin"

  redirect(destination)
}

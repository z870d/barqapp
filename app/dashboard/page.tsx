import { redirect } from "next/navigation"

import { getCurrentUser } from "@/lib/auth"
import { ROLE_HOME_PATH } from "@/lib/roles"

export default async function DashboardPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/")
  }

  const destination = ROLE_HOME_PATH[user.role.name] ?? ROLE_HOME_PATH.admin
  redirect(destination)
}

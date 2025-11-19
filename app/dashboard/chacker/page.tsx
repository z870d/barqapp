import { redirect } from "next/navigation"

import { ChackerBoard } from "@/components/dashboard/chacker-board"
import { getCurrentUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { serializeRequests } from "@/lib/requests"
import { ROLE_HOME_PATH } from "@/lib/roles"

export default async function ChackerDashboardPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/")
  }

  if (user.role.name !== "chacker") {
    const destination =
      ROLE_HOME_PATH[user.role.name] ?? ROLE_HOME_PATH.admin
    redirect(destination)
  }

  const requests = await prisma.request.findMany({
    include: {
      maker: true,
      shacker: true,
    },
    orderBy: { created_at: "desc" },
  })

  return <ChackerBoard initialRequests={serializeRequests(requests)} />
}

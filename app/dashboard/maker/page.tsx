import { redirect } from "next/navigation"

import { MakerBoard } from "@/components/dashboard/maker-board"
import { getCurrentUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { serializeRequests } from "@/lib/requests"
import { ROLE_HOME_PATH } from "@/lib/roles"

export default async function MakerDashboardPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/")
  }

  if (user.role.name !== "maker") {
    const destination =
      ROLE_HOME_PATH[user.role.name] ?? ROLE_HOME_PATH.admin
    redirect(destination)
  }

  const requests = await prisma.request.findMany({
    where: { maker_id: user.id },
    include: {
      maker: true,
      shacker: true,
    },
    orderBy: { created_at: "desc" },
  })

  return <MakerBoard initialRequests={serializeRequests(requests)} />
}

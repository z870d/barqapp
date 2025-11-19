import { redirect } from "next/navigation"
import type { ReactNode } from "react"

import { DashboardShell } from "@/components/dashboard-shell"
import { PermissionsProvider } from "@/hooks/useCan"
import { getCurrentUser } from "@/lib/auth"

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode
}) {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/")
  }

  const permissions =
    user.role.rolePermissions.map((rp) => rp.permission.action) ?? []

  return (
    <PermissionsProvider permissions={permissions}>
      <DashboardShell
        user={{
          id: user.id,
          username: user.username,
          role: user.role.name,
        }}
      >
        {children}
      </DashboardShell>
    </PermissionsProvider>
  )
}

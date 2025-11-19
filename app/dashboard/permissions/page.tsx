import { redirect } from "next/navigation"

import { getCurrentUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export default async function PermissionsPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/")
  }

  if (user.role.name !== "admin") {
    redirect("/dashboard")
  }

  const roles = await prisma.role.findMany({
    include: {
      rolePermissions: {
        include: { permission: true },
        orderBy: { permission: { action: "asc" } },
      },
    },
    orderBy: { name: "asc" },
  })

  return (
    <section className="space-y-6 rounded-3xl border border-[#eceff3] bg-white p-6 shadow-sm">
      <div>
        <h2 className="text-2xl font-semibold text-[#121317]">Permissions matrix</h2>
        <p className="text-sm text-muted-foreground">
          Reference of which actions each role can perform.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {roles.map((role) => (
          <div key={role.id} className="rounded-2xl border border-[#e6e7ec] bg-[#fefefe] p-4">
            <h3 className="text-lg font-semibold capitalize text-[#121317]">
              {role.name}
            </h3>
            <ul className="mt-3 space-y-2 text-sm text-[#4f535c]">
              {role.rolePermissions.length === 0 ? (
                <li className="text-muted-foreground">No permissions assigned.</li>
              ) : (
                role.rolePermissions.map((rp) => (
                  <li
                    key={`${role.id}-${rp.permission_id}`}
                    className="rounded-full bg-[#f5f5f7] px-3 py-1 font-medium"
                  >
                    {rp.permission.action}
                  </li>
                ))
              )}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}

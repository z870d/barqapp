import { redirect } from "next/navigation"

import { getCurrentUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

function formatDate(value: Date) {
  return value.toLocaleString()
}

export default async function UsersPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/")
  }

  if (user.role.name !== "admin") {
    redirect("/dashboard")
  }

  const users = await prisma.user.findMany({
    include: { role: true },
    orderBy: { username: "asc" },
  })

  return (
    <section className="rounded-3xl border border-[#eceff3] bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-semibold text-[#121317]">Users & roles</h2>
      <p className="text-sm text-muted-foreground">
        Manage who can access the dashboard.
      </p>

      <div className="mt-6 overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Username</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((entry) => (
              <TableRow key={entry.id}>
                <TableCell className="font-medium">{entry.id}</TableCell>
                <TableCell>{entry.username}</TableCell>
                <TableCell className="capitalize">{entry.role.name}</TableCell>
                <TableCell>{formatDate(entry.created_at)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </section>
  )
}

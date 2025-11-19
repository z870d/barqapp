import type { RequestDto } from "@/lib/requests"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

function formatDate(value: string) {
  return new Date(value).toLocaleString()
}

export function AdminBoard({ requests }: { requests: RequestDto[] }) {
  return (
    <section className="rounded-3xl border border-[#eceff3] bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-[#121317]">All requests</h2>
      <p className="text-sm text-muted-foreground">
        Overview of everything in the system.
      </p>

      <div className="mt-6 overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Field</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Maker</TableHead>
              <TableHead>Checker</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Updated</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-sm text-muted-foreground">
                  No requests found.
                </TableCell>
              </TableRow>
            ) : (
              requests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell className="font-medium">{request.id}</TableCell>
                  <TableCell className="max-w-[280px] truncate">{request.field}</TableCell>
                  <TableCell className="capitalize">{request.status}</TableCell>
                  <TableCell>{request.maker.username}</TableCell>
                  <TableCell>{request.shacker?.username ?? "Unassigned"}</TableCell>
                  <TableCell>{formatDate(request.createdAt)}</TableCell>
                  <TableCell>{formatDate(request.updatedAt)}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </section>
  )
}

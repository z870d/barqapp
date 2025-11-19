"use client"

import { useCallback, useEffect, useMemo, useState } from "react"

import type { RequestDto } from "@/lib/requests"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useCan } from "@/hooks/useCan"
import { approveRequest } from "@/actions/approve-request"
import { rejectRequest } from "@/actions/reject-request"

const ACTIVE_STATUSES = new Set(["pending", "bidding"])

function formatDate(value: string) {
  return new Date(value).toLocaleString()
}

export function ChackerBoard({
  initialRequests,
}: {
  initialRequests: RequestDto[]
}) {
  const [requests, setRequests] = useState(initialRequests)
  const [error, setError] = useState<string | null>(null)
  const [mutatingId, setMutatingId] = useState<number | null>(null)
  const canApprove = useCan(["request:approve"])
  const canReject = useCan(["request:reject"])

  const refresh = useCallback(async () => {
    try {
      const response = await fetch("/api/requests", { cache: "no-store" })
      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        throw new Error(data.error ?? "Unable to refresh requests.")
      }
      const data = (await response.json()) as RequestDto[]
      setRequests(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to refresh.")
    }
  }, [])

  useEffect(() => {
    refresh()
    const interval = setInterval(refresh, 10_000)
    return () => clearInterval(interval)
  }, [refresh])

  const { currentRequests, historyRequests } = useMemo(() => {
    const current = requests.filter((request) =>
      ACTIVE_STATUSES.has(request.status),
    )
    const history = requests.filter(
      (request) => !ACTIVE_STATUSES.has(request.status),
    )

    return { currentRequests: current, historyRequests: history }
  }, [requests])

  async function handleStatusChange(
    requestId: number,
    action: "approve" | "reject",
  ) {
    setError(null)
    setMutatingId(requestId)
    try {
      const updated =
        action === "approve"
          ? await approveRequest(requestId)
          : await rejectRequest(requestId)

      setRequests((prev) =>
        prev.map((request) => (request.id === updated.id ? updated : request)),
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unexpected error occurred.")
    } finally {
      setMutatingId(null)
    }
  }

  return (
    <div className="space-y-8">
      {error ? <p className="rounded-xl bg-red-50 p-3 text-sm text-red-600">{error}</p> : null}

      <section id="current" className="rounded-3xl border border-[#eceff3] bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-[#121317]">Current requests</h2>
            <p className="text-sm text-muted-foreground">
              Items waiting for checker action.
            </p>
          </div>
          <Button variant="outline" onClick={refresh}>
            Refresh
          </Button>
        </div>

        <div className="mt-6 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Field</TableHead>
                <TableHead>Maker</TableHead>
                <TableHead>Assigned checker</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentRequests.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-sm text-muted-foreground">
                    No pending requests right now.
                  </TableCell>
                </TableRow>
              ) : (
                currentRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell className="font-medium">{request.id}</TableCell>
                    <TableCell className="max-w-[260px] truncate">{request.field}</TableCell>
                    <TableCell>{request.maker.username}</TableCell>
                    <TableCell>{request.shacker?.username ?? "Not assigned"}</TableCell>
                    <TableCell className="capitalize">{request.status}</TableCell>
                    <TableCell>{formatDate(request.createdAt)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {canApprove ? (
                          <Button
                            size="sm"
                            className="bg-emerald-600 text-white hover:bg-emerald-500"
                            disabled={mutatingId === request.id}
                            onClick={() => handleStatusChange(request.id, "approve")}
                          >
                            Approve
                          </Button>
                        ) : null}
                        {canReject ? (
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-red-200 text-red-600 hover:bg-red-50"
                            disabled={mutatingId === request.id}
                            onClick={() => handleStatusChange(request.id, "reject")}
                          >
                            Reject
                          </Button>
                        ) : null}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </section>

      <section id="history" className="rounded-3xl border border-[#eceff3] bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-[#121317]">Handled requests</h2>
        <p className="text-sm text-muted-foreground">
          Everything previously approved or rejected.
        </p>

        <div className="mt-6 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Field</TableHead>
                <TableHead>Maker</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Updated</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {historyRequests.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-sm text-muted-foreground">
                    No history yet.
                  </TableCell>
                </TableRow>
              ) : (
                historyRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell className="font-medium">{request.id}</TableCell>
                    <TableCell className="max-w-[260px] truncate">{request.field}</TableCell>
                    <TableCell>{request.maker.username}</TableCell>
                    <TableCell className="capitalize">{request.status}</TableCell>
                    <TableCell>{formatDate(request.updatedAt)}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </section>
    </div>
  )
}

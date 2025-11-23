"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import type { RequestDto } from "@/lib/requests"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { approveRequest } from "@/actions/approve-request"
import { rejectRequest } from "@/actions/reject-request"
import { useCan } from "@/hooks/useCan"
import { CheckCircle, Check, XCircle, BadgeCheck } from "lucide-react"

const ACTIVE_STATUSES = new Set(["pending", "bidding"])

function formatDate(value: string) {
  return new Date(value).toLocaleString()
}

type Req = RequestDto & {
  _loading?: boolean
}

export function ChackerBoard({ initialRequests }: { initialRequests: RequestDto[] }) {
  const [requests, setRequests] = useState<Req[]>(initialRequests)
  const [error, setError] = useState<string | null>(null)

  const canApprove = useCan(["request:approve"])
  const canReject = useCan(["request:reject"])

  const refresh = useCallback(async () => {
    try {
      const response = await fetch("/api/requests", { cache: "no-store" })
      const data = (await response.json()) as RequestDto[]
      setRequests(data)
    } catch {
      setError("Failed to refresh.")
    }
  }, [])

  useEffect(() => {
    refresh()
    const interval = setInterval(refresh, 10000)
    return () => clearInterval(interval)
  }, [refresh])
function timeAgo(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();

  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours   = Math.floor(minutes / 60);
  const days    = Math.floor(hours / 24);

  if (seconds < 60) return "just now";
  if (minutes < 60) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  if (hours < 24)   return `${hours} hour${hours > 1 ? "s" : ""} ago`;

  return `${days} day${days > 1 ? "s" : ""} ago`;
}

  const { currentRequests, historyRequests } = useMemo(() => {
    return {
      currentRequests: requests.filter((r) => ACTIVE_STATUSES.has(r.status)),
      historyRequests: requests.filter((r) => !ACTIVE_STATUSES.has(r.status)),
    }
  }, [requests])

  async function mutate(id: number, action: "approve" | "reject") {
    setRequests(prev =>
      prev.map(r => (r.id === id ? { ...r, _loading: true } : r))
    )

    try {
      const updated =
        action === "approve" ? await approveRequest(id) : await rejectRequest(id)

      setRequests(prev =>
        prev.map(r =>
          r.id === id ? { ...updated, _loading: false } : r
        )
      )
    } catch {
      setRequests(prev =>
        prev.map(r =>
          r.id === id ? { ...r, _loading: false } : r
        )
      )
      setError("Something went wrong.")
    }
  }

  return (
    <div className="space-y-12">
      {error &&
        <p className="rounded-xl bg-red-50 p-3 text-sm text-red-600">
          {error}
        </p>
      }

      {/* CURRENT REQUESTS */}
      <section className="rounded-3xl border border-[#eceff3] bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">Current requests</h2>
            <p className="text-sm text-muted-foreground">Items waiting for checker action.</p>
          </div>
          <Button variant="outline" onClick={refresh}>Refresh</Button>
        </div>

        {/* Timeline */}
        <div className="mt-8 relative">
          <div className="absolute left-4 top-0 bottom-0 w-[2px] bg-gray-200" />

          <div className="space-y-8 pl-10">
            {currentRequests.length === 0 && (
              <p className="text-sm text-gray-500">No pending requests right now.</p>
            )}

            {currentRequests.map((req) => (
              <div key={req.id} className="relative">
                <div className="absolute -left-[30px] top-6 w-4 h-4 rounded-full bg-[#f5cf32] border-4 border-white shadow" />

                {/* Card */}
<div
  className={`
    relative rounded-xl border p-4 bg-white shadow 
    transition-all duration-500 w-full
    overflow-hidden

  `}
>

                  {/* 🔥 خط الانتظار الأصفر */}
{/* خط انتظار داخل الكرت */}
{(req.status === "pending" || req.status === "bidding") && !req._loading && (
  <div className="waiting-line" />
)}


                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold relative">
                      Request #{req.id}
                    </h3>

                    <span
                      className={`text-xs font-medium px-3 py-1 rounded-full ${
                        req.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : req.status === "approved"
                          ? "bg-emerald-100 text-emerald-700"
                          : req.status === "rejected"
                          ? "bg-red-100 text-red-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {req.status}
                    </span>
                  </div>

                  <p className="mt-1 text-sm text-gray-600">{req.field}</p>

                  {/* Info */}
                  <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <p className="font-semibold">Maker</p>
                      <p>{req.maker.username}</p>
                    </div>
<div>

  {req.status === "pending" || req.status === "bidding" ? (
    <p className="flex items-center gap-2 text-yellow-700 text-sm font-medium">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-4 w-4 text-yellow-500 animate-pulse"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      Waiting for checker action...
    </p>
  ) : (
    <p className="flex items-center gap-2 text-gray-600 text-sm">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-3.5 w-3.5 text-gray-400"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <circle cx="10" cy="10" r="3" />
      </svg>
      Not assigned
    </p>
  )}
</div>

                    <div>
                      <p className="font-semibold">Created</p>
<p>{timeAgo(req.createdAt)}</p>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="mt-4 flex gap-2 justify-end">
                    {req._loading ? (
                      <>
                        <div className="h-8 w-20 rounded-lg bg-gray-200 animate-pulse" />
                        <div className="h-8 w-20 rounded-lg bg-gray-200 animate-pulse" />
                      </>
                    ) : (
                      <>
                        {canReject && (
                          <Button
                            variant="outline"
                            className="h-8 text-xs border-red-200 text-red-600 hover:bg-red-50"
                            onClick={() => mutate(req.id, "reject")}
                          >
                            Reject
                          </Button>
                        )}
                        {canApprove && (
                          <Button
                            className="h-8 text-xs bg-emerald-600 text-white hover:bg-emerald-500"
                            onClick={() => mutate(req.id, "approve")}
                          >
                            Approve
                          </Button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HISTORY */}
      <section className="rounded-3xl border border-[#eceff3] bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold">Handled requests</h2>
        <p className="text-sm text-muted-foreground">Everything previously approved or rejected.</p>

        <div className="mt-6 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Details</TableHead>
                <TableHead>Maker</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Updated</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {historyRequests.map((r) => (
                <TableRow key={r.id}>
                  <TableCell>{r.id}</TableCell>
                  <TableCell>{r.field}</TableCell>
                  <TableCell>{r.maker.username}</TableCell>
<TableCell className="text-center">
  <div className="flex items-center justify-center gap-2">
    {r.status === "approved" && (
      <span className="flex items-center gap-1 text-emerald-600 text-sm font-medium">
        <CheckCircle className="h-4 w-4" />
        Approved
      </span>
    )}

    {r.status === "rejected" && (
      <span className="flex items-center gap-1 text-red-600 text-sm font-medium">
        <XCircle className="h-4 w-4" />
        Rejected
      </span>
    )}

    {(r.status === "pending" || r.status === "bidding") && (
      <span className="flex items-center gap-1 text-yellow-600 text-sm font-medium">
        <div className="h-2 w-2 rounded-full bg-yellow-400 animate-ping" />
        Pending
      </span>
    )}
  </div>
</TableCell>

                  <TableCell>{formatDate(r.updatedAt)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>
    </div>
  )
}

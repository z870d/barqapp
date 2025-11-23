"use client"

import { useState } from "react"
import { CheckCircle, Check, XCircle, BadgeCheck } from "lucide-react"
import toast from "react-hot-toast"

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

function formatDate(value: string) {
  return new Date(value).toLocaleString()
}

export function MakerBoard({ initialRequests }: { initialRequests: RequestDto[] }) {
  const [requests, setRequests] = useState(initialRequests)
  const [field, setField] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const canCreate = useCan(["request:create"])
function actionDuration(created: string, updated: string) {
  const start = new Date(created).getTime();
  const end = new Date(updated).getTime();

  const diffMs = end - start;

  if (diffMs < 0) return "—";

  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours   = Math.floor(minutes / 60);

  if (seconds < 60) return `${seconds}s`;
  if (minutes < 60) return `${minutes}m`;
  if (hours < 24) return `${hours}h ${minutes % 60}m`;

  const days = Math.floor(hours / 24);
  return `${days}d ${hours % 24}h`;
}

async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
  event.preventDefault()
  setError(null)

  if (!field.trim()) {
    setError("Details are required.")
    return
  }

  setSubmitting(true)

  const toastId = toast.loading("Submitting your request...")

  try {
    const response = await fetch("/api/requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ field }),
    })

    if (!response.ok) {
      const data = await response.json().catch(() => ({}))
      throw new Error(data.error ?? "Unable to create request.")
    }

    const created = (await response.json()) as RequestDto
    setRequests((prev) => [created, ...prev])
    setField("")

    toast.success("Request submitted successfully!", { id: toastId })
  } catch (err) {
    toast.error(
      err instanceof Error ? err.message : "Unexpected error.",
      { id: toastId }
    )
  } finally {
    setSubmitting(false)
  }
}


  return (
    <div className="space-y-10">
      {canCreate ? (
        <section id="create-request" className="rounded-3xl border border-[#eceff3] bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-[#121317]">Create a new request</h2>
          <p className="text-sm text-muted-foreground">
            Describe the issue you want to submit to the checker team.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label htmlFor="requestField" className="text-sm font-medium text-[#1c1d22]">
                Request details
              </label>
              <textarea
                id="requestField"
                name="field"
                value={field}
                onChange={(event) => setField(event.target.value)}
                rows={4}
                className="mt-2 w-full rounded-2xl border border-[#e0e2e8] bg-[#f9f9fb] p-4 text-sm outline-none focus:ring-2 focus:ring-black"
                placeholder="Enter the request details"
              />
            </div>

            {error ? <p className="text-sm text-red-500">{error}</p> : null}

            <Button
              type="submit"
              className="rounded-2xl bg-black px-6 py-3 text-white hover:bg-black/90"
              disabled={submitting}
            >
              {submitting ? "Submitting..." : "Submit request"}
            </Button>
          </form>
        </section>
      ) : null}
<section
  id="my-requests"
  className="rounded-3xl border border-[#eceff3] bg-white p-6 shadow-sm"
>
  <div className="flex items-center justify-between">
    <div>
      <h2 className="text-xl font-semibold text-[#121317]">My requests</h2>
      <p className="text-sm text-muted-foreground">
        Track the status of everything you have submitted.
      </p>
    </div>
  </div>

  <div className="mt-6 overflow-x-auto">
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Details</TableHead>
          <TableHead className="text-center">Status</TableHead>
          <TableHead>Assigned checker</TableHead>
          <TableHead>Created</TableHead>
          <TableHead>Action Taken</TableHead>
          <TableHead>Duration</TableHead>

        </TableRow>
      </TableHeader>

      <TableBody>
        {requests.length === 0 ? (
          <TableRow>
            <TableCell
              colSpan={6}
              className="text-center text-sm text-muted-foreground"
            >
              No requests yet.
            </TableCell>
          </TableRow>
        ) : (
          requests.map((request) => (
            <TableRow key={request.id} className="hover:bg-gray-50">
              {/* ID */}
              <TableCell className="font-medium">{request.id}</TableCell>

              {/* Details */}
              <TableCell className="max-w-[320px] truncate text-sm">
                {request.field}
              </TableCell>

              {/* Status with colors + icons */}
              <TableCell className="text-center">
                <div className="flex justify-center">
                  {request.status === "approved" && (
                    <span className="flex items-center gap-1 text-emerald-600 text-sm font-medium px-2 py-1 rounded-full bg-emerald-100">
                      <CheckCircle className="h-4 w-4" />
                      Approved
                    </span>
                  )}

                  {request.status === "rejected" && (
                    <span className="flex items-center gap-1 text-red-600 text-sm font-medium px-2 py-1 rounded-full bg-red-100">
                      <XCircle className="h-4 w-4" />
                      Rejected
                    </span>
                  )}

                  {(request.status === "pending" ||
                    request.status === "bidding") && (
                    <span className="flex items-center gap-1 text-yellow-700 text-sm font-medium px-2 py-1 rounded-full bg-yellow-100">
                      <div className="h-2 w-2 rounded-full bg-yellow-500 animate-ping" />
                      Pending
                    </span>
                  )}
                </div>
              </TableCell>

              {/* Checker */}
<TableCell className="text-center">
  {request.shacker ? (
    <div className="flex items-center justify-center gap-2 text-sm">
{request.shacker.username.charAt(0).toUpperCase() + request.shacker.username.slice(1)}
    </div>
  ) : (
<div className="flex items-center justify-center gap-2 text-sm text-gray-400">
  <span>Awaiting checker assignment</span>
</div>

  )}
</TableCell>

{/* Created */}
<TableCell className="text-sm text-gray-700">
  {formatDate(request.createdAt)}
</TableCell>

{/* Updated */}

<TableCell className="text-center text-sm font-medium">
  {request.status === "pending" || request.status === "bidding" ? (
    <span className="text-gray-400">—</span>
  ) : (
    <span className="text-gray-900">
  {formatDate(request.updatedAt)}
    </span>
  )}
</TableCell>
{/* Duration */}
<TableCell className="text-center text-sm font-medium">
  {request.status === "pending" || request.status === "bidding" ? (
    <span className="text-gray-400">—</span>
  ) : (
    <span className="text-gray-900">
      {actionDuration(request.createdAt, request.updatedAt)}
    </span>
  )}
</TableCell>

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

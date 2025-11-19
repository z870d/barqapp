"use client"

import { useState } from "react"

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

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)

    if (!field.trim()) {
      setError("Details are required.")
      return
    }

    setSubmitting(true)

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
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unexpected error.")
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

      <section id="my-requests" className="rounded-3xl border border-[#eceff3] bg-white p-6 shadow-sm">
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
                <TableHead>Status</TableHead>
                <TableHead>Assigned checker</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Updated</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-sm text-muted-foreground">
                    No requests yet.
                  </TableCell>
                </TableRow>
              ) : (
                requests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell className="font-medium">{request.id}</TableCell>
                    <TableCell className="max-w-[320px] truncate text-sm">{request.field}</TableCell>
                    <TableCell className="capitalize">{request.status}</TableCell>
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
    </div>
  )
}

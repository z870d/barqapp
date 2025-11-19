import type { RequestDto } from "@/lib/requests"

export async function rejectRequest(
  requestId: number | string,
): Promise<RequestDto> {
  const id = Number(requestId)

  if (!Number.isFinite(id)) {
    throw new Error("Invalid request id.")
  }

  const response = await fetch(`/api/requests/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ action: "reject" }),
  })

  if (!response.ok) {
    const data = await response.json().catch(() => ({}))
    throw new Error(data.error ?? "Failed to reject request.")
  }

  return response.json()
}

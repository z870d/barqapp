import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

import { prisma } from "@/lib/prisma"
import { can } from "@/lib/rbac"
import { getCurrentUserFromRequest } from "@/lib/auth"
import { serializeRequest } from "@/lib/requests"

type PatchParams = {
  params: {
    id: string
  }
}

const logTag = "[api/requests/:id PATCH]"

export async function PATCH(
  request: NextRequest,
  context?: PatchParams,
) {
  const pathSegments = request.nextUrl?.pathname
    ?.split("/")
    .filter((segment) => segment.length > 0)
  const derivedId = pathSegments?.[pathSegments.length - 1]
  const params = context?.params

  console.log(`${logTag} params`, params, "derived", derivedId)

  const user = await getCurrentUserFromRequest(request)

  if (!user) {
    console.warn(`${logTag} unauthorized request`)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const rawId = params?.id ?? derivedId
  const requestId = Number(rawId)
  if (!rawId || Number.isNaN(requestId)) {
    console.warn(`${logTag} invalid id`, rawId)
    return NextResponse.json({ error: "Invalid request id" }, { status: 400 })
  }

  let payload: unknown = null
  try {
    payload = await request.json()
  } catch (error) {
    console.error(`${logTag} failed to parse body`, error)
  }

  console.log(`${logTag} payload`, payload)

  const action =
    typeof payload === "object" && payload !== null
      ? (payload as { action?: string }).action
      : undefined

  if (action !== "approve" && action !== "reject") {
    console.warn(`${logTag} invalid action`, action)
    return NextResponse.json(
      { error: "Action must be approve or reject." },
      { status: 400 },
    )
  }

  if (user.role.name !== "chacker") {
    console.warn(`${logTag} role not allowed`, user.role.name)
    return NextResponse.json(
      { error: "Only checkers can update requests." },
      { status: 403 },
    )
  }

  const requiredPermission =
    action === "approve" ? "request:approve" : "request:reject"

  const allowed = await can(user.id, requiredPermission)
  if (!allowed) {
    console.warn(`${logTag} missing permission`, requiredPermission)
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const existing = await prisma.request.findUnique({
    where: { id: requestId },
  })

  if (!existing) {
    console.warn(`${logTag} request not found`, requestId)
    return NextResponse.json({ error: "Request not found" }, { status: 404 })
  }

  const newStatus = action === "approve" ? "approved" : "rejected"

const updated = await prisma.request.update({
  where: { id: requestId },
  data: {
    status: newStatus,
    shacker_id: user.id, // ← assign checker who performed the action
  },
  include: {
    maker: true,
    shacker: true,
  },
})


  console.log(`${logTag} request updated`, {
    id: updated.id,
    status: updated.status,
  })

  return NextResponse.json(serializeRequest(updated))
}

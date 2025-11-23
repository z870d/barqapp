import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

import { prisma } from "@/lib/prisma"
import { can } from "@/lib/rbac"
import { getCurrentUserFromRequest } from "@/lib/auth"
import { serializeRequest, serializeRequests } from "@/lib/requests"

const requestInclude = {
  include: {
    maker: true,
    shacker: true,
  },
  orderBy: {
    id: "desc",
  },
} as const

export async function GET(request: NextRequest) {
  const user = await getCurrentUserFromRequest(request)

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const allowed = await can(user.id, "request:read")
  if (!allowed) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const where =
    user.role.name === "maker" ? { maker_id: user.id } : undefined

  const requests = await prisma.request.findMany({
    ...requestInclude,
    where,
  })

  return NextResponse.json(serializeRequests(requests))
}

export async function POST(request: NextRequest) {
  const user = await getCurrentUserFromRequest(request)

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  if (user.role.name !== "maker") {
    return NextResponse.json(
      { error: "Only makers can create requests." },
      { status: 403 },
    )
  }

  const allowed = await can(user.id, "request:create")
  if (!allowed) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const body = await request.json().catch(() => null)

  if (!body?.field || typeof body.field !== "string" || !body.field.trim()) {
    return NextResponse.json(
      { error: "Field is required." },
      { status: 400 },
    )
  }

  const shacker = await prisma.user.findFirst({
    where: { role: { name: "chacker" } },
    orderBy: { id: "asc" },
  })

const newRequest = await prisma.request.create({
  data: {
    maker_id: user.id,
    shacker_id: null, // ❗ No checker assigned yet
    status: "pending",
    field: body.field.trim(),
  },
  include: {
    maker: true,
    shacker: true,
  },
})


  return NextResponse.json(serializeRequest(newRequest), { status: 201 })
}

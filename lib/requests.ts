import type { Prisma } from "@prisma/client"

export type RequestWithUsers = Prisma.RequestGetPayload<{
  include: {
    maker: true
    shacker: true
  }
}>

export type RequestDto = {
  id: number
  field: string
  status: string
  createdAt: string
  updatedAt: string
  maker: {
    id: number
    username: string
  }
  shacker: {
    id: number
    username: string
  } | null
}

export function serializeRequest(request: RequestWithUsers): RequestDto {
  return {
    id: request.id,
    field: request.field,
    status: request.status,
    createdAt: request.created_at.toISOString(),
    updatedAt: request.updated_at.toISOString(),
    maker: {
      id: request.maker.id,
      username: request.maker.username,
    },
    shacker: request.shacker
      ? { id: request.shacker.id, username: request.shacker.username }
      : null,
  }
}

export function serializeRequests(requests: RequestWithUsers[]) {
  return requests.map(serializeRequest)
}

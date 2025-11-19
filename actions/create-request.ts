"use server"

import { prisma } from "@/lib/prisma"

export async function createRequest(makerId: number, field: string) {
  return prisma.request.create({
    data: {
      maker_id: makerId,
      field,
      status: "bidding"
    }
  })
}

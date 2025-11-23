"use client"

import data from "@/app/dashboard/data.json"
import { DataTable } from "@/components/data-table"

export default function RequestsPage() {
  return (
      <DataTable data={data} />
  )
}

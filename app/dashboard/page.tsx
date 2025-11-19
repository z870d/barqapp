import { DataTable } from "@/components/data-table"
import data from "./data.json"

export default function Page() {
  return (
    <div className="px-2 sm:px-4 lg:px-6">
      <DataTable data={data} />
    </div>
  )
}

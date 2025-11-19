"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ActionModal } from "@/components/action-modal"

export default function ActionsPage() {
  const [open, setOpen] = useState(false)
  const [mode, setMode] = useState<"reprocess" | "approve" | null>(null)

  return (
    <div className="flex flex-col items-center justify-center gap-6 pt-20">
      <Button
        className="h-12 w-64 rounded-2xl bg-black text-white hover:bg-black/90"
        onClick={() => {
          setMode("reprocess")
          setOpen(true)
        }}
      >
        Reprocess transaction
      </Button>

      <Button
        className="h-12 w-64 rounded-2xl bg-[#f2f3f7] text-black hover:bg-[#e8e8ec]"
        onClick={() => {
          setMode("approve")
          setOpen(true)
        }}
      >
        Approve reprocessing
      </Button>

      <ActionModal open={open} onOpenChange={setOpen} mode={mode} />
    </div>
  )
}

"use client"

import { useState } from "react"
import { CheckIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogTitle
} from "@/components/ui/dialog"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"

export function ActionModal({
  open,
  onOpenChange,
  mode,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  mode: "reprocess" | "approve" | null
}) {
  const [success, setSuccess] = useState(false)

  if (!mode) return null

  const isReprocess = mode === "reprocess"

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[420px] rounded-2xl p-8">

        {/* ✔ REQUIRED FOR ACCESSIBILITY */}
        <VisuallyHidden>
          <DialogTitle>Transaction Action</DialogTitle>
        </VisuallyHidden>
        {success ? (
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
              <CheckIcon className="size-12 text-emerald-600" />
            </div>

            <h2 className="text-lg font-semibold">
              {isReprocess
                ? "Transaction Reprocessed Successfully"
                : "Transaction Reprocessing Approved"}
            </h2>

            <p className="text-sm text-gray-500">
              The transaction has been successfully {isReprocess ? "reprocessed" : "approved for reprocessing"}.
            </p>

            <Button
              className="mt-2 h-12 w-full rounded-xl bg-black text-white hover:bg-black/90"
              onClick={() => {
                setSuccess(false)
                onOpenChange(false)
              }}
            >
              Close
            </Button>
          </div>
        ) : (
          /* CONFIRMATION STATE */
          <div className="flex flex-col items-center gap-6 text-center">
            <h2 className="text-lg font-semibold">
              {isReprocess
                ? "Are you sure you want to reprocess this transaction?"
                : "Are you sure you want to Approve reprocessing this transaction?"}
            </h2>

            <p className="text-sm text-gray-500">
              [Transaction-Identifier-name]
            </p>

            <div className="flex w-full flex-col gap-3">
              <Button
                className="h-12 w-full rounded-xl bg-black text-white hover:bg-black/90"
                onClick={() => setSuccess(true)}
              >
                {isReprocess ? "Reprocess transaction" : "Approve reprocessing"}
              </Button>

              <Button
                className="h-12 w-full rounded-xl bg-gray-100 text-black hover:bg-gray-200"
                onClick={() => {
                  setSuccess(false)
                  onOpenChange(false)
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

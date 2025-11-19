"use client"

import * as React from "react"
import { DayPicker } from "react-day-picker"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

export function StyledCalendar({
  className,
  ...props
}: React.ComponentProps<typeof DayPicker>) {
  return (
    <DayPicker
      className={cn(
        "p-4 rounded-3xl shadow-[0_20px_60px_rgba(15,15,15,0.12)] bg-white",
        className
      )}
      captionLayout="dropdown-buttons"
      showOutsideDays
      components={{
        IconLeft: () => <ChevronLeft className="h-5 w-5" />,
        IconRight: () => <ChevronRight className="h-5 w-5" />,
      }}
      {...props}
    />
  )
}

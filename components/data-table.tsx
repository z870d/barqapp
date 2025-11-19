"use client"
/* eslint-disable react-hooks/rules-of-hooks, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */

import * as React from "react"
import {
  ColumnDef,
  Row,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  flexRender,
  useReactTable,
} from "@tanstack/react-table"
import {
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  EyeIcon,
  MoreHorizontalIcon,
  RefreshCcwIcon,
  SearchIcon,
} from "lucide-react"
import { z } from "zod"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { InboxIcon ,X} from "lucide-react"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Calendar as CalendarIcon } from "lucide-react"
import { format } from "date-fns"

import { Calendar } from "@/components/ui/calendar"

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover"

export const schema = z.object({
  id: z.number(),
  header: z.string(),
  type: z.string(),
  status: z.string(),
  target: z.string(),
  limit: z.string(),
  reviewer: z.string(),
})

type UiStatus = "Completed" | "Pending" | "Failed" | "In Review"

type RequestRow = z.infer<typeof schema> & {
  requestDate: string
  uiStatus: UiStatus
  cif: string
  accountNumber: string
  iban: string
  accountType: string
  jointAccount: string
  accountStatusLabel: string
  institution: string
  availableBalance: string
  totalBalance: string
  balanceDate: string
  customerName: string
}

const tabConfig = [
  { label: "All Requests", value: "all" },
  { label: "Account Info", value: "account" },
  { label: "Balance Info", value: "balance" },
  { label: "Customer Info", value: "customer" },
  { label: "Account Statement", value: "statement" },
]

const statusTheme: Record<UiStatus, { bg: string; text: string }> = {
  Completed: { bg: "bg-[#dfeff3]", text: "text-[#1f4a59]" },
  Pending: { bg: "bg-[#fdf0cc]", text: "text-[#8b6009]" },
  Failed: { bg: "bg-[#fde2e2]", text: "text-[#8c1d1d]" },
  "In Review": { bg: "bg-[#e4e8ff]", text: "text-[#2b3c8d]" },
}

const columns: ColumnDef<RequestRow>[] = [
  {
    accessorKey: "type",
    header: "Request type",
    cell: ({ row }) => (
      <div className="font-medium text-[#1c1d22]">{row.original.type}</div>
    ),
  },
  {
    accessorKey: "id",
    header: "SRN",
    cell: ({ row }) => row.original.id.toString(),
  },
  {
    accessorKey: "header",
    header: "Msg UID",
    cell: ({ row }) => (
      <div className="max-w-[160px] truncate text-[#6f7380]" title={row.original.header}>
        {row.original.header}
      </div>
    ),
  },
  {
    accessorKey: "requestDate",
    header: "Request date",
    cell: ({ row }) => (
      <div className="whitespace-nowrap">{row.original.requestDate}</div>
    ),
  },
  {
    accessorKey: "uiStatus",
    header: "Request status",
    cell: ({ row }) => {
      const status = row.original.uiStatus
      const theme = statusTheme[status]
      return (
        <span
          className={cn(
            "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold",
            theme.bg,
            theme.text
          )}
        >
          {status}
        </span>
      )
    },
  },
  {
    accessorKey: "cif",
    header: "CIF",
    cell: ({ row }) => (
      <span className="font-medium text-[#373a44]">{row.original.cif}</span>
    ),
  },
  {
    accessorKey: "accountNumber",
    header: "Account number",
    cell: ({ row }) => (
      <span className="font-mono text-sm tracking-tight text-[#1c1d22]">
        {row.original.accountNumber}
      </span>
    ),
  },
  {
    accessorKey: "iban",
    header: "IBAN",
    cell: ({ row }) => {
      const [showTooltip, setShowTooltip] = React.useState(false)
      const iban = row.original.iban

      return (
        <div
          className="relative inline-flex cursor-pointer font-mono text-sm tracking-tight text-[#1c1d22]"
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          {iban.slice(0, 12)}...
          {showTooltip ? (
            <div className="absolute left-1/2 top-full z-20 mt-2 -translate-x-1/2 whitespace-nowrap rounded-2xl border border-[#eceff3] bg-white px-4 py-2 text-sm font-semibold text-[#1c1d22] shadow-[0_20px_40px_rgba(14,22,34,0.12)]">
              {iban}
            </div>
          ) : null}
        </div>
      )
    },
  },
  {
    accessorKey: "accountType",
    header: "Account Type",
    cell: ({ row }) => (
      <span className="text-sm font-medium text-[#1b1d22]">
        {row.original.accountType}
      </span>
    ),
  },
  {
    accessorKey: "jointAccount",
    header: "JntAcc",
    cell: ({ row }) => (
      <span className="text-sm text-[#1b1d22]">{row.original.jointAccount}</span>
    ),
  },
  {
    accessorKey: "accountStatusLabel",
    header: "Account Status",
    cell: ({ row }) => (
      <Badge className="rounded-full bg-[#dfeff3] px-4 py-1 text-xs font-semibold text-[#1a4c5b]">
        {row.original.accountStatusLabel}
      </Badge>
    ),
  },
  {
    accessorKey: "institution",
    header: "Institution",
    cell: ({ row }) => (
      <span className="text-sm text-[#1b1d22]">{row.original.institution}</span>
    ),
  },
  {
    accessorKey: "availableBalance",
    header: "Available Balance",
    cell: ({ row }) => (
      <span className="text-sm font-medium text-[#1b1d22]">
        {row.original.availableBalance}
      </span>
    ),
  },
  {
    accessorKey: "totalBalance",
    header: "Total Balance",
    cell: ({ row }) => (
      <span className="text-sm font-medium text-[#1b1d22]">
        {row.original.totalBalance}
      </span>
    ),
  },
  {
    accessorKey: "balanceDate",
    header: "Balance Date",
    cell: ({ row }) => (
      <span className="text-sm text-[#1b1d22]">{row.original.balanceDate}</span>
    ),
  },
  {
    accessorKey: "customerName",
    header: "Customer Full Name",
    cell: ({ row }) => (
      <span className="text-sm font-medium text-[#1c1d22]">
        {row.original.customerName}
      </span>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <RowActionsMenu row={row} />,
  },
]

const accountStatusOptions = [
  { label: "All Account Statuses", value: "all" },
  { label: "Active", value: "active" },
  { label: "On hold", value: "hold" },
  { label: "Closed", value: "closed" },
]

const requestStatusOptions: UiStatus[] = [
  "Completed",
  "Pending",
  "In Review",
  "Failed",
]


const customerNames = [
  "Huda Al-Awadi",
  "Amina Al-Fahad",
  "Dalal Al-Safadi",
  "Adnan Al-Saleh",
  "Hassan Al-Mutairi",
  "Layla Al-Jaber",
  "Reem Al-Qahtani",
  "Faisal Al-Mansour",
  "Salma Al-Harthy",
  "Khalid Al-Nasser",
]
export function RangeDatePicker({ range, setRange }: any) {
const getLabel = () => {
  const from = range?.from
  const to = range?.to

  if (!from && !to) return "Select date range"

  const sameDay =
    from && to && from.toDateString() === to.toDateString()

  const sameYear =
    from && to && from.getFullYear() === to.getFullYear()

  // Formatter helpers
  const formatDayFull = (date: Date) =>
    format(date, "EEEE, MMM d") // Monday, Jan 5

  const formatShort = (date: Date) =>
    format(date, "MMM d") // Jan 5

  const formatWithYear = (date: Date) =>
    format(date, "MMM d, yyyy") // Jan 5, 2025

  // لو نفس اليوم
  if (sameDay) {
    return formatDayFull(from)
  }

  // لو نفس السنة
  if (sameYear) {
    return `${formatShort(from)} — ${formatShort(to)}`
  }

  // سنوات مختلفة
  return `${formatWithYear(from)} — ${formatWithYear(to)}`
}






  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="
            h-14 w-full justify-between rounded-[20px]
            text-base font-medium text-[#1b1d22]
          "
        >
          {getLabel()}
          <CalendarIcon className="size-5 text-[#8f9198]" />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        side="bottom"
        align="start"
        className="
          w-auto p-0 rounded-[24px]
          shadow-[0_12px_40px_rgba(15,15,15,0.08)]
          translate-x-3   /* مسافة من اليمين */
        "
      >
        <Calendar
          mode="range"
          selected={range}
          onSelect={setRange}
          numberOfMonths={1}  // ← ← شهر واحد فقط
          showOutsideDays={false}
          className="p-4 rounded-[24px]"
classNames={{
  root: "p-4 space-y-4",

  /* مسافة جانبية */
  months: "flex justify-center px-4",

  month: "space-y-6",

  /* ====== الهيدر (الشهر + السنة + الأسهم) ====== */
  caption: "flex w-full items-center justify-center relative px-4",

  /* عنوان الشهر */
  caption_label:
    "text-[18px] font-semibold text-[#1b1d22] pointer-events-none",

  /* ازالة ستايل الدروبداون */
  dropdown: "bg-transparent shadow-none border-none outline-none",

  /* ====== الأسهم — بجانب العنوان تماماً ====== */
  button_previous: `
    absolute left-4 top-2
    h-11 w-11 flex items-center justify-center
    text-[#1b1d22] text-[20px]
        hover:bg-[#efefef] rounded-md
    transition-all
  `,

  button_next: `
    absolute right-4 top-2
    h-11 w-11 flex items-center justify-center
    hover:bg-[#efefef] rounded-md
    text-[#1b1d22] text-[18px]
    transition-all
  `,

  /* ====== أيام الأسبوع ====== */
  head_row: "flex",
  head_cell:
    "w-10 h-10 flex items-center justify-center text-gray-400 text-xs font-medium",

  /* ====== شبكة الأيام ====== */
  row: "flex mt-1",
  cell: "relative p-0 w-10 h-10",

  /* يوم عادي */
  day: `
    w-10 h-10 flex items-center justify-center
    rounded-full text-sm text-[#1b1d22]
    hover:bg-[#f2f7fa] cursor-pointer transition
  `,

  /* بداية ونهاية النطاق (أسود) */
  range_start: `
    bg-black text-white rounded-full
  `,
  range_end: `
    bg-black text-white rounded-full
  `,

  /* الأيام داخل النطاق — سماوي فاتح */
  range_middle: `
    bg-red text-[#1b1d22]
  `,

  /* اليوم المحدد */
  day_selected: `
    bg-black text-white rounded-full
  `,
}}


        />
      </PopoverContent>
    </Popover>
  )
}




export function DataTable({ data }: { data: z.infer<typeof schema>[] }) {
  const [activeTab, setActiveTab] = React.useState("all")
const [dateRange, setDateRange] = React.useState<any>()
  const [selectedRange, setSelectedRange] = React.useState<{
    from?: Date
    to?: Date
  }>({})
  const [search, setSearch] = React.useState("")
  const [requestStatus, setRequestStatus] = React.useState<"all" | UiStatus>(
    "all"
  )
  const [accountStatus, setAccountStatus] =
    React.useState<(typeof accountStatusOptions)[number]["value"]>("all")
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  })
const hasFilters =
  selectedRange?.from ||
  selectedRange?.to ||
  requestStatus !== "all" ||
  accountStatus !== "all"

function handleClearFilters() {
  setSearch("")
  setSelectedRange({})
  setRequestStatus("all")
  setAccountStatus("all")
}

  const tableData = React.useMemo<RequestRow[]>(() => {
  return data.map((item, index) => ({
    ...item,
    requestDate: buildRequestDate(index),
    uiStatus: deriveUiStatus(item, index),
    cif: buildCif(item.id),
    accountNumber: buildAccountNumber(item.id),
    iban: buildIban(item.id),
    accountType: deriveAccountType(item),
    jointAccount: index % 3 === 0 ? "---" : "Joint",
    accountStatusLabel: deriveAccountStatusLabel(item),
    institution: index % 4 === 0 ? "XYZ Bank" : "---",
    availableBalance: formatCurrency(95300 + index * 137),
    totalBalance: formatCurrency(95500 + index * 120),
    balanceDate: buildRequestDate(index + 1),
    customerName: customerNames[index % customerNames.length],
  }))
}, [data])

const filteredData = React.useMemo(() => {
  return tableData.filter((item) => {
    // فلترة التاب
    const matchesTab =
      activeTab === "all"
        ? true
        : item.type.toLowerCase().includes(activeTab)

    // فلترة البحث
    const matchesSearch = `${item.type} ${item.header} ${item.status}`
      .toLowerCase()
      .includes(search.toLowerCase())

    // فلترة حالة الطلب
    const matchesStatus =
      requestStatus === "all" ? true : item.uiStatus === requestStatus

    // فلترة حالة الحساب
    const matchesAccount =
      accountStatus === "all"
        ? true
        : item.limit.endsWith(accountStatus.charAt(0))

    // -------------------------------
    // ✅ فلترة التاريخ (من – إلى)
    // -------------------------------
    let matchesDate = true

    if (selectedRange?.from || selectedRange?.to) {
      const itemDate = new Date(item.requestDate.split(" at ")[0]) // نأخذ التاريخ فقط

      if (selectedRange?.from && itemDate < selectedRange.from) {
        matchesDate = false
      }

      if (selectedRange?.to && itemDate > selectedRange.to) {
        matchesDate = false
      }
    }

    return (
      matchesTab &&
      matchesSearch &&
      matchesStatus &&
      matchesAccount &&
      matchesDate
    )
  })
}, [
  tableData,
  activeTab,
  search,
  requestStatus,
  accountStatus,
  selectedRange,
])

  const fieldBaseClass =
    "h-14 w-full rounded-[20px] border border-[#dfe1e7] bg-white text-base text-[#1b1d22] shadow-none transition focus-visible:border-[#1c1d22] focus-visible:ring-0"

  const table = useReactTable({
    data: filteredData,
    columns,
    state: {
      sorting,
      pagination,
    },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  return (
    <div className="rounded-[36px] bg-white p-6 shadow-[0_30px_80px_rgba(15,15,15,0.08)]">
      <div className="flex flex-wrap gap-3">
        {tabConfig.map((tab) => (
          <Button
            key={tab.value}
            type="button"
            variant="outline"
            onClick={() => setActiveTab(tab.value)}
            aria-pressed={activeTab === tab.value}
            className={cn(
              "rounded-full border px-5 py-2 text-sm font-semibold transition-none",
              activeTab === tab.value
                ? "border-[#1c1d22] bg-[#1c1d22] text-white"
                : "border-transparent bg-[#f4f4f6] text-[#4f5158] hover:bg-[#f4f4f6]"
            )}
          >
            {tab.label}
          </Button>
        ))}
      </div>
<div
  className="
    mt-6 grid grid-cols-1 gap-3
    sm:grid-cols-2
    lg:grid-cols-[1fr_1fr_1fr_1.2fr_auto]  /* ← توزيع أفضل للفلاتر */
    px-1 sm:px-2 lg:px-4
  "
>
  {/* 🔍 Search */}
<div className="w-full relative">
  {/* 🔍 Icon */}
  <SearchIcon className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-[#7f8088]" />

  {/* 📝 Input */}
  <Input
    type="search"
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    placeholder="Search by Customer ID, SRN, Msg UID and CIF"
    className={cn(fieldBaseClass, "pl-12 pr-12")}
  />

  {/* ❌ Clear Button */}
  {search && (
    <button
      onClick={() => setSearch("")}
      className="
        absolute right-4 top-1/2 -translate-y-1/2
        h-5 w-5 flex items-center justify-center
        rounded-full bg-[#e5e7eb] hover:bg-[#dfe1e7]
        transition cursor-pointer
      "
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="size-3 text-[#555]"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M6 18L18 6" />
      </svg>
    </button>
  )}
</div>


  {/* 📌 Request Status */}
  <div className="w-full">
    <Select
      value={requestStatus}
      onValueChange={(v: UiStatus | "all") => setRequestStatus(v)}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="All Request Statuses" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Request Statuses</SelectItem>
        {requestStatusOptions.map((option) => (
          <SelectItem key={option} value={option}>
            {option}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>

  {/* 🏦 Account Status */}
  <div className="w-full">
    <Select
      value={accountStatus}
      onValueChange={(v) => setAccountStatus(v)}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="All Account Statuses" />
      </SelectTrigger>
      <SelectContent>
        {accountStatusOptions.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>

  {/* 📅 Date Range */}
  <div className="w-full">
    <RangeDatePicker range={selectedRange} setRange={setSelectedRange} />
  </div>

  {/* ❌ Clear Button */}
  <div className="flex items-center justify-start">
    {hasFilters && (
      <Button
        type="button"
        variant="outline"
        onClick={handleClearFilters}
        className="
          h-12 px-4 rounded-[16px]
          text-sm font-semibold
          border border-red-200
          text-red-600 hover:text-red-700
          bg-white hover:bg-red-50
          flex items-center gap-2
          shadow-sm whitespace-nowrap
        "
      >
        <X className="size-4" />
      </Button>
    )}
  </div>
</div>






<div className="mt-6 rounded-t-[12px]">
  {/* 🔍 هنا الشرط الجديد */}
  {filteredData.length === 0 ? (
    <div className="flex flex-col items-center justify-center gap-4 py-20">

      <InboxIcon className="size-20 text-[#d0d3d8]" />

      <h3 className="text-xl font-semibold text-[#1c1d22]">
        No requests found
      </h3>

      <p className="max-w-[300px] text-sm text-[#7a7d88] text-center">
        It looks like there are no requests to display at the moment.
      </p>

    </div>
  ) : (
    <div className="w-full overflow-x-auto scroll-smooth px-2 sm:px-4 lg:px-6">
      <div className="min-w-[1200px] px-4 sm:px-6 lg:px-8">

        <Table className="text-center">
          <TableHeader className="bg-white">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="bg-white">
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="bg-white text-[#1b1d22] text-sm font-semibold text-center py-3 border-b border-[#f0f1f5]"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody className="[&_tr:hover]:bg-[#fafafb]">
            {table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                className="border-b border-[#f0f1f5] last:border-0"
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>

        </Table>

      </div>
    </div>
  )}
</div>
<div
  className="
    mt-6 flex flex-col gap-4 border-t border-[#eceff3] pt-6
    text-sm text-[#5d606a]
    lg:flex-row lg:items-center lg:justify-between
  "
>
  {/* LEFT — Page Size (Hidden on Mobile) */}
  <div className="hidden lg:flex items-center gap-3 text-[#7c7f8a]">
    <Select
      value={String(pagination.pageSize)}
      onValueChange={(value) =>
        setPagination((prev) => ({
          ...prev,
          pageSize: Number(value),
          pageIndex: 0,
        }))
      }
    >
      <SelectTrigger
        id="page-size"
        className="h-12 w-20 rounded-[12px] border border-[#dfe1e7] bg-white px-4 text-base font-semibold text-[#1c1d22]"
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent className="rounded-2xl border border-[#eceef2] bg-white shadow-[0_20px_50px_rgba(15,15,15,0.12)]">
        {[10, 20, 30].map((size) => (
          <SelectItem key={size} value={String(size)}>
            {size}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>

    <span className="text-[#5f626d]">
      Show {getEntryRange(pagination, filteredData.length)} entries
    </span>
  </div>

  {/* RIGHT — Pagination */}
  <div className="flex flex-col items-center gap-3 w-full lg:w-auto">

    {/* 📱 Mobile — Simple Pagination */}
    <div className="flex w-full items-center justify-between lg:hidden">
      <Button
        type="button"
        variant="outline"
        className="h-10 px-4 rounded-[10px]"
        disabled={!table.getCanPreviousPage()}
        onClick={() => table.previousPage()}
      >
        <ChevronLeftIcon className="size-4" />
      </Button>

      <span className="text-[#1c1d22] font-medium">
        Page {pagination.pageIndex + 1} of {table.getPageCount()}
      </span>

      <Button
        type="button"
        variant="outline"
        className="h-10 px-4 rounded-[10px]"
        disabled={!table.getCanNextPage()}
        onClick={() => table.nextPage()}
      >
        <ChevronRightIcon className="size-4" />
      </Button>
    </div>

    {/* 💻 Desktop — Full Pagination */}
    <div className="hidden lg:flex items-center gap-2 rounded-[14px] bg-white px-3 py-2">
      <Button
        type="button"
        variant="outline"
        className="h-10 rounded-[12px] border border-[#e5e7eb] bg-[#f9fafb] px-4 text-sm font-semibold text-[#1c1d22] hover:bg-[#f3f4f6]"
        disabled={!table.getCanPreviousPage()}
        onClick={() => table.previousPage()}
      >
        <ChevronLeftIcon className="mr-1 size-4" />
        Previous
      </Button>

      {buildPaginationItems(
        table.getState().pagination.pageIndex,
        table.getPageCount()
      ).map((item, index) =>
        item === "..." ? (
          <span key={`ellipsis-${index}`} className="px-2 text-[#9a9eaa]">...</span>
        ) : (
          <Button
            key={item}
            type="button"
            variant="outline"
            onClick={() => table.setPageIndex(item)}
            className={cn(
              "h-10 min-w-10 rounded-[12px] border border-[#e5e7eb] px-3 text-sm font-semibold text-[#1c1d22] hover:bg-[#f3f4f6]",
              table.getState().pagination.pageIndex === item
                ? "bg-[#1c1d22] text-white"
                : "bg-[#f9fafb]"
            )}
          >
            {item + 1}
          </Button>
        )
      )}

      <Button
        type="button"
        variant="outline"
        className="h-10 rounded-[12px] border border-[#e5e7eb] bg-[#f9fafb] px-4 text-sm font-semibold text-[#1c1d22] hover:bg-[#f3f4f6]"
        disabled={!table.getCanNextPage()}
        onClick={() => table.nextPage()}
      >
        Next
        <ChevronRightIcon className="ml-1 size-4" />
      </Button>
    </div>
  </div>
</div>

    </div>
  )
}

function buildRequestDate(index: number) {
  const base = new Date(2025, 9, 17) // Aug 17 2023
  const date = new Date(base)
  date.setDate(base.getDate() + index)
  const time = new Date(2023, 7, 17, 9 + (index % 6) * 2, (index * 13) % 60)

  const formattedDate = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(date)

  const hours = time.getHours()
  const minutes = time.getMinutes().toString().padStart(2, "0")
  const period = hours >= 12 ? "pm" : "am"
  const hour12 = ((hours + 11) % 12 || 12).toString().padStart(2, "0")

  return `${formattedDate} at ${hour12}:${minutes} ${period}`
}

function deriveUiStatus(
  item: z.infer<typeof schema>,
  index: number
): UiStatus {
  if (item.status === "Done") {
    return "Completed"
  }

  if (item.status === "In Process") {
    return index % 2 === 0 ? "Pending" : "In Review"
  }

  return "Failed"
}

function buildCif(id: number) {
  return (8840000 + (id % 1000)).toString()
}

function buildAccountNumber(id: number) {
  return (100000000000 + id * 987).toString()
}

function buildIban(id: number) {
  const suffix = (900000000000 + id * 123).toString().padStart(12, "0")
  return `SA99${suffix}`
}

function deriveAccountType(item: z.infer<typeof schema>) {
  if (item.type.toLowerCase().includes("balance")) {
    return "Savings"
  }
  if (item.type.toLowerCase().includes("customer")) {
    return "Corporate"
  }
  return "Current"
}

function deriveAccountStatusLabel(item: z.infer<typeof schema>) {
  if (item.status === "Done") return "Active"
  if (item.status === "In Process") return "Review"
  return "Inactive"
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(value)
}

function RowActionsMenu({ row }: { row: Row<RequestRow> }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-10 w-10 rounded-[12px] text-[#1c1d22] hover:bg-[#f3f4f6]"
        >
          <MoreHorizontalIcon className="size-5" />
        </Button>
      </DropdownMenuTrigger>
<DropdownMenuContent
  align="end"
  className="w-56 rounded-2xl border-0 bg-[#1c1d22] p-2 text-white shadow-[0_8px_24px_rgba(0,0,0,0.1)]"
>
  {[
    { icon: EyeIcon, label: "View XML Body" },
    { icon: RefreshCcwIcon, label: "Reprocess" },
    { icon: CheckIcon, label: "Approve reprocessing" },
  ].map(({ icon: Icon, label }, i) => (
    <DropdownMenuItem
      key={i}
      className="group flex items-center gap-2 rounded-xl px-3 py-2 text-sm
        text-white hover:text-white focus:text-white data-[highlighted]:text-white
        transition-colors duration-150
        hover:bg-[#fafafa]/15 focus:bg-[#fafafa]/15 data-[highlighted]:bg-[#fafafa]/15"
    >
      <Icon className="size-4 text-white" />
      <span className="text-white">{label}</span>
    </DropdownMenuItem>
  ))}
</DropdownMenuContent>

    </DropdownMenu>
  )
}

function getEntryRange(
  pagination: { pageIndex: number; pageSize: number },
  total: number
) {
  if (total === 0) return "0 of 0"
  const start = pagination.pageIndex * pagination.pageSize + 1
  const end = Math.min((pagination.pageIndex + 1) * pagination.pageSize, total)
  return `${start} to ${end} of ${total}`
}

function buildPaginationItems(current: number, totalPages: number) {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, index) => index)
  }

  const items: (number | "...")[] = [0]

  if (current > 2) {
    items.push("...")
  }

  const start = Math.max(1, current - 1)
  const end = Math.min(totalPages - 2, current + 1)
  for (let page = start; page <= end; page += 1) {
    items.push(page)
  }

  if (current < totalPages - 3) {
    items.push("...")
  }

  items.push(totalPages - 1)

  return items
}

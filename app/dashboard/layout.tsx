"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"

import {
  BellIcon,
  ChevronDownIcon,
  CircleHelpIcon,
  FileTextIcon,
  PlayIcon,
  GlobeIcon, // ← زر تغيير اللغة
} from "lucide-react"

import { Button } from "@/components/ui/button"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  const isDashboard = pathname === "/dashboard"
  const isActions = pathname === "/dashboard/actions"

  return (
    <div className="flex min-h-screen bg-[#f5f5f7] text-[#1c1d22]">

      {/* =============== SIDEBAR – DESKTOP =============== */}
      <aside
        className="
          hidden lg:flex
          w-24 flex-col items-center
          border-r border-[#e3e4eb]
          bg-white px-4 py-8
          shadow-[0_10px_40px_rgba(15,15,15,0.08)]
        "
      >
        <div className="flex flex-col items-center gap-10">

          {/* Logo */}
          <div className="flex h-12 w-12 items-center justify-center overflow-hidden">
            <Image
              src="/barq-icon-black.png"
              alt="Barq Logo"
              width={32}
              height={32}
              className="object-contain"
            />
          </div>

          {/* Requests */}
          <Link href="/dashboard">
            <Button
              size="icon"
              variant="ghost"
              aria-label="Requests"
              className={`
                h-10 w-14 rounded-full transition
                ${isDashboard
                  ? "bg-[#f5cf32] text-[#0f0f10]"
                  : "bg-[#f2f3f7] text-[#4f535c] hover:bg-[#e6e7ec]"
                }
              `}
            >
              <FileTextIcon className="size-5" />
            </Button>
          </Link>

          {/* Actions Demo */}
          <Link href="/dashboard/actions">
            <Button
              size="icon"
              variant="ghost"
              aria-label="Demo"
              className={`
                h-10 w-14 rounded-full transition
                ${isActions
                  ? "bg-[#f5cf32] text-[#0f0f10]"
                  : "bg-[#f2f3f7] text-[#4f535c] hover:bg-[#e6e7ec]"
                }
              `}
            >
              <PlayIcon className="size-5" />
            </Button>
          </Link>
        </div>

        {/* Help Button */}
        <Button
          size="icon"
          variant="ghost"
          aria-label="Help"
          className="mt-auto size-10 rounded-full text-[#9ea0a8]"
        >
          <CircleHelpIcon className="size-5" />
        </Button>
      </aside>

      {/* =============== MOBILE NAVBAR =============== */}
      <nav
        className="
          fixed bottom-0 left-0 right-0 z-40
          flex justify-around items-center
          lg:hidden
          bg-white border-t border-[#e3e4eb]
          py-3 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]
        "
      >
        <Link href="/dashboard">
          <Button
            size="icon"
            variant="ghost"
            className={`
              rounded-full 
              ${isDashboard ? "bg-[#f5cf32] text-black" : "text-[#4f535c]"}
            `}
          >
            <FileTextIcon className="size-6" />
          </Button>
        </Link>

        <Link href="/dashboard/actions">
          <Button
            size="icon"
            variant="ghost"
            className={`
              rounded-full
              ${isActions ? "bg-[#f5cf32] text-black" : "text-[#4f535c]"}
            `}
          >
            <PlayIcon className="size-6" />
          </Button>
        </Link>

        <Button size="icon" variant="ghost">
          <CircleHelpIcon className="size-6 text-[#4f535c]" />
        </Button>
      </nav>

      {/* =============== MAIN CONTENT =============== */}
      <div className="flex w-full flex-col px-4 py-8 pb-20 lg:px-8 xl:px-10 2xl:px-16">
        <div className="mx-auto w-full max-w-[92rem]">

{/* HEADER */}
<header
  className="
    flex flex-col gap-4 pb-6
    lg:flex-row lg:items-center lg:justify-between
  "
>

  {/* 🌐🔔 USER INFO — MOBILE ONLY */}
  <div className="flex items-center justify-between lg:hidden">
    {/* LEFT: User info */}
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e6ecff] text-sm font-semibold text-[#2f3a8f]">
        CW
      </div>

      <div className="text-left">
        <p className="text-sm font-semibold leading-tight">xyz company</p>
        <p className="text-xs text-[#7a7d88]">Cameron Williamson</p>
      </div>
    </div>

    {/* RIGHT: Language + Bell */}
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        className="h-10 w-10 rounded-full bg-[#f2f3f7] text-[#4f535c]"
      >
        <GlobeIcon className="size-5" />
      </Button>

      <Button
        variant="ghost"
        className="h-10 w-10 rounded-full bg-[#f2f3f7] text-[#4f535c]"
      >
        <BellIcon className="size-5" />
      </Button>
    </div>
  </div>

  {/* 📌 TITLE (always visible) */}
  <h1 className="text-3xl font-semibold lg:order-none">
    {isDashboard ? "Requests" : "Actions Demo"}
  </h1>

  {/* 🌐🔔👤 USER + LANGUAGE — DESKTOP ONLY */}
  <div className="hidden lg:flex items-center gap-3">

    <Button
      variant="ghost"
      className="h-11 w-11 rounded-full bg-[#f2f3f7] text-[#4f535c]"
    >
      <GlobeIcon className="size-5" />
    </Button>

    <Button
      variant="ghost"
      className="h-11 w-11 rounded-full bg-[#f2f3f7] text-[#4f535c]"
    >
      <BellIcon className="size-5" />
    </Button>

    <div className="hidden items-center gap-4 pl-2 sm:flex lg:pl-4 xl:pl-6">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e6ecff] text-sm font-semibold text-[#2f3a8f]">
        CW
      </div>

      <div className="text-left">
        <p className="text-sm font-semibold leading-tight">xyz company</p>
        <p className="text-xs text-[#7a7d88]">Cameron Williamson</p>
      </div>

      <ChevronDownIcon className="size-4 text-[#a1a4af]" />
    </div>
  </div>
</header>


          <main className="flex-1">{children}</main>
        </div>
      </div>
    </div>
  )
}

"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import type { LucideIcon } from "lucide-react"
import {
  BellIcon,
  ChevronDownIcon,
  CircleHelpIcon,
  FileTextIcon,
  GlobeIcon,
  HistoryIcon,
  PlusCircleIcon,
  ShieldCheckIcon,
  UserIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Can } from "@/components/Can"
import { ROLE_HOME_PATH } from "@/lib/roles"

type MenuItem = {
  label: string
  href: string
  icon: LucideIcon
  allow?: string | string[]
}

const MENU_BY_ROLE: Record<string, MenuItem[]> = {
  maker: [
    {
      label: "New Request",
      href: `${ROLE_HOME_PATH.maker}#create-request`,
      icon: PlusCircleIcon,
      allow: "request:create",
    },
    {
      label: "My Requests",
      href: `${ROLE_HOME_PATH.maker}#my-requests`,
      icon: FileTextIcon,
      allow: "request:read",
    },
  ],
  chacker: [
    {
      label: "Current Requests",
      href: `${ROLE_HOME_PATH.chacker}#current`,
      icon: FileTextIcon,
      allow: "request:read",
    },
    {
      label: "Request History",
      href: `${ROLE_HOME_PATH.chacker}#history`,
      icon: HistoryIcon,
      allow: "request:read",
    },
  ],
  admin: [
    {
      label: "Requests",
      href: ROLE_HOME_PATH.admin,
      icon: FileTextIcon,
      allow: "request:read",
    },
    {
      label: "Users & Roles",
      href: "/dashboard/users",
      icon: UserIcon,
      allow: "user:read",
    },
    {
      label: "Permissions Matrix",
      href: "/dashboard/permissions",
      icon: ShieldCheckIcon,
      allow: "role:read",
    },
  ],
}

function initials(name: string) {
  if (!name) return "??"
  const [first, second] = name.split(" ")
  if (second) return `${first[0] ?? ""}${second[0] ?? ""}`.toUpperCase()
  return name.slice(0, 2).toUpperCase()
}

function isActivePath(itemHref: string, pathname: string) {
  const normalized = itemHref.split("#")[0]
  if (!normalized) return pathname === "/dashboard"
  return normalized === pathname
}

export function DashboardShell({
  children,
  user,
}: {
  children: React.ReactNode
  user: {
    id: number
    username: string
    role: string
  }
}) {
  const pathname = usePathname()
  const menuItems = MENU_BY_ROLE[user.role] ?? MENU_BY_ROLE.maker
  const userInitials = initials(user.username)
  const headingByRole: Record<string, string> = {
    maker: "My requests",
    chacker: "Checker console",
    admin: "Requests overview",
  }
  const heading = headingByRole[user.role] ?? "Dashboard"

  return (
    <div className="flex min-h-screen bg-[#f5f5f7] text-[#1c1d22]">
      <aside className="hidden w-24 flex-col items-center border-r border-[#e3e4eb] bg-white px-4 py-8 shadow-[0_10px_40px_rgba(15,15,15,0.08)] lg:flex">
        <div className="flex flex-col items-center gap-8">
          <div className="flex h-12 w-12 items-center justify-center overflow-hidden">
            <Image
              src="/barq-icon-black.png"
              alt="Barq Logo"
              width={32}
              height={32}
              className="object-contain"
            />
          </div>

          <div className="flex flex-col items-center gap-4">
            {menuItems.map((item) => {
              const active = isActivePath(item.href, pathname)
              return (
                <Can key={item.href} allow={item.allow}>
                  <Link href={item.href}>
                    <Button
                      size="icon"
                      variant="ghost"
                      aria-label={item.label}
                      className={`h-10 w-14 rounded-full transition ${
                        active
                          ? "bg-[#f5cf32] text-[#0f0f10]"
                          : "bg-[#f2f3f7] text-[#4f535c] hover:bg-[#e6e7ec]"
                      }`}
                    >
                      <item.icon className="size-5" />
                    </Button>
                  </Link>
                </Can>
              )
            })}
          </div>
        </div>

        <Button
          size="icon"
          variant="ghost"
          aria-label="Help"
          className="mt-auto size-10 rounded-full text-[#9ea0a8]"
        >
          <CircleHelpIcon className="size-5" />
        </Button>
      </aside>

      <nav className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around border-t border-[#e3e4eb] bg-white py-3 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] lg:hidden">
        {menuItems.map((item) => {
          const active = isActivePath(item.href, pathname)
          return (
            <Can key={item.href} allow={item.allow}>
              <Link href={item.href}>
                <Button
                  size="icon"
                  variant="ghost"
                  className={`rounded-full ${
                    active ? "bg-[#f5cf32] text-black" : "text-[#4f535c]"
                  }`}
                >
                  <item.icon className="size-6" />
                </Button>
              </Link>
            </Can>
          )
        })}

        <Button size="icon" variant="ghost">
          <CircleHelpIcon className="size-6 text-[#4f535c]" />
        </Button>
      </nav>

      <div className="flex w-full flex-col px-4 py-8 pb-20 lg:px-8 xl:px-10 2xl:px-16">
        <div className="mx-auto w-full max-w-[92rem]">
          <header className="flex flex-col gap-4 pb-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center justify-between lg:hidden">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e6ecff] text-sm font-semibold text-[#2f3a8f]">
                  {userInitials}
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold leading-tight">{user.username}</p>
                  <p className="text-xs text-[#7a7d88]">{user.role}</p>
                </div>
              </div>

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

            <h1 className="text-3xl font-semibold">{heading}</h1>

            <div className="hidden items-center gap-3 lg:flex">
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
                  {userInitials}
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold leading-tight">
                    {user.username}
                  </p>
                  <p className="text-xs text-[#7a7d88]">{user.role}</p>
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

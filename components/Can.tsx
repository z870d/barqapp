"use client"

import type { ReactNode } from "react"

import { useCan } from "@/hooks/useCan"

function matchesPermission(permission: string, requested: string) {
  if (permission === requested) return true
  if (permission.endsWith("*")) {
    return requested.startsWith(permission.slice(0, -1))
  }
  if (requested.endsWith("*")) {
    return permission.startsWith(requested.slice(0, -1))
  }
  return false
}

function listHasPermission(permissions: string[], required: string[]) {
  if (!required.length) return true
  return required.some((action) =>
    permissions.some((permission) => matchesPermission(permission, action)),
  )
}

export function Can({
  allow,
  permissions,
  children,
}: {
  allow?: string | string[]
  permissions?: string[]
  children: ReactNode
}) {
  const required = Array.isArray(allow)
    ? allow
    : allow
      ? [allow]
      : []

  const contextAllowance = useCan(required)

  if (!allow) return <>{children}</>

  const allowed = permissions
    ? listHasPermission(permissions, required)
    : contextAllowance

  if (!allowed) return null

  return <>{children}</>
}

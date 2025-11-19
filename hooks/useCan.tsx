"use client"

import {
  createContext,
  useContext,
  type ReactNode,
} from "react"

const PermissionsContext = createContext<string[]>([])

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

export function PermissionsProvider({
  permissions,
  children,
}: {
  permissions: string[]
  children: ReactNode
}) {
  return (
    <PermissionsContext.Provider value={permissions}>
      {children}
    </PermissionsContext.Provider>
  )
}

export function usePermissions() {
  return useContext(PermissionsContext)
}

export function useCan(required: string[]) {
  const permissions = usePermissions()
  if (!required.length) return true
  return required.some((action) =>
    permissions.some((permission) => matchesPermission(permission, action)),
  )
}

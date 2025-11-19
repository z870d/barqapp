import { useEffect, useState } from "react"

export function useCan(required: string[]) {
  const [allowed, setAllowed] = useState(false)

  useEffect(() => {
    // API → /api/me/permissions
    // or session → user.permissions
  }, [])

  return allowed
}

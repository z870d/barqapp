export function Can({ allow, permissions, children }) {
  if (!permissions?.includes(allow)) return null
  return <>{children}</>
}

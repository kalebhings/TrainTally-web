import type { ReactNode } from 'react'

interface AppShellProps {
  children: ReactNode
}

export function AppShell({
  children,
}: AppShellProps) {
  return (
    <div className="mx-auto min-h-screen w-full max-w-4xl px-4 py-8">
      {children}
    </div>
  )
}
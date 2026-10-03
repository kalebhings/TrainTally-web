import type { ReactNode } from 'react'

interface SectionProps {
  title: string
  aside?: ReactNode
  children: ReactNode
}

export function Section({
  title,
  aside,
  children,
}: SectionProps) {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-baseline justify-between gap-4">
        <h2 className="text-lg font-semibold">{title}</h2>
        {aside}
      </div>

      {children}
    </section>
  )
}

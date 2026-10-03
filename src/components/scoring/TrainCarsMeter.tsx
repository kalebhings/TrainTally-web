interface TrainCarsMeterProps {
  used: number
  total: number
}

export function TrainCarsMeter({
  used,
  total,
}: TrainCarsMeterProps) {
  const remaining = total - used
  const full = remaining <= 0
  const percent = Math.min(100, (used / total) * 100)

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-baseline justify-between">
        <h2 className="text-lg font-semibold">Train Cars</h2>
        <span
          className={`tabular-nums ${full ? 'font-semibold text-amber-600' : 'text-gray-500'}`}
        >
          {used} / {total} used
          {remaining >= 0 && ` · ${remaining} left`}
        </span>
      </div>

      <div
        className="mt-3 h-2 overflow-hidden rounded-full bg-gray-200"
        role="progressbar"
        aria-label="Train cars used"
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={used}
      >
        <div
          className={`h-full rounded-full ${full ? 'bg-amber-500' : 'bg-blue-600'}`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </section>
  )
}
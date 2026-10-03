interface StepperProps {
  value: number
  label: string
  min?: number
  max?: number | null
  onChange: (delta: number) => void
}

const buttonClass =
  'flex size-10 items-center justify-center rounded-full text-xl font-semibold disabled:opacity-30'

export function Stepper({
  value,
  label,
  min = 0,
  max = null,
  onChange,
}: StepperProps) {
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        className={`${buttonClass} bg-gray-200 text-gray-700`}
        aria-label={`Decrease ${label}`}
        disabled={value <= min}
        onClick={() => onChange(-1)}
      >
        −
      </button>

      <span
        className="min-w-8 text-center text-lg font-semibold tabular-nums"
        aria-live="polite"
      >
        {value}
      </span>

      <button
        type="button"
        className={`${buttonClass} bg-green-600 text-white`}
        aria-label={`Increase ${label}`}
        disabled={max !== null && value >= max}
        onClick={() => onChange(1)}
      >
        +
      </button>
    </div>
  )
}
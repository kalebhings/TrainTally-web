interface ToggleProps {
  checked: boolean
  label: string
  onChange: (checked: boolean) => void
}

export function Toggle({
  checked,
  label,
  onChange,
}: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      className={`relative h-8 w-14 shrink-0 rounded-full transition-colors ${
        checked ? 'bg-green-600' : 'bg-gray-300'
      }`}
      onClick={() => onChange(!checked)}
    >
      <span
        className={`absolute top-1 left-1 size-6 rounded-full bg-white shadow transition-transform ${
          checked ? 'translate-x-6' : ''
        }`}
      />
    </button>
  )
}
import { capitalize, playerAccentHex, playerColorHex } from './display'

interface PlayerSetupRowProps {
  index: number
  name: string
  color: string
  availableColors: string[]
  onNameChange: (name: string) => void
  onColorChange: (color: string) => void
}

export function PlayerSetupRow({
  index,
  name,
  color,
  availableColors,
  onNameChange,
  onColorChange,
}: PlayerSetupRowProps) {
  const placeholder = `Player ${index + 1}`

  return (
    <div
      className="rounded-xl border-l-4 bg-gray-50 p-3"
      style={{ borderLeftColor: playerAccentHex(color) }}
    >
      <input
        type="text"
        className="min-h-12 w-full rounded-lg border border-gray-300 bg-white px-3 text-base"
        value={name}
        onChange={(event) =>
          onNameChange(event.target.value)
        }
        placeholder={placeholder}
        aria-label={`${placeholder} name`}
        autoComplete="off"
        enterKeyHint="next"
      />

      <div
        className="mt-3 flex flex-wrap gap-2"
        role="radiogroup"
        aria-label={`${placeholder} color`}
      >
        {availableColors.map((playerColor) => {
          const selected = playerColor === color

          return (
            <button
              key={playerColor}
              type="button"
              role="radio"
              aria-checked={selected}
              aria-label={capitalize(playerColor)}
              title={capitalize(playerColor)}
              className={`size-10 rounded-full border border-gray-300 ${
                selected
                  ? 'ring-2 ring-blue-600 ring-offset-2'
                  : ''
              }`}
              style={{ backgroundColor: playerColorHex(playerColor) }}
              onClick={() => onColorChange(playerColor)}
            />
          )
        })}
      </div>
    </div>
  )
}
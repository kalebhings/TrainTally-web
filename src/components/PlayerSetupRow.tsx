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
  return (
    <div className="player-setup-row">
      <label>
        Player {index + 1}
        <input
          type="text"
          value={name}
          onChange={(event) =>
            onNameChange(event.target.value)
          }
          placeholder={`Player ${index + 1}`}
        />
      </label>

      <label>
        Color
        <select
          value={color}
          onChange={(event) =>
            onColorChange(event.target.value)
          }
        >
          {availableColors.map((playerColor) => (
            <option
              key={playerColor}
              value={playerColor}
            >
              {playerColor}
            </option>
          ))}
        </select>
      </label>
    </div>
  )
}
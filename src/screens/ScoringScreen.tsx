import type { GameSetup } from '../domain/game-setup'

interface ScoringScreenProps {
  gameSetup: GameSetup
  onBack: () => void
}

export function ScoringScreen({
  gameSetup,
  onBack,
}: ScoringScreenProps) {
  return (
    <main>
      <button onClick={onBack}>
        Back
      </button>

      <h1>{gameSetup.gameVersion.displayName}</h1>

      <h2>Players</h2>

      <ul>
        {gameSetup.players.map((player, index) => (
          <li key={index}>
            {player.name || `Player ${index + 1}`}
            {' — '}
            {player.color}
          </li>
        ))}
      </ul>
    </main>
  )
}
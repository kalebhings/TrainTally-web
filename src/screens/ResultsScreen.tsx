import type { GameConfig } from '../domain/game-config'
import type { CompleteGameScoreResult } from '../domain/scoring/game/complete-game-score'

import { formatPoints, playerAccentHex } from '../components/display'

interface ResultsScreenProps {
  config: GameConfig
  result: CompleteGameScoreResult
  onBack: () => void
  onNewGame: () => void
  onHome: () => void
}

export function ResultsScreen({
  config,
  result,
  onBack,
  onNewGame,
  onHome,
}: ResultsScreenProps) {
  const winners = result.standings.filter((ranked) => ranked.rank === 1)

  const bonusNames = new Map(
    config.bonuses.map((bonus) => [bonus.id, bonus.displayName]),
  )

  const hasMeeples = config.gameVersion.meepleConfig !== null

  return (
    <main className="mx-auto grid w-full max-w-xl gap-4">
      <header className="flex items-center justify-between gap-3">
        <button
          type="button"
          className="min-h-11 rounded-full border border-gray-300 bg-white px-4 font-medium"
          onClick={onBack}
        >
          Edit scores
        </button>

        <h1 className="truncate text-lg font-semibold">
          {config.gameVersion.displayName}
        </h1>
      </header>

      <section className="rounded-2xl bg-blue-600 p-6 text-center text-white">
        <p className="text-sm tracking-wide uppercase opacity-80">
          {winners.length > 1 ? 'Tied winners' : 'Winner'}
        </p>
        <p className="mt-1 text-3xl font-bold">
          {winners.map((ranked) => ranked.player.name).join(' & ')}
        </p>
        <p className="mt-1 text-lg tabular-nums opacity-90">
          {winners[0]?.score.total ?? 0} pts
        </p>
      </section>

      <ol className="grid gap-3">
        {result.standings.map((ranked) => (
          <li key={ranked.player.id}>
            <details className="group rounded-2xl border border-gray-200 bg-white shadow-sm">
              <summary
                className="flex min-h-14 cursor-pointer list-none items-center gap-3 border-l-4 px-4 py-3"
                style={{ borderLeftColor: playerAccentHex(ranked.player.color) }}
              >
                <span className="w-6 text-lg font-bold text-gray-400 tabular-nums">
                  {ranked.rank}
                </span>
                <span className="flex-1 truncate font-semibold">
                  {ranked.player.name}
                </span>
                <span className="text-lg font-bold tabular-nums">
                  {ranked.score.total}
                </span>
                <svg
                  className="size-4 text-gray-400 transition-transform group-open:rotate-90"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <path d="M6 3l5 5-5 5" />
                </svg>
              </summary>

              <dl className="grid grid-cols-[1fr_auto] gap-x-4 gap-y-1 border-t border-gray-100 px-4 py-3 text-sm">
                <dt className="text-gray-600">Routes</dt>
                <dd className="text-right tabular-nums">
                  {formatPoints(ranked.score.routeScore)}
                </dd>

                <dt className="text-gray-600">Destination tickets</dt>
                <dd className="text-right tabular-nums">
                  {formatPoints(ranked.score.destinationTicketScore)}
                </dd>

                {ranked.bonuses.map((bonus) => (
                  <BreakdownRow
                    key={bonus.bonusId}
                    label={bonusNames.get(bonus.bonusId) ?? bonus.bonusId}
                    points={bonus.score}
                  />
                ))}

                {hasMeeples && (
                  <BreakdownRow
                    label="Meeples"
                    points={ranked.score.meepleScore}
                  />
                )}
              </dl>
            </details>
          </li>
        ))}
      </ol>

      <div className="grid gap-3 pb-8 sm:grid-cols-2">
        <button
          type="button"
          className="min-h-12 rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white"
          onClick={onNewGame}
        >
          New Game
        </button>

        <button
          type="button"
          className="min-h-12 rounded-xl border border-gray-300 bg-white px-4 py-3 font-semibold text-gray-800"
          onClick={onHome}
        >
          Home
        </button>
      </div>
    </main>
  )
}

function BreakdownRow({
  label,
  points,
}: {
  label: string
  points: number
}) {
  return (
    <>
      <dt className="text-gray-600">{label}</dt>
      <dd className="text-right tabular-nums">{formatPoints(points)}</dd>
    </>
  )
}
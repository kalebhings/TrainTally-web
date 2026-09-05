interface HomeScreenProps {
  onNewGame: () => void
  onHistory: () => void
  onSettings: () => void
}

export function HomeScreen({
  onNewGame,
  onHistory,
  onSettings,
}: HomeScreenProps) {
  return (
    <main className="flex min-h-[calc(100vh-4rem)] flex-col justify-center gap-12">
      <header className="text-center">
        <h1 className="text-4xl font-bold sm:text-5xl">
          TrainTally
        </h1>

        <p className="mt-3 text-gray-500">
          Ticket to Ride score tracker
        </p>
      </header>

      <div className="mx-auto grid w-full max-w-md gap-4">
        <button
          className="min-h-12 rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white"
          onClick={onNewGame}
        >
          New Game
        </button>

        <button
          className="min-h-12 rounded-xl border border-gray-300 bg-white px-4 py-3 font-semibold text-gray-800"
          onClick={onHistory}
        >
          History
        </button>

        <button
          className="min-h-12 rounded-xl border border-gray-300 bg-white px-4 py-3 font-semibold text-gray-800"
          onClick={onSettings}
        >
          Settings
        </button>
      </div>
    </main>
  )
}
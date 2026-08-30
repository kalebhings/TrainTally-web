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
    <main className="home-screen">
      <header className="home-header">
        <h1>TrainTally</h1>
        <p>Ticket to Ride score tracker</p>
      </header>

      <div className="home-actions">
        <button
          className="primary-button"
          onClick={onNewGame}
        >
          New Game
        </button>

        <button
          className="secondary-button"
          onClick={onHistory}
        >
          History
        </button>

        <button
          className="secondary-button"
          onClick={onSettings}
        >
          Settings
        </button>
      </div>
    </main>
  )
}
// Display colors for the color names used in game configs.
const PLAYER_COLOR_HEX: Record<string, string> = {
  red: '#dc2626',
  blue: '#2563eb',
  green: '#16a34a',
  yellow: '#eab308',
  black: '#171717',
  white: '#f5f5f4',
  purple: '#9333ea',
}

export function playerColorHex(color: string): string {
  return PLAYER_COLOR_HEX[color] ?? '#9ca3af'
}

// Color for borders and accents; white needs contrast on light cards.
export function playerAccentHex(color: string): string {
  return color === 'white' ? '#a8a29e' : playerColorHex(color)
}

// Readable text color on top of a filled player color.
export function playerTextColor(color: string): string {
  return color === 'yellow' || color === 'white' ? '#1c1917' : '#ffffff'
}

export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1)
}
export function formatPoints(points: number): string {
  return points > 0 ? `+${points}` : `${points}`
}

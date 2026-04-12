import type { RsvpPayload } from '@/types/rsvp'

export class RsvpConfigurationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'RsvpConfigurationError'
  }
}

export async function submitRsvp(payload: RsvpPayload): Promise<void> {
  const url = import.meta.env.VITE_APPS_SCRIPT_URL
  if (!url) {
    throw new RsvpConfigurationError('VITE_APPS_SCRIPT_URL is not set')
  }

  const response = await fetch(url, {
    method: 'POST',
    mode: 'cors',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const text = await response.text().catch(() => '')
    throw new Error(text || `RSVP failed: ${response.status}`)
  }
}

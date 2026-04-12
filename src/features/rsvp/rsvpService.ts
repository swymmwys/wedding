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

  // Apps Script web apps do not answer OPTIONS with CORS headers; application/json
  // triggers a preflight. text/plain + no-cors avoids preflight; body stays JSON for doPost.
  await fetch(url, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(payload),
  })
}

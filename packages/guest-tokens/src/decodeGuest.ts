import {
  decodeGuestNameFromToken,
  encodeGuestNameToTokenPayload,
} from './guestTokenCodec.ts'

const ID_HEX_PREFIX_LENGTH = 16

async function guestIdFromName(name: string): Promise<string> {
  const bytes = new TextEncoder().encode(name)
  const digest = new Uint8Array(await crypto.subtle.digest('SHA-256', bytes))
  let hex = ''
  for (const byte of digest) {
    hex += byte.toString(16).padStart(2, '0')
  }
  return hex.slice(0, ID_HEX_PREFIX_LENGTH)
}

export interface GuestIdentity {
  id: string
  name: string
}

/** Payload-only base64url(trimmed name); invite links use full canonical tokens from `generatePrefixedGuestToken`. */
export function encodeGuestToG(name: string): string | null {
  return encodeGuestNameToTokenPayload(name)
}

export async function decodeGuestFromG(g: string): Promise<GuestIdentity | null> {
  const name = decodeGuestNameFromToken(g)
  if (name === null) return null
  const id = await guestIdFromName(name)
  return { id, name }
}

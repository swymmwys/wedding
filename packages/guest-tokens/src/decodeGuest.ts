import {
  decodeGuestNameFromToken,
  encodeGuestNameToTokenPayload,
} from './guestTokenCodec.ts'

/** Resolved guest from URL param `g`; `id` is the trimmed canonical invite token string. */
export interface GuestIdentity {
  id: string
  name: string
}

/** Payload-only base64url(trimmed name); invite links use full canonical tokens from `generatePrefixedGuestToken`. */
export function encodeGuestToG(name: string): string | null {
  return encodeGuestNameToTokenPayload(name)
}

export function decodeGuestFromG(g: string): GuestIdentity | null {
  const trimmed = g.trim()
  if (!trimmed.length) return null
  const name = decodeGuestNameFromToken(trimmed)
  if (name === null) return null
  return { id: trimmed, name }
}

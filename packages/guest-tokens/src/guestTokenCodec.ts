/**
 * Canonical guest invite token: one hex length digit (1..f = 1..15) naming the random
 * prefix nibble count, then that many random hex nibbles, then base64url(UTF-8 trimmed name).
 */

const HEX_NIBBLE = /^[0-9a-fA-F]$/

function base64UrlToUint8Array(segment: string): Uint8Array | null {
  try {
    let b64 = segment.replace(/-/g, '+').replace(/_/g, '/')
    const pad = b64.length % 4
    if (pad) b64 += '='.repeat(4 - pad)
    const binary = atob(b64)
    const out = new Uint8Array(binary.length)
    for (let i = 0; i < binary.length; i++) {
      out[i] = binary.charCodeAt(i)
    }
    return out
  } catch {
    return null
  }
}

function uint8ArrayToBase64Url(bytes: Uint8Array): string {
  let binary = ''
  for (const byte of bytes) {
    binary += String.fromCharCode(byte)
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function decodeUtf8Strict(bytes: Uint8Array): string | null {
  try {
    return new TextDecoder('utf-8', { fatal: true }).decode(bytes)
  } catch {
    return null
  }
}

function tryDecodeNameFromBase64UrlPayload(payload: string): string | null {
  const bytes = base64UrlToUint8Array(payload)
  if (!bytes) return null
  const decoded = decodeUtf8Strict(bytes)
  if (decoded === null) return null
  const name = decoded.trim()
  return name.length > 0 ? name : null
}

/**
 * Number of random hex prefix nibbles for a run with `guestCount` guests.
 * Uses minimal bits: max(1, ceil(log2(guestCount))), then ceil(bits / 4) nibbles.
 * Capped at 15 (one len hex digit 1..f).
 */
export function prefixNibbleCountForGuestCount(guestCount: number): number {
  if (!Number.isFinite(guestCount) || guestCount < 1) {
    return 1
  }
  const bits = Math.max(1, Math.ceil(Math.log2(guestCount)))
  const nibbles = Math.ceil(bits / 4)
  return Math.min(15, nibbles)
}

function assertCrypto(): Crypto {
  const c: Crypto | undefined = globalThis.crypto
  if (!c?.getRandomValues) {
    throw new Error('Web Crypto getRandomValues is not available')
  }
  return c
}

function randomHexPrefixNibbles(nibbles: number): string {
  if (nibbles < 1 || nibbles > 15) {
    throw new Error('prefixNibbleCount must be between 1 and 15')
  }
  const c = assertCrypto()
  const byteCount = Math.ceil(nibbles / 2)
  const buf = new Uint8Array(byteCount)
  c.getRandomValues(buf)
  let hex = ''
  for (let i = 0; i < byteCount; i++) {
    hex += buf[i]!.toString(16).padStart(2, '0')
  }
  return hex.slice(0, nibbles)
}

function decodeCanonicalGuestToken(trimmed: string): string | null {
  if (trimmed.length < 2) return null
  const lenCh = trimmed[0]
  if (!lenCh || !HEX_NIBBLE.test(lenCh)) return null
  const nibbleCount = parseInt(lenCh, 16)
  if (nibbleCount < 1 || nibbleCount > 15) return null
  if (trimmed.length < 1 + nibbleCount) return null
  const prefix = trimmed.slice(1, 1 + nibbleCount)
  if (prefix.length !== nibbleCount) return null
  for (const ch of prefix) {
    if (!HEX_NIBBLE.test(ch)) return null
  }
  return tryDecodeNameFromBase64UrlPayload(trimmed.slice(1 + nibbleCount))
}

/** Base64url(trimmed UTF-8 name); used as the payload suffix after lenHex + random hex prefix. */
export function encodeGuestNameToTokenPayload(name: string): string | null {
  const trimmed = name.trim()
  if (!trimmed.length) return null
  return uint8ArrayToBase64Url(new TextEncoder().encode(trimmed))
}

/**
 * Canonical token: lenHex + random hex prefix + base64url payload.
 * @param prefixNibbleCount 1..15
 */
export function generatePrefixedGuestToken(
  name: string,
  prefixNibbleCount: number,
): string | null {
  if (prefixNibbleCount < 1 || prefixNibbleCount > 15 || !Number.isInteger(prefixNibbleCount)) {
    return null
  }
  const payload = encodeGuestNameToTokenPayload(name)
  if (payload === null) return null
  const lenHex = prefixNibbleCount.toString(16)
  if (lenHex.length !== 1) {
    return null
  }
  return lenHex + randomHexPrefixNibbles(prefixNibbleCount) + payload
}

/** Decodes only the canonical token shape (lenHex + random hex prefix + base64url payload). */
export function decodeGuestNameFromToken(token: string): string | null {
  const trimmed = token.trim()
  if (!trimmed.length) return null
  return decodeCanonicalGuestToken(trimmed)
}

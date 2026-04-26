import type { GuestIdentity } from '@/stores/guest'

const ID_HEX_PREFIX_LENGTH = 16

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

async function guestIdFromName(name: string): Promise<string> {
  const bytes = new TextEncoder().encode(name)
  const digest = new Uint8Array(await crypto.subtle.digest('SHA-256', bytes))
  let hex = ''
  for (const byte of digest) {
    hex += byte.toString(16).padStart(2, '0')
  }
  return hex.slice(0, ID_HEX_PREFIX_LENGTH)
}

export function encodeGuestToG(name: string): string | null {
  const trimmed = name.trim()
  if (!trimmed) return null
  return uint8ArrayToBase64Url(new TextEncoder().encode(trimmed))
}

export async function decodeGuestFromG(g: string): Promise<GuestIdentity | null> {
  const trimmed = g.trim()
  if (!trimmed) return null

  const bytes = base64UrlToUint8Array(trimmed)
  if (!bytes) return null

  const decoded = decodeUtf8Strict(bytes)
  if (decoded === null) return null

  const name = decoded.trim()
  if (!name) return null

  const id = await guestIdFromName(name)
  return { id, name }
}

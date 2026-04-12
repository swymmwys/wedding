import { importJWK, jwtVerify } from 'jose'
import type { GuestIdentity } from '@/stores/guest'

function base64UrlToUint8Array(segment: string): Uint8Array {
  let b64 = segment.replace(/-/g, '+').replace(/_/g, '/')
  const pad = b64.length % 4
  if (pad) b64 += '='.repeat(4 - pad)
  const binary = atob(b64)
  const out = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) out[i] = binary.charCodeAt(i)
  return out
}

function decodeSimplePayload(g: string): GuestIdentity | null {
  try {
    const bytes = base64UrlToUint8Array(g)
    const text = new TextDecoder().decode(bytes)
    const data: unknown = JSON.parse(text)
    if (!data || typeof data !== 'object') return null
    const rec = data as Record<string, unknown>
    const id = rec.id
    const name = rec.name
    if (typeof id !== 'string' || typeof name !== 'string' || !id || !name) return null
    return { id, name }
  } catch {
    return null
  }
}

async function verifyGuestJwt(token: string, jwkJson: string): Promise<GuestIdentity | null> {
  try {
    const jwk = JSON.parse(jwkJson) as Record<string, unknown>
    if (!jwk || typeof jwk !== 'object') return null
    const key = await importJWK(jwk, 'RS256')
    const { payload } = await jwtVerify(token, key)
    const sub = payload.sub
    const nameClaim = payload.name
    if (typeof sub !== 'string' || typeof nameClaim !== 'string' || !sub || !nameClaim) return null
    return { id: sub, name: nameClaim }
  } catch {
    return null
  }
}

export async function decodeGuestFromG(g: string): Promise<GuestIdentity | null> {
  const trimmed = g.trim()
  if (!trimmed) return null

  const jwkRaw = import.meta.env.VITE_JWT_PUBLIC_JWK
  if (jwkRaw && trimmed.split('.').length === 3) {
    const fromJwt = await verifyGuestJwt(trimmed, jwkRaw)
    if (fromJwt) return fromJwt
  }

  return decodeSimplePayload(trimmed)
}

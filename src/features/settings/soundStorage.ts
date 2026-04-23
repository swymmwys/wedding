export const WEDDING_SOUND_STORAGE_KEY = 'wedding-sound'

export function readStoredSound(): boolean {
  if (typeof localStorage === 'undefined') return true
  const v = localStorage.getItem(WEDDING_SOUND_STORAGE_KEY)
  if (v === '0') return false
  if (v === '1') return true
  return true
}

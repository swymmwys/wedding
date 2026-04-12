export const WEDDING_SOUND_STORAGE_KEY = 'wedding-sound'

export function readStoredSound(): boolean {
  if (typeof localStorage === 'undefined') return false
  return localStorage.getItem(WEDDING_SOUND_STORAGE_KEY) === '1'
}

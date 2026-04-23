import { defineStore } from 'pinia'
import { ref } from 'vue'
import { readStoredSound, WEDDING_SOUND_STORAGE_KEY } from '@/features/settings/soundStorage'

export const useUiStore = defineStore('ui', () => {
  const soundEnabled = ref(true)
  /** True after intro overlay has fully finished and unmounted (hero / ambient may run). */
  const introHidden = ref(false)

  function markIntroHidden(): void {
    introHidden.value = true
  }

  function setSoundEnabled(on: boolean): void {
    soundEnabled.value = on
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(WEDDING_SOUND_STORAGE_KEY, on ? '1' : '0')
    }
  }

  function toggleSound(): void {
    setSoundEnabled(!soundEnabled.value)
  }

  /** Call once on the client after Pinia is installed. */
  function hydrateFromStorage(): void {
    soundEnabled.value = readStoredSound()
  }

  return {
    soundEnabled,
    introHidden,
    markIntroHidden,
    setSoundEnabled,
    toggleSound,
    hydrateFromStorage,
  }
})

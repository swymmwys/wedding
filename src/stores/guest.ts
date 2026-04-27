import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { GuestIdentity } from '@wedding/guest-tokens'

export type { GuestIdentity } from '@wedding/guest-tokens'

export const useGuestStore = defineStore('guest', () => {
  const guestId = ref<string | null>(null)
  const guestName = ref<string | null>(null)

  function setGuest(payload: GuestIdentity): void {
    guestId.value = payload.id
    guestName.value = payload.name.trim()
  }

  return { guestId, guestName, setGuest }
})

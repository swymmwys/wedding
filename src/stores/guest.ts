import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface GuestIdentity {
  id: string
  name: string
}

export const useGuestStore = defineStore('guest', () => {
  const guestId = ref<string | null>(null)
  const guestName = ref<string | null>(null)

  function setGuest(payload: GuestIdentity): void {
    guestId.value = payload.id
    guestName.value = payload.name
  }

  return { guestId, guestName, setGuest }
})

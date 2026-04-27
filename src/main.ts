import { createPinia } from 'pinia'
import { ViteSSG } from 'vite-ssg/single-page'
import App from './App.vue'
import { useUiStore } from '@/stores/ui'
import './styles/fonts.css'
import './styles/global.css'

export const createApp = ViteSSG(
  App,
  async ({ app, isClient }) => {
    const pinia = createPinia()
    app.use(pinia)
    if (isClient) {
      useUiStore(pinia).hydrateFromStorage()
      const { useGuestStore } = await import('@/stores/guest')
      const { decodeGuestFromG } = await import('@wedding/guest-tokens')
      const params = new URLSearchParams(window.location.search)
      const g = params.get('g')
      if (g) {
        const guest = await decodeGuestFromG(g)
        if (guest) useGuestStore().setGuest(guest)
      }
    }
  },
  { rootContainer: '#app' },
)

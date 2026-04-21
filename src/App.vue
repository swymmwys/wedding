<script setup lang="ts">
import AudioControls from '@/features/settings/AudioControls.vue'
import HomePage from '@/pages/HomePage.vue'
import faviconUrl from '@/assets/favicon.svg'
import { useHead } from '@unhead/vue'

useHead({
  title: 'Свадебное приглашение',
  meta: [
    {
      name: 'description',
      content: 'Персональное приглашение на торжество',
    },
  ],
  link: [{ rel: 'icon', type: 'image/svg+xml', href: faviconUrl }],
})
</script>

<template>
  <AudioControls />
  <HomePage />
</template>

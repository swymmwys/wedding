<script setup lang="ts">
import AudioControls from '@/features/settings/AudioControls.vue'
import HomePage from '@/pages/HomePage.vue'
import { useHead } from '@unhead/vue'

useHead({
  title: 'Свадебное приглашение',
  meta: [
    {
      name: 'description',
      content: 'Персональное приглашение на торжество',
    },
  ],
})
</script>

<template>
  <AudioControls />
  <HomePage />
</template>

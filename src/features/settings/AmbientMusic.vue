<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { onMounted, ref, watch } from 'vue'
import introMusicUrl from '@/assets/intro-music.mp3'
import { useUiStore } from '@/stores/ui'

const { soundEnabled, introHidden } = storeToRefs(useUiStore())
const audioRef = ref<HTMLAudioElement | null>(null)

function syncPlayback(): void {
  const el = audioRef.value
  if (!el) return
  if (!introHidden.value) {
    el.pause()
    el.currentTime = 0
    return
  }
  el.muted = !soundEnabled.value
  if (soundEnabled.value) {
    void el.play().catch(() => {
      /* Autoplay limits after intro — enabling sound via control retries play */
    })
  } else {
    el.pause()
  }
}

watch([soundEnabled, introHidden], syncPlayback)
watch(audioRef, syncPlayback)
onMounted(syncPlayback)
</script>

<template>
  <div class="ambient-root" aria-hidden="true">
    <audio
      ref="audioRef"
      class="ambient-audio"
      loop
      preload="auto"
      playsinline
      :src="introMusicUrl"
    />
  </div>
</template>

<style scoped>
.ambient-root {
  position: absolute;
  width: 0;
  height: 0;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
}

.ambient-audio {
  display: block;
}
</style>

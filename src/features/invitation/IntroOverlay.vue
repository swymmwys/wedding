<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { nextTick, ref, watch } from 'vue'
import { publicAsset } from '@/lib/publicAsset'
import { useUiStore } from '@/stores/ui'

const ui = useUiStore()
const { soundEnabled } = storeToRefs(ui)

/**
 * Full-screen poster → tap → intro video → fade out → main site.
 * The “envelope” is the poster artwork (`intro-poster.jpg`), not a separate asset.
 */
type Phase = 'idle' | 'playing' | 'fading'

const phase = ref<Phase>('idle')
const done = ref(false)
const videoRef = ref<HTMLVideoElement | null>(null)

watch(phase, (p) => {
  if (p !== 'playing') return
  void nextTick(() => {
    const el = videoRef.value
    if (!el) return
    el.muted = !soundEnabled.value
    void el.play().catch(() => {
      // Try muted autoplay (policy), then skip only if still blocked
      el.muted = true
      void el.play().catch(() => {
        phase.value = 'fading'
      })
    })
  })
})

watch(soundEnabled, (on) => {
  const el = videoRef.value
  if (el) el.muted = !on
})

function onIntroClick(e: MouseEvent): void {
  if (phase.value !== 'idle') {
    e.preventDefault()
    e.stopPropagation()
    return
  }
  phase.value = 'playing'
}

function onIntroKey(): void {
  if (phase.value === 'idle') {
    phase.value = 'playing'
  }
}

function goToFadeAfterPlayback(): void {
  if (phase.value === 'playing') {
    phase.value = 'fading'
  }
}

function onVideoEnded(): void {
  goToFadeAfterPlayback()
}

/** Some browsers / .mov omit `ended`; treat last frames as complete. */
function onIntroTimeUpdate(e: Event): void {
  const el = e.target as HTMLVideoElement
  if (phase.value !== 'playing') return
  const d = el.duration
  if (!Number.isFinite(d) || d <= 0) return
  if (el.currentTime >= d - 0.06) {
    goToFadeAfterPlayback()
  }
}

function onFadeInComplete(): void {
  if (phase.value === 'fading') {
    done.value = true
    ui.markIntroHidden()
  }
}
</script>

<template>
  <div
    v-if="!done"
    class="intro"
    role="button"
    tabindex="0"
    aria-label="Открыть приглашение"
    @click="onIntroClick"
    @keydown.enter.prevent="onIntroKey"
    @keydown.space.prevent="onIntroKey"
  >
    <img
      v-if="phase === 'idle'"
      :src="publicAsset('assets/intro-poster.jpg')"
      alt="Приглашение"
      class="media"
      fetchpriority="high"
      loading="eager"
      width="1200"
      height="1600"
    />
    <video
      v-else
      ref="videoRef"
      class="media media--video"
      :src="publicAsset('assets/intro-video.mov')"
      :poster="publicAsset('assets/intro-poster.jpg')"
      playsinline
      :muted="!soundEnabled"
      preload="auto"
      @click.stop.prevent
      @ended="onVideoEnded"
      @timeupdate="onIntroTimeUpdate"
    />
    <Transition name="intro-fade" @after-enter="onFadeInComplete">
      <div v-if="phase === 'fading'" class="fade-layer" aria-hidden="true" />
    </Transition>
    <p v-if="phase === 'idle'" class="tap-hint">Нажмите, чтобы открыть</p>
  </div>
</template>

<style scoped>
.intro {
  position: fixed;
  inset: 0;
  z-index: 100;
  cursor: pointer;
  background: var(--color-ivory);
}

.media {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* No taps hit the element — clicks fall through to .intro, which ignores non-idle. */
.media--video {
  pointer-events: none;
}

.fade-layer {
  position: absolute;
  inset: 0;
  background: var(--color-ivory);
}

.intro-fade-enter-active {
  transition: opacity 1.2s ease-in-out;
}

.intro-fade-enter-from {
  opacity: 0;
}

.intro-fade-enter-to {
  opacity: 1;
}

.tap-hint {
  position: absolute;
  bottom: 45vh;
  left: 0;
  right: 0;
  text-align: center;
  pointer-events: none;
  font-size: 0.75rem;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.7);
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
  margin: 0;
  font-weight: bold;
}
</style>

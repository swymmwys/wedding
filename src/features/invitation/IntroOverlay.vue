<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { nextTick, ref, watch } from 'vue'
import introPosterUrl from '@/assets/intro-poster.jpg'
import introVideoUrl from '@/assets/intro.mp4'
import { useUiStore } from '@/stores/ui'

const ui = useUiStore()
const { soundEnabled } = storeToRefs(ui)

/**
 * Full-screen poster → tap → intro video → overlay fades out (opacity → 0) → main site.
 * The “envelope” is the poster artwork (`intro-poster.jpg`), not a separate asset.
 */
/** Start ivory fade this many seconds before the video ends (shortens perceived intro). */
const INTRO_FADE_LEAD_SECONDS = 1.2

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

function scrollBodyToTop(): void {
  if (typeof window === 'undefined') return
  window.scrollTo(0, 0)
}

function onIntroClick(e: MouseEvent): void {
  if (phase.value !== 'idle') {
    e.preventDefault()
    e.stopPropagation()
    return
  }
  scrollBodyToTop()
  phase.value = 'playing'
}

function onIntroKey(): void {
  if (phase.value === 'idle') {
    scrollBodyToTop()
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
  const endEpsilon = 0.06
  const threshold =
    d > INTRO_FADE_LEAD_SECONDS
      ? d - INTRO_FADE_LEAD_SECONDS - endEpsilon
      : d - endEpsilon
  if (el.currentTime >= threshold) {
    goToFadeAfterPlayback()
  }
}

function prefersReducedMotion(): boolean {
  if (typeof globalThis.matchMedia !== 'function') return false
  return globalThis.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function onFadeOutComplete(): void {
  if (done.value) return
  if (phase.value !== 'fading') return
  done.value = true
  ui.markIntroHidden()
}

function onIntroOpacityTransitionEnd(e: TransitionEvent): void {
  if (prefersReducedMotion()) return
  if (e.propertyName !== 'opacity') return
  const el = e.target as HTMLElement
  if (!el.classList.contains('intro')) return
  onFadeOutComplete()
}

watch(phase, (p) => {
  if (p !== 'fading') return
  if (prefersReducedMotion()) {
    void nextTick(() => onFadeOutComplete())
  }
})
</script>

<template>
  <div
    v-if="!done"
    class="intro"
    :class="{ 'intro--fade-out': phase === 'fading' }"
    role="button"
    tabindex="0"
    aria-label="Открыть приглашение"
    @click="onIntroClick"
    @keydown.enter.prevent="onIntroKey"
    @keydown.space.prevent="onIntroKey"
    @transitionend="onIntroOpacityTransitionEnd"
  >
    <img
      v-if="phase === 'idle'"
      :src="introPosterUrl"
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
      :src="introVideoUrl"
      :poster="introPosterUrl"
      playsinline
      :muted="!soundEnabled"
      preload="auto"
      @click.stop.prevent
      @ended="onVideoEnded"
      @timeupdate="onIntroTimeUpdate"
    />
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
  overflow: hidden;
  opacity: 1;
  transition: opacity 1.2s ease-in-out;
}

.intro--fade-out {
  opacity: 0;
  pointer-events: none;
  cursor: default;
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
  transform-origin: center center;
}

@media (prefers-reduced-motion: reduce) {
  .intro {
    transition: none;
  }

  .media--video {
    animation: none;
  }
}

.tap-hint {
  position: absolute;
  bottom: 45vh;
  left: 0;
  right: 0;
  text-align: center;
  pointer-events: none;
  font-size: 0.75rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.7);
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
  margin: 0;
  font-family: var(--font-body);
}
</style>

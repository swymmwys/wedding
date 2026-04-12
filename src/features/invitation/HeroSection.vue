<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed, nextTick, ref, watch } from 'vue'
import { publicAsset } from '@/lib/publicAsset'
import { weddingHeroDateRu, weddingHeroNames } from '@/setting'
import { useGuestStore } from '@/stores/guest'
import { useUiStore } from '@/stores/ui'

const { guestName } = storeToRefs(useGuestStore())
const { introHidden } = storeToRefs(useUiStore())

const heroVideoRef = ref<HTMLVideoElement | null>(null)
const videoEnded = ref(false)

const greeting = computed(() =>
  guestName.value ? `${guestName.value}, мы ждём вас!` : null,
)

function markHeroFinished(): void {
  if (videoEnded.value) return
  videoEnded.value = true
}

function syncHeroPlayback(): void {
  const el = heroVideoRef.value
  if (!el) return
  if (!introHidden.value) {
    el.pause()
    el.currentTime = 0
    return
  }
  if (el.ended) {
    markHeroFinished()
    return
  }
  if (videoEnded.value) return
  if (!el.paused) return
  void el.play().catch(() => {})
}

function onVideoEnded(): void {
  markHeroFinished()
}

/** Some encodings / browsers omit `ended`; treat the tail as complete. */
function onHeroTimeUpdate(e: Event): void {
  const el = e.target as HTMLVideoElement
  if (videoEnded.value || !introHidden.value) return
  const d = el.duration
  if (!Number.isFinite(d) || d <= 0) return
  if (el.currentTime >= d - 0.06) {
    markHeroFinished()
  }
}

watch(introHidden, () => {
  void nextTick(() => syncHeroPlayback())
})

watch(heroVideoRef, () => {
  void nextTick(() => syncHeroPlayback())
})
</script>

<template>
  <section class="hero">
    <div class="hero-video-wrap">
      <video
        ref="heroVideoRef"
        class="hero-video"
        muted
        playsinline
        preload="auto"
        @click.stop.prevent
        @ended="onVideoEnded"
        @timeupdate="onHeroTimeUpdate"
      >
        <source :src="publicAsset('assets/hero-video.mp4')" type="video/mp4" />
      </video>
    </div>
    <div
      class="hero-content"
      :class="{ 'hero-content--ended': videoEnded, 'hero-content--visible': introHidden }"
    >
      <p class="tagline">Мы женимся</p>
      <h1 class="names">{{ weddingHeroNames }}</h1>
      <p class="date">{{ weddingHeroDateRu }}</p>
      <p class="greeting">{{ greeting }}</p>
    </div>
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  min-height: 100vh;
  padding-top: 20vh;
  overflow: hidden;
  background: var(--color-ivory);
}

.hero-video-wrap {
  position: absolute;
  inset: 0;
}

.hero-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  pointer-events: none;
}

.hero-content {
  position: relative;
  z-index: 1;
  box-sizing: border-box;
  width: 100%;
  max-width: 28rem;
  margin: 0 auto;
  padding: 0 1rem 2rem;
  text-align: center;
  color: var(--color-hero-text);
  text-shadow: 0 1px 12px rgba(0, 0, 0, 0.35);
  opacity: 0;
  transform: translateY(20px);
  transition:
    opacity 0.6s ease,
    transform 0.6s ease,
    color 0.5s ease;
}

.hero-content--visible {
  opacity: 1;
  transform: translateY(0);
}

@media (prefers-reduced-motion: reduce) {
  .hero-content {
    opacity: 1;
    transform: none;
    transition: color 0.5s ease;
  }
}

.hero-content--ended {
  color: #fdfcf9;
}

.hero-content--ended .tagline {
  color: rgb(255 255 255 / 0.85);
}

.hero-content--ended .date {
  color: rgb(255 255 255 / 0.72);
}

.hero-content--ended .greeting {
  color: rgb(255 255 255 / 0.9);
}

.tagline {
  font-family: var(--font-body);
  font-size: clamp(0.8125rem, 2.5vw, 1rem);
  letter-spacing: 0.3em;
  text-transform: uppercase;
  margin: 0 0 1rem;
  font-weight: 200;
  color: var(--color-text-body);
  opacity: 0.9;
}

.names {
  font-family: var(--font-script);
  font-size: clamp(2.75rem, 10vw, 4.5rem);
  margin: 0 0 0.75rem;
  line-height: 1.1;
}

.date {
  font-family: var(--font-body);
  font-size: clamp(0.8125rem, 2.5vw, 1rem);
  letter-spacing: 0.2em;
  text-transform: uppercase;
  margin: 0 0 1.25rem;
  font-weight: 200;
  color: var(--color-text-secondary);
}

.greeting {
  margin: 0;
  font-size: 1.1rem;
  line-height: 1.5;
}
</style>

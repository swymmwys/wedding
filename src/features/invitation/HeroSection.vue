<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import villaImageUrl from '@/assets/villa-image.jpg'
import HeroScrollIndicator from '@/features/invitation/HeroScrollIndicator.vue'
import { weddingHeroDateRu, weddingHeroNames } from '@/setting'
import { useUiStore } from '@/stores/ui'

const { introHidden, introStarted } = storeToRefs(useUiStore())
const heroSectionRef = ref<HTMLElement | null>(null)
const isHeroMostlyVisible = ref<boolean>(true)
const isHeroVisibilityObserved = ref<boolean>(false)
let heroIntersectionObserver: IntersectionObserver | null = null

const heroImageSrc = computed<string | undefined>(() => {
  return introStarted.value ? villaImageUrl : undefined
})

const showScrollIndicator = computed<boolean>(() => {
  return introHidden.value && (!isHeroVisibilityObserved.value || isHeroMostlyVisible.value)
})

onMounted(() => {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
    return
  }

  const heroSectionElement = heroSectionRef.value

  if (heroSectionElement === null) {
    return
  }

  heroIntersectionObserver = new IntersectionObserver(
    (entries) => {
      const heroEntry = entries[0]

      if (heroEntry === undefined) {
        return
      }

      isHeroMostlyVisible.value =
        heroEntry.isIntersecting && heroEntry.intersectionRatio >= 0.5
    },
    {
      threshold: [0, 0.5, 1],
    },
  )

  heroIntersectionObserver.observe(heroSectionElement)
  isHeroVisibilityObserved.value = true
})

onBeforeUnmount(() => {
  heroIntersectionObserver?.disconnect()
  heroIntersectionObserver = null
  isHeroVisibilityObserved.value = false
})

</script>

<template>
  <section ref="heroSectionRef" class="hero">
    <img
      class="hero-image"
      :class="{ 'hero-image--visible': introHidden }"
      :src="heroImageSrc"
      alt=""
      width="1536"
      height="1024"
      fetchpriority="high"
      loading="eager"
      decoding="auto"
    >
    <div
      class="hero-content"
      :class="{ 'hero-content--visible': introHidden }"
    >
      <h1 class="names">{{ weddingHeroNames }}</h1>
      <p class="date">{{ weddingHeroDateRu }}</p>
    </div>
    <HeroScrollIndicator v-if="showScrollIndicator" />
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  min-height: 100svh;
  padding-top: 25svh;
  overflow: hidden;
}

/* Fades in during the last ~0.7s of IntroOverlay’s 1.2s opacity transition (see HERO_REVEAL_LEAD_MS). */
.hero-image {
  position: absolute;
  inset: 0;
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  pointer-events: none;
  box-shadow: 0 0 20px 1px rgb(27 27 27);
  opacity: 1;
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
  color: #fdfcf9;
  text-shadow: 1px 1px 13px black;
  opacity: 0;
  transform: translateY(20px);
  transition:
    opacity 0.6s ease,
    transform 0.6s ease;
}

.hero-content--visible {
  opacity: 1;
  transform: translateY(0);
}

.hero-scroll-indicator {
  position: absolute;
  left: 50%;
  bottom: clamp(1.25rem, 4svh, 2.5rem);
  z-index: 1;
}

@media (prefers-reduced-motion: reduce) {
  .hero-image {
    transition: none;
  }

  .hero-content {
    opacity: 1;
    transform: none;
  }
}

.tagline {
  font-family: var(--font-body);
  font-size: clamp(0.8125rem, 2.5vw, 1rem);
  letter-spacing: 0.3em;
  text-transform: uppercase;
  margin: 0 0 1rem;
  font-weight: 200;
  color: rgb(255 255 255 / 0.85);
}

.names {
  font-family: var(--font-script);
  font-size: clamp(2.75rem, 10vw, 3.75rem);
  margin: 0 0 0.75rem;
  line-height: 1.1;
}

.date {
  font-family: var(--font-body);
  font-size: clamp(0.8125rem, 2.5vw, 1rem);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  margin: 0 0 1.25rem;
  font-weight: 200;
  color: rgb(255 255 255 / 0.72);
}

.greeting {
  margin: 0;
  font-size: 1.1rem;
  line-height: 1.5;
  color: rgb(255 255 255 / 0.9);
}
</style>

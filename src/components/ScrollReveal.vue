<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

/**
 * Mirrors mirror template motion: opacity 0→1, translateY / scaleY, whileInView once.
 */
const props = withDefaults(
  defineProps<{
    kind?: 'lift' | 'pillar'
    y?: 20 | 30
    durationSec?: number
    delaySec?: number
    once?: boolean
    /** Hidden scale for lift (e.g. 0.9); omit for no scale. */
    scaleFrom?: number | null
  }>(),
  {
    kind: 'lift',
    y: 20,
    durationSec: 0.6,
    delaySec: 0,
    once: true,
    scaleFrom: null,
  },
)

const root = ref<HTMLElement | null>(null)
const visible = ref(false)

let observer: IntersectionObserver | null = null

onMounted(() => {
  if (typeof window === 'undefined') return

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    visible.value = true
    return
  }

  const el = root.value
  if (!el || typeof IntersectionObserver === 'undefined') {
    visible.value = true
    return
  }

  observer = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          visible.value = true
          if (props.once) {
            observer?.disconnect()
            observer = null
          }
        } else if (!props.once) {
          visible.value = false
        }
      }
    },
    { threshold: 0.12, rootMargin: '0px 0px -6% 0px' },
  )
  observer.observe(el)
})

onUnmounted(() => {
  observer?.disconnect()
})

const liftFromScale = props.scaleFrom != null && props.scaleFrom < 1 ? String(props.scaleFrom) : '1'
</script>

<template>
  <div
    ref="root"
    class="scroll-reveal"
    :class="[
      visible ? 'scroll-reveal--visible' : '',
      kind === 'pillar' ? 'scroll-reveal--pillar' : 'scroll-reveal--lift',
    ]"
    :style="{
      '--sr-y': y === 30 ? '30px' : '20px',
      '--sr-dur': `${durationSec}s`,
      '--sr-delay': `${delaySec}s`,
      '--sr-scale-from': liftFromScale,
    }"
  >
    <slot />
  </div>
</template>

<style scoped>
.scroll-reveal--lift {
  opacity: 0;
  transform: translateY(var(--sr-y)) scale(var(--sr-scale-from));
  transition:
    opacity var(--sr-dur) ease,
    transform var(--sr-dur) ease;
  transition-delay: var(--sr-delay);
}

.scroll-reveal--lift.scroll-reveal--visible {
  opacity: 1;
  transform: translateY(0) scale(1);
}

/* Vertical rule grow (mirror schedule connector) */
.scroll-reveal--pillar {
  opacity: 1;
  transform: scaleY(0);
  transform-origin: top center;
  transition: transform var(--sr-dur) ease;
  transition-delay: var(--sr-delay);
}

.scroll-reveal--pillar.scroll-reveal--visible {
  transform: scaleY(1);
}
</style>

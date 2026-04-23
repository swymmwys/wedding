<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import ScrollReveal from '@/components/ScrollReveal.vue'
import { weddingEventStart } from '@/setting'

const target = weddingEventStart.getTime()

const days = ref(0)
const hours = ref(0)
const minutes = ref(0)
const seconds = ref(0)

let timer: ReturnType<typeof setInterval> | null = null

function tick(): void {
  const now = Date.now()
  const diff = Math.max(0, target - now)
  days.value = Math.floor(diff / (1000 * 60 * 60 * 24))
  hours.value = Math.floor((diff / (1000 * 60 * 60)) % 24)
  minutes.value = Math.floor((diff / (1000 * 60)) % 60)
  seconds.value = Math.floor((diff / 1000) % 60)
}

function pad2(n: number): string {
  return String(n).padStart(2, '0')
}

onMounted(() => {
  tick()
  timer = setInterval(tick, 1000)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<template>
  <section id="countdown" class="section countdown" aria-labelledby="countdown-heading">
    <ScrollReveal>
      <div class="inner">
      <h2 id="countdown-heading" class="heading-script">Дорогие родные и близкие</h2>
      <p class="sub">
        Совсем скоро наступит значимый и долгожданный для нас день - наша свадьба! 
        Мы будем счастливы разделить его в кругу особенно дорогих нам людей. <br><br>
        С большой нежностью приглашаем вас провести с нами этот день и стать частью нашей истории любви.
      </p>
      <div class="grid" role="timer" aria-live="polite">
        <div class="cell">
          <span class="num">{{ pad2(days) }}</span>
          <span class="unit">дней</span>
        </div>
        <div class="cell">
          <span class="num">{{ pad2(hours) }}</span>
          <span class="unit">часов</span>
        </div>
        <div class="cell">
          <span class="num">{{ pad2(minutes) }}</span>
          <span class="unit">минут</span>
        </div>
        <div class="cell">
          <span class="num">{{ pad2(seconds) }}</span>
          <span class="unit">секунд</span>
        </div>
      </div>
    </div>
    </ScrollReveal>
  </section>
</template>

<style scoped>
.section {
  box-sizing: border-box;
  padding: var(--section-padding);
  overflow: hidden;
  background: var(--countdown-section-bg);
}

.inner {
  text-align: center;
  max-width: var(--invitation-shell-max-width);
  margin: 0 auto;
}

.heading-script {
  font-family: var(--font-script);
  font-size: clamp(2.25rem, 8vw, 3.75rem);
  color: #fdfcf9;
  margin: 0 0 0.75rem;
  line-height: 1.1;
}

@media (min-width: 768px) {
  .heading-script {
    font-size: clamp(3rem, 6vw, 3.75rem);
  }
}

.sub {
  margin: 0 0 2rem;
  font-size: 1em;
  letter-spacing: 0.1em;
  color: rgb(255 255 255 / 0.6);
  font-family: var(--font-body);
  font-weight: 200;
  font-style: italic;
}

@media (min-width: 768px) {
  .sub {
    margin-bottom: 2em;
  }
}

.grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0.5rem;
  max-width: 48rem;
  margin: 0 auto;
}

@media (min-width: 768px) {
  .grid {
    gap: 2rem;
  }
}

.cell {
  padding: 0.5rem;
}

@media (min-width: 768px) {
  .cell {
    padding: 1.5rem;
  }
}

.num {
  display: block;
  font-family: var(--font-display);
  font-size: clamp(2.25rem, 8vw, 2.5rem);
  font-weight: 300;
  color: #fdfcf9;
  line-height: 1.1;
}

@media (min-width: 640px) {
  .num {
    font-size: clamp(2.5rem, 10vw, 3rem);
  }
}

@media (min-width: 768px) {
  .num {
    font-size: clamp(3rem, 12vw, 4.5rem);
  }
}

.unit {
  display: block;
  margin-top: 0.25rem;
  font-size: 0.625rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: rgb(255 255 255 / 0.7);
  font-family: var(--font-body);
  font-weight: 200;
}

@media (min-width: 640px) {
  .unit {
    font-size: 0.75rem;
  }
}

@media (min-width: 768px) {
  .unit {
    margin-top: 0.5rem;
    letter-spacing: 0.1em;
  }
}
</style>

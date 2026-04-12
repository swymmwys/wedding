<script setup lang="ts">
import { computed } from 'vue'
import ScrollReveal from '@/components/ScrollReveal.vue'
import { googleCalendarUrl } from '@/lib/calendarDeepLinks'
import { publicAsset } from '@/lib/publicAsset'
import { buildYandexMapsUrl } from '@/lib/yandexMapsUrl'
import {
  weddingEventEnd,
  weddingEventLocation,
  weddingEventStart,
} from '@/setting'

const mapUrl = buildYandexMapsUrl()

const timeFrom = computed(() =>
  weddingEventStart.toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Europe/Minsk',
  }),
)

const timeTo = computed(() =>
  weddingEventEnd.toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Europe/Minsk',
  }),
)

</script>

<template>
  <section class="details-root" aria-labelledby="details-heading">
    <ScrollReveal>
      <div class="details-header">
        <img
          class="details-hero-illus"
          :src="publicAsset('assets/dog-bouquet.png')"
          width="144"
          height="144"
          alt=""
        />
        <h2 id="details-heading" class="details-title">Детали</h2>
        <p class="details-sub">Всё, что нужно знать</p>
      </div>
    </ScrollReveal>

    <ScrollReveal :y="30">
      <div class="details-body">
      <div class="frame-wrap">
        <img
          class="frame-border"
          :src="publicAsset('assets/ornate-frame-new.png')"
          width="440"
          height="520"
          alt=""
        />
        <div class="frame-inner">
          <h3 class="location-script">Место</h3>
          <div class="location-block">
            <div class="venue-line">
              <span class="venue-name">{{ weddingEventLocation }}</span>
            </div>
            <div class="time-row">
              <svg
                class="time-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
              </svg>
              <span class="time-text">С {{ timeFrom }} до {{ timeTo }}</span>
            </div>
          </div>
            <img
              class="venue-illus"
              :src="publicAsset('assets/finca-biniagual-illustration.png')"
              alt="" />
        </div>
      </div>

      <div class="actions">
        <a
          class="action-btn"
          :href="mapUrl"
          target="_blank"
          rel="noopener noreferrer"
        >
          <svg
            class="action-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          Яндекс.Карты
        </a>
        <a
          class="action-btn"
          :href="googleCalendarUrl()"
          target="_blank"
          rel="noopener noreferrer"
        >
          <svg
            class="action-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path d="M8 2v4" />
            <path d="M16 2v4" />
            <rect width="18" height="18" x="3" y="4" rx="2" />
            <path d="M3 10h18" />
          </svg>
          Календарь
        </a>
      </div>
    </div>
    </ScrollReveal>
  </section>
</template>

<style scoped>
.details-root {
  box-sizing: border-box;
  padding: var(--section-padding);
  background: var(--color-ivory);
}

.details-header {
  max-width: 56rem;
  margin: 0 auto 2rem;
  padding: 0;
  text-align: center;
}

.details-hero-illus {
  display: block;
  width: 9rem;
  height: auto;
  margin: 0 auto 1rem;
}

.details-title {
  font-family: var(--font-script);
  font-size: clamp(2.75rem, 8vw, 3.75rem);
  color: var(--color-sage-dark);
  margin: 0 0 0.75rem;
  line-height: 1.1;
}

.details-sub {
  margin: 0;
  font-size: 0.875rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--color-text-body);
  opacity: 0.85;
  font-family: var(--font-body);
}

.details-body {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.frame-wrap {
  position: relative;
  width: 100%;
  max-width: 28rem;
  margin: 0 auto;
}

.frame-border {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: fill;
  pointer-events: none;
  z-index: 0;
}

.frame-inner {
  position: relative;
  z-index: 1;
  margin: 23% 17%;
  padding: 1.25rem 1rem 0;
  background: rgb(255 255 255 / 0.95);
  border-radius: 2.5rem;
  text-align: center;
  overflow: hidden;
}

@media (min-width: 768px) {
  .frame-inner {
    padding-top: 1.5rem;
    padding-left: 1.25rem;
    padding-right: 1.25rem;
  }
}

.location-script {
  font-family: var(--font-script);
  font-size: clamp(2.25rem, 6vw, 3rem);
  color: var(--color-sage-dark);
  margin: 0 0 0.75rem;
  line-height: 1.1;
}

.location-block {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.venue-line {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.venue-name {
  font-family: var(--font-display);
  font-weight: 300;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--color-sage-dark);
}

.time-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 0.75rem;
  color: var(--color-text-secondary);
}

.time-icon {
  width: 1rem;
  height: 1rem;
  flex-shrink: 0;
}

.time-text {
  font-family: var(--font-body);
  font-size: 0.875rem;
  font-weight: 600;
}

.venue-illus {
  display: block;
  width: 100%;
  height: auto;
}

.actions {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 0.75rem;
  justify-content: center;
  margin-top: 1.5rem;
  margin-bottom: 0;
  padding: 0;
}

.action-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.5rem 0.875rem;
  border: none;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 600;
  font-family: var(--font-sans-strong);
  text-decoration: none;
  cursor: pointer;
  background: var(--color-primary);
  color: var(--color-on-primary);
  transition: background-color 0.2s ease;
}

.action-btn:hover {
  filter: brightness(0.92);
}

.action-icon {
  width: 1rem;
  height: 1rem;
  flex-shrink: 0;
}

</style>

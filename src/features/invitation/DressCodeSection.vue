<script setup lang="ts">
import ScrollReveal from '@/components/ScrollReveal.vue'
import { publicAsset } from '@/lib/publicAsset'
</script>

<template>
  <section class="section dress" aria-labelledby="dress-heading">
    <div class="inner">
      <ScrollReveal>
        <header class="dress-header">
          <h2 id="dress-heading" class="heading-script">Дресс-код</h2>
          <p class="sub">Несколько мягких пожеланий</p>
        </header>
      </ScrollReveal>

      <ScrollReveal :y="30">
        <div class="dress-stack">
        <img
          class="illus"
          :src="publicAsset('assets/dress-code-illustration.png')"
          width="800"
          height="400"
          alt=""
        />
        <div class="card">
          <div class="card-lead">
            <h3 class="h3">Формальный стиль</h3>
            <p class="p">
              Будем благодарны, если вы выберете наряд в духе торжества.
            </p>
          </div>
          <p class="p p-note">
            Просим не надевать белый цвет — он оставлен для невесты.
          </p>
          <p class="p p-note">
            Дамам удобнее на траве и гравии в туфлях на платформе, танкетке или низком каблуке, чем в шпильках.
          </p>
        </div>
        </div>
      </ScrollReveal>
    </div>
  </section>
</template>

<style scoped>
.section {
  box-sizing: border-box;
  padding: var(--section-padding);
  background: var(--color-ivory);
}

.inner {
  max-width: 36rem;
  margin: 0 auto;
}

.dress-header {
  text-align: center;
  margin-bottom: 0;
}

.heading-script {
  font-family: var(--font-script);
  font-size: clamp(3rem, 9vw, 3.75rem);
  letter-spacing: -0.02em;
  color: var(--color-sage-dark);
  margin: 0 0 0.75rem;
  line-height: 1.1;
}

.sub {
  margin: 0 0 1.75rem;
  font-size: 0.875rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--color-text-tertiary);
  font-family: var(--font-body);
  font-weight: 200;
}

.dress-stack {
  text-align: center;
}

.illus {
  position: relative;
  z-index: 1;
  display: block;
  width: 100%;
  height: auto;
  margin: 0 auto -2rem;
}

.card {
  position: relative;
  z-index: 0;
  text-align: left;
  background: var(--color-surface);
  border-radius: 2rem;
  padding: 3rem 2rem 2rem;
  box-shadow:
    0 2px 15px -3px rgba(58, 69, 52, 0.08),
    0 4px 6px -2px rgba(58, 69, 52, 0.04);
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.card-lead {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.h3 {
  font-family: var(--font-display);
  font-size: 1.25rem;
  font-weight: 300;
  margin: 0;
  color: var(--color-sage-dark);
}

.p {
  margin: 0;
  line-height: 1.625;
  color: var(--color-text-secondary);
  font-size: 1rem;
  font-family: var(--font-body);
  font-weight: 200;
}

.p-note {
  font-size: 0.875rem;
  font-style: italic;
}
</style>

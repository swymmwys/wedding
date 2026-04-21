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
          <p class="p p-note">
            Мы очень трепетно готовим наше торжество и будем благодарны, если вы поддержите его цветовую гамму и стилистику в своих образах. Уверены, вы будете неотразимы! 
            <br>
            <br>
            <hr />
            <br>
            Просим вас воздержаться от полностью белых образов, образов с яркими и пестрыми рисунками, спортивной обуви и одежды.
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
  letter-spacing: 0.1em;
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
  margin: 0 auto -2em;
}

.card {
  position: relative;
  z-index: 0;
  text-align: left;
  background: var(--color-surface);
  border-radius: 16px;
  padding: 1.75rem;
  box-shadow: var(--chrome-shadow);
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
  margin: 0 0 0.85rem;
  line-height: 1.65;
  color: var(--color-text-body);
  font-size: 1em;
}

.p:last-child {
  margin-bottom: 0;
}

.p-note {
  font-style: italic;
  text-align: center;
}
</style>

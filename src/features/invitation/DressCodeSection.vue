<script setup lang="ts">
import ExternalLinkIcon from '@/components/ExternalLinkIcon.vue'
import ScrollReveal from '@/components/ScrollReveal.vue'
import DressCodeColorPalette from './DressCodeColorPalette.vue'
import dressCodeIllustrationUrl from '@/assets/dress-code.png'
</script>

<template>
  <section class="section dress" aria-labelledby="dress-heading">
    <div class="shell">
      <ScrollReveal>
        <header class="dress-header">
          <h2 id="dress-heading" class="heading-script">Дресс-код</h2>
        </header>
      </ScrollReveal>

      <ScrollReveal :y="30">
        <div class="frame">
          <div class="dress-stack">
            <img
              class="illus"
              :src="dressCodeIllustrationUrl"
              width="800"
              height="400"
              alt=""
            />
            <div class="card">
              <p class="p p-note">
                Мы очень трепетно готовим наше торжество и будем благодарны, если вы поддержите его цветовую гамму и стилистику в своих образах. Уверены, вы будете неотразимы!
              </p>
              <DressCodeColorPalette />
              <p class="p p-note">
                Просим вас воздержаться от полностью белых образов, образов с яркими и пестрыми рисунками, спортивной обуви и одежды.
              </p>
              <p class="p p-note dress-examples">
                Можете воспользоваться
                <a
                  class="dress-examples__link"
                  href="https://photos.app.goo.gl/Qd5gM2fpxw2BpTyH9"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  примерами
                  <ExternalLinkIcon />
                </a>
                для составления образа.
              </p>
            </div>
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

.shell {
  max-width: var(--invitation-shell-max-width);
  margin: 0 auto;
}

.frame {
  max-width: var(--invitation-card-column-max-width);
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
  box-sizing: border-box;
  text-align: left;
  background: var(--color-surface);
  border-radius: var(--invitation-card-radius);
  padding: var(--invitation-card-padding);
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

.dress-examples {
  font-size: 0.95em;
}

.dress-examples__link {
  display: inline;
  color: var(--color-primary);
  text-decoration: underline;
  text-decoration-color: var(--color-text-tertiary);
  text-underline-offset: 0.2em;
  text-decoration-thickness: 0.04em;
}

.dress-examples__link:hover,
.dress-examples__link:focus-visible {
  text-decoration-color: var(--color-primary);
}

.dress-examples__link:focus-visible {
  outline: 2px solid var(--color-sage);
  outline-offset: 2px;
}
</style>

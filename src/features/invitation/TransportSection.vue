<script setup lang="ts">
import ScrollReveal from '@/components/ScrollReveal.vue'
import { publicAsset } from '@/lib/publicAsset'
</script>

<template>
  <section class="section transport" aria-labelledby="transport-heading">
    <ScrollReveal>
      <div class="inner">
      <img class="illus" :src="publicAsset('assets/bus-illustration.png')" width="160" height="160" alt="" />
      <h2 id="transport-heading" class="heading-script">Как добраться</h2>
      <div class="card">
        <p class="p">
          Мы позаботимся о вашем комфорте и организуем трансфер туда-обратно. Точку отправления трансфера сообщим в общем чате сбора гостей ближе к мероприятию.
        </p>
      </div>
    </div>
    </ScrollReveal>
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
  text-align: center;
}

.illus {
  margin: 0 auto 1rem;
  width: 10rem;
  height: auto;
}

.heading-script {
  font-family: var(--font-script);
  font-size: clamp(2.25rem, 6vw, 3.25rem);
  color: var(--color-sage-dark);
  margin: 0 0 .5em;
}

.sub {
  margin: 0 0 1.75rem;
  font-size: 0.85rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--color-text-secondary);
}

.card {
  text-align: left;
  background: var(--color-surface);
  border-radius: 16px;
  padding: 1.75rem;
  box-shadow: var(--chrome-shadow);
}

.p {
  margin: 0 0 0.85rem;
  line-height: 1.65;
  color: var(--color-text-body);
  font-size: 1em;
  font-style: italic;
  text-align: center;
}

.p:last-child {
  margin-bottom: 0;
}
</style>

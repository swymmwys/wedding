<script setup lang="ts">
import ScrollReveal from '@/components/ScrollReveal.vue'
import { publicAsset } from '@/lib/publicAsset'
</script>

<template>
  <section class="section gifts" aria-labelledby="gifts-heading">
    <div class="shell">
      <ScrollReveal>
        <header class="gifts-header">
          <h2 id="gifts-heading" class="heading-script">Подарки</h2>
          <p class="sub">Сердечная благодарность</p>
        </header>
      </ScrollReveal>

      <ScrollReveal :y="30">
        <div class="frame">
        <div class="card">
          <p class="p">
            Самый ценный подарок для нас — ваше присутствие. Если вы хотите нас порадовать, будем рады конверту
            или переводу на карту — реквизиты вышлем по запросу.
          </p>
        </div>
        <img class="bouquet" :src="publicAsset('assets/flower-bouquet.png')" width="935" height="512" alt="" />
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
  max-width: 42rem;
  margin: 0 auto;
  text-align: center;
}

.gifts-header {
  margin-bottom: 0;
}

.heading-script {
  font-family: var(--font-script);
  font-size: 3rem;
  letter-spacing: -0.02em;
  color: var(--color-sage-dark);
  margin: 0 0 0.75rem;
  line-height: 1.1;
}

@media (min-width: 768px) {
  .heading-script {
    font-size: 3.75rem;
  }
}

.sub {
  margin: 0 0 2rem;
  font-size: 0.875rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--color-text-tertiary);
  font-family: var(--font-body);
  font-weight: 200;
}

.frame {
  position: relative;
  max-width: 32rem;
  margin: 0 auto;
  padding-bottom: 4rem;
  text-align: left;
}

.card {
  box-sizing: border-box;
  text-align: left;
  background-color: rgb(255 255 255 / 0.8);
  border: 1px solid rgb(138 154 132 / 0.3);
  border-radius: 0.5rem;
  padding: 2.5rem 2rem 7rem;
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
}

@media (min-width: 768px) {
  .card {
    padding-left: 4rem;
    padding-right: 4rem;
  }
}

.p {
  margin: 0;
  line-height: 1.625;
  color: var(--color-text-secondary);
  font-size: 1.125rem;
  font-family: var(--font-body);
  font-weight: 200;
}

.bouquet {
  position: absolute;
  left: 50%;
  bottom: 0;
  z-index: 10;
  width: 18rem;
  height: auto;
  transform: translateX(-50%);
  pointer-events: none;
}
</style>

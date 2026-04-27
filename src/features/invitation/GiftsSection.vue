<script setup lang="ts">
import ScrollReveal from '@/components/ScrollReveal.vue'
import flowerBouquetUrl from '@/assets/flower-bouquet.png'
</script>

<template>
  <section class="section gifts" aria-labelledby="gifts-heading">
    <div class="shell">
      <ScrollReveal>
        <header class="gifts-header">
          <h2 id="gifts-heading" class="heading-script">Наши пожелания</h2>
        </header>
      </ScrollReveal>

      <ScrollReveal :y="30">
        <div class="frame">
        <div class="card">
          <p class="p">
            Просим вас не дарить цветы в день свадьбы - к сожалению, в суете праздника они быстро завянут.
            <br>
            Если же вам захочется порадовать нас цветами, вы можете оформить для нас цветочную подписку - тогда после свадьбы мы будем получать букеты от вас и ещё долго вспоминать этот особенный день.
            <br>
            <br>
            <hr />
            <br>
            Мы безмерно любим малышей и подростков, но этот день мы хотим провести в атмосфере взрослого уюта и спокойствия. Пусть это будет вечер, когда вы сможете отдохнуть, потанцевать и насладиться праздником без забот.
          </p>
        </div>
        <img class="bouquet" :src="flowerBouquetUrl" width="935" height="512" alt="" />
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
  text-align: center;
}

.gifts-header {
  margin-bottom: 0;
}

.heading-script {
  font-family: var(--font-script);
  font-size: 2.5rem;
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
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--color-text-tertiary);
  font-family: var(--font-body);
  font-weight: 200;
}

.frame {
  position: relative;
  max-width: var(--invitation-card-column-max-width);
  margin: 0 auto;
  padding-bottom: 4rem;
  text-align: left;
}

.card {
  box-sizing: border-box;
  text-align: left;
  background: var(--color-surface);
  border-radius: var(--invitation-card-radius);
  padding: var(--invitation-card-padding) var(--invitation-card-padding) 7rem;
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

<script setup lang="ts">
import ScrollReveal from '@/components/ScrollReveal.vue'
import coupleDancingUrl from '@/assets/couple-dancing.png'

const items = [
  { time: '15:00', title: 'Встреча гостей', body: 'Аперитив и приветственные напитки' },
  { time: '', title: 'Церемония', body: 'Самый трогательный момент дня' },
  { time: '', title: 'Свадебный ужин', body: 'Ужин на свежем воздухе' },
  { time: '', title: 'Танцы и общение', body: 'Танцуем до упаду!' },
  { time: '', title: 'Праздничный салют', body: 'Прощание и тёплые объятия' },
] as const
</script>

<template>
  <section class="section schedule" aria-labelledby="schedule-heading">
    <div class="inner">
      <ScrollReveal>
        <img
          class="header-illus"
          :src="coupleDancingUrl"
          width="144"
          height="144"
          alt=""
        />
        <h2 id="schedule-heading" class="heading-script">Программа дня</h2>
        <p class="sub">Что мы для вас приготовили</p>
      </ScrollReveal>
      <ol class="list">
        <li v-for="(item, i) in items" :key="item.title" class="item">
          <ScrollReveal
            v-if="i > 0"
            kind="pillar"
            class="line-reveal"
            :duration-sec="0.4"
            :delay-sec="i * 0.08"
          >
            <div class="line" aria-hidden="true" />
          </ScrollReveal>
          <ScrollReveal :duration-sec="0.4" :delay-sec="i * 0.08">
            <div class="content">
              <p v-if="item.time" class="time">{{ item.time }}</p>
              <h3 class="title">{{ item.title }}</h3>
              <p class="body">{{ item.body }}</p>
            </div>
          </ScrollReveal>
        </li>
      </ol>
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
  max-width: 28rem;
  margin: 0 auto;
  text-align: center;
}

.header-illus {
  display: block;
  width: 9rem;
  height: auto;
  margin: 0 auto 1rem;
}

.heading-script {
  font-family: var(--font-script);
  font-size: clamp(2.25rem, 6vw, 3.25rem);
  color: var(--color-sage-dark);
  margin: 0 0 0.35rem;
}

.sub {
  margin: 0 0 2.5rem;
  font-size: 0.85rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--color-text-secondary);
}

.list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.line-reveal {
  display: flex;
  justify-content: center;
  width: 100%;
}

.line {
  width: 1px;
  height: 2em;
  background: var(--color-rule);
  margin: 0.25rem 0;
}

.content {
  padding: 0.25rem 0 1.5rem;
}

.time {
  font-size: 0.75rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--color-text-tertiary);
  margin: 0 0 0.35rem;
}

.title {
  font-family: var(--font-sans-strong);
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0 0 0.35rem;
  color: var(--color-sage-dark);
}

.body {
  margin: 0;
  font-size: 1em;
  line-height: 1.55;
  color: var(--color-text-body);
  font-style: italic;
}
</style>

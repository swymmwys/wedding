<script setup lang="ts">
import ExternalLinkIcon from '@/components/ExternalLinkIcon.vue'
import ScrollReveal from '@/components/ScrollReveal.vue'
import {
  weddingTelegramGroupInviteUrl,
} from '@/setting'
</script>

<template>
  <section class="section contacts" aria-labelledby="contacts-heading">
    <ScrollReveal>
      <div class="shell">
        <h2 id="contacts-heading" class="heading-script">Контакты</h2>
        <div class="frame">
          <div class="card">
            <p class="p">
              Если у вас есть вопросы по торжеству или вы готовите сюрприз, пожалуйста, свяжитесь с нашими организаторами
            </p>
            <div class="organizers">
              <p class="p">
                <a
                  class="link"
                  href="https://t.me/darya_alesina"
                  target="_blank"
                  rel="noopener noreferrer"
                >Написать <span class="link-tail">Дарье<ExternalLinkIcon /></span></a>
              </p>
              <p class="p">
                <a
                  class="link"
                  href="https://t.me/victoria_kuprovich"
                  target="_blank"
                  rel="noopener noreferrer"
                >Написать <span class="link-tail">Виктории<ExternalLinkIcon /></span></a>
              </p>
            </div>
            <p class="p">
              Чтобы мы были на связи, могли обменяться фотографиями и впечатлениями, добавляйтесь в наш общий чат в
              <a
                class="link"
                :href="weddingTelegramGroupInviteUrl"
                target="_blank"
                rel="noopener noreferrer"
              ><span class="link-tail">Телеграме<ExternalLinkIcon /></span></a>.
            </p>
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
  background: var(--color-ivory);
}

.shell {
  max-width: var(--invitation-shell-max-width);
  margin: 0 auto;
  text-align: center;
}

.frame {
  max-width: var(--invitation-card-column-max-width);
  margin: 0 auto;
}

.heading-script {
  font-family: var(--font-script);
  font-size: clamp(2.25rem, 6vw, 3.25rem);
  color: var(--color-sage-dark);
  margin: 0 0 .5em;
}

.card {
  box-sizing: border-box;
  text-align: left;
  background: var(--color-surface);
  border-radius: var(--invitation-card-radius);
  padding: var(--invitation-card-padding);
  box-shadow: var(--chrome-shadow);
}

.organizers {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.85rem 1.5rem;
  margin: 0 0 0.85rem;
}

.organizers .p {
  margin: 0;
  box-sizing: border-box;
  flex: 1 1 125px;
  min-width: 125px;
  max-width: 100%;
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

.link-tail {
  white-space: nowrap;
}

.link {
  color: var(--color-sage-dark);
  text-decoration: underline;
  text-underline-offset: 0.15em;
  font-style: italic;
}

.link:hover {
  opacity: 0.88;
}
</style>

<script setup lang="ts">
import couplePhotoUrl from '@/assets/leyla_alexander_photo.jpeg'
</script>

<template>
  <section class="couple-photo">
    <img
      class="couple-photo-image"
      :src="couplePhotoUrl"
      width="800"
      height="1200"
      alt=""
      decoding="async"
    />
    <div class="couple-photo-overlay">
      <p class="couple-photo-text">
        <span class="couple-photo-line">Будем рады видеть вас на нашей свадьбе!</span>
        <span class="couple-photo-line">Ваши Александр и Лейла</span>
      </p>
    </div>
  </section>
</template>

<style scoped>
.couple-photo {
  position: relative;
  width: 100%;
  height: 500px;
  margin: 0;
  padding: 0;
  overflow: hidden;
}

.couple-photo-image {
  position: absolute;
  inset: 0;
  z-index: 0;
  display: block;
  width: 100%;
  height: 100%;
  max-width: none;
  object-fit: cover;
  object-position: center;
}

.couple-photo-overlay {
  position: absolute;
  inset: 0;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  text-align: center;
}

.couple-photo-text {
  margin: 0;
  font-family: var(--font-accent);
  font-size: 1.7em;
  line-height: 1.4;
  color: var(--color-ivory);
  text-shadow: 0 0 1.5rem rgba(0, 0, 0), 1px 1px 8px rgba(0, 0, 0);
}

.couple-photo-line {
  display: block;
}

.couple-photo-line + .couple-photo-line {
  margin-top: 0.5em;
}
</style>

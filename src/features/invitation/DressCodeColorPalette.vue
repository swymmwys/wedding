<script setup lang="ts">
import dressPalette01 from '@/assets/dress-palette-200/dress-palette-01.jpg'
import dressPalette02 from '@/assets/dress-palette-200/dress-palette-02.jpg'
import dressPalette03 from '@/assets/dress-palette-200/dress-palette-03.jpg'
import dressPalette04 from '@/assets/dress-palette-200/dress-palette-04.jpg'
import dressPalette05 from '@/assets/dress-palette-200/dress-palette-05.jpg'
import dressPalette06 from '@/assets/dress-palette-200/dress-palette-06.jpg'
import dressPalette07 from '@/assets/dress-palette-200/dress-palette-07.jpg'
import dressPalette08 from '@/assets/dress-palette-200/dress-palette-08.jpg'
import dressPalette09 from '@/assets/dress-palette-200/dress-palette-09.jpeg'

/** Cropped 200×200 sources in sorted `photo_2026-*` order. */
const PALETTE_IMAGE_URLS: readonly [
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
] = [
  dressPalette01,
  dressPalette02,
  dressPalette03,
  dressPalette04,
  dressPalette05,
  dressPalette06,
  dressPalette07,
  dressPalette08,
  dressPalette09,
] as const
</script>

<template>
  <div
    class="dress-code-palette"
    role="img"
    aria-label="Цветовая гамма дресс-кода, фотографии"
    :style="{ '--palette-n': PALETTE_IMAGE_URLS.length }"
  >
    <div class="palette-row">
      <div
        v-for="(src, i) in PALETTE_IMAGE_URLS"
        :key="i"
        class="palette-cell"
        :style="{ zIndex: i + 1 }"
      >
        <img
          class="palette-img"
          :src="src"
          width="200"
          height="200"
          alt=""
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.dress-code-palette {
  /* Row width w = d×(27n+15)/42 with overlap 15/42×d; fit w to parent: d = 42/(27n+15)×100% */
  --size: min(200px, calc(100% * 42 / (27 * var(--palette-n) + 15)));
  display: flex;
  justify-content: center;
  width: 100%;
  padding-block: 0.25rem;
  box-sizing: border-box;
}

/* Overlap: 15/42 of diameter (same as SVG) */
.palette-row {
  display: flex;
  width: 100%;
  flex-direction: row;
  align-items: center;
}

.palette-cell {
  position: relative;
  flex: 0 0 var(--size);
  width: var(--size);
  aspect-ratio: 1;
  flex-shrink: 0;
  overflow: hidden;
  border-radius: 50%;
  box-shadow: 0 0 0 1px rgba(0 0 0 / 0.18);
}

.palette-cell + .palette-cell {
  margin-left: calc(-1 * 15 * var(--size) / 42);
}

.palette-img {
  position: absolute;
  inset: 0;
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}
</style>

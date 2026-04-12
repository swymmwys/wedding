<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useUiStore } from '@/stores/ui'

const ui = useUiStore()
const { soundEnabled } = storeToRefs(ui)
</script>

<template>
  <button
    type="button"
    class="audio-btn"
    :aria-pressed="soundEnabled"
    :aria-label="soundEnabled ? 'Выключить звук' : 'Включить звук'"
    :title="soundEnabled ? 'Звук вкл.' : 'Звук выкл.'"
    @click="ui.toggleSound()"
  >
    <svg
      v-if="soundEnabled"
      class="audio-icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      <path
        d="M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z"
      />
      <path d="M16 9a5 5 0 0 1 0 6" />
      <path d="M19.364 18.364a9 9 0 0 0 0-12.728" />
    </svg>
    <svg
      v-else
      class="audio-icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      <path
        d="M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z"
      />
      <line x1="22" x2="16" y1="9" y2="15" />
      <line x1="16" x2="22" y1="9" y2="15" />
    </svg>
  </button>
</template>

<style scoped>
.audio-btn {
  position: fixed;
  bottom: 1.5rem;
  right: 1.5rem;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem;
  border: none;
  border-radius: 999px;
  background-color: hsl(var(--audio-primary) / 0.9);
  color: hsl(var(--audio-primary-foreground));
  box-shadow:
    0 10px 15px -3px rgb(0 0 0 / 0.1),
    0 4px 6px -4px rgb(0 0 0 / 0.1);
  cursor: pointer;
  transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1);
}

.audio-btn:hover {
  background-color: hsl(var(--audio-primary));
}

.audio-btn:focus-visible {
  outline: 2px solid var(--color-sage);
  outline-offset: 2px;
}

.audio-icon {
  width: 1.25rem;
  height: 1.25rem;
}
</style>

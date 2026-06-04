<template>
  <div class="hero-scroll-indicator" aria-hidden="true">
    <svg
      viewBox="0 0 24 24"
      role="presentation"
      focusable="false"
    >
      <path
        d="M6 9L12 15L18 9"
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
      />
    </svg>
  </div>
</template>

<style scoped>
.hero-scroll-indicator {
  width: 2.5rem;
  height: 2.5rem;
  color: var(--color-hero-text);
  opacity: 0.9;
  transform: translateX(-50%);
  animation: hero-scroll-bounce 1.8s ease-in-out infinite;
  filter: drop-shadow(1px 1px 10px rgb(0 0 0 / 0.45));
}

.hero-scroll-indicator svg {
  width: 100%;
  height: 100%;
}

@keyframes hero-scroll-bounce {
  0%,
  20%,
  50%,
  80%,
  100% {
    transform: translateX(-50%) translateY(0);
  }

  40% {
    transform: translateX(-50%) translateY(8px);
  }

  60% {
    transform: translateX(-50%) translateY(4px);
  }
}

@media (prefers-reduced-motion: reduce) {
  .hero-scroll-indicator {
    transform: translateX(-50%);
    animation: none;
  }
}
</style>

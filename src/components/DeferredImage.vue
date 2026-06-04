<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { useUiStore } from '@/stores/ui'

type DeferredImageProps = {
  src: string
  alt?: string
}

const props = defineProps<DeferredImageProps>()

const { introHidden } = storeToRefs(useUiStore())

const resolvedSrc = computed<string | undefined>(() => {
  return introHidden.value ? props.src : undefined
})

</script>

<template>
  <img
    v-bind="$attrs"
    :src="resolvedSrc"
    :alt="props.alt"
    loading="lazy"
    decoding="async"
  >
</template>

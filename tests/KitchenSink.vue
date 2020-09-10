<template>
  <div>Count is {{ count }}</div>
  <div>{{ computedMsg }}</div>
</template>

<script lang="ts">
declare global {
  interface Window {
    performGlobalSideEffect: () => void
  }
}
window.performGlobalSideEffect()

// this can be imported as `import { named } from './*.vue'`
export const named = 1
</script>

<script setup="props" lang="ts">
import { ref, computed } from 'vue'

export const count = ref(5)

declare const props: {
  msg: string
}

// export const computedMsg = computed<number>(() => props.msg)
export const computedMsg = computed(() => props.msg)
</script>
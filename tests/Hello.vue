<template>
  <button @click="inc">Count: {{ count }}</button>
</template>

<script setup="props, { emit }" lang="ts">
import { ref } from 'vue'

export const count = ref<string>(5)
export const inc = () => count.value++
</script>

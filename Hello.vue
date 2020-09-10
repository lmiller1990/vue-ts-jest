<template>
  <button @click="inc">{{ count }}</button>
</template>

<script setup="props, { emit }" lang="ts">
import { ref } from 'vue'

export const count = ref(0)
export const inc = () => count.value++
</script>

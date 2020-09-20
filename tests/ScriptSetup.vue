<template>
  <button @click="increase">Count: {{ num }}</button>
</template>

<script setup="props, { emit }" lang="ts">
import { ref } from 'vue'

export const num = ref<string>(5)
export const increase = () => num.value++
</script>

<template>
  <button @click="inc">Count: {{ count }}</button>
</template>

<script lang="ts">
import {
  defineComponent,
  ref
} from 'vue'

export default defineComponent({
  setup() {
    const count = ref<string>(5)
    const inc = () => count.value++

    return {
      count,
      inc
    }
  }
})
</script>

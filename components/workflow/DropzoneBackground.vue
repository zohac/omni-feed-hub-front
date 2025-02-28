<template>
  <div :style="{ border: isDragOver ? '2px dashed #007bff' : 'none' }" class="dropzone-background">
    <Background :gap="20" :size="2" pattern-color="#BDBDBD" />
    <div class="overlay">
      <slot />
    </div>
  </div>
</template>

<script setup>
import { Background } from '@vue-flow/background'
import { ref } from 'vue'

const isDragOver = ref(false)
</script>

<style scoped>
.dropzone-background {
  position: relative;
  width: 100%;
  height: 100%;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}
</style>

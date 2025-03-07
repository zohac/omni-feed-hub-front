<template>
  <v-snackbar
    v-model="show"
    :color="color"
    :timeout="timeout"
    location="right"
    style="z-index: 1000000"
  >
    {{ message }}
    <template #actions>
      <v-btn icon="mdi-close" variant="text" @click="show = !show" />
    </template>
  </v-snackbar>
</template>

<script lang="ts" setup>
const props = defineProps({
  modelValue: Boolean,
  message: String,
  color: {
    type: String,
    default: 'success'
  },
  timeout: {
    type: Number,
    default: 5000
  }
})

const emit = defineEmits(['update:modelValue'])

// Permet de contrôler la visibilité avec v-model
const show = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})
</script>

<template>
  <v-col cols="12" md="4">
    <v-card>
      <v-card-title>
        <v-icon>{{ icon }}</v-icon>
        {{ title }}
      </v-card-title>
      <v-card-text>{{ value }}</v-card-text>
    </v-card>
  </v-col>
</template>

<script lang="ts" setup>
defineProps({
  title: {
    type: String,
    required: true
  },
  value: {
    type: [String, Number],
    required: true
  },
  icon: {
    type: String,
    required: true
  }
})
</script>

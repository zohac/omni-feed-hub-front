<template>
  <v-col cols="12" md="4">
    <v-card
      :subtitle="title"
      :title="value"
      class="mx-auto rounded-lg"
      variant="outlined"
      with-background
    >
      <template v-slot:prepend>
        <v-avatar color="blue-darken-2">
          <v-icon :icon="icon"></v-icon>
        </v-avatar>
      </template>
    </v-card>
  </v-col>
</template>

<script lang="ts" setup>
// components/dashboard/StatCard
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

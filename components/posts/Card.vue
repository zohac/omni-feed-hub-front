<!-- components/posts/Card.vue -->
<template>
  <v-card class="cursor-pointer" @click="openPost">
    <v-card-title>{{ post.title }}</v-card-title>
    <v-card-text>{{ post.content }}</v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
import { defineEmits, defineProps } from 'vue'
import type { Post } from '~/types/entities/Post'

const props = defineProps<{
  post: Post
}>()

const emit = defineEmits(['open-post'])

const openPost = () => {
  emit('open-post', props.post.id)
}
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}
</style>

<!-- components/posts/Post.vue -->
<template>
  <div v-if="post">
    <!-- Boutons d'actions -->
    <v-container class="d-flex justify-end">
      <v-btn
        :color="post.published ? 'green-darken-2' : 'grey'"
        :variant="post.published ? 'flat' : 'outlined'"
        class="mr-5"
        icon
        @click="togglePublished"
      >
        <v-icon>mdi-check</v-icon>
      </v-btn>
    </v-container>

    <v-divider></v-divider>

    <v-container>
      <h2 class="text-h4">{{ post.title }}</h2>
      <p class="text-subtitle-1 grey--text">Created At: {{ formatDate(post.createdAt) }}</p>
      <p class="text-subtitle-1 grey--text">Scheduled At: {{ formatDate(post.scheduledAt) }}</p>
      <p class="text-subtitle-1 grey--text">Published At: {{ formatDate(post.publishedAt) }}</p>
      <v-chip-group>
        <v-chip v-for="article in post.articles" color="primary" size="small" variant="outlined">
          {{ article.title }}
        </v-chip>
      </v-chip-group>
      <v-divider class="my-4"></v-divider>

      <div class="post-content" v-html="post.content"></div>
    </v-container>
  </div>
</template>

<script lang="ts" setup>
import { usePostStore } from '~/stores/postStore'
import { Post } from '~/types/entities/Post'

const postStore = usePostStore()

const props = defineProps({
  post: {
    type: Object as () => Post,
    required: true
  }
})
console.log(props.post)
// Événement d'émission
const emit = defineEmits(['post-updated'])

const togglePublished = async () => {
  if (!props.post) return

  props.post.published = !props.post.published
  await updatePostState(props.post)
}

// Met à jour l'état du post via l'API
const updatePostState = async (post: Post) => {
  if (post.id) {
    await postStore.updatePost(post.id, {
      published: post.published
    })
  }

  emit('post-updated', post)
}

// Format date function
const formatDate = (date: string | null) => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleString()
}
</script>

<style scoped>
.post-content {
  white-space: pre-wrap;
}
</style>

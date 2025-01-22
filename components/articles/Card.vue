<template>
  <v-card :variant="article.state.isRead ? 'flat' : 'outlined'">
    <div class="d-flex flex-no-wrap justify-space-between">
      <v-img
        v-if="article.mediaAttachments?.length"
        :src="article.mediaAttachments?.[0].url"
        cover
        max-width="300px"
        width="300px"
      ></v-img>
      <div>
        <v-card-title
          class="cursor-pointer text-primary wrap-title"
          @click="openArticle(article.id)"
          >{{ article.title }}
        </v-card-title>
        <v-card-subtitle>
          {{ formatDate(article.publicationAt) }}{{ ' - ' + article.feed?.title }}
        </v-card-subtitle>
        <v-card-text :class="{ 'text-grey-darken-1': article.state.isRead }">
          {{ article.description }}
        </v-card-text>
      </div>
    </div>
  </v-card>
</template>

<script lang="ts" setup>
// Props
import type { Article } from '~/types/entities/Article'

const props = defineProps({
  article: {
    type: Object as () => Article,
    required: true
  }
})

// Événement d'émission
const emit = defineEmits(['open-article'])

const openArticle = (id: number) => {
  emit('open-article', id)
}
</script>

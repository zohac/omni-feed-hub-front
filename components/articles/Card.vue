<template>
  <v-card :variant="article.state.isRead ? 'flat' : 'outlined'" style="max-height: 256px">
    <div class="d-flex flex-no-wrap justify-space-between">
      <NuxtPicture
        v-if="article.mediaAttachments?.length"
        :src="article.mediaAttachments?.[0].url"
        cover
        format="avif,webp"
        max-height="256px"
        max-width="300px"
        width="300px"
      />
      <div class="w-100">
        <v-card-title
          class="cursor-pointer text-primary wrap-title"
          @click="openArticle(article.id)"
          >{{ article.title }}
        </v-card-title>
        <v-card-subtitle>
          {{ formatDate(article.publicationAt) }}
          <span v-if="article.feed">
            -
            <a :href="/feeds/ + article.feed.id">{{ article.feed.title }}</a></span
          >
          <v-chip-group>
            <v-chip v-for="tag in article.tags" color="primary" size="small" variant="outlined">
              {{ tag }}
            </v-chip>
          </v-chip-group>
        </v-card-subtitle>
        <v-card-text :class="{ 'text-grey-darken-1': article.state.isRead }">
          {{ truncateText(article.description, 512) }}
        </v-card-text>
      </div>
    </div>
  </v-card>
</template>

<script lang="ts" setup>
import { useTruncate } from '~/composables/useTruncate' // Props
import type { Article } from '~/types/entities/Article'

const { truncateText } = useTruncate()

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

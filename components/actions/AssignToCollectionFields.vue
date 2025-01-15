<template>
  <div>
    <v-select
      v-model="selected"
      :items="collections"
      item-title="name"
      item-value="id"
      label="Sélectionnez une Collection"
      required
      @update:modelValue="onUpdateModelValue"
    />
  </div>
</template>

<script lang="ts" setup>
// components/actions/AssignToCollectionFields.vue

import { onMounted, ref } from 'vue'
import { useArticleCollectionStore } from '~/stores/articleCollectionStore'
import type { ArticleCollection } from '~/types/entities/ArticleCollection'

const props = defineProps({
  modelValue: {
    type: [Number, null],
    required: true
  }
})
// Déclaration des événements
const emit = defineEmits(['update:modelValue'])

const articleCollectionStore = useArticleCollectionStore()
const collections = ref([] as ArticleCollection[])
let selected: ArticleCollection | null = null

onMounted(async () => {
  await articleCollectionStore.fetchArticlesCollection()
  collections.value = articleCollectionStore.articlesCollection

  selected = collections.value.find((item) => props.modelValue === item.id) as ArticleCollection
})

const onUpdateModelValue = (value: number) => {
  emit('update:modelValue', value)
}
</script>

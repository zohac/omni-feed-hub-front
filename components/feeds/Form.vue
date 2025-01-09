<template>
  <v-card class="mx-auto" width="400">
    <template v-slot:title>
      <span class="font-weight-black">
        {{ isNewFeed ? 'Ajouter un nouveau flux' : 'Modifier le flux' }}
      </span>
    </template>

    <v-card-text>
      <v-form @submit.prevent="onSubmit">
        <v-text-field v-model="title" :error-messages="errors.title" label="Title" />
        <v-text-field v-model="url" :error-messages="errors.url" label="URL" />
        <v-text-field
          v-model="description"
          :error-messages="errors.description"
          label="Description"
        />

        <v-select
          v-model="collectionId"
          :error-messages="errors.collectionId"
          :items="collections"
          item-title="name"
          item-value="id"
          label="Collection"
        />

        <v-btn color="primary" type="submit" variant="flat">
          {{ isNewFeed ? 'Créer' : 'Mettre à jour' }}
        </v-btn>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
// components/feeds/Form.vue
import { useForm } from 'vee-validate'
import * as yup from 'yup'
import { RssFeedCollection } from '~/types/entities/RssFeedCollection' // Définition des props

// Définition des props
const props = defineProps({
  isNewFeed: Boolean,
  formData: {
    type: Object,
    required: true
  }
})

// Événement pour remonter les données validées vers le parent
const emit = defineEmits(['formSubmit'])

const feedCollectionStore = useFeedCollectionStore()
const collections = ref([] as RssFeedCollection[])

await feedCollectionStore.fetchFeedsCollection()
collections.value = feedCollectionStore.feedsCollection

// Schéma de validation Yup
const schema = yup.object({
  title: yup.string().required('Titre requis').min(3, 'Minimum 3 caractères'),
  url: yup.string().required('URL requise').url('URL invalide'),
  description: yup.string().nullable().max(200, 'Maximum 200 caractères'),
  collectionId: yup.number().nullable().required('Collection requise')
})

// Utilisation de VeeValidate
const { defineField, handleSubmit, errors, resetForm } = useForm({
  validationSchema: schema,
  initialValues: props.formData
})

// Liaison des champs
const [title] = defineField('title')
const [url] = defineField('url')
const [description] = defineField('description')
const [collectionId] = defineField('collectionId')

// Validation et soumission
const onSubmit = handleSubmit((values) => {
  const { collection, ...dto } = values // Enlève explicitement `collection`
  emit('formSubmit', dto)
})

watch(
  () => props.formData,
  () => {
    const { collection, ...formData } = props.formData // Ne garde que collectionId
    resetForm({ values: { ...formData, collectionId: props.formData.collection?.id } })
  }
)
</script>

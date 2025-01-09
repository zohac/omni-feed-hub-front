<template>
  <v-card class="mx-auto" width="400">
    <template v-slot:title>
      <span class="font-weight-black">
        {{
          isNewFeedCollection ? 'Ajouter une nouvelle Collection de flux' : 'Modifier la Collection'
        }}
      </span>
    </template>

    <v-card-text>
      <v-form @submit.prevent="onSubmit">
        <v-text-field v-model="name" :error-messages="errors.name" label="Name" />
        <v-text-field
          v-model="description"
          :error-messages="errors.description"
          label="Description"
        />

        <v-btn color="primary" type="submit" variant="flat">
          {{ isNewFeedCollection ? 'Créer' : 'Mettre à jour' }}
        </v-btn>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
// components/collections/feeds/Form.vue
import { useForm } from 'vee-validate'
import * as yup from 'yup' // Définition des props

// Définition des props
const props = defineProps({
  isNewFeedCollection: Boolean,
  formData: {
    type: Object,
    required: true
  }
})

// Événement pour remonter les données validées vers le parent
const emit = defineEmits(['formSubmit'])

// Schéma de validation Yup
const schema = yup.object({
  name: yup.string().required('Nom requis').min(3, 'Minimum 3 caractères'),
  description: yup.string().max(200, 'Maximum 200 caractères')
})

// Utilisation de VeeValidate
const { defineField, handleSubmit, errors, resetForm } = useForm({
  validationSchema: schema,
  initialValues: props.formData
})

// Liaison des champs
const [name] = defineField('name')
const [description] = defineField('description')

// Validation et soumission
const onSubmit = handleSubmit((values) => {
  emit('formSubmit', values)
})

watch(
  () => props.formData,
  () => {
    resetForm({ values: props.formData })
  }
)
</script>

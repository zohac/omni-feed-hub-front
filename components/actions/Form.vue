<template>
  <v-card class="mx-auto" width="600">
    <template v-slot:title>
      <h2>{{ isNewAction ? 'Créer une Nouvelle Action' : "Modifier l'Action" }}</h2>
    </template>

    <v-card-text>
      <v-form @submit.prevent="onSubmit">
        <!-- Champ Nom -->
        <v-text-field v-model="name" label="Nom de l'Action" required />

        <!-- Type d'Action -->
        <v-select
          v-model="form.type"
          :items="actionTypes.items"
          item-title="text"
          item-value="value"
          label="Type d'Action"
          @update:modelValue="onTypeChange"
        />

        <!-- Champs spécifiques au type -->
        <div v-if="form.type?.value === ActionType.ASSIGN_TO_COLLECTION">
          <AssignToCollectionFields v-model="form.collectionId" />
        </div>

        <!-- Boutons -->
        <div class="d-flex justify-end mt-4">
          <v-btn color="primary" type="submit">
            {{ isNewAction ? 'Créer' : 'Mettre à Jour' }}
          </v-btn>
        </div>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
// components/actions/Form.vue

import { useForm } from 'vee-validate'
import { reactive } from 'vue'
import * as yup from 'yup'
import AssignToCollectionFields from '~/components/actions/AssignToCollectionFields.vue'
import { ActionType } from '~/types/enums/ActionType'
import { actionTypes } from '~/utils/actionTypes'

const props = defineProps({
  isNewAction: Boolean,
  formData: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['formSubmit'])

// Champs dynamiques
const form = reactive({
  name: '',
  type: actionTypes.find(props.formData.type),
  collectionId: props.formData.collectionId || null
})

const schema = yup.object({
  name: yup.string().required('Le nom est requis'),
  type: yup.string().required('Le type est requis'),
  collectionId: yup
    .number()
    .nullable()
    .when('type', (type, schema) => {
      return type === ActionType.ASSIGN_TO_COLLECTION
        ? schema.required('La collection est requise pour ce type d’action')
        : schema.nullable()
    })
})

// Champs globaux
const { defineField, handleSubmit, errors, resetForm } = useForm({
  validationSchema: schema,
  initialValues: props.formData
})

const [name] = defineField('name')
const [type] = defineField('type')

// Soumission du formulaire
const onSubmit = handleSubmit((values) => {
  emit('formSubmit', { ...values, collectionId: form.collectionId })
})

const onTypeChange = (selectedValue: string) => {
  // Reconstruire l'objet complet basé sur la valeur sélectionnée
  form.type = actionTypes.find(selectedValue) || actionTypes.items[0]

  // Réinitialiser les champs dépendants si nécessaire
  if (form.type.value !== ActionType.ASSIGN_TO_COLLECTION) {
    form.collectionId = null
  }
}
</script>

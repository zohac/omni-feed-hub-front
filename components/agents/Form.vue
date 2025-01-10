<template>
  <v-card class="mx-auto" width="600">
    <template v-slot:title>
      <h2>{{ isNewAgent ? 'Créer un nouvel Agent IA' : "Modifier l'Agent IA" }}</h2>
    </template>

    <v-card-text>
      <v-form @submit.prevent="onSubmit">
        <!-- Nom -->
        <v-text-field
          v-model="name"
          :error-messages="errors.name"
          label="Nom de l'Agent"
          required
        />

        <!-- Description -->
        <v-textarea
          v-model="description"
          :error-messages="errors.description"
          label="Description"
          rows="3"
        />

        <!-- Fournisseur -->
        <v-select
          v-model="provider"
          :error-messages="errors.provider"
          :items="providers"
          label="Fournisseur"
        />

        <!-- Rôle -->
        <v-select v-model="role" :error-messages="errors.role" :items="roles" label="Rôle" />

        <!-- Configuration -->
        <h3>Configuration</h3>
        <v-text-field
          v-model="configuration.model"
          :error-messages="errors['configuration.model']"
          label="Modèle"
          required
        />
        <v-textarea
          v-model="configuration.prompt"
          :error-messages="errors['configuration.prompt']"
          label="Prompt"
          rows="3"
        />
        <v-checkbox v-model="configuration.stream" label="Stream" />
        <v-text-field
          v-model="configuration.temperature"
          :error-messages="errors['configuration.temperature']"
          label="Température"
          model-value="0.7"
          type="number"
        />

        <!-- Boutons -->
        <div class="d-flex justify-end mt-4">
          <v-btn color="primary" type="submit">
            {{ isNewAgent ? 'Créer' : 'Mettre à jour' }}
          </v-btn>
        </div>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
import { useForm } from 'vee-validate'
import { watch } from 'vue'
import * as yup from 'yup'
import { CreateAiAgentDto } from '~/types/dtos/AiAgentDto'
import { AiAgentProvider } from '~/types/enums/AiAgentProvider'
import { AiAgentRole } from '~/types/enums/AiAgentRole'

// Props
const props = defineProps({
  isNewAgent: Boolean,
  formData: {
    type: Object as () => Partial<CreateAiAgentDto>,
    required: true
  }
})

// Événement d'émission
const emit = defineEmits(['formSubmit', 'cancel'])

// Options
const providers = Object.values(AiAgentProvider)
const roles = Object.values(AiAgentRole)

// Validation avec Yup
const schema = yup.object({
  name: yup.string().required('Le nom est requis'),
  description: yup.string().nullable(),
  provider: yup.string().oneOf(providers).required('Le fournisseur est requis'),
  role: yup.string().oneOf(roles).required('Le rôle est requis'),
  configuration: yup.object({
    model: yup.string().required('Le modèle est requis'),
    prompt: yup.string().nullable(),
    stream: yup.boolean(),
    temperature: yup
      .number()
      .nullable()
      .min(0, 'La température doit être supérieure ou égale à 0')
      .max(1, 'La température doit être inférieure ou égale à 1')
  })
})

// Liaison Vee-Validate
const { defineField, handleSubmit, errors, resetForm } = useForm({
  validationSchema: schema,
  initialValues: props.formData
})

const [name] = defineField('name')
const [description] = defineField('description')
const [provider] = defineField('provider')
const [role] = defineField('role')
const [configuration] = defineField('configuration')

// Soumission du formulaire
const onSubmit = handleSubmit((values) => {
  emit('formSubmit', values)
})

// Annulation
const cancel = () => {
  emit('cancel')
}

// Mise à jour des données initiales
watch(
  () => props.formData,
  () => {
    resetForm({ values: props.formData })
  },
  { deep: true }
)
</script>

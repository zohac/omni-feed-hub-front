<template>
  <v-container class="mx-auto">
    <v-form @submit.prevent="onSubmit">
      <!-- Nom -->
      <v-text-field
        v-model="name"
        :error-messages="errors.name"
        density="compact"
        label="Nom de l'Agent"
        required
      />

      <!-- Description -->
      <v-textarea
        v-model="description"
        :error-messages="errors.description"
        density="compact"
        label="Description"
        rows="2"
      />

      <v-row>
        <v-col>
          <!-- Fournisseur -->
          <v-select
            v-model="provider"
            :error-messages="errors.provider"
            :items="providers"
            density="compact"
            label="Fournisseur"
          />
        </v-col>
        <v-col>
          <!-- Rôle -->
          <v-select
            v-model="role"
            :error-messages="errors.role"
            :items="roles"
            density="compact"
            label="Rôle"
          />
        </v-col>
      </v-row>

      <!-- Configuration -->
      <h3>Configuration</h3>
      <v-text-field
        v-if="configuration"
        v-model="configuration.model"
        :error-messages="errors['configuration.model']"
        density="compact"
        label="Modèle"
        required
      />
      <v-textarea
        v-if="configuration"
        v-model="configuration.prompt"
        :error-messages="errors['configuration.prompt']"
        density="compact"
        label="Prompt"
        rows="5"
      />
      <v-checkbox
        v-if="configuration"
        v-model="configuration.stream"
        density="compact"
        label="Stream"
      />
      <v-text-field
        v-if="configuration"
        v-model="configuration.temperature"
        :error-messages="errors['configuration.temperature']"
        :max="1"
        :min="0"
        density="compact"
        label="Température"
      />

      <!-- Boutons -->
      <div class="d-flex justify-end mt-4">
        <v-btn color="primary" type="submit">
          {{ isNewAgent ? 'Créer' : 'Mettre à jour' }}
        </v-btn>
      </div>
    </v-form>
  </v-container>
</template>

<script lang="ts" setup>
import { useForm } from 'vee-validate'
import { watch } from 'vue'
import * as yup from 'yup'
import { CreateAiAgentDto } from '~/types/dtos/AiAgentDto'
import { AiAgentProvider } from '~/types/enums/AiAgentProvider'
import { AiAgentRole } from '~/types/enums/AiAgentRole' // Props

// Props
const props = defineProps({
  isNewAgent: Boolean,
  formData: {
    type: [Object as () => Partial<CreateAiAgentDto>, null],
    required: true,
    default: null
  }
})

const defaultForm: Partial<CreateAiAgentDto> = {
  name: '',
  description: '',
  provider: undefined,
  role: undefined,
  configuration: {
    model: '',
    prompt: '',
    stream: false,
    temperature: 0.7 // Température par défaut
  }
}

// Événement d'émission
const emit = defineEmits(['formSubmit'])

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
  initialValues: defaultForm
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

// Mise à jour des données initiales
watch(
  () => props.formData,
  () => {
    resetForm({ values: defaultForm })
    if (undefined !== props.formData && props.formData) {
      console.log(props.formData)
      resetForm({ values: props.formData })
    }
  },
  { deep: true }
)
</script>

<template>
  <div style="width: 50%">
    <v-form @submit.prevent="onSubmit">
      <v-row>
        <v-col cols="4">
          <v-text-field
            v-model="name"
            :error-messages="errors.name"
            density="compact"
            label="Name"
            variant="outlined"
          />
        </v-col>
        <v-col cols="4">
          <v-select
            v-model="status"
            :error-messages="errors.status"
            :items="workflowStatus"
            class="test"
            density="compact"
            label="Status"
            variant="outlined"
          />
        </v-col>
        <v-col cols="4">
          <v-btn color="primary" text="Sauvegarder" type="submit" variant="flat" />
        </v-col>
      </v-row>
    </v-form>
  </div>
</template>

<script lang="ts" setup>
// components/collections/feeds/Form.vue
import { useForm } from 'vee-validate'
import * as yup from 'yup'
import { WorkflowService } from '~/services/workflowService'
import { useMainStore } from '~/stores/mainStore'
import { useWorkflowStore } from '~/stores/worflowStore'
import { AgentWorkflow } from '~/types/entities/AgentWorkflow'
import { AgentWorkflowStatus } from '~/types/enums/AgentWorkflowStatus' // Définition des props

// Définition des props
const props = defineProps({
  newWorkflow: Boolean,
  formData: {
    type: Object,
    required: true
  }
})

const mainStore = useMainStore()
const workflowStore = useWorkflowStore()
const workflowService = new WorkflowService(workflowStore)
const workflowStatus = Object.values(AgentWorkflowStatus)

// Événement pour remonter les données validées vers le parent
const emit = defineEmits(['formSubmit'])
const isNewWorkflow = ref<boolean>(props.newWorkflow)
const workflow = ref<AgentWorkflow | null>(workflowStore.workflow)

// Schéma de validation Yup
const schema = yup.object({
  name: yup.string().required('Nom requis').min(3, 'Minimum 3 caractères'),
  status: yup.string().oneOf(workflowStatus).required('Le status est requis')
})

// Utilisation de VeeValidate
const { defineField, handleSubmit, errors, resetForm } = useForm({
  validationSchema: schema,
  initialValues: props.formData
})

// Liaison des champs
const [name] = defineField('name')
const [status] = defineField('status')
name.value = isNewWorkflow.value ? 'Nouveau Workflow' : props.formData.name
status.value = isNewWorkflow.value ? AgentWorkflowStatus.ACTIVE : props.formData.status

// Validation et soumission
const onSubmit = handleSubmit(async (values) => {
  if (isNewWorkflow.value) {
    mainStore.snackMessage = await workflowService.createWorkflow(values)

    isNewWorkflow.value = false
  } else if (workflow.value) {
    workflow.value.name = values?.name
    workflow.value.status = values?.status

    mainStore.snackMessage = await workflowService.updateWorkflow(workflow.value)
  }

  workflow.value = workflowStore.workflow
  emit('formSubmit', values)
})

watch(
  () => props.formData,
  () => {
    resetForm({ values: props.formData })
  }
)
</script>

<style scoped>
.test {
  display: block;
}
</style>

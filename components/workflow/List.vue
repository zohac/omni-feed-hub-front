<template>
  <v-row>
    <v-col>
      <h1>Gestion des Workflows</h1>
    </v-col>

    <v-col class="d-flex justify-end align-center">
      <v-btn color="primary" text="Créer un Workflow" @click="openCanvas" />
    </v-col>
  </v-row>

  <!-- Liste des workflows -->
  <v-row>
    <v-col>
      <v-data-table
        :headers="headers"
        :items="workflowStore.workflows"
        :items-per-page="10"
        class="data-table"
        item-value="id"
      >
        <template v-slot:item.actions="{ item }">
          <v-btn
            v-tooltip:top="'Modifier'"
            class="me-2"
            color="primary"
            density="comfortable"
            icon="mdi-pencil"
            @click="openUpdateWorkflow(item)"
          >
          </v-btn>
          <v-btn
            v-tooltip:top="'Supprimer'"
            color="error"
            density="comfortable"
            icon="mdi-delete"
            @click="confirmDeleteWorkflow(item)"
          >
          </v-btn>
        </template>
      </v-data-table>
    </v-col>
  </v-row>

  <!-- Canvas Workflow -->
  <WorkflowCanvas
    v-if="isOpen"
    :form="form"
    :is-new-workflow="isNewWorkflow"
    @close="closeCanvas"
  />

  <v-dialog v-model="confirmDialog.show" max-width="500px">
    <v-card>
      <v-card-title class="text-h6"> Confirmer la suppression</v-card-title>
      <v-card-text>
        Voulez-vous vraiment supprimer le Workflow
        <strong>{{ confirmDialog.workflow?.name }}</strong> ?
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="confirmDialog.show = false"> Annuler</v-btn>
        <v-btn color="error" @click="deleteConfirmedWorkflow"> Supprimer</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
// components/workflow/List.vue

import { ref } from 'vue'
import { WorkflowService } from '~/services/workflowService'
import { useWorkflowStore } from '~/stores/worflowStore'
import {
  CreateAgentWorkflowFormDto,
  UpdateAgentWorkflowFormDto
} from '~/types/dtos/forms/AgentWorkflowDto'
import type { AgentWorkflow } from '~/types/entities/AgentWorkflow'
import { AgentWorkflowStatus } from '~/types/enums/AgentWorkflowStatus'

const workflowStore = useWorkflowStore()
const isOpen = ref(false)
const isNewWorkflow = ref(true)
const confirmDialog = ref({
  show: false,
  workflow: null as AgentWorkflow | null
})
const form = ref<Partial<CreateAgentWorkflowFormDto | UpdateAgentWorkflowFormDto>>({
  name: '',
  status: AgentWorkflowStatus.ACTIVE
})

const headers = [
  { title: 'Name', align: 'start', key: 'name' },
  { title: 'Status', align: 'start', key: 'status' },
  { title: 'Actions', align: 'start', key: 'actions', sortable: false }
]

// Snackbar pour les notifications
const snackbar = ref({
  show: false,
  message: '',
  color: 'success'
})

const workflowService = new WorkflowService(workflowStore)

// Chargement des agents
onMounted(async () => {
  await workflowService.getAll()
})

const newWorkflow = () => {
  form.value = {
    name: '',
    status: AgentWorkflowStatus.ACTIVE
  }
  isNewWorkflow.value = true
  isOpen.value = true
}

const createWorkflow = async (values: CreateAgentWorkflowFormDto) => {
  const response = await workflowService.createWorkflow(values)

  for (const message of response.message) {
    showSnackbar(message, response.success ? 'success' : 'error')
  }

  isOpen.value = false
}

// Préparer la modification
const openUpdateWorkflow = async (item: AgentWorkflow) => {
  const workflow = await workflowService.getWorkflowById(item.id)

  if (!workflow) {
    showSnackbar('Workflow non trouvé', 'error')
  }

  form.value = {
    id: workflow!.id,
    name: workflow!.name,
    status: workflow!.status
  }
  isNewWorkflow.value = false
  isOpen.value = true
}

// mettre à jour un flux
const updateWorkflow = async (values: UpdateAgentWorkflowFormDto) => {
  const response = await workflowService.updateWorkflow(values)

  if (response.success) isOpen.value = false

  for (const message of response.message) {
    showSnackbar(message, response.success ? 'success' : 'error')
  }
}

// Supprimer un flux
const confirmDeleteWorkflow = (workflow: AgentWorkflow) => {
  confirmDialog.value = {
    show: true,
    workflow
  }
}

const deleteConfirmedWorkflow = async () => {
  if (!confirmDialog.value.workflow) {
    confirmDialog.value = { show: false, workflow: null }
    return
  }

  const response = await workflowService.deleteWorkflow(confirmDialog.value.workflow.id)

  for (const message of response.message) {
    showSnackbar(message, response.success ? 'success' : 'error')
  }

  // Réinitialisez le dialog
  confirmDialog.value = { show: false, workflow: null }
}

// Afficher les messages flash
const showSnackbar = (message: string, color: 'success' | 'error') => {
  snackbar.value.message = message
  snackbar.value.color = color
  snackbar.value.show = true
}

const openCanvas = () => {
  isNewWorkflow.value = true
  isOpen.value = true
}

const closeCanvas = () => {
  isOpen.value = false
}
</script>

<style scoped>
.data-table {
  border: 1px rgba(var(--v-border-color), var(--v-medium-emphasis-opacity)) solid;
  border-radius: 4px;
}
</style>

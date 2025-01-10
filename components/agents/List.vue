<template>
  <v-container>
    <!-- Header -->
    <v-row>
      <v-col>
        <h1>Gestion des Agents IA</h1>
      </v-col>
      <v-col class="d-flex justify-end align-center">
        <v-btn color="primary" @click="newAgent">Ajouter un Agent IA</v-btn>
      </v-col>
    </v-row>

    <!-- Liste des agents -->
    <v-row>
      <v-col>
        <v-data-table
          :headers="headers"
          :items="agents"
          :items-per-page="10"
          class="elevation-1"
          item-value="id"
          @update:options="agentStore.fetchAgents()"
        >
          <template v-slot:item.actions="{ item }">
            <v-btn
              v-tooltip:top="'Modifier'"
              class="me-2"
              color="primary"
              density="comfortable"
              icon="mdi-pencil"
              @click="updateAgent(item)"
            >
            </v-btn>
            <v-btn
              v-tooltip:top="'Supprimer'"
              color="error"
              density="comfortable"
              icon="mdi-delete"
              @click="deleteAgent(item)"
            >
            </v-btn>
          </template>
        </v-data-table>
      </v-col>
    </v-row>

    <!-- Formulaire dans un dialogue -->
    <v-dialog v-model="isOpen" class="d-flex align-center justify-center" max-width="600">
      <AgentsForm :form-data="form" :is-new-agent="isNewAgent" @form-submit="submitForm" />
    </v-dialog>

    <!-- Snackbar pour les messages -->
    <CoreAppSnackbar v-model="snackbar.show" :color="snackbar.color" :message="snackbar.message" />
  </v-container>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { useAgentStore } from '~/stores/agentStore'
import type { CreateAiAgentDto, UpdateAiAgentDto } from '~/types/dtos/AiAgentDto'
import type { AiAgent } from '~/types/entities/AiAgent'

const agentStore = useAgentStore()

// État local
const isOpen = ref(false)
const isNewAgent = ref(false)
const snackbar = ref({
  show: false,
  message: '',
  color: 'success'
})

// Entête pour le tableau
const headers = [
  { title: 'Nom', align: 'start', key: 'name' },
  { title: 'Fournisseur', align: 'start', key: 'provider' },
  { title: 'Rôle', align: 'start', key: 'role' },
  { title: 'Description', align: 'start', key: 'description' },
  { title: 'Actions', align: 'start', key: 'actions', sortable: false }
]

const form = ref<Partial<CreateAiAgentDto>>({
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
})

// Chargement des agents
const agents = ref<AiAgent[]>([])
onMounted(async () => {
  await fetchAgents()
})

const fetchAgents = async () => {
  await agentStore.fetchAgents()
  agents.value = agentStore.agents
}

// Actions de modification
const updateAgent = (agent: AiAgent) => {
  form.value = { ...agent }
  isOpen.value = true
  isNewAgent.value = false
}

// Action de suppression
const deleteAgent = async (agent: AiAgent) => {
  if (confirm('Voulez-vous vraiment supprimer cet agent ?')) {
    const response = await agentStore.deleteAgent(agent.id)

    for (const message of response.message) {
      showSnackbar(message, response.success ? 'success' : 'error')
    }
    await fetchAgents()
  }
}

// Créer un nouvel agent avec température par défaut
const newAgent = () => {
  form.value = {
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
  isOpen.value = true
  isNewAgent.value = true
}

// Soumission du formulaire
const submitForm = async (values: CreateAiAgentDto | UpdateAiAgentDto) => {
  let response
  if (isNewAgent.value) {
    response = await agentStore.createAgent(values as CreateAiAgentDto)
  } else if (isUpdateDto(values)) {
    const dto = removeIdFromUpdateAiAgentDto(values)
    const { id, ...configurationDto } = dto.configuration
    dto.configuration = configurationDto
    response = await agentStore.updateAgent(id, dto)
  } else {
    console.error('Le DTO pour la mise à jour est invalide.')
    return
  }

  for (const message of response.message) {
    showSnackbar(message, response.success ? 'success' : 'error')
  }
  if (response.success) {
    closeModal()
    await fetchAgents()
  }
}

function removeIdFromUpdateAiAgentDto(values: UpdateAiAgentDto): UpdateAiAgentDto {
  const { id, _actions, ...dto } = values

  return dto
}

// Type guard pour vérifier si l'objet est UpdateRssFeedDto
function isUpdateDto(dto: CreateAiAgentDto | UpdateAiAgentDto): dto is UpdateAiAgentDto {
  return 'id' in dto
}

// Afficher un message Snackbar
const showSnackbar = (message: string, color: 'success' | 'error') => {
  snackbar.value.message = message
  snackbar.value.color = color
  snackbar.value.show = true
}

// Fermer la modale
const closeModal = () => {
  isOpen.value = false
  form.value = {}
}
</script>

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

    <!-- Composant de détails -->
    <AgentsDetailsDrawer
      :agent="selectedAgent"
      :is-open="isOpen"
      @close="closeSidebar"
      @edit="updateAgent"
      @fetch-agents="fetchAgents"
    />
  </v-container>

  <!-- Snackbar pour les messages -->
  <CoreAppSnackbar v-model="snackbar.show" :color="snackbar.color" :message="snackbar.message" />
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { useAgentStore } from '~/stores/agentStore'
import type { AiAgent } from '~/types/entities/AiAgent' // État local

// État local
const agentStore = useAgentStore()
const isOpen = ref(false) // Contrôle de la barre latérale
const selectedAgent = ref<AiAgent | null>(null) // Agent sélectionné
const agents = ref<AiAgent[]>([])
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

// Chargement des agents
onMounted(async () => {
  await fetchAgents()
})

const fetchAgents = async () => {
  await agentStore.fetchAgents()
  agents.value = agentStore.agents
}

// Créer un nouvel agent avec température par défaut
const newAgent = () => {
  selectedAgent.value = null
  isOpen.value = true
}

// Actions de modification
const updateAgent = (agent: AiAgent) => {
  selectedAgent.value = agent
  isOpen.value = true
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

// Afficher un message Snackbar
const showSnackbar = (message: string, color: 'success' | 'error') => {
  snackbar.value.message = message
  snackbar.value.color = color
  snackbar.value.show = true
}

// Fermer la barre latérale
const closeSidebar = () => {
  isOpen.value = false
  selectedAgent.value = null
}
</script>

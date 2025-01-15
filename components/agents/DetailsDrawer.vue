<template>
  <v-navigation-drawer
    :model-value="localIsOpen"
    location="right"
    temporary
    width="900"
    @update:modelValue="updateIsOpen"
  >
    <div>
      <v-container>
        <v-row>
          <v-col class="d-flex justify-start">
            <h2 class="d-flex align-center">
              {{ isNewAgent ? 'Créer un nouvel Agent IA' : `Modifier l'Agent IA - ${agent?.name}` }}
            </h2>
          </v-col>
          <v-col class="d-flex justify-end">
            <v-btn
              v-tooltip:top="'Fermer'"
              icon="mdi-close"
              variant="outlined"
              @click="closeDrawer"
            ></v-btn>
          </v-col>
        </v-row>
      </v-container>

      <v-divider></v-divider>

      <AgentsForm :form-data="form" :is-new-agent="isNewAgent" @form-submit="submitForm" />
    </div>
  </v-navigation-drawer>

  <!-- Snackbar pour les messages -->
  <CoreAppSnackbar v-model="snackbar.show" :color="snackbar.color" :message="snackbar.message" />
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import { AiAgentService } from '~/services/AiAgentService'
import { useAgentStore } from '~/stores/agentStore'
import type { AiAgentDto } from '~/types/dtos/forms/AiAgentDto'
import type { AiAgent } from '~/types/entities/AiAgent' // Props

// Props
const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  },
  agent: {
    type: Object as () => AiAgent | null,
    required: false,
    default: null
  }
})

// Événements
const emits = defineEmits(['update:isOpen', 'edit', 'close', 'fetch-agents'])

// État local pour la barre latérale
const localIsOpen = ref(props.isOpen)
const agentStore = useAgentStore()
const isNewAgent = ref<boolean>(true)
const selectedAgent = ref<AiAgent | null>(props.agent)
const snackbar = ref({
  show: false,
  message: '',
  color: 'success'
})
const form = ref<Partial<AiAgentDto> | null>(null)
const agentService = new AiAgentService(agentStore)

// Soumission du formulaire
const submitForm = async (values: AiAgentDto) => {
  let response
  if (isNewAgent.value) {
    response = await agentService.createAgent(values)
  } else if (selectedAgent.value) {
    response = await agentService.updateAgent(selectedAgent.value.id, values)
  } else {
    console.error('Le DTO pour la mise à jour est invalide.')
    return
  }

  for (const message of response.message) {
    showSnackbar(message, response.success ? 'success' : 'error')
  }
  if (response.success) {
    closeDrawer()
    emits('fetch-agents')
  }
}

// Afficher un message Snackbar
const showSnackbar = (message: string, color: 'success' | 'error') => {
  snackbar.value.message = message
  snackbar.value.color = color
  snackbar.value.show = true
}

// Créer un nouvel agent avec température par défaut
const newAgent = () => {
  form.value = null
  selectedAgent.value = null
  isNewAgent.value = true
}

// Actions de modification
const updateAgent = (agent: AiAgent) => {
  form.value = { ...agent }
  selectedAgent.value = agent
  isNewAgent.value = false
}

// Émetteur pour mettre à jour la prop `isOpen`
const updateIsOpen = (value: boolean) => {
  emits('update:isOpen', value)
}

// Fermer la barre latérale
const closeDrawer = () => {
  localIsOpen.value = false
  emits('update:isOpen', false)
  emits('close')
}

// Synchronisation entre l'état local et la prop `isOpen`
watch(
  () => props.isOpen,
  (newVal) => {
    localIsOpen.value = newVal
  }
)

watch(
  () => props.agent,
  (agent) => {
    console.log(agent)
    newAgent()
    if (agent) updateAgent(agent)
  }
)
</script>

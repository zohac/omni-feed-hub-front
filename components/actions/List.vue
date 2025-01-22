<template>
  <v-container>
    <!-- Header -->
    <v-row>
      <v-col>
        <h1>Gestion des Actions réalisable par un action IA</h1>
      </v-col>
      <v-col class="d-flex justify-end align-center">
        <v-btn color="primary" @click="newAction">Ajouter une Action</v-btn>
      </v-col>
    </v-row>

    <!-- Liste des actions -->
    <v-row>
      <v-col>
        <v-data-table
          :headers="headers"
          :items="actions"
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
              @click="updateAction(item)"
            >
            </v-btn>
            <v-btn
              v-tooltip:top="'Supprimer'"
              color="error"
              density="comfortable"
              icon="mdi-delete"
              @click="deleteAction(item)"
            >
            </v-btn>
          </template>
        </v-data-table>
      </v-col>
    </v-row>

    <!-- Formulaire dans un dialogue -->
    <v-dialog v-model="isOpen" class="d-flex align-center justify-center" max-width="600">
      <ActionsForm :form-data="form" :is-new-action="isNewAction" @form-submit="submitForm" />
    </v-dialog>

    <!-- Snackbar pour les messages -->
    <CoreAppSnackbar v-model="snackbar.show" :color="snackbar.color" :message="snackbar.message" />
  </v-container>
</template>

<script lang="ts" setup>
// components/actions/List.vue

import { onMounted, ref } from 'vue'
import { useActionStore } from '~/stores/actionStore'
import type { CreateActionDto, UpdateActionDto } from '~/types/dtos/ActionDto'
import type { Action } from '~/types/entities/Action'
import { ActionType } from '~/types/enums/ActionType'

const actionStore = useActionStore()

// État local
const isOpen = ref(false)
const isNewAction = ref(false)
const snackbar = ref({
  show: false,
  message: '',
  color: 'success'
})

// Entête pour le tableau
const headers = [
  { title: 'Nom', align: 'start', key: 'name' },
  { title: 'Type', align: 'start', key: 'type' },
  { title: 'Actions', align: 'start', key: 'actions', sortable: false }
]

const form = ref<Partial<CreateActionDto | UpdateActionDto>>({
  name: '',
  type: ActionType.ASSIGN_TO_COLLECTION
})

// Chargement des actions
const actions = ref<Action[]>([])
onMounted(async () => {
  await fetchActions()
})

const fetchActions = async () => {
  await actionStore.fetchActions()
  actions.value = actionStore.actions
}

// Utilisez actionTypes.find() pour trouver le type correspondant
const updateAction = (action: Action) => {
  form.value = {
    id: action.id,
    name: action.name || '',
    type: action.type,
    collectionId: action.parameters?.collection?.id || null
  }

  console.log('form.type après initialisation :', form.value.type)
  isOpen.value = true
  isNewAction.value = false
}

// Action de suppression
const deleteAction = async (action: Action) => {
  if (confirm('Voulez-vous vraiment supprimer cet action ?')) {
    const response = await actionStore.deleteAction(action.id)

    for (const message of response.message) {
      showSnackbar(message, response.success ? 'success' : 'error')
    }
    await fetchActions()
  }
}

// Créer un nouvel action
const newAction = () => {
  form.value = {
    name: '',
    type: ActionType.ASSIGN_TO_COLLECTION
  }
  isOpen.value = true
  isNewAction.value = true
}

// Soumission du formulaire
const submitForm = async (values: CreateActionDto | UpdateActionDto) => {
  let response
  if (isNewAction.value) {
    response = await actionStore.createAction(values as CreateActionDto)
  } else if (isUpdateDto(values)) {
    const { id, ...dto } = values
    response = await actionStore.updateAction(id!, dto)
  } else {
    console.error('Le DTO pour la mise à jour est invalide.')
    return
  }

  for (const message of response.message) {
    showSnackbar(message, response.success ? 'success' : 'error')
  }
  if (response.success) {
    closeModal()
    await fetchActions()
  }
}

// Type guard pour vérifier si l'objet est UpdateRssFeedDto
function isUpdateDto(dto: CreateActionDto | UpdateActionDto): dto is UpdateActionDto {
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

<style scoped>
.data-table {
  border: 1px rgba(var(--v-border-color), var(--v-medium-emphasis-opacity)) solid;
  border-radius: 4px;
}
</style>

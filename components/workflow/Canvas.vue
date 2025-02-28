<template>
  <div class="workflow-canvas-container">
    <!-- Header avec bouton de fermeture -->
    <v-row align="center" class="canvas-header" justify="space-between">
      <WorkflowForm :form-data="form" :new-workflow="isNewWorkflow" />
      <v-btn
        v-tooltip:left="'Fermer le canvas'"
        icon="mdi-close"
        size="small"
        variant="outlined"
        @click="closeCanvas"
      ></v-btn>
    </v-row>

    <div class="d-flex m-0" style="height: calc(100% - 62px)">
      <WorkflowSidebar />

      <!-- Barre latérale dynamique pour la configuration -->
      <v-card v-if="isConfigPanelOpen" class="config-panel elevation-2">
        <v-toolbar>
          <v-toolbar-title>Configuration de l'étape</v-toolbar-title>
          <v-spacer />
          <v-btn icon="mdi-close" @click="closeConfigPanel" />
        </v-toolbar>
        <v-divider />
        <v-container>
          <template v-if="selectedNode">
            <v-text-field
              v-model="selectedNode.data.label"
              density="compact"
              label="Nom de l'étape"
              variant="outlined"
            />
            <v-select
              v-model="selectedNode.data.stepType"
              :items="['test type']"
              density="compact"
              label="Type d'étape"
              variant="outlined"
            />
            <v-textarea
              v-model="selectedNode.data.inputData"
              density="compact"
              label="Données d'entrée"
              variant="outlined"
            />
          </template>
          <template>
            <p>Aucune étape sélectionnée.</p>
          </template>
        </v-container>
      </v-card>

      <!-- Canvas Vue Flow -->
      <div class="canvas-workflow canvas-area" @drop="onDrop" @dragover.prevent>
        <VueFlow
          :edges="edges"
          :nodes="nodes"
          class="basic-flow"
          fit-view-on-init
          @node-click="onNodeClick"
        >
          <template #node-value="props">
            <ValueNode :id="props.id" :data="props.data" />
          </template>
          <WorkflowDropzoneBackground
            :style="{
              backgroundColor: isDragOver ? '#e7f3ff' : 'transparent',
              transition: 'background-color 0.2s ease'
            }"
          />
          <p v-if="isDragOver">Drop here</p>
        </VueFlow>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import '@vue-flow/core/dist/style.css'
import '@vue-flow/core/dist/theme-default.css'
import { Position, useVueFlow, VueFlow } from '@vue-flow/core'
import useDragAndDrop from '~/composables/useDnD'

const { onConnect, addEdges } = useVueFlow()

onConnect(addEdges)

defineProps({
  isNewWorkflow: Boolean,
  form: {
    type: Object,
    required: true
  }
})

const nodes = [
  {
    id: '1',
    type: 'input',
    position: { x: 0, y: 0 },
    data: { label: 'Start Node' },
    sourcePosition: Position.Right,
    targetPosition: Position.Left
  },
  {
    id: '2',
    type: 'output',
    position: { x: 250, y: 0 },
    data: { label: 'End Node' },
    sourcePosition: Position.Right,
    targetPosition: Position.Left
  }
]

const edges = [{ id: 'e1-2', source: '1', target: '2', animated: false }]

const { onDragOver, onDrop, onDragLeave, isDragOver } = useDragAndDrop()

const emit = defineEmits(['close'])

// Gestion de la configuration
const isConfigPanelOpen = ref(false)
const selectedNode = ref<object | null>(null)

const onNodeClick = (nodeClick: any) => {
  console.log('Node clicked:', nodeClick)
  selectedNode.value = nodeClick.node
  isConfigPanelOpen.value = true
}

const closeCanvas = () => {
  // Émet un événement pour fermer le canvas
  emit('close')
}

const closeConfigPanel = () => {
  selectedNode.value = null
  isConfigPanelOpen.value = false
}
</script>

<style scoped>
.workflow-canvas-container {
  position: fixed;
  top: 10px;
  left: 10px;
  width: calc(100vw - 40px);
  height: calc(100vh - 20px);
  background: white;
  z-index: 1500;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  border: 1px rgba(var(--v-border-color), var(--v-medium-emphasis-opacity)) solid;
  border-radius: 4px;
  max-width: calc(100vw - 40px);
  overflow: hidden;
  margin: 0 auto;
}

.canvas-header {
  margin: 0;
  padding: 16px;
  background-color: rgb(var(--v-theme-surface-light));
  border-bottom: 1px solid #ddd;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
}

.canvas-workflow {
  width: 100%;
}

.config-panel {
  position: absolute;
  z-index: 1600;
  height: 100%;
  width: 400px;
  background-color: rgb(var(--v-theme-surface));
}
</style>

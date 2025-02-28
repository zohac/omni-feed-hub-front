<template>
  <aside>
    <h3>Étapes disponibles</h3>

    <div class="steps-list">
      <div
        v-for="step in steps"
        :key="step.id"
        :draggable="true"
        class="vue-flow__node-default custom-node"
        @dragstart="onDragStart($event, step.type)"
      >
        {{ step.label }}
      </div>
    </div>
  </aside>
</template>

<script setup>
import useDragAndDrop from '~/composables/useDnD'
import { Position } from '@vue-flow/core'

const { onDragStart } = useDragAndDrop()

const steps = [
  {
    id: 'step-1',
    label: 'Start Step',
    type: 'input',
    sourcePosition: Position.Right,
    targetPosition: Position.Left
  },
  {
    id: 'step-2',
    label: 'Default Step',
    type: 'default',
    sourcePosition: Position.Right,
    targetPosition: Position.Left
  },
  {
    id: 'step-3',
    label: 'End Step',
    type: 'output',
    sourcePosition: Position.Right,
    targetPosition: Position.Left
  }
]
</script>

<style scoped>
aside {
  font-weight: 700;
  border-right: 1px solid #eee;
  padding: 15px 10px;
  font-size: 12px;
  height: 100%;
  width: 300px;
  color: rgb(var(--v-theme-on-surface-light));
  background: rgb(var(--v-theme-surface-light));
}

h3 {
  margin-bottom: 10px;
}

.custom-node {
  margin-bottom: 10px;
  width: 100%;
}
</style>

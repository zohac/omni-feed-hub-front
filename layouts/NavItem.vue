<template>
  <UVerticalNavigation :links="navigation" />
</template>

<script setup lang="ts">
import {useNavigation} from "~/composables/useNavigation";

const { navigation } = useNavigation()
</script>
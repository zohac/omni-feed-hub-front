<template>
  <div class="mb-10">
    <h1>Gestion des Flux RSS</h1>
  </div>

  <!-- Formulaire de création -->
  <div class="mb-10">
    <UButton label="Nouveau Flux Rss" @click="newFeed" />

    <UModal v-model="isOpen">
      <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100' }">
        <template #header>
          <h2 class="text-xl font-semibold">Ajouter un nouveau flux</h2>
        </template>

        <UForm :state="form" class="space-y-4" @submit="submitForm">

          <UFormGroup label="Titre" name="title">
            <UInput v-model="form.title" />
          </UFormGroup>

          <UFormGroup label="URL" name="url">
            <UInput v-model="form.url" />
          </UFormGroup>

          <UFormGroup label="Description" name="description">
            <UInput v-model="form.description"  />
          </UFormGroup>

          <UButton type="submit" label="Envoyer" />
        </UForm>
      </UCard>
    </UModal>
  </div>

  <div>
    <UTable :rows="feedStore.feeds" :columns="columns">
      <template #actions-data="{ row }">
        <UDropdown :items="items(row)">
          <UButton color="gray" variant="ghost" icon="i-heroicons-ellipsis-horizontal-20-solid" />
        </UDropdown>
      </template>
    </UTable>
  </div>
</template>

<script setup lang="ts">
import {useFeedStore} from "~/stores/feedStore";
import {CreateRssFeedDto, UpdateRssFeedDto} from "~/types/rssFeed";

const feedStore = useFeedStore()
const isOpen = ref(false)
const isNewFeed = ref(false)

const form = ref<CreateRssFeedDto>({
  title: '',
  url: '',
  description: '',
  collectionId: undefined
})

const columns = [
  {
    key: 'id',
    label: 'id'
  },
  {
    key: 'title',
    label: 'Title'
  },
  {
    key: 'url',
    label: 'URL'
  },
  {
    key: 'description',
    label: 'Description'
  },
  {
    key: 'collectionId',
    label: 'Collection'
  },
  {
    key: 'actions'
  }
];

const items = row => [
  [{
    label: 'Edit',
    icon: 'i-heroicons-pencil-square-20-solid',
    click: () => editFeed(row.id)
  }],
  [{
    label: 'Delete',
    icon: 'i-heroicons-trash-20-solid',
    click: () => deleteFeed(row.id)
  }],
];

// Charger les flux au montage du composant
await useAsyncData('feeds', () => feedStore.fetchFeeds())

// Créer un nouveau flux
const submitForm = () => {
  console.log(form.value)
  if (form.value.title && form.value.url) {
    if (isNewFeed.value) {
      feedStore.createFeed(form.value)
    }else  {
      const id = form.value.id
      const feed: UpdateRssFeedDto = {
        title: form.value.title,
        url: form.value.url,
        description: form.value.description,
      }

      feedStore.updateFeed(id, feed)
    }
  }

  isOpen.value = false
  form.value = { title: '', url: '', description: '', collectionId: undefined }
}

// Supprimer un flux
const deleteFeed = (id: number) => {
  if (confirm('Voulez-vous vraiment supprimer ce flux ?')) {
    feedStore.deleteFeed(id)
  }
}

// Préparer la modification (fonction à compléter)
const editFeed = (feedId: number) => {
  const feed = feedStore.feeds.find((feed) => feed.id === feedId);
  form.value = { ...feed }
  isOpen.value = true
  isNewFeed.value = false
}

const newFeed = () => {
  const emptyForm = {
    title: '',
    url: '',
    description: '',
    collectionId: undefined
  }
  form.value = { ...emptyForm }
  isOpen.value = true
  isNewFeed.value = true
}
</script>

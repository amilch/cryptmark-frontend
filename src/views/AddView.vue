<script setup>
import {computed, onMounted, ref, watch} from 'vue'
import store from '@/store/index'
import router from '@/router/index'
import { useRoute } from "vue-router"
import { urlUtils } from '@/utils'

const route = useRoute()

const dialog = ref(true)
const bookmark = ref(null)
const loading = ref(false)

const hasPendingChanges = computed(() => !bookmark.value ||
    url.value !== bookmark.value.url || title.value !== bookmark.value.title)

onMounted(() => {
    if (!!route.params.id) {
        bookmark.value = store.getters.bookmark(parseInt(route.params.id))
        url.value = bookmark.value.url
        title.value = bookmark.value.title
    }
})

async function handleForm() {
    loading.value = true
    if (!!bookmark.value) {
        await store.actions.editBookmark({
            id: bookmark.value.id,
            title: title.value,
            url: url.value,
        })
    } else {
        await store.actions.addBookmark({url: url.value, title: title.value})
    }
    loading.value = false
}

function abort() {
    dialog.value = false
    router.back()
}
</script>

<template>
  <div class="modal" tabindex="-1">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Modal title</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <p>Modal body text goes here.</p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          <button type="button" class="btn btn-primary">Save changes</button>
        </div>
      </div>
    </div>
  </div>
        <v-card>
            <template v-slot:title>{{ bookmark ? 'Edit' : 'New' }} Bookmark</template>
            <template v-slot:append>
                <v-btn density="compact" icon="$close" variant="plain" @click="abort"/>
            </template>
            <v-divider style="margin-top:14px"/>
            <v-form class="px-6 py-8" v-model="form" @submit.prevent="handleForm">
                <v-text-field v-model="url" :rules="[rules.required, rules.isURL]"
                              autofocus class="mb-2" clearable label="URL"/>
                <v-text-field v-model="title" class="mb-2" clearable label="Title (Optional)"/>
                <div class="text-end">
                    <v-btn type="submit" :loading="loading" :disabled="!form || !hasPendingChanges" size="large" variant="tonal">Save
                    </v-btn>
                </div>
            </v-form>
        </v-card>
</template>



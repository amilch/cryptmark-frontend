<script setup>
import {computed, onMounted, ref, watch} from 'vue'
import store from '@/store/index'
import router from '@/router/index'
import isURL from "validator/es/lib/isURL"
import {useRoute} from "vue-router";

const route = useRoute()

const url = ref('')
const title = ref('')
const rules = ref({
    required: value => !!value || 'Field is required',
    isURL: value => isURL(value) || 'No valid URL',
})
const form = ref(false)
const dialog = ref(true)
const bookmark = ref(null)

const hasPendingChanges = computed(() => !bookmark.value ||
    url.value !== bookmark.value.url || title.value !== bookmark.value.title)

onMounted(() => {
    if (!!route.params.id) {
        bookmark.value = store.getters.bookmark(parseInt(route.params.id))
        url.value = bookmark.value.url
        title.value = bookmark.value.title
    }
})

function handleForm() {
    if (!!bookmark.value) {
        store.actions.edit({
            id: bookmark.value.id,
            title: title.value,
            url: url.value,
        })
    } else {
        store.actions.add({url: url.value, title: title.value})
    }
}

function abort() {
    dialog.value = false
    router.back()
}
</script>

<template>
    <v-dialog persistent v-model="dialog" max-width="960">
        {{ hasPendingChanges }}
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
                    <v-btn type="submit" :disabled="!form || !hasPendingChanges" size="large" variant="tonal">Save
                    </v-btn>
                </div>
            </v-form>
        </v-card>
    </v-dialog>
</template>



<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import store from '@/store/index'
import router from '@/router/index'
import { useRoute } from 'vue-router'
import { urlUtils } from '@/utils'
import Modal from '@/components/Modal.vue'
import { Form } from 'vee-validate'
import FormField from '@/components/FormField.vue'
import Button from '@/components/Button.vue'
import * as yup from 'yup'

const route = useRoute()

const bookmark = ref(null)
const loading = ref(false)

const schema = yup.object({
  url: yup.string().required('URL is required').test('isURL', 'Not a valid url', urlUtils.isURL),
  title: yup.string()
})

onMounted(async () => {
  if (!!route.params.id) {
    if (!store.state.bookmarks) {
      await store.actions.getAllBookmarks()
    }
    bookmark.value = store.getters.bookmark(parseInt(route.params.id))
  }
})

async function onSubmit(values) {
  loading.value = true
  if (!!bookmark.value) {
    await store.actions.editBookmark({
      id: bookmark.value.id,
      title: values.title,
      url: values.url
    })
  } else {
    await store.actions.addBookmark({ url: values.url, title: values.title })
  }
  loading.value = false
}

function onAbort() {
  router.back()
}
</script>

<template>
  <Form @submit="onSubmit" :validation-schema="schema" v-slot="{ meta }" :initial-values="bookmark">
    <Modal ref="modal" :title="(bookmark ? 'Edit' : 'New') + ' Bookmark'">
      <FormField name="url" autofocus label="URL" />
      <FormField name="title" label="Title" />
      <template v-slot:footer>
        <button type="button" class="btn btn-link text-decoration-none" @click="onAbort">
          Discard
        </button>
        <Button
          type="submit"
          class="btn btn-light"
          :loading="loading"
          :disabled="!meta.dirty || !meta.valid"
          text="Save"
        />
      </template>
    </Modal>
  </Form>
</template>

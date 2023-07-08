<script setup>
import store from '@/store/index'
import router from '@/router/index'
import Bookmark from '@/components/Bookmark.vue'

function visitBookmark(bookmark, _) {
  store.actions.visitBookmark(bookmark)
}

function editBookmark(bookmark, event) {
  event.stopPropagation()
  router.push(`/edit/${bookmark.id}`)
}

function deleteBookmark(bookmark, event) {
  event.stopPropagation()
  store.actions.removeBookmark(bookmark)
}

await store.actions.getAllBookmarks()
</script>

<template>
  <v-list lines="two">
    <Bookmark
      v-for="[_, bookmark] in store.state.bookmarks"
      :bookmark="bookmark"
      :on-visit="visitBookmark"
      :on-edit="editBookmark"
      :on-delete="deleteBookmark"
    />
  </v-list>
</template>

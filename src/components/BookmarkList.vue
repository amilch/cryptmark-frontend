<script setup>
import store from '@/store/index'
import router from '@/router/index'
import Bookmark from '@/components/Bookmark.vue'

await store.actions.getAllBookmarks()
</script>

<template>
  <ul class="list-group">
    <Bookmark
      v-for="[_, bookmark] in store.state.bookmarks"
      :bookmark="bookmark"
      :on-visit="(b) => store.actions.visitBookmark(b)"
      :on-edit="(b) => router.push(`/edit/${b.id}`)"
      :on-delete="(b) => store.actions.removeBookmark(b)"
    />
  </ul>
</template>

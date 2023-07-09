<script setup>
import { computed, ref } from 'vue'
import store from '../store/index'
import BookmarkList from '../components/BookmarkList.vue'
import Spinner from "@/components/Spinner.vue";

const title = computed(() => {
  if (!!store.state.bookmarks && store.state.bookmarks.length > 0) {
    return `Bookmarks (${store.state.bookmarks.length})`
  } else {
    return 'Bookmarks'
  }
})
</script>

<template>
  <div class="row justify-content-center">
    <div class="col-md-9 pa-4">
      <header class="d-flex align-items-center mb-8">
        <h1 class="flex-grow-1">{{ title }}</h1>
        <button class="btn btn-light btn-lg" @click="$router.push('/add')">
          <span class="mdi mdi-plus"></span>
          New
        </button>
      </header>
      <Suspense>
        <BookmarkList />
        <template #fallback>
          <Spinner />
        </template>
      </Suspense>
    </div>
  </div>
</template>

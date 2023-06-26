<script setup>
import {ref} from 'vue'
import store from '../store/index'
import BookmarkList from '../components/BookmarkList.vue'

</script>

<template>
    <h1>All bookmarks</h1>
    <router-link to="/add">Add Bookmark</router-link>
    <Suspense>
        <BookmarkList />
        <template #fallback>Loading...</template>
    </Suspense>
    <div class="row justify-content-center">
    </div>
</template>



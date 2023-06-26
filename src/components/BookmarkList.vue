<template>
    <ul>
        <li v-for="bookmark in store.state.bookmarks">
            {{ bookmark }}
        </li>
    </ul>
</template>

<script setup>
import store from "../store/index";

await store.actions.getAll()
</script>
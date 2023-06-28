<script setup>
import store from "@/store/index";
import router from "@/router/index";

function visitBookmark(bookmark) {
    window.open(bookmark.url, '_blank')
}

function editBookmark(bookmark, event) {
    event.stopPropagation()
    router.push(`/edit/${bookmark.id}`)
}

function deleteBookmark(bookmark, event) {
    event.stopPropagation()
    store.actions.remove(bookmark)
}

await store.actions.getAll()
</script>

<template>
    <v-list lines="two">
        <v-list-item
                v-for="[_, bookmark] in store.state.bookmarks"
                class="py-2"
                :key="bookmark.id"
                :value="bookmark"
                :title="bookmark.title ? bookmark.title : bookmark.url"
                :subtitle="bookmark.title ? bookmark.url : ''"
                @click="visitBookmark(bookmark)"
        >
            <template v-slot:append>
                <v-btn
                        @click.native.capture="editBookmark(bookmark, $event)"
                        icon="mdi-pencil"
                        variant="plain"/>
                <v-btn
                        @click.native.capture="deleteBookmark(bookmark, $event)"
                        icon="mdi-delete"
                        variant="plain"/>
            </template>
        </v-list-item>
    </v-list>
</template>

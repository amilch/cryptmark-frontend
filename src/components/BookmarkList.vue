<template>
    <v-row dense>
        <v-col cols="12" v-for="bookmark in store.state.bookmarks">
            <v-card>
                <v-card-title>{{ bookmark.title }}</v-card-title>
                <v-card-text>{{ bookmark.url }}</v-card-text>
                <v-card-actions>
                    <v-btn variant="text">Edit</v-btn>
                </v-card-actions>
            </v-card>
        </v-col>
    </v-row>
</template>

<script setup>
import store from "../store/index";

await store.actions.getAll()
</script>
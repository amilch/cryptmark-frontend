<script setup>
import {computed, ref} from 'vue'
import store from '../store/index'
import BookmarkList from '../components/BookmarkList.vue'

const title = computed(() => {
    if (!!store.state.bookmarks && store.state.bookmarks.length > 0) {
        return `Bookmarks (${store.state.bookmarks.length})`
    } else {
        return 'Bookmarks'
    }
})

</script>

<template>
    <v-row justify="center" class="pa-4">
        <v-col cols="12" md="9">
            <v-row class="mb-8 align-center">
                <v-col>
                    <h1>{{ title }}</h1>
                </v-col>
                <v-col cols="auto">
                    <v-btn to="/add" size="large" prepend-icon="mdi-plus">New</v-btn>
                </v-col>
            </v-row>
            <div>
                <Suspense>
                    <BookmarkList/>
                    <template #fallback>
                        <v-progress-circular indeterminate/>
                    </template>
                </Suspense>
            </div>

        </v-col>
    </v-row>
</template>



<script setup>
import {computed, ref} from 'vue'
import store from '../store/index'
import BookmarkList from '../components/BookmarkList.vue'

const title = computed(() => {
    const l = store.state.bookmarks.length
    return l != 0 ? `Bookmarks (${l})` : 'Bookmarks'
})

</script>

<template>
    <v-row justify="center" class="pa-4">
        <v-col cols="12" md="9">
            <v-row>
                <v-col>
                    <h1>{{ title }}</h1>
                </v-col>
                <v-spacer/>
                <v-col cols="auto">
                    <v-btn to="/add" size="large">Add</v-btn>
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



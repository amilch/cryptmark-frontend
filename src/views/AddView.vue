<script setup>
 import { ref } from 'vue'
 import store from '@/store/index'
 import router from '@/router/index'

 const url = ref('')
 const title = ref('')
 const rules = ref({
     required: value => !!value || 'Field is required',
 })
 const form = ref(false)
 const dialog = ref(true)

 function add() {
     store.actions.add(title.value, url.value)
 }
 function abort() {
     dialog.value = false
     router.back()
 }
</script>

<template>
    <v-dialog persistent v-model="dialog" max-width="960">
        <v-card>
            <v-card-text>
                <v-container>
                    <h1 class="mb-8">Add bookmark</h1>
                    <v-form v-model="form" @submit.prevent="" action="#">
                        <v-text-field v-model="title" class="mb-2" clearable label="Title"/>
                        <v-text-field v-model="url" :rules="[rules.required]" class="mb-2" clearable label="URL"/>
                        <v-row justify="end">
                            <v-col cols="auto">
                                <v-btn @click="add()" :disabled="!form" size="large" variant="tonal">Add</v-btn>
                                <v-btn @click="abort()" size="large" variant="plain">Abort</v-btn>
                            </v-col>
                        </v-row>
                    </v-form>
                </v-container>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>



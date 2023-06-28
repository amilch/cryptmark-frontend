<script setup>
import {computed, onMounted, ref} from 'vue'
import store from '@/store/index'
import router from '@/router/index'
import {useRoute} from "vue-router";

const route = useRoute()

const username = ref('')
const password = ref('')
const password2 = ref('')

const showPassword = ref(false)
const rules = ref({
    required: value => !!value || 'Field is required',
    min: value => !isSigningUp.value || value.length >= 8 || 'Min 8 characters',
    matches: value => value === password.value || 'Passwords have to match',
})
const formModel = ref(false)
const formRef = ref(null)
const loading = ref(false)

const isSigningUp = computed(() => route.path === '/signup')

async function handleForm() {
    loading.value = true
    if (!isSigningUp.value) {
        await store.actions.authenticate(username.value, password.value)
    } else {
        await store.actions.signup(username.value, password.value)
    }
    loading.value = false
}

async function changeToSignUp() {
    await router.replace('/signup')
    if (password.value.length != 0) {
        formRef.value.validate()
    }
}
</script>

<template>
    <v-row justify="center">
        <v-col cols="12" md="4">
            <header class="py-8">
                <h1 class="text-center">{{ !!isSigningUp ? 'Sign Up' : 'Log In' }}</h1>
                <p class="text-center" v-if="!isSigningUp">or sign up for a new account</p>
            </header>
            <v-alert v-if="!!store.state.error" variant="tonal" class="ma-4" color="error" :text="store.state.error" />
            <v-form @submit.prevent="handleForm"
                    v-model="formModel"
                    ref="formRef"
                    class="pa-4">
                <v-text-field
                        autofocus
                        v-model="username"
                        :rules="[rules.required]"
                        class="mb-2"
                        label="Username"/>
                <v-text-field
                        v-model="password"
                        :rules="[rules.required, rules.min]"
                        :type="showPassword ? 'text' : 'password'"
                        label="Enter your password"
                        :hide-details="!!isSigningUp ? false : 'auto'"
                        :class="!!isSigningUp ? 'mb-2' : ''"/>
                <v-text-field
                        v-if="!!isSigningUp"
                        v-model="password2"
                        :rules="[rules.required, rules.matches]"
                        :type="showPassword ? 'text' : 'password'"
                        label="Repeat your password"
                        placeholder="Repeat your password"/>
                <v-checkbox
                        v-model="showPassword"
                        :label="!!isSigningUp ? 'Show passwords' : 'Show password'"
                />

                <template v-if="!isSigningUp">
                    <v-row justify="center">
                        <v-col cols="auto">
                            <v-btn type="submit" :loading="loading" :disabled="!formModel" size="large">
                                Log In
                            </v-btn>
                        </v-col>
                    </v-row>
                    <v-row justify="center">
                        <v-col cols="auto">
                            <v-btn @click="changeToSignUp()" class="text-none" variant="plain">
                                No account? Sign up instead
                            </v-btn>
                        </v-col>
                    </v-row>
                </template>
                <template v-else>
                    <v-row justify="center">
                        <v-col cols="auto">
                            <v-btn type="submit" :loading="loading" :disabled="!formModel" size="large">
                                Sign Up
                            </v-btn>
                        </v-col>
                    </v-row>
                </template>
            </v-form>
        </v-col>
    </v-row>
</template>



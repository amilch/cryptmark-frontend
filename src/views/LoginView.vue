<script setup>
import { computed, ref } from 'vue'
import store from '@/store/index'
import router from '@/router/index'
import { useRoute } from 'vue-router'
import * as yup from 'yup'
import { Field, Form } from 'vee-validate'
import FormField from '@/components/FormField.vue'
import FormCheck from '@/components/FormCheck.vue'
import Button from '@/components/Button.vue'

const route = useRoute()

const showPassword = ref(false)
const loading = ref(false)

const schema = yup.object({
  username: yup.string().required('Username is required'),
  password: yup
    .string()
    .required('Password is required')
    .min(8, 'Password must contain at least 8 characters'),
  password2: yup.string().oneOf([yup.ref('password')], 'Passwords must match')
})

const isSigningUp = computed(() => route.path === '/signup')

async function onSubmit(values) {
  loading.value = true
  if (!isSigningUp.value) {
    await store.actions.authenticate(values.username, values.password)
  } else {
    await store.actions.signup(values.username, values.password)
  }
  loading.value = false
}

async function changeToSignUp() {
  await router.replace('/signup')
}

async function changeToLogIn() {
  await router.replace('/login')
}
</script>

<template>
  <div class="row justify-content-center">
    <div class="col-xl-4">
      <header class="py-5">
        <h1 class="text-center">{{ !!isSigningUp ? 'Sign Up' : 'Log In' }}</h1>
        <p class="text-center mb-0" v-if="!isSigningUp">or sign up for a new account</p>
      </header>

      <div v-if="!!store.state.error" class="alert alert-danger" role="alert">
        {{ store.state.error }}
      </div>

      <Form @submit="onSubmit" :validation-schema="schema" v-slot="{ meta }" >
        <FormField name="username" label="Username" autofocus />
        <FormField name="password" label="Password" :type="showPassword ? 'text' : 'password'" />
        <FormField
          name="password2"
          label="Repeat your password"
          :type="showPassword ? 'text' : 'password'"
          v-if="!!isSigningUp"
        />
        <FormCheck v-model="showPassword" label="Show password" />

        <div class="text-center">
          <Button
            type="submit"
            class="btn btn-light btn-lg my-4"
            :disabled="!meta.valid"
            :text="!isSigningUp ? 'Log In' : 'Sign Up'"
            :loading="loading"
          />
          <div>
            <button @click="changeToSignUp()" class="btn btn-link" v-if="!isSigningUp">
              No account? Sign up instead
            </button>
            <button @click="changeToLogIn()" class="btn btn-link" v-else>
              Log in with existing account instead
            </button>
          </div>
        </div>
      </Form>
    </div>
  </div>
</template>

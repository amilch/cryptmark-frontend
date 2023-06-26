<script setup>
 import { ref } from 'vue'
 import store from '../store/index'

 const username = ref('')
 const password = ref('')

 function login() {
     store.actions.authenticate(username.value, password.value)
 }
 function register() {
     store.actions.register(username.value, password.value)
 }
</script>

<template>
  <div class="row justify-content-center">
    <form @submit.prevent="" action="#" class="col-sm-4">
      <div class="mb-3">
        <label for="inputUsername" class="form-label">Username</label>
        <input v-model="username" type="text" class="form-control" id="inputUsername">
      </div>
      <div class="mb-3">
          <label for="inputPassword" class="form-label">Password</label>
          <input v-model="password" type="password" class="form-control" id="inputPassword">
      </div>
      <button @click="login()" type="submit" class="btn btn-primary">Log In</button>
      <button @click="register()" type="submit" class="btn btn-secondary">Register</button>
    </form>
  </div>
</template>



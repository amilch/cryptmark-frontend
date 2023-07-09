<script setup>
import store from '@/store'
</script>

<template>
  <nav class="navbar navbar-expand-lg bg-body-secondary mb-4">
    <div class="container-fluid mx-1 align-items-center">
      <a class="navbar-brand" href="/">Cryptmark</a>
      <div v-if="store.getters.isLoggedIn()">
        Welcome {{ store.getters.username() }}
      </div>
      <ul class="navbar-nav d-flex flex-row small">
        <template v-if="!store.getters.isLoggedIn()">
          <li class="nav-item me-4">
            <button
              class="btn btn-link btn-sm text-decoration-none"
              @click="$router.push('/login')"
            >
              LOG IN
            </button>
          </li>
          <li class="nav-item">
            <button
              class="btn btn-link btn-sm text-decoration-none"
              @click="$router.push('/signup')"
            >
              SIGN UP
            </button>
          </li>
        </template>
        <template v-else>
          <li class="nav-item">
            <button class="btn btn-link btn-sm text-decoration-none" @click="store.actions.logout">
              LOG OUT
            </button>
          </li>
        </template>
      </ul>
    </div>
  </nav>
</template>

<style scoped></style>

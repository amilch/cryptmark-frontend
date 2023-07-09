<script setup>
import {RouterLink, RouterView} from 'vue-router'
import store from './store/index.js'
</script>

<template>
  <nav class="navbar navbar-expand-lg bg-body-tertiary">
    <div class="container-fluid">
      <a class="navbar-brand" href="/">Cryptmark</a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarText">
        <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
          <template v-if="!store.getters.isLoggedIn()">
            <li class="nav-item">
              <router-link class="nav-link" to="/login">LOG IN</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/signup">SIGN UP</router-link>
            </li>
          </template>
          <template v-else>
            <li class="nav-item">
              <a class="nav-link" @click="store.actions.logout" href="#">LOG OUT</a>
            </li>
          </template>
        </ul>
      </div>
    </div>
  </nav>
    <v-toolbar>
        <v-toolbar-title>CryptMark</v-toolbar-title>
        <v-banner-text v-if="store.getters.isLoggedIn()">Welcome {{ store.getters.username() }}</v-banner-text>
        <v-spacer></v-spacer>
        <div v-if="!store.getters.isLoggedIn()">
            <v-btn to="/login" variant="plain">Log In</v-btn>
            <v-btn to="/signup" variant="plain">Sign Up</v-btn>
        </div>
        <div v-else>
            <v-btn @click="store.actions.logout" variant="plain">Logout</v-btn>
        </div>

    </v-toolbar>
    <RouterView/>
    <RouterView name="dialog" />

</template>

<script setup>
import {RouterLink, RouterView} from 'vue-router'
import store from './store/index.js'
</script>

<template>
    <v-toolbar>
        <v-toolbar-title>CryptMark</v-toolbar-title>
        <v-banner-text v-if="store.getters.isLoggedIn()">Welcome {{ store.getters.username() }}</v-banner-text>
        <v-spacer></v-spacer>
        <div v-if="!store.getters.isLoggedIn()">
            <v-btn to="/login" variant="plain">Log In</v-btn>
            <v-btn to="/signup" variant="plain">Sign Up</v-btn>
        </div>
        <div v-else>
            <v-btn to="/logout" variant="plain">Logout</v-btn>
        </div>

    </v-toolbar>
    <RouterView/>
    <RouterView name="dialog" />

</template>

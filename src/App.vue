<script setup>
 import { RouterLink, RouterView } from 'vue-router'
 import store from './store/index.js'
</script>

<template>
    <header>
	<div v-if="!store.getters.isLoggedIn()">
	    <router-link to="/login">Login</router-link>
	</div>
	<div v-else>
	    Welcome {{ store.getters.username() }}
	</div>
    </header>
    <main>
	<div class="container">
	    <RouterView />
	</div>
    </main>

</template>

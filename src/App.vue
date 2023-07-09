<script setup>
import { RouterLink, RouterView } from 'vue-router'
import store from './store/index.js'
import Navbar from '@/components/Navbar.vue'
</script>

<template>
  <Navbar />
  <div class="container-lg">
    <RouterView />
  </div>
  <RouterView name="dialog" />
</template>

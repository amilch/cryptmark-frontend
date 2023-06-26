<script setup>
 import { ref } from 'vue'
 import store from '../store/index'

</script>

<template>
  <h1>All bookmarks</h1>
  <router-link to="/add">Add Bookmark</router-link>
  <ul>
	<li v-for="bookmark in store.state.bookmarks">
  	{{ bookmark }}
  	</li>
  </ul>
  <div class="row justify-content-center">
  </div>
</template>



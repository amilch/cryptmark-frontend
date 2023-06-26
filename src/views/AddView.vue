<script setup>
 import { ref } from 'vue'
 import store from '../store/index'

 const url = ref('')
 const title = ref('')

 function add() {
     store.actions.add(title.value, url.value)
 }
</script>

<template>
  <h1>Add bookmark</h1>
  <div class="row justify-content-center">
    <form @submit.prevent="" action="#" class="col-sm-4">
      <div class="mb-3">
        <label for="inputTitle" class="form-label">Title</label>
        <input v-model="title" type="text" class="form-control" id="inputTitle">
      </div>
      <div class="mb-3">
          <label for="inputUrl" class="form-label">URL</label>
          <input v-model="url" type="text" class="form-control" id="inputUrl">
      </div>
      <button @click="add()" type="submit" class="btn btn-primary">Add</button>
    </form>
  </div>
</template>



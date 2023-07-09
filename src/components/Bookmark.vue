<script setup>
import router from "@/router";
import store from "@/store";

defineProps(['bookmark', 'onVisit', 'onEdit', 'onDelete'])

</script>

<template>
  <a :href="$props.bookmark.url" target="_blank"
    class="list-group-item list-group-item-action d-flex align-items-center"
  >
    <div class="flex-grow-1">
      {{ bookmark.title ? bookmark.title : bookmark.url }}
      <div class="small text-muted" v-if="!!bookmark.title">{{ bookmark.url }}</div>
    </div>
    <button
      class="btn btn-link btn-lg"
      @click.prevent="$props.onEdit($props.bookmark)"
    >
      <span class="mdi mdi-pencil fs-4"></span>
    </button>
    <button
      class="btn btn-link btn-lg"
      @click.prevent="$props.onDelete($props.bookmark)"
    >
      <span class="mdi mdi-delete fs-4"></span>
    </button>
  </a>
</template>

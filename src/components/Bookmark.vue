<script setup>
defineProps(['bookmark', 'onVisit', 'onEdit', 'onDelete'])
</script>

<template>
  <a href="#"
    class="list-group-item list-group-item-action d-flex"
    @click.prevent="$props.onVisit($props.bookmark, $event)"
  >
    <div class="flex-grow-1">
      <div class="">{{ bookmark.title ? bookmark.title : bookmark.url }}</div>
      <div class="small text-muted">{{ bookmark.title ? bookmark.url : '' }}</div>
    </div>
    <button
      class="btn btn-link btn-lg"
      @click.native.capture="$props.onEdit($props.bookmark, $event)"
    >
      <span class="mdi mdi-pencil fs-4"></span>
    </button>
    <button
      class="btn btn-link btn-lg"
      @click.native.capture="$props.onDelete($props.bookmark, $event)"
    >
      <span class="mdi mdi-delete fs-4"></span>
    </button>
  </a>
</template>

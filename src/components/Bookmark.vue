<script setup>
defineProps(['bookmark', 'onVisit', 'onEdit', 'onDelete'])
</script>

<template>
  <v-list-item
      class="py-2"
      :key="$props.bookmark.id"
      :value="$props.bookmark"
      :title="$props.bookmark.title ? $props.bookmark.title : $props.bookmark.url"
      :subtitle="$props.bookmark.title ? $props.bookmark.url : ''"
      @click="$props.onVisit($props.bookmark, $event)"
  >
    <template v-slot:append>
      <v-btn
          @click.native.capture="$props.onEdit($props.bookmark, $event)"
          icon="mdi-pencil"
          variant="plain"/>
      <v-btn
          @click.native.capture="$props.onDelete($props.bookmark, $event)"
          icon="mdi-delete"
          variant="plain"/>
    </template>
  </v-list-item>
</template>